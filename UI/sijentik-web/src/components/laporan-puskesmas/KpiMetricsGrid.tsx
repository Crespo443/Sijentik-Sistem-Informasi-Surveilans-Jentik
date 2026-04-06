type KpiMetricsGridProps = {
  summary: any;
};

export default function KpiMetricsGrid({ summary }: KpiMetricsGridProps) {
  return (
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
  );
}
