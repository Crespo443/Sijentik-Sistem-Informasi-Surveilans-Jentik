import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Pagination } from "../components/common/Pagination";
import api from "../lib/api";
import Select from "react-select";
import { selectCustomStyles } from "../lib/selectCustomStyles";

type SurveyMeta = {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

const DEFAULT_LIMIT = 10;

const getParam = (searchParams: URLSearchParams, key: string, fallback = "") =>
  searchParams.get(key) ?? fallback;

const getNumberParam = (
  searchParams: URLSearchParams,
  key: string,
  fallback: number,
) => {
  const raw = searchParams.get(key);
  const parsed = raw ? Number(raw) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildSurveyParams = (filters: {
  page: number;
  limit: number;
  search: string;
  puskesmasId: string;
  villageId: string;
  startDate: string;
  endDate: string;
  statusJentik: string;
  sortOption: string;
}) => {
  const params = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.search) params.append("search", filters.search);
  if (filters.puskesmasId) params.append("puskesmasId", filters.puskesmasId);
  if (filters.villageId) params.append("villageId", filters.villageId);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.statusJentik) params.append("status", filters.statusJentik);

  if (filters.sortOption) {
    const [sortBy, sortDir] = filters.sortOption.split("-");
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDir) params.append("sortDir", sortDir);
  }

  return params;
};

const applySearchParams = (
  setSearchParams: (
    nextInit: URLSearchParams,
    navigateOptions?: { replace?: boolean },
  ) => void,
  next: Record<string, string | number | undefined>,
  replace = false,
) => {
  const params = new URLSearchParams();
  Object.entries(next).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === 0) return;
    params.set(key, String(value));
  });
  setSearchParams(params, { replace });
};

const getUserRole = () => JSON.parse(localStorage.getItem("user") || "{}").role;

