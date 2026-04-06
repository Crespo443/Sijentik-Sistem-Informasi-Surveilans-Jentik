import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export type ChartMetric = "abj" | "abjWilayah" | "densityFigure";

export const DASHBOARD_PERIOD_OPTIONS = [
  { value: "all", label: "Semua Waktu" },
  { value: "this_week", label: "Minggu Ini" },
  { value: "last_week", label: "Minggu Lalu" },
  { value: "this_month", label: "Bulan Ini" },
] as const;

export const resolvePeriodLabel = (period: string) => {
  if (period === "all") return "Semua Waktu";
  if (period === "this_week") return "Minggu Ini";
  if (period === "last_week") return "Minggu Lalu";
  return "Bulan Ini";
};

export const useDashboardData = () => {
  const [chartMetric, setChartMetric] = useState<ChartMetric>("abj");
  const [filterPeriod, setFilterPeriod] = useState("this_week");

  const dashboardQuery = useQuery({
    queryKey: ["dashboard", filterPeriod],
    queryFn: async () => {
      const [kpiRes, regionalRes, activityRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/analytics/regional-performance"),
        api.get("/analytics/recent-activity"),
      ]);

      return {
        kpis: kpiRes.data,
        regionalData: regionalRes.data ?? [],
        activities: activityRes.data ?? [],
      };
    },
    placeholderData: keepPreviousData,
  });

  return {
    chartMetric,
    setChartMetric,
    filterPeriod,
    setFilterPeriod,
    loading: dashboardQuery.isLoading,
    kpis: dashboardQuery.data?.kpis,
    regionalData: dashboardQuery.data?.regionalData ?? [],
    activities: dashboardQuery.data?.activities ?? [],
  };
};
