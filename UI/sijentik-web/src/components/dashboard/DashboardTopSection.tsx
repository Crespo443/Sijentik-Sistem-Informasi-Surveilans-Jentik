import Select from "react-select";
import { selectCustomStyles } from "../../lib/selectCustomStyles";
import {
  DASHBOARD_PERIOD_OPTIONS,
  resolvePeriodLabel,
} from "../../hooks/useDashboardData";

type DashboardTopSectionProps = {
  densityFigure: number;
  abjSurvei: number;
  filterPeriod: string;
  onFilterPeriodChange: (value: string) => void;
};

const DashboardTopSection = ({
  densityFigure,
  abjSurvei,
  filterPeriod,
  onFilterPeriodChange,
}: DashboardTopSectionProps) => {
  const month = new Date().getMonth() + 1;
  const isRainySeason = month >= 10 || month <= 4;

  const dfRisk =
    densityFigure >= 6 ? "CRITICAL" : densityFigure >= 3 ? "WARNING" : "RENDAH";
  const abjRisk =
    abjSurvei < 80 ? "CRITICAL" : abjSurvei < 95 ? "WARNING" : "RENDAH";
  const overallRisk =
    dfRisk === "CRITICAL" || abjRisk === "CRITICAL"
      ? "CRITICAL"
      : dfRisk === "WARNING" || abjRisk === "WARNING"
        ? "WARNING"
        : "RENDAH";

  const riskConfig = {
    CRITICAL: {
      bg: "bg-red-50",
      border: "border-red-300",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      textColor: "text-red-700",
      icon: "warning",
      badge: "bg-red-100 text-red-700 border-red-200",
      label: "Kritis",
      title: "Tingkat Risiko Jentik: KRITIS",
      desc: `DF=${densityFigure} (skala WHO), ABJ=${abjSurvei}% — jauh di bawah target nasional 95%. Segera tingkatkan frekuensi survei.`,
    },
    WARNING: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      titleColor: "text-amber-900",
      textColor: "text-amber-700",
      icon: "notification_important",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      label: "Waspada",
      title: "Tingkat Risiko Jentik: WASPADA",
      desc: `DF=${densityFigure} (skala WHO), ABJ=${abjSurvei}% — belum mencapai target 95%. Pantau wilayah dengan ABJ rendah.`,
    },
    RENDAH: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      textColor: "text-blue-700",
      icon: isRainySeason ? "thunderstorm" : "wb_sunny",
      badge: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Rendah",
      title: isRainySeason
        ? "Musim Hujan — Risiko Terkendali"
        : "Musim Kemarau — Kondisi Baik",
      desc: `DF=${densityFigure}, ABJ=${abjSurvei}% — telah memenuhi target nasional ≥95%. Pertahankan survei rutin.`,
    },
  };

  const cfg = riskConfig[overallRisk as keyof typeof riskConfig];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
      <div
        className={`flex-1 w-full ${cfg.bg} border ${cfg.border} rounded-lg p-3 flex items-center gap-3 shadow-sm`}
      >
        <div
          className={`w-10 h-10 rounded-full ${cfg.iconBg} flex items-center justify-center shrink-0 ${cfg.iconColor}`}
        >
          <span className="material-symbols-outlined">{cfg.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-bold ${cfg.titleColor}`}>{cfg.title}</p>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}
            >
              {cfg.label}
            </span>
          </div>
          <p className={`text-xs ${cfg.textColor} mt-0.5`}>{cfg.desc}</p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2 z-30 relative min-w-50">
        <Select
          options={[...DASHBOARD_PERIOD_OPTIONS]}
          value={{
            value: filterPeriod,
            label: resolvePeriodLabel(filterPeriod),
          }}
          onChange={(selected: any) =>
            onFilterPeriodChange(selected?.value || "all")
          }
          styles={{
            ...selectCustomStyles,
            control: (base) => ({
              ...base,
              minHeight: "38px",
              borderRadius: "0.5rem",
              borderColor: "#E2E8F0",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            }),
          }}
          isSearchable={false}
          className="w-full text-sm font-medium"
        />
      </div>
    </div>
  );
};

export default DashboardTopSection;