export default function DataSurveyList() {
  const [showFilter, setShowFilter] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const page = getNumberParam(searchParams, "page", 1);
  const limit = getNumberParam(searchParams, "limit", DEFAULT_LIMIT);
  const search = getParam(searchParams, "search");
  const puskesmasId = getParam(searchParams, "puskesmasId");
  const villageId = getParam(searchParams, "villageId");
  const startDate = getParam(searchParams, "startDate");
  const endDate = getParam(searchParams, "endDate");
  const statusJentik = getParam(searchParams, "statusJentik");
  const sortOption = getParam(searchParams, "sortOption", "date-desc");

  const [draftSearch, setDraftSearch] = useState(search);
  const [draftPuskesmasId, setDraftPuskesmasId] = useState(puskesmasId);
  const [draftVillageId, setDraftVillageId] = useState(villageId);
  const [draftStartDate, setDraftStartDate] = useState(startDate);
  const [draftEndDate, setDraftEndDate] = useState(endDate);
  const [draftStatusJentik, setDraftStatusJentik] = useState(statusJentik);
  const [draftSortOption, setDraftSortOption] = useState(sortOption);

  const appliedFilters = useMemo(
    () => ({
      page,
      limit,
      search,
      puskesmasId,
      villageId,
      startDate,
      endDate,
      statusJentik,
      sortOption,
    }),
    [
      page,
      limit,
      search,
      puskesmasId,
      villageId,
      startDate,
      endDate,
      statusJentik,
      sortOption,
    ],
  );

  const villagesQuery = useQuery({
    queryKey: ["villages-my-pkm"],
    queryFn: async () => {
      const res = await api.get("/village/my-pkm");
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const puskesmasQuery = useQuery({
    queryKey: ["health-center-list"],
    queryFn: async () => {
      const res = await api.get("/health-center");
      if (Array.isArray(res.data?.data)) return res.data.data;
      if (Array.isArray(res.data)) return res.data;
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const surveysQuery = useQuery({
    queryKey: ["surveys", appliedFilters],
    queryFn: async () => {
      const params = buildSurveyParams(appliedFilters);
      const res = await api.get(`/survey?${params.toString()}`);

      if (Array.isArray(res.data)) {
        const list = res.data;
        return {
          surveys: list,
          meta: {
            total: list.length,
            page: 1,
            limit: list.length || DEFAULT_LIMIT,
            lastPage: 1,
          } as SurveyMeta,
        };
      }

      return {
        surveys: res.data.data ?? [],
        meta: (res.data.meta ?? {
          total: 0,
          page: 1,
          limit: DEFAULT_LIMIT,
          lastPage: 1,
        }) as SurveyMeta,
      };
    },
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/survey/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });

  const surveys = surveysQuery.data?.surveys ?? [];
  const meta: SurveyMeta = surveysQuery.data?.meta ?? {
    total: 0,
    page: page,
    limit,
    lastPage: 1,
  };

  const villages = villagesQuery.data ?? [];
  const puskesmasList = puskesmasQuery.data ?? [];

  const syncDraftToApplied = () => {
    setDraftSearch(search);
    setDraftPuskesmasId(puskesmasId);
    setDraftVillageId(villageId);
    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
    setDraftStatusJentik(statusJentik);
    setDraftSortOption(sortOption);
  };

  const handleSearch = () => {
    applySearchParams(setSearchParams, {
      page: 1,
      limit,
      search: draftSearch,
      puskesmasId: draftPuskesmasId,
      villageId: draftVillageId,
      startDate: draftStartDate,
      endDate: draftEndDate,
      statusJentik: draftStatusJentik,
      sortOption: draftSortOption,
    });
  };

  const handleReset = () => {
    applySearchParams(setSearchParams, {
      page: 1,
      limit,
      sortOption: "date-desc",
    });
    setDraftSearch("");
    setDraftPuskesmasId("");
    setDraftVillageId("");
    setDraftStartDate("");
    setDraftEndDate("");
    setDraftStatusJentik("");
    setDraftSortOption("date-desc");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus data survei ini?")) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus survei");
    }
  };

  const isLoading =
    surveysQuery.isLoading ||
    villagesQuery.isLoading ||
    puskesmasQuery.isLoading;
  const isFetching = surveysQuery.isFetching && !surveysQuery.isLoading;

  return (
    <div className="flex-1 overflow-auto p-6 bg-background-light flex flex-col gap-5">
      <PageHeader
        title="Data Survey"
        icon="fact_check"
        breadcrumbs={[
          { label: "Surveilans", href: "/" },
          { label: "Data Survey" },
        ]}
        actions={
          <Button variant="secondary" icon="help">
            Help Guide
          </Button>
        }
      />

      <div className="bg-surface border border-border-subtle rounded shadow-card animate-fade-in">
        <div className="w-full flex items-center justify-between p-4 rounded-t">
          <h3 className="font-heading text-base font-semibold text-text-main flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">
              search
            </span>
            Filter & Pencarian
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Reset Filter
            </button>
            <button
              aria-label="Toggle Filter"
              onClick={() => setShowFilter(!showFilter)}
              className="p-1 rounded hover:bg-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-center"
            >
              <span
                className={`material-symbols-outlined text-text-muted transition-transform duration-200 ${showFilter ? "rotate-180" : ""}`}
              >
                expand_less
              </span>
            </button>
          </div>
        </div>

        {showFilter ? (
          <div className="px-5 pb-5 border-t border-border-subtle">
            <div className="pt-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted">
                  Cari
                </label>
                <input
                  className="w-full px-3 py-2 border border-border-subtle rounded bg-surface text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  placeholder="Nama KK, alamat, petugas..."
                  type="text"
                  value={draftSearch}
                  onChange={(e) => setDraftSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted z-20 relative">
                  Puskesmas
                </label>
                <Select
                  options={[
                    { value: "", label: "Semua Puskesmas" },
                    ...puskesmasList.map((p: any) => ({
                      value: p.id,
                      label: p.name,
                    })),
                  ]}
                  value={{
                    value: draftPuskesmasId,
                    label: draftPuskesmasId
                      ? puskesmasList.find(
                          (p: any) => p.id === draftPuskesmasId,
                        )?.name || "Semua Puskesmas"
                      : "Semua Puskesmas",
                  }}
                  onChange={(selected: any) =>
                    setDraftPuskesmasId(selected?.value || "")
                  }
                  styles={selectCustomStyles}
                  placeholder="Cari Puskesmas..."
                  isClearable
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted z-20 relative">
                  Kelurahan/Desa
                </label>
                <Select
                  options={[
                    { value: "", label: "Semua Kelurahan" },
                    ...villages.map((v: any) => ({
                      value: v.id,
                      label: `${v.type === "KELURAHAN" ? "Kelurahan" : "Desa"} ${v.name}`,
                    })),
                  ]}
                  value={{
                    value: draftVillageId,
                    label: draftVillageId
                      ? (() => {
                          const village = villages.find(
                            (v: any) => v.id === draftVillageId,
                          );
                          if (!village) return "Semua Kelurahan";
                          return `${village.type === "KELURAHAN" ? "Kelurahan" : "Desa"} ${village.name}`;
                        })()
                      : "Semua Kelurahan",
                  }}
                  onChange={(selected: any) =>
                    setDraftVillageId(selected?.value || "")
                  }
                  styles={selectCustomStyles}
                  placeholder="Cari Kelurahan..."
                  isClearable
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted z-20 relative">
                  Urutkan
                </label>
                <Select
                  options={[
                    { value: "date-desc", label: "Tanggal (Terbaru)" },
                    { value: "date-asc", label: "Tanggal (Terlama)" },
                    { value: "houseOwner-asc", label: "Nama KK (A-Z)" },
                    { value: "houseOwner-desc", label: "Nama KK (Z-A)" },
                  ]}
                  value={{
                    value: draftSortOption,
                    label:
                      draftSortOption === "date-desc"
                        ? "Tanggal (Terbaru)"
                        : draftSortOption === "date-asc"
                          ? "Tanggal (Terlama)"
                          : draftSortOption === "houseOwner-asc"
                            ? "Nama KK (A-Z)"
                            : "Nama KK (Z-A)",
                  }}
                  onChange={(selected: any) =>
                    setDraftSortOption(selected?.value || "date-desc")
                  }
                  styles={selectCustomStyles}
                  isSearchable={false}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1.5 align-middle">
                <label className="text-xs font-medium text-text-muted">
                  Dari Tanggal
                </label>
                <input
                  className="w-full px-3 py-2 border border-border-subtle rounded bg-surface text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm min-h-[38px]"
                  type="date"
                  value={draftStartDate}
                  onChange={(e) => setDraftStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 align-middle">
                <label className="text-xs font-medium text-text-muted">
                  Sampai Tanggal
                </label>
                <input
                  className="w-full px-3 py-2 border border-border-subtle rounded bg-surface text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm min-h-[38px]"
                  type="date"
                  value={draftEndDate}
                  onChange={(e) => setDraftEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 align-middle">
                <label className="text-xs font-medium text-text-muted z-10 relative">
                  Status Jentik
                </label>
                <Select
                  options={[
                    { value: "", label: "Semua Status" },
                    { value: "Positif", label: "Positif" },
                    { value: "Negatif", label: "Negatif" },
                  ]}
                  value={{
                    value: draftStatusJentik,
                    label: draftStatusJentik || "Semua Status",
                  }}
                  onChange={(selected: any) =>
                    setDraftStatusJentik(selected?.value || "")
                  }
                  styles={selectCustomStyles}
                  placeholder="Pilih Status"
                  isSearchable={false}
                />
              </div>
              <div className="flex items-end md:col-start-4">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="w-full"
                >
                  Terapkan Filter
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="bg-surface border border-border-subtle rounded shadow-card flex-1 flex flex-col overflow-hidden animate-fade-in">
        <div className="overflow-auto custom-scrollbar flex-1 relative">
          {isFetching ? (
            <div className="absolute top-3 right-3 text-[10px] text-text-muted bg-slate-100 px-2 py-1 rounded-full">
              Memperbarui data...
            </div>
          ) : null}
          <table className="min-w-full divide-y divide-border-subtle text-left">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle w-12">
                  No
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">
                  Puskesmas
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">
                  Kelurahan/Desa
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">
                  Nama KK
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center">
                  Kontainer
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center">
                  Positif
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">
                  Petugas
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border-subtle text-sm">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="h-12 animate-pulse">
                    <td className="px-4 py-2" colSpan={10}>
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : surveys.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-text-muted">
                    Tidak ada data survei.
                  </td>
                </tr>
              ) : (
                surveys.map((survey: any, index: number) => {
                  const no = (meta.page - 1) * meta.limit + index + 1;
                  const date = new Date(survey.surveyDate).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  );
                  const kontainer =
                    survey.containers?.reduce(
                      (acc: number, c: any) => acc + c.inspectedCount,
                      0,
                    ) || 0;
                  const positif =
                    survey.containers?.reduce(
                      (acc: number, c: any) => acc + c.positiveCount,
                      0,
                    ) || 0;
                  const status = positif > 0 ? "Positif" : "Negatif";

                  return (
                    <SurveyRow
                      key={survey.id}
                      id={survey.id}
                      no={no}
                      date={date}
                      puskesmas={
                        survey.accessCode?.healthCenter?.name ||
                        survey.puskesmas?.name ||
                        "-"
                      }
                      kel={survey.village?.name || "-"}
                      kk={survey.houseOwner}
                      kontainer={kontainer}
                      positif={positif}
                      status={status}
                      surveyor={survey.surveyorName}
                      onDelete={() => handleDelete(survey.id)}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && meta.total > 0 ? (
          <Pagination
            label={`Menampilkan ${(meta.page - 1) * meta.limit + 1}-${Math.min(meta.page * meta.limit, meta.total)} dari ${meta.total} data`}
            currentPage={meta.page}
            totalPages={meta.lastPage}
            onPageChange={(nextPage) => {
              applySearchParams(setSearchParams, {
                page: nextPage,
                limit,
                search,
                puskesmasId,
                villageId,
                startDate,
                endDate,
                statusJentik,
                sortOption,
              });
              syncDraftToApplied();
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function SurveyRow({
  id,
  no,
  date,
  puskesmas,
  kel,
  kk,
  kontainer,
  positif,
  status,
  surveyor,
  onDelete,
}: any) {
  return (
    <tr className="hover:bg-primary/5 transition-colors h-12">
      <td className="px-4 py-2 whitespace-nowrap text-text-muted font-mono text-xs">
        {no}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-text-main text-sm">
        {date}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-text-muted text-sm">
        {puskesmas}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-text-main text-sm uppercase">
        {kel}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-text-muted text-sm">
        {kk}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center text-text-muted font-mono text-xs">
        {kontainer}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center font-semibold text-danger font-mono text-xs">
        {positif}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        {status === "Negatif" ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700">
            Negatif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700">
            Positif
          </span>
        )}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-text-muted text-sm">
        {surveyor}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center flex gap-2 justify-center">
        <Link
          to={`/data-survey/detail/${id}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded text-primary hover:bg-primary/10 transition-colors"
          title="Detail"
        >
          <span className="material-symbols-outlined text-[18px]">
            visibility
          </span>
        </Link>
        <Link
          to={`/data-survey/edit/${id}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
          title="Edit"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </Link>
        {getUserRole() !== "SURVEYOR" ? (
          <button
            onClick={onDelete}
            aria-label="Delete"
            className="inline-flex items-center justify-center w-8 h-8 rounded text-danger hover:bg-danger/10 transition-colors"
            title="Hapus"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        ) : null}
      </td>
    </tr>
  );
}
