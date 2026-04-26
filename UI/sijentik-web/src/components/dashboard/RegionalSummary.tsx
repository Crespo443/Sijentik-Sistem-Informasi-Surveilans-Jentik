import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ChartMetric } from "../../hooks/useDashboardData";

const METRIC_OPTIONS: { value: ChartMetric; label: string; unit: string }[] = [
  { value: "abj", label: "ABJ Survei", unit: "%" },
  { value: "abjWilayah", label: "ABJ Wilayah", unit: "%" },
  { value: "densityFigure", label: "Density Figure (DF)", unit: "" },
];

type RegionalSummaryProps = {
  data: any[];
  metric: ChartMetric;
  onMetricChange: (m: ChartMetric) => void;
};

const RegionalSummary = ({
  data,
  metric,
  onMetricChange,
}: RegionalSummaryProps) => {
  const chartData = data.map((d) => ({
    name: d.name.replace(/PKM /g, ""),
    abj: d.abj,
    abjWilayah: d.abjWilayah ?? 0,
    abjWilayahNull: d.abjWilayah === null || d.abjWilayah === undefined,
    densityFigure: d.densityFigure ?? 0,
    totalSurveys: d.totalSurveys,
    targetHouses: d.targetHouses ?? 0,
    riskLevel: d.riskLevel,
  }));

  const isDF = metric === "densityFigure";
  const currentOpt = METRIC_OPTIONS.find((o) => o.value === metric)!;

  const yDomain: [number, number] = isDF ? [0, 9] : [0, 100];
  const yTicks = isDF ? [0, 3, 6, 9] : [0, 25, 50, 75, 100];

  const getBarColor = (entry: any) => {
    if (metric === "abjWilayah" && entry.abjWilayahNull) return "#CBD5E1";

    if (isDF) {
      const df = entry.densityFigure;
      if (df >= 6) return "#ef4444";
      if (df >= 3) return "#eab308";
      return "#22c55e";
    }

    const value: number = entry[metric] ?? 0;
    if (value >= 95) return "#22c55e";
    if (value >= 80) return "#eab308";
    return "#ef4444";
  };

  const chartHeight = 300;

  return (
    <div className="bg-surface rounded-lg border border-border-subtle shadow-card p-5">
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">
            bar_chart
          </span>
          Performa per Wilayah
        </h3>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {METRIC_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onMetricChange(opt.value)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-md transition-all duration-150 ${
                metric === opt.value
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full mt-2" style={{ height: `${chartHeight}px` }}>
        {data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-sm text-text-muted">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">
              bar_chart
            </span>
            Belum ada data survei di wilayah ini.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
            >
              <defs>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fca5a5" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fde047" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#86efac" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                type="number"
                domain={yDomain}
                ticks={yTicks}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748B" }}
                width={36}
                tickFormatter={(v) => (isDF ? String(v) : `${v}%`)}
              />
              <Tooltip
                cursor={{ fill: "#F1F5F9" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const color =
                      d.riskLevel === "CRITICAL"
                        ? "#ef4444"
                        : d.riskLevel === "WARNING"
                          ? "#eab308"
                          : "#22c55e";
                    const isWilayah = metric === "abjWilayah";
                    const wilayahNull = isWilayah && d.abjWilayahNull;
                    return (
                      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg min-w-42.5">
                        <p className="font-bold text-sm text-slate-800 mb-2">
                          {d.name}
                        </p>
                        <p className="text-xs text-slate-600">
                          {currentOpt.label}:{" "}
                          {wilayahNull ? (
                            <span className="font-bold text-slate-400">
                              N/A
                            </span>
                          ) : (
                            <span className="font-bold" style={{ color }}>
                              {isDF ? d.densityFigure : `${payload[0].value}%`}
                            </span>
                          )}
                        </p>
                        {isWilayah && d.targetHouses > 0 && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Rumah terdaftar:{" "}
                            <span className="font-semibold">
                              {d.targetHouses}
                            </span>
                          </p>
                        )}
                        {isWilayah && wilayahNull && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Data rumah wilayah belum tersedia
                          </p>
                        )}
                        {isDF && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            {d.densityFigure >= 6
                              ? "🔴 Kepadatan Tinggi"
                              : d.densityFigure >= 3
                                ? "🟡 Kepadatan Sedang"
                                : "🟢 Kepadatan Rendah"}
                          </p>
                        )}
                        {!isDF && !isWilayah && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            {d.riskLevel === "CRITICAL"
                              ? "🔴 Kritis"
                              : d.riskLevel === "WARNING"
                                ? "🟡 Waspada"
                                : "🟢 Aman (≥95%)"}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          Survei dilakukan:{" "}
                          <span className="font-bold">{d.totalSurveys}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey={metric}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                minPointSize={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3 justify-center flex-wrap">
        {isDF ? (
          <>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-green-400 inline-block"></span>
              Rendah (DF 1–2)
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block"></span>
              Sedang (DF 3–5)
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-red-400 inline-block"></span>
              Kritis (DF 6–9)
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-green-400 inline-block"></span>
              Aman (≥95%)
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block"></span>
              Waspada (80–94%)
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-red-400 inline-block"></span>
              Kritis (&lt;80%)
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default RegionalSummary;
