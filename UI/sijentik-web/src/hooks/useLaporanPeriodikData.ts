import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useLaporanPeriodikData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const defaultYear = new Date().getFullYear().toString();

  const [periodeType, setPeriodeType] = useState(
    searchParams.get("periodeType") || "bulanan",
  );
  const [month, setMonth] = useState(searchParams.get("month") || defaultMonth);
  const [year, setYear] = useState(searchParams.get("year") || defaultYear);
  const [districtId, setDistrictId] = useState(
    searchParams.get("districtId") || "",
  );

  const appliedPeriodeType = searchParams.get("periodeType") || periodeType;
  const appliedMonth = searchParams.get("month") || month;
  const appliedYear = searchParams.get("year") || year;
  const appliedDistrictId = searchParams.get("districtId") || districtId;

  const [sortBy, setSortBy] = useState<string>("");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const districtsQuery = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const res = await api.get("/district");
      return res.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const dateRange = useMemo(() => {
    if (appliedPeriodeType === "bulanan") {
      return {
        startDate: `${appliedYear}-${appliedMonth}-01`,
        endDate: `${appliedYear}-${appliedMonth}-31`,
      };
    }

    return {
      startDate: `${appliedYear}-01-01`,
      endDate: `${appliedYear}-12-31`,
    };
  }, [appliedMonth, appliedPeriodeType, appliedYear]);

  const [kpiQuery, regionalQuery, trendQuery] = useQueries({
    queries: [
      {
        queryKey: [
          "analytics-dashboard",
          dateRange.startDate,
          dateRange.endDate,
          appliedDistrictId,
        ],
        queryFn: async () => {
          const params = new URLSearchParams({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          });
          if (appliedDistrictId) params.append("districtId", appliedDistrictId);
          const res = await api.get(
            `/analytics/dashboard?${params.toString()}`,
          );
          return res.data;
        },
        placeholderData: keepPreviousData,
      },
      {
        queryKey: [
          "analytics-regional-performance",
          dateRange.startDate,
          dateRange.endDate,
          appliedDistrictId,
        ],
        queryFn: async () => {
          const params = new URLSearchParams({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          });
          if (appliedDistrictId) params.append("districtId", appliedDistrictId);
          const res = await api.get(
            `/analytics/regional-performance?${params.toString()}`,
          );
          return res.data ?? [];
        },
        placeholderData: keepPreviousData,
      },
      {
        queryKey: ["analytics-trend", appliedYear, appliedDistrictId],
        queryFn: async () => {
          const params = new URLSearchParams({ year: appliedYear });
          if (appliedDistrictId) params.append("districtId", appliedDistrictId);
          const res = await api.get(`/analytics/trend?${params.toString()}`);
          return res.data ?? [];
        },
        placeholderData: keepPreviousData,
      },
    ],
  });

  const kpis = kpiQuery.data;
  const regionalData = regionalQuery.data ?? [];
  const trendData = trendQuery.data ?? [];
  const districts = districtsQuery.data ?? [];
  const loading =
    kpiQuery.isFetching || regionalQuery.isFetching || trendQuery.isFetching;

  const sortedRegionalData = useMemo(() => {
    if (!sortBy) return regionalData;
    return [...regionalData].sort((a, b) => {
      const valA = a[sortBy] ?? -1;
      const valB = b[sortBy] ?? -1;
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [regionalData, sortBy, sortAsc]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const applyFilters = () => {
    const nextParams = new URLSearchParams();
    nextParams.set("periodeType", periodeType);
    nextParams.set("month", month);
    nextParams.set("year", year);
    if (districtId) nextParams.set("districtId", districtId);
    setSearchParams(nextParams);
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await api.get("/report/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `survey_report_${year}_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Failed to download CSV", error);
      alert("Gagal mengunduh laporan");
    }
  };

  const getMonthName = (index: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ags",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    return months[index - 1];
  };

  return {
    periodeType,
    setPeriodeType,
    month,
    setMonth,
    year,
    setYear,
    districtId,
    setDistrictId,
    sortBy,
    sortAsc,
    kpis,
    regionalData,
    sortedRegionalData,
    trendData,
    districts,
    loading,
    handleSort,
    applyFilters,
    handleDownloadCSV,
    getMonthName,
  };
};
