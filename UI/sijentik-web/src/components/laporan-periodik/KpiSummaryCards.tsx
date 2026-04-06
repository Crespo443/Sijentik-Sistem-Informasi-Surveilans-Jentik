type KpiSummaryCardsProps = {
  kpis: any;
};

export function KpiSummaryCards({ kpis }: KpiSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
        <div className="h-0.75 rounded-b-sm bg-linear-to-r from-[#6504ae] via-[rgb(168,85,247)] to-[#c084fc]"></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider">
              Total Rumah
            </h3>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">
                home_work
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-text-main font-heading tracking-tight">
            {kpis?.totalSurveys || 0}
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Total rumah diperiksa periode ini
          </div>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/50 rounded-full transition-all duration-1000 ease-out"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
        <div className="h-0.75 rounded-b-sm bg-linear-to-r from-danger to-red-400"></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider">
              Rumah Positif
            </h3>
            <div className="w-9 h-9 rounded-lg bg-danger/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-danger text-[20px]">
                bug_report
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-danger font-heading tracking-tight">
            {kpis?.positiveHouses || 0}
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Rumah ditemukan jentik
          </div>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-danger/50 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: kpis?.totalSurveys
                  ? `${(kpis?.positiveHouses / kpis?.totalSurveys) * 100}%`
                  : "0%",
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
        <div className="h-0.75 rounded-b-sm bg-linear-to-r from-success to-green-400"></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider">
              ABJ Survei
            </h3>
            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-success text-[20px]">
                checklist
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-success font-heading tracking-tight">
            {kpis?.abjSurvei || 0}%
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Angka bebas jentik survei
          </div>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-success/50 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${kpis?.abjSurvei || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
        <div className="h-0.75 rounded-b-sm bg-linear-to-r from-warning to-yellow-400"></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider">
              ABJ Wilayah
            </h3>
            <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-warning text-[20px]">
                map
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-warning tracking-tight font-mono">
            {kpis?.abjWilayah !== null ? `${kpis?.abjWilayah}%` : "N/A"}
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Angka bebas jentik keseluruhan
          </div>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-warning/50 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${kpis?.abjWilayah || 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
