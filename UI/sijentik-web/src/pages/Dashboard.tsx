import DashboardTopSection from "../components/dashboard/DashboardTopSection";
import DashboardKpiCards from "../components/dashboard/DashboardKpiCards";
import EntomologyKpiCards from "../components/dashboard/EntomologyKpiCards";
import RegionalSummary from "../components/dashboard/RegionalSummary";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { useDashboardData } from "../hooks/useDashboardData";

const Dashboard = () => {
  const {
    chartMetric,
    setChartMetric,
    filterPeriod,
    setFilterPeriod,
    loading,
    kpis,
    regionalData,
    activities,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto space-y-6">
      <DashboardTopSection
        densityFigure={kpis?.densityFigure ?? 0}
        abjSurvei={kpis?.abjSurvei ?? 100}
        filterPeriod={filterPeriod}
        onFilterPeriodChange={setFilterPeriod}
      />

      <DashboardKpiCards kpis={kpis} />

      {/* ===== OPERATIONAL OVERVIEW ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ====== LEFT COLUMN: Entomological Indices ====== */}
        <div className="lg:col-span-2 space-y-6">
          <EntomologyKpiCards kpis={kpis} />
          <RegionalSummary
            data={regionalData}
            metric={chartMetric}
            onMetricChange={setChartMetric}
          />
        </div>

        {/* ====== RIGHT COLUMN: Activity Feed ====== */}
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
};

export default Dashboard;
