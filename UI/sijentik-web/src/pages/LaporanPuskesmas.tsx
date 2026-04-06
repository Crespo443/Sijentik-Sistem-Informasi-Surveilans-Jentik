import { useNavigate, useParams } from "react-router-dom";
import KpiMetricsGrid from "../components/laporan-puskesmas/KpiMetricsGrid";
import MonthlyRecapTable from "../components/laporan-puskesmas/MonthlyRecapTable";
import PuskesmasProfileSummary from "../components/laporan-puskesmas/PuskesmasProfileSummary";
import RecentSurveysSection from "../components/laporan-puskesmas/RecentSurveysSection";
import ReportHeader from "../components/laporan-puskesmas/ReportHeader";
import TargetComparisonPanel from "../components/laporan-puskesmas/TargetComparisonPanel";
import VillagePerformanceTable from "../components/laporan-puskesmas/VillagePerformanceTable";
import YearFilterBar from "../components/laporan-puskesmas/YearFilterBar";
import { usePuskesmasReportData } from "../hooks/usePuskesmasReportData";

export default function LaporanPuskesmas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
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
  } = usePuskesmasReportData({ id, navigate });

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
      <ReportHeader
        pkm={pkm}
        summary={summary}
        statusLabel={statusLabel}
        statusClass={statusClass}
        healthCenters={healthCenters}
        onBack={() => navigate(-1)}
        onSelectPkm={(healthCenterId) =>
          navigate(`/laporan/puskesmas/${healthCenterId}`)
        }
        onPrint={() => window.print()}
      />

      <main className="flex-1 overflow-y-auto p-6 custom-scroll">
        <div className="max-w-325 mx-auto space-y-5">
          <YearFilterBar
            availableYears={availableYears}
            year={year}
            yearSurveysLength={yearSurveys.length}
            onYearChange={setYear}
          />

          <PuskesmasProfileSummary pkm={pkm} summary={summary} />

          <KpiMetricsGrid summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MonthlyRecapTable
              monthlyStats={monthlyStats}
              summary={summary}
              year={year}
            />
            <TargetComparisonPanel
              summary={summary}
              onBackToRekap={() => navigate("/laporan")}
            />
          </div>

          <VillagePerformanceTable villageStats={villageStats} />

          <RecentSurveysSection
            year={year}
            searchTerm={searchTerm}
            villageFilter={villageFilter}
            pkm={pkm}
            recentSurveys={recentSurveys}
            filteredSurveys={filteredSurveys}
            onSearchTermChange={setSearchTerm}
            onVillageFilterChange={setVillageFilter}
            onViewSurvey={(surveyId) =>
              navigate(`/data-survey/detail/${surveyId}`)
            }
            onResetFilter={() => setSearchTerm("")}
          />
        </div>
      </main>
    </div>
  );
}
