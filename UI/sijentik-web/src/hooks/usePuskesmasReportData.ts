import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

interface ProcessedSurvey extends AnyObject {
  _surveyYear: number;
  _surveyMonth: number;
  _surveyTime: number;
  _searchHaystack: string;
  _stats: {
    inspected: number;
    positive: number;
    hasPositive: boolean;
    containerIndex: number;
  };
}

export const usePuskesmasReportData = ({
  id,
  navigate,
}: UsePuskesmasReportDataArgs) => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Use React Query to cache the heavy surveys request
  const { data, isLoading: loading, isError: error } = useQuery({
    queryKey: ["puskesmas-report-data", id],
    queryFn: async () => {
      const [healthCenterRes, surveyRes] = await Promise.all([
        api.get("/health-center"),
        api.get("/survey?limit=5000"),
      ]);

      const healthCenterList = Array.isArray(healthCenterRes.data)
        ? healthCenterRes.data
        : [];

      const resolvedId = isUuid(id) ? id : healthCenterList[0]?.id;

      if (!resolvedId) {
        throw new Error("No health center available");
      }

      if (resolvedId !== id) {
        return {
          healthCenters: healthCenterList,
          redirectId: resolvedId,
          pkm: null,
          surveys: []
        };
      }

      const pkmRes = await api.get(`/health-center/${resolvedId}`);

      const surveyList = surveyRes.data?.data ?? surveyRes.data ?? [];
      const rawArray = Array.isArray(surveyList) ? surveyList : [];
      
      const processedSurveys: ProcessedSurvey[] = rawArray.map((survey: AnyObject) => {
        const d = new Date(survey.surveyDate);
        
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

        return {
          ...survey,
          _surveyYear: d.getFullYear(),
          _surveyMonth: d.getMonth(),
          _surveyTime: d.getTime(),
          _searchHaystack: searchHaystack,
          _stats: getSurveyStats(survey)
        };
      });

      return {
        healthCenters: healthCenterList,
        pkm: pkmRes.data,
        surveys: processedSurveys
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  const pkm = data?.pkm || null;
  const healthCenters = data?.healthCenters || [];
  const surveys = data?.surveys || [];

  // Handle redirect outside queryFn
  useEffect(() => {
    if ((data as any)?.redirectId && (data as any).redirectId !== id) {
      navigate(`/laporan/puskesmas/${(data as any).redirectId}`, { replace: true });
    }
  }, [data, id, navigate]);

  // Determine available years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    surveys.forEach((survey) => {
      if (Number.isFinite(survey._surveyYear)) years.add(survey._surveyYear);
    });
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }, [surveys]);

  // Sync year state if available years change
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(Number(year))) {
      setYear(String(availableYears[0]));
    }
  }, [availableYears, year]);

  const yearSurveys = useMemo(() => {
    if (!pkm) return [];
    const pkmVillageIds = new Set(
      (pkm.district?.villages || []).map((village: AnyObject) => village.id),
    );
    const targetYear = Number(year);

    return surveys.filter((survey) => {
      if (survey._surveyYear !== targetYear) return false;
      if (pkmVillageIds.size === 0) return true;
      return pkmVillageIds.has(survey.villageId);
    });
  }, [pkm, surveys, year]);

  const filteredSurveys = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return yearSurveys.filter((survey) => {
      if (villageFilter && survey.villageId !== villageFilter) return false;
      if (!normalizedSearch) return true;
      return survey._searchHaystack.includes(normalizedSearch);
    });
  }, [searchTerm, villageFilter, yearSurveys]);

  const summary = useMemo(() => {
    const totalRumah = yearSurveys.length;
    const rumahPositif = yearSurveys.filter(
      (survey) => survey._stats.hasPositive,
    ).length;
    const totalContainersInspected = yearSurveys.reduce(
      (sum, survey) => sum + survey._stats.inspected,
      0,
    );
    const totalContainersPositive = yearSurveys.reduce(
      (sum, survey) => sum + survey._stats.positive,
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
        (survey) => survey._surveyMonth === monthIndex,
      );
      const positiveHouses = monthSurveys.filter(
        (survey) => survey._stats.hasPositive,
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
        (survey) => survey._stats.hasPositive,
      ).length;
      const houseIndex =
        villageSurveys.length > 0
          ? (positiveHouses / villageSurveys.length) * 100
          : 0;
          
      let maxTime = 0;
      for (let i = 0; i < villageSurveys.length; i++) {
        if (villageSurveys[i]._surveyTime > maxTime) {
          maxTime = villageSurveys[i]._surveyTime;
        }
      }
          
      const latestDate = villageSurveys.length
        ? formatDate(new Date(maxTime))
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
      .sort((a, b) => b._surveyTime - a._surveyTime)
      .slice(0, 5)
      .map((survey) => {
        const stats = survey._stats;
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

  // Prevent returning data if we're in the middle of a redirect
  const isRedirecting = (!isUuid(id) && healthCenters.length > 0) || !!(data as any)?.redirectId;

  return {
    pkm,
    healthCenters,
    loading: loading || isRedirecting,
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
