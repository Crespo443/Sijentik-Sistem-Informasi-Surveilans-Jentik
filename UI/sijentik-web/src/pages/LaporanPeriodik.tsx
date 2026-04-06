import { FilterSection } from "../components/laporan-periodik/FilterSection";
import { KpiSummaryCards } from "../components/laporan-periodik/KpiSummaryCards";
import { RegionalRecapTable } from "../components/laporan-periodik/RegionalRecapTable";
import { ReportHeader } from "../components/laporan-periodik/ReportHeader";
import { TrendAndIndexSection } from "../components/laporan-periodik/TrendAndIndexSection";
import { useLaporanPeriodikData } from "../hooks/useLaporanPeriodikData";

export default function LaporanPeriodik() {
  const {
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
  } = useLaporanPeriodikData();

  if (!kpis)
    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-text-muted">
          <span className="material-symbols-outlined text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="font-semibold text-sm">Memuat laporan periodik...</p>
        </div>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light">
      <ReportHeader onDownloadCSV={handleDownloadCSV} />

      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-5">
          <FilterSection
            periodeType={periodeType}
            setPeriodeType={setPeriodeType}
            month={month}
            setMonth={setMonth}
            year={year}
            setYear={setYear}
            districtId={districtId}
            setDistrictId={setDistrictId}
            districts={districts}
            loading={loading}
            applyFilters={applyFilters}
          />

          <KpiSummaryCards kpis={kpis} />

          <TrendAndIndexSection
            trendData={trendData}
            year={year}
            periodeType={periodeType}
            month={month}
            getMonthName={getMonthName}
            kpis={kpis}
          />

          <RegionalRecapTable
            regionalDataLength={regionalData.length}
            periodeType={periodeType}
            month={month}
            year={year}
            sortBy={sortBy}
            sortAsc={sortAsc}
            handleSort={handleSort}
            sortedRegionalData={sortedRegionalData}
            kpis={kpis}
          />
        </div>
      </main>
    </div>
  );
}
