type TrendAndIndexSectionProps = {
  trendData: any[];
  year: string;
  periodeType: string;
  month: string;
  getMonthName: (index: number) => string;
  kpis: any;
};

export function TrendAndIndexSection({
  trendData,
  year,
  periodeType,
  month,
  getMonthName,
  kpis,
}: TrendAndIndexSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-surface rounded-lg border border-border-subtle shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">
              bar_chart
            </span>
            Tren ABJ Survei per Bulan ({year})
          </h3>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-primary/70"></span>
              ABJ Survei
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-success/50"></span>
              Target (95%)
            </span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-40 px-2">
          <div className="flex-1 relative flex items-end">
            <div className="w-full flex items-end gap-2 h-full z-10 relative">
              {trendData.map((d: any, index: number) => {
                const mt = (index + 1).toString().padStart(2, "0");
                const isActive = periodeType === "bulanan" && month === mt;
                const val = d.abjSurvei;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                  >
                    {val !== null ? (
                      <span
                        className={`text-[9px] font-mono font-bold ${isActive ? "text-primary" : "text-text-muted"}`}
                      >
                        {val}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-300 font-bold">
                        —
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t transition-all duration-700 ease-in-out ${val === null ? "bg-slate-100 border-2 border-dashed border-slate-200" : isActive ? "bg-primary ring-2 ring-primary/30" : "bg-primary/70"}`}
                      style={{
                        height:
                          val !== null ? `${Math.max(val - 10, 5)}%` : "30%",
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div
              className="absolute w-full border-t-2 border-dashed border-success/50 z-0"
              style={{ bottom: "85%" }}
            >
              <span className="absolute right-0 -top-5 text-[9px] text-success font-bold bg-green-50 px-1 rounded">
                Target 95%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-2 mt-2">
          {trendData.map((d: any, index: number) => {
            const mt = (index + 1).toString().padStart(2, "0");
            const isActive = periodeType === "bulanan" && month === mt;
            const val = d.abjSurvei;

            return (
              <div
                key={index}
                className={`flex-1 text-center text-[9px] ${isActive ? "text-primary font-bold" : val !== null ? "text-text-muted font-medium" : "text-slate-300 font-medium"}`}
              >
                {getMonthName(d.month)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border-subtle shadow-card p-5 flex flex-col gap-3">
        <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">
            biotech
          </span>
          Indeks Entomologi
        </h3>
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-text-muted uppercase mb-1">
              House Index
            </p>
            <p className="text-xl font-bold text-primary font-mono">
              {kpis?.houseIndex || 0}%
            </p>
            <div className="mt-1 h-1 bg-white rounded-full">
              <div
                className="h-full bg-primary/40 rounded-full"
                style={{ width: `${kpis?.houseIndex || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-text-muted uppercase mb-1">
              Container
            </p>
            <p className="text-xl font-bold text-primary font-mono">
              {kpis?.containerIndex || 0}%
            </p>
            <div className="mt-1 h-1 bg-white rounded-full">
              <div
                className="h-full bg-primary/40 rounded-full"
                style={{ width: `${kpis?.containerIndex || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-text-muted uppercase mb-1">
              Breteau
            </p>
            <p
              className={`text-xl font-bold font-mono ${kpis?.breteauIndex > 5 ? "text-warning" : "text-primary"}`}
            >
              {kpis?.breteauIndex || 0}
            </p>
            <div className="text-[9px] text-text-muted mt-1">
              {kpis?.breteauIndex > 5 ? "High risk zone" : "Normal"}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-text-muted uppercase mb-1">
              Density Fig
            </p>
            <p
              className={`text-xl font-bold font-mono ${kpis?.densityFigure >= 3 ? "text-warning" : "text-primary"}`}
            >
              {kpis?.densityFigure || 0}
            </p>
            <span
              className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 ${kpis?.densityFigure >= 3 ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}
            >
              {kpis?.densityFigure < 3
                ? "Rendah"
                : kpis?.densityFigure < 6
                  ? "Sedang"
                  : "Tinggi"}
            </span>
          </div>
          <div className="col-span-2 bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">
                Maya Index (MII)
              </p>
              <p className="text-xl font-bold text-primary font-mono">
                {kpis?.mayaIndex || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
