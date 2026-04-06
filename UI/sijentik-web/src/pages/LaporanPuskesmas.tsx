import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Select from "react-select";
import { selectCustomStyles } from "../lib/selectCustomStyles";
import api from "../lib/api";

type AnyObject = Record<string, any>;

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const calculateDensityFigure = (hi: number) => {
  if (hi === 0) return 0;
  if (hi < 4) return 1;
  if (hi < 8) return 2;
  if (hi < 18) return 3;
  if (hi < 29) return 4;
  if (hi < 38) return 5;
  if (hi < 50) return 6;
  if (hi < 60) return 7;
  if (hi < 77) return 8;
  return 9;
};

const calculateMayaIndex = (densityFigure: number) => {
  if (densityFigure < 3) return "Low";
  if (densityFigure < 6) return "Medium";
  return "High";
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
};

const isUuid = (value?: string) =>
  !!value &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const getSurveyStats = (survey: AnyObject) => {
  const containers = Array.isArray(survey.containers) ? survey.containers : [];
  const inspected = containers.reduce(
    (sum: number, container: AnyObject) =>
      sum + (Number(container.inspectedCount) || 0),
    0,
  );
  const positive = containers.reduce(
    (sum: number, container: AnyObject) =>
      sum + (Number(container.positiveCount) || 0),
    0,
  );
  const hasPositive = containers.some(
    (container: AnyObject) => Number(container.positiveCount) > 0,
  );
  const houseIndex = hasPositive ? 100 : 0;
  const containerIndex = inspected > 0 ? (positive / inspected) * 100 : 0;
  const breteauIndex = positive;

  return {
    inspected,
    positive,
    hasPositive,
    houseIndex,
    containerIndex,
    breteauIndex,
  };
};

