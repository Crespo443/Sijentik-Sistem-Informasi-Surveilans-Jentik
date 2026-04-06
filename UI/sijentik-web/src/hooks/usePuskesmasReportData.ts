import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";
import api from "../lib/api";
import {
  calculateDensityFigure,
  calculateMayaIndex,
  formatDate,
  getSurveyStats,
  isUuid,
  monthNames,
} from "../lib/surveyReportUtils";
import type { AnyObject } from "../lib/surveyReportUtils";

type UsePuskesmasReportDataArgs = {
  id?: string;
  navigate: NavigateFunction;
};

export const usePuskesmasReportData = ({
  id,
  navigate,
}: UsePuskesmasReportDataArgs) => {
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

  return {
    pkm,
    healthCenters,
    loading,
    error,
    year,
    setYear,
    searchTerm,
    setSearchTerm,
    villageFilter,
    setVillageFilter,
    availableYears,
    yearSurveys,
    filteredSurveys,
    summary,
    monthlyStats,
    villageStats,
    recentSurveys,
    statusLabel,
    statusClass,
  };
};