export default function LaporanPuskesmas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pkm, setPkm] = useState<AnyObject | null>(null);
  const [healthCenters, setHealthCenters] = useState<AnyObject[]>([]);
  const [surveys, setSurveys] = useState<AnyObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [year, setYear] = useState(
    searchParams.get("year") || String(new Date().getFullYear()),
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [villageFilter, setVillageFilter] = useState(
    searchParams.get("villageId") || "",
  );

  useEffect(() => {
    const nextParams = new URLSearchParams();
    nextParams.set("year", year);

    if (searchTerm) nextParams.set("search", searchTerm);
    else nextParams.delete("search");

    if (villageFilter) nextParams.set("villageId", villageFilter);
    else nextParams.delete("villageId");

    setSearchParams(nextParams, { replace: true });
  }, [searchTerm, setSearchParams, villageFilter, year]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(false);

      try {
        const [healthCenterRes, surveyRes] = await Promise.all([
          api.get("/health-center"),
          api.get("/survey?limit=5000"),
        ]);

        const healthCenterList = Array.isArray(healthCenterRes.data)
          ? healthCenterRes.data
          : [];
        setHealthCenters(healthCenterList);

        const resolvedId = isUuid(id) ? id : healthCenterList[0]?.id;

        if (!resolvedId) {
          setError(true);
          return;
        }

        if (resolvedId !== id) {
          navigate(`/laporan/puskesmas/${resolvedId}`, { replace: true });
          return;
        }

        const [pkmRes] = await Promise.all([
          api.get(`/health-center/${resolvedId}`),
        ]);

        setPkm(pkmRes.data);

        const surveyList = surveyRes.data?.data ?? surveyRes.data ?? [];
        setSurveys(Array.isArray(surveyList) ? surveyList : []);

        const availableYears = Array.from(
          new Set(
            (Array.isArray(surveyList) ? surveyList : [])
              .map((survey: AnyObject) =>
                new Date(survey.surveyDate).getFullYear(),
              )
              .filter((value: number) => Number.isFinite(value)),
          ),
        ).sort((a, b) => b - a);

        if (
          availableYears.length > 0 &&
          !availableYears.includes(Number(year))
        ) {
          setYear(String(availableYears[0]));
        }
      } catch (fetchError) {
        console.error("Failed to fetch puskesmas report data", fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();

    surveys.forEach((survey) => {
      const surveyYear = new Date(survey.surveyDate).getFullYear();
      if (Number.isFinite(surveyYear)) years.add(surveyYear);
    });

    const currentYear = new Date().getFullYear();
    years.add(currentYear);

    return Array.from(years).sort((a, b) => b - a);
  }, [surveys]);

  const yearSurveys = useMemo(() => {
    if (!pkm) return [];
    const pkmVillageIds = new Set(
      (pkm.district?.villages || []).map((village: AnyObject) => village.id),
    );

    return surveys.filter((survey) => {
      const surveyYear = new Date(survey.surveyDate).getFullYear();
      if (surveyYear !== Number(year)) return false;
      if (pkmVillageIds.size === 0) return true;
      return pkmVillageIds.has(survey.villageId);
    });
  }, [pkm, surveys, year]);

  const filteredSurveys = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return yearSurveys.filter((survey) => {
      if (villageFilter && survey.villageId !== villageFilter) return false;
      if (!normalizedSearch) return true;

      const villageName = survey.village?.name || "";
      const searchHaystack = [
        villageName,
        survey.surveyorName,
        survey.houseOwner,
        survey.address,
        survey.rtRw,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchHaystack.includes(normalizedSearch);
    });
  }, [searchTerm, villageFilter, yearSurveys]);

  const summary = useMemo(() => {
    const totalRumah = yearSurveys.length;
    const rumahPositif = yearSurveys.filter(
      (survey) => getSurveyStats(survey).hasPositive,
    ).length;
    const totalContainersInspected = yearSurveys.reduce(
      (sum, survey) => sum + getSurveyStats(survey).inspected,
      0,
    );
    const totalContainersPositive = yearSurveys.reduce(
      (sum, survey) => sum + getSurveyStats(survey).positive,
      0,
    );

    const abjSurvei =
      totalRumah > 0 ? ((totalRumah - rumahPositif) / totalRumah) * 100 : 0;
    const abjWilayah =
      pkm?.targetHouses && pkm.targetHouses > 0
        ? ((pkm.targetHouses - rumahPositif) / pkm.targetHouses) * 100
        : null;
    const houseIndex = totalRumah > 0 ? (rumahPositif / totalRumah) * 100 : 0;
    const containerIndex =
      totalContainersInspected > 0
        ? (totalContainersPositive / totalContainersInspected) * 100
        : 0;
    const breteauIndex =
      totalRumah > 0 ? totalContainersPositive / totalRumah : 0;
    const densityFigure = calculateDensityFigure(houseIndex);
    const mayaIndex = calculateMayaIndex(densityFigure);

    return {
      totalRumah,
      rumahPositif,
      totalContainersInspected,
      totalContainersPositive,
      abjSurvei,
      abjWilayah,
      houseIndex,
      containerIndex,
      breteauIndex,
      densityFigure,
      mayaIndex,
    };
  }, [pkm, yearSurveys]);

  const monthlyStats = useMemo(() => {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const monthSurveys = yearSurveys.filter(
        (survey) => new Date(survey.surveyDate).getMonth() === monthIndex,
      );
      const positiveHouses = monthSurveys.filter(
        (survey) => getSurveyStats(survey).hasPositive,
      ).length;
      const abj =
        monthSurveys.length > 0
          ? ((monthSurveys.length - positiveHouses) / monthSurveys.length) * 100
          : null;

      return {
        monthIndex,
        label: monthNames[monthIndex],
        totalSurveys: monthSurveys.length,
        positiveHouses,
        abj,
        latest: monthSurveys.length > 0,
      };
    });
  }, [yearSurveys]);

  const villageStats = useMemo(() => {
    return (pkm?.district?.villages || []).map((village: AnyObject) => {
      const villageSurveys = yearSurveys.filter(
        (survey) => survey.villageId === village.id,
      );
      const positiveHouses = villageSurveys.filter(
        (survey) => getSurveyStats(survey).hasPositive,
      ).length;
      const houseIndex =
        villageSurveys.length > 0
          ? (positiveHouses / villageSurveys.length) * 100
          : 0;
      const latestDate = villageSurveys.length
        ? formatDate(
            new Date(
              Math.max(
                ...villageSurveys.map((survey) =>
                  new Date(survey.surveyDate).getTime(),
                ),
              ),
            ),
          )
        : "-";

      return {
        id: village.id,
        name: village.name,
        total: villageSurveys.length,
        positive: positiveHouses,
        houseIndex,
        latestDate,
        surveyor:
          villageSurveys.length > 0 ? villageSurveys[0].surveyorName : "-",
      };
    });
  }, [pkm, yearSurveys]);

  const recentSurveys = useMemo(() => {
    return [...filteredSurveys]
      .sort(
        (a, b) =>
          new Date(b.surveyDate).getTime() - new Date(a.surveyDate).getTime(),
      )
      .slice(0, 5)
      .map((survey) => {
        const stats = getSurveyStats(survey);
        const hi = stats.hasPositive ? 100 : 0;
        const ci = stats.containerIndex;

        return {
          id: survey.id,
          villageName: survey.village?.name || "-",
          rtRw: survey.rtRw || "-",
          date: formatDate(survey.surveyDate),
          inspected: stats.inspected,
          positive: stats.positive,
          hi,
          ci,
          surveyor: survey.surveyorName || "-",
          houseOwner: survey.houseOwner || "-",
          occupantCount: survey.occupantCount || 0,
        };
      });
  }, [filteredSurveys]);

  const statusLabel =
    summary.abjSurvei >= 95
      ? "Aman"
      : summary.abjSurvei >= 80
        ? "Waspada"
        : "At Risk";

  const statusClass =
    summary.abjSurvei >= 95
      ? "bg-green-50 text-success border-green-100"
      : summary.abjSurvei >= 80
        ? "bg-yellow-50 text-warning border-yellow-100"
        : "bg-red-50 text-danger border-red-100";

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-text-muted">
        <span className="material-symbols-outlined text-[40px] animate-spin mr-3">
          progress_activity
        </span>
        Memuat laporan...
      </div>
    );
  }

  if (error || !pkm) {
    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light">
        <header className="h-16 bg-surface border-b border-border-subtle flex items-center px-6 sticky top-0 z-10 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="text-text-muted hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
          </button>
          <div className="h-5 w-px bg-slate-200 mx-4"></div>
          <h2 className="font-heading text-lg font-bold text-text-main">
            Laporan Puskesmas
          </h2>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-12">
          <span className="material-symbols-outlined text-[48px] text-text-muted">
            local_hospital
          </span>
          <p className="font-semibold text-text-main">
            Data Puskesmas Tidak Ditemukan
          </p>
          <p className="text-sm text-text-muted">
            Data untuk puskesmas ini belum tersedia atau belum ada data master.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Kembali
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light">
      <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="text-text-muted hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
          </button>
          <div className="h-5 w-px bg-slate-200"></div>
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold text-text-main tracking-tight leading-none truncate">
              {pkm.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5 flex-wrap">
              <span className="material-symbols-outlined text-[12px]">
                location_on
              </span>
              <span className="truncate">
                {pkm.district?.name || "Kecamatan belum diatur"}
              </span>
              <span className="text-border-subtle">•</span>
              <span>{pkm.district?.villages?.length || 0} kelurahan</span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusClass}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${summary.abjSurvei >= 95 ? "bg-success" : summary.abjSurvei >= 80 ? "bg-warning" : "bg-danger"} animate-pulse-slow`}
            ></span>
            {statusLabel}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-64 z-[100]">
            <Select
              options={healthCenters.map((hc) => ({ value: hc.id, label: hc.name }))}
              value={pkm ? { value: pkm.id, label: pkm.name } : null}
              onChange={(selected: any) =>
                navigate(`/laporan/puskesmas/${selected?.value}`)
              }
              styles={selectCustomStyles}
              isSearchable={false}
              menuPortalTarget={document.body}
            />
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white border border-border-subtle text-text-muted px-3 py-1.5 rounded text-sm font-medium hover:bg-slate-50 hover:text-text-main transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Cetak
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              picture_as_pdf
            </span>
            PDF
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 custom-scroll">
        <div className="max-w-325 mx-auto space-y-5">
          <div className="bg-surface border border-border-subtle shadow-card rounded-lg p-4 animate-fade-in flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="material-symbols-outlined text-primary text-[18px]">
                calendar_month
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Tahun:
                </span>
                <div className="w-32 z-50 relative">
                  <Select
                    options={availableYears.map((y) => ({ value: String(y), label: String(y) }))}
                    value={{ value: year, label: year }}
                    onChange={(selected: any) => setYear(selected?.value)}
                    styles={selectCustomStyles}
                    isSearchable={false}
                    menuPortalTarget={document.body}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="material-symbols-outlined text-[16px]">
                info
              </span>
              <span>
                {yearSurveys.length > 0
                  ? `Data periode tahun ${year}`
                  : "Belum ada data pada tahun terpilih"}
              </span>
            </div>
          </div>

          <div className="bg-linear-to-r from-primary/5 via-violet-50 to-transparent border border-primary/10 rounded-lg px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between animate-fade-in gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[26px]">
                  local_hospital
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-text-main text-base truncate">
                  {pkm.name}
                </h3>
                <p className="text-text-muted text-xs mt-0.5 truncate">
                  {pkm.address || "Alamat belum diatur"}
                </p>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">
                      person
                    </span>
                    Kepala: {pkm.headName || "-"}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">
                      phone
                    </span>
                    {pkm.phoneNumber || "-"}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">
                      people
                    </span>
                    Wilayah: {pkm.district?.villages?.length || 0} kelurahan
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-center bg-white/60 p-3 rounded-lg border border-white/50 shadow-sm flex-wrap justify-center">
              <div>
                <p className="text-2xl font-bold text-text-main data-mono font-heading">
                  {summary.totalRumah}
                </p>
                <p className="text-[10px] text-text-muted font-semibold uppercase">
                  Total Rumah
                </p>
              </div>
              <div className="h-10 w-px bg-border-subtle"></div>
              <div>
                <p className="text-2xl font-bold text-danger data-mono font-heading">
                  {summary.rumahPositif}
                </p>
                <p className="text-[10px] text-text-muted font-semibold uppercase">
                  Rumah Positif
                </p>
              </div>
              <div className="h-10 w-px bg-border-subtle"></div>
              <div>
                <p
                  className={`text-2xl font-bold data-mono font-heading ${summary.abjSurvei >= 95 ? "text-success" : "text-danger"}`}
                >
                  {summary.abjSurvei.toFixed(1)}%
                </p>
                <p className="text-[10px] text-text-muted font-semibold uppercase">
                  ABJ Survei
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-6 gap-3 animate-slide-up">
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    home
                  </span>
                </div>
                <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                  House Index
                </h3>
              </div>
              <div className="text-xl font-bold text-primary font-heading tracking-tight data-mono">
                {summary.houseIndex.toFixed(1)}%
              </div>
              <p className="text-[9px] text-text-muted mt-1">Target &lt;5%</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-danger/60 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    inventory_2
                  </span>
                </div>
                <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                  Container
                </h3>
              </div>
              <div className="text-xl font-bold text-primary font-heading tracking-tight data-mono">
                {summary.containerIndex.toFixed(1)}%
              </div>
              <p className="text-[9px] text-text-muted mt-1">Target &lt;5%</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-danger/60 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    bug_report
                  </span>
                </div>
                <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                  Breteau
                </h3>
              </div>
              <div className="text-xl font-bold text-warning font-heading tracking-tight data-mono">
                {summary.breteauIndex.toFixed(1)}
              </div>
              <p className="text-[9px] text-text-muted mt-1">Zona Sedang</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning/60 rounded-full"
                  style={{
                    width: `${Math.min(summary.breteauIndex * 3, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    density_small
                  </span>
                </div>
                <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                  Density
                </h3>
              </div>
              <div className="text-xl font-bold text-warning font-heading tracking-tight data-mono">
                {summary.densityFigure}
              </div>
              <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-warning/10 text-warning mt-1">
                {summary.densityFigure < 3
                  ? "Rendah"
                  : summary.densityFigure < 6
                    ? "Sedang"
                    : "Tinggi"}
              </span>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning/60 rounded-full"
                  style={{
                    width: `${Math.min(summary.densityFigure * 10, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    cleaning_services
                  </span>
                </div>
                <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                  ABJ Wilayah
                </h3>
              </div>
              <div
                className={`text-xl font-bold font-heading tracking-tight data-mono ${summary.abjWilayah !== null && summary.abjWilayah >= 95 ? "text-success" : "text-danger"}`}
              >
                {summary.abjWilayah !== null
                  ? `${summary.abjWilayah.toFixed(1)}%`
                  : "-"}
              </div>
              <p className="text-[9px] text-text-muted mt-1">Target &geq;95%</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-danger/60 rounded-full"
                  style={{
                    width: `${Math.min(summary.abjWilayah ?? 0, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    query_stats
                  </span>
                </div>
                <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                  Maya Index
                </h3>
              </div>
              <div
                className={`text-xl font-bold font-heading tracking-tight data-mono ${summary.mayaIndex === "Low" ? "text-success" : summary.mayaIndex === "Medium" ? "text-warning" : "text-danger"}`}
              >
                {summary.mayaIndex}
              </div>
              <p className="text-[9px] text-text-muted mt-1">Tingkat Risiko</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${summary.mayaIndex === "Low" ? "bg-success/60" : summary.mayaIndex === "Medium" ? "bg-warning/60" : "bg-danger/60"}`}
                  style={{
                    width: `${Math.min(summary.densityFigure * 10, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center">
                <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    calendar_month
                  </span>
                  Rekap Bulanan {year}
                </h3>
                <span className="text-xs text-text-muted">
                  ABJ Target: <strong className="text-success">&ge; 95%</strong>
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-border-subtle">
                      <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Bulan
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                        Rmh Diperiksa
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                        Rmh Positif
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                        ABJ Survei
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                        ABJ Wilayah
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {monthlyStats.map((month) => {
                      const isCurrent =
                        month.totalSurveys > 0 &&
                        month.label === monthNames[new Date().getMonth()];
                      return (
                        <tr
                          key={month.label}
                          className={`table-row-hover transition-colors ${isCurrent ? "bg-primary/5" : ""}`}
                        >
                          <td
                            className={`px-4 py-3 font-semibold ${isCurrent ? "text-primary" : "text-text-main"}`}
                          >
                            {month.label}
                            {isCurrent ? " ← saat ini" : ""}
                          </td>
                          <td className="px-4 py-3 text-right data-mono">
                            {month.totalSurveys || "—"}
                          </td>
                          <td className="px-4 py-3 text-right data-mono text-danger">
                            {month.positiveHouses || "—"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {month.abj !== null ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-danger/10 text-danger">
                                {month.abj.toFixed(1)}%
                              </span>
                            ) : (
                              <span className="text-xs text-text-muted">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center data-mono text-sm">
                            {summary.abjWilayah !== null
                              ? `${summary.abjWilayah.toFixed(1)}%`
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {month.totalSurveys > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-danger border border-red-100 uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
                                {month.abj !== null && month.abj >= 95
                                  ? "Target"
                                  : "At Risk"}
                              </span>
                            ) : (
                              <span className="text-xs text-text-muted">
                                Belum tersedia
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-primary/5 border-t-2 border-primary/20">
                    <tr>
                      <td className="px-4 py-3 font-bold text-text-main">
                        Rata-rata (YTD)
                      </td>
                      <td className="px-4 py-3 text-right font-bold data-mono">
                        {summary.totalRumah}
                      </td>
                      <td className="px-4 py-3 text-right font-bold data-mono text-danger">
                        {summary.rumahPositif}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-danger/10 text-danger">
                          {summary.abjSurvei.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold data-mono">
                        {summary.abjWilayah !== null
                          ? `${summary.abjWilayah.toFixed(1)}%`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-text-muted">
                        —
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-border-subtle shadow-card p-5 flex flex-col gap-4">
              <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  flag
                </span>
                Capaian vs Target
              </h3>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-text-muted">
                    ABJ Survei
                  </span>
                  <span className="text-xs font-bold text-danger data-mono">
                    {summary.abjSurvei.toFixed(1)}% / 95%
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="progress-fill h-full rounded-full"
                    style={{
                      width: `${Math.min(summary.abjSurvei, 100)}%`,
                      background: "linear-gradient(90deg, #DC2626, #f87171)",
                    }}
                  ></div>
                </div>
                <p className="text-[10px] text-danger mt-1 font-medium">
                  {summary.abjSurvei >= 95
                    ? "Target tercapai"
                    : `Kurang ${(95 - summary.abjSurvei).toFixed(1)}% dari target`}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-text-muted">
                    ABJ Wilayah
                  </span>
                  <span className="text-xs font-bold text-danger data-mono">
                    {summary.abjWilayah !== null
                      ? `${summary.abjWilayah.toFixed(1)}% / 95%`
                      : "-"}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="progress-fill h-full rounded-full"
                    style={{
                      width: `${Math.min(summary.abjWilayah ?? 0, 100)}%`,
                      background: "linear-gradient(90deg, #DC2626, #f87171)",
                    }}
                  ></div>
                </div>
                <p className="text-[10px] text-danger mt-1 font-medium">
                  {summary.abjWilayah !== null
                    ? summary.abjWilayah >= 95
                      ? "Target tercapai"
                      : `Kurang ${(95 - summary.abjWilayah).toFixed(1)}% dari target`
                    : "Belum ada target rumah terdaftar"}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-text-muted">
                    Density Figure
                  </span>
                  <span className="text-xs font-bold text-warning data-mono">
                    {summary.densityFigure} / 9
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="progress-fill h-full rounded-full"
                    style={{
                      width: `${(summary.densityFigure / 9) * 100}%`,
                      background: "linear-gradient(90deg, #D97706, #fbbf24)",
                    }}
                  ></div>
                </div>
                <p className="text-[10px] text-warning mt-1 font-medium">
                  Maya Index: {summary.mayaIndex}
                </p>
              </div>

              <div className="border-t border-border-subtle pt-3">
                <h4 className="text-xs font-bold text-text-muted uppercase mb-3">
                  Rekomendasi Tindakan
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2.5 rounded bg-red-50 border border-red-100">
                    <span className="material-symbols-outlined text-danger text-[16px] mt-0.5 shrink-0">
                      priority_high
                    </span>
                    <p className="text-[11px] text-danger leading-relaxed">
                      Intensifikasi PSN di kelurahan dengan rumah positif
                      terbanyak.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded bg-orange-50 border border-orange-100">
                    <span className="material-symbols-outlined text-orange-600 text-[16px] mt-0.5 shrink-0">
                      campaign
                    </span>
                    <p className="text-[11px] text-orange-700 leading-relaxed">
                      Sosialisasi 3M Plus pada wilayah dengan ABJ di bawah
                      target.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded bg-violet-50 border border-violet-100">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">
                      fact_check
                    </span>
                    <p className="text-[11px] text-primary leading-relaxed">
                      Tingkatkan coverage survei dan lengkapi pencatatan RT/RW
                      untuk seluruh kunjungan.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/laporan")}
                className="flex items-center justify-center gap-2 mt-auto py-2 border border-border-subtle rounded text-xs text-text-muted hover:text-primary hover:border-primary/40 transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                Kembali ke Rekap Periodik
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center">
              <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  location_city
                </span>
                Rekap Kinerja Kelurahan / Desa
              </h3>
              <span className="text-xs text-text-muted">
                {villageStats.length} kelurahan
              </span>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-border-subtle">
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase">
                      Kelurahan / Desa
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-center">
                      Tgl Survey Terakhir
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-right">
                      Rmh Diperiksa
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-right">
                      Rmh Positif
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-center">
                      House Index (HI)
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-center">
                      Petugas Terakhir
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {villageStats.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-text-muted"
                      >
                        Tidak ada data kelurahan.
                      </td>
                    </tr>
                  ) : (
                    villageStats.map((village: AnyObject) => (
                      <tr
                        key={village.id}
                        className="hover:bg-primary/5 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-text-main">
                            {village.name}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-center text-text-muted text-xs">
                          {village.latestDate}
                        </td>
                        <td className="px-4 py-3.5 text-right data-mono">
                          {village.total}
                        </td>
                        <td className="px-4 py-3.5 text-right data-mono text-danger">
                          {village.positive}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {village.total > 0 ? (
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${village.houseIndex > 5 ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}
                            >
                              {village.houseIndex.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-xs text-text-muted">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center text-xs text-text-muted">
                          {village.surveyor}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-border-subtle flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
              <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  format_list_bulleted
                </span>
                Data Survey Terakhir
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 ml-1">
                  {monthNames[new Date().getMonth()]} {year}
                </span>
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <span className="material-symbols-outlined text-text-muted text-[16px] absolute left-2.5 top-1/2 -translate-y-1/2">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Cari alamat / RT..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-border-subtle rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all w-44"
                  />
                </div>
                <div className="w-56 z-40 relative">
                  <Select
                    options={[
                      { value: "", label: "Semua Kelurahan" },
                      ...(pkm.district?.villages || []).map((v: AnyObject) => ({ value: v.id, label: v.name }))
                    ]}
                    value={villageFilter 
                      ? { value: villageFilter, label: pkm.district?.villages?.find((v: AnyObject) => v.id === villageFilter)?.name || "Semua Kelurahan" } 
                      : { value: "", label: "Semua Kelurahan" }}
                    onChange={(selected: any) => setVillageFilter(selected?.value || "")}
                    styles={selectCustomStyles}
                    isClearable={false}
                    menuPortalTarget={document.body}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-border-subtle">
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Kelurahan / RT
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                      Tgl Survey
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                      Container Diperiksa
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                      Container Positif
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                      Nama KK
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                      Jumlah Penghuni
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                      Petugas
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {recentSurveys.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-6 text-text-muted"
                      >
                        Tidak ada data survey pada filter yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    recentSurveys.map((survey) => {
                      return (
                        <tr
                          key={survey.id}
                          className="table-row-hover transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-text-main">
                              {survey.villageName}
                            </p>
                            <p className="text-[11px] text-text-muted">
                              {survey.rtRw !== "-"
                                ? `RT/RW ${survey.rtRw}`
                                : "-"}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-center text-text-muted text-xs">
                            {survey.date}
                          </td>
                          <td className="px-4 py-3.5 text-right data-mono">
                            {survey.inspected}
                          </td>
                          <td className="px-4 py-3.5 text-right data-mono text-danger">
                            {survey.positive}
                          </td>
                          <td className="px-4 py-3.5 text-center font-semibold text-text-main truncate max-w-40">
                            {survey.houseOwner}
                          </td>
                          <td className="px-4 py-3.5 text-center data-mono text-xs">
                            {survey.occupantCount}
                          </td>
                          <td className="px-4 py-3.5 text-center text-xs text-text-muted">
                            {survey.surveyor}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <button
                              onClick={() =>
                                navigate(`/data-survey/detail/${survey.id}`)
                              }
                              className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                visibility
                              </span>
                              Lihat
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-text-muted">
                Menampilkan {recentSurveys.length} dari {filteredSurveys.length}{" "}
                data survey terfilter
              </span>
              <button
                onClick={() => setSearchTerm("")}
                className="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
              >
                Reset Filter{" "}
                <span className="material-symbols-outlined text-[14px]">
                  refresh
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
