import Select from "react-select";
import { selectCustomStyles } from "../../lib/selectCustomStyles";

type YearFilterBarProps = {
  availableYears: number[];
  year: string;
  yearSurveysLength: number;
  onYearChange: (year: string) => void;
};

export default function YearFilterBar({
  availableYears,
  year,
  yearSurveysLength,
  onYearChange,
}: YearFilterBarProps) {
  return (
    <div className="bg-surface border border-border-subtle shadow-card rounded-lg p-4 animate-fade-in flex flex-wrap items-center gap-4 justify-between">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="material-symbols-outlined text-primary text-[18px]">
          calendar_month
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Tahun:
          </span>
          <div className="w-32 z-50 relative">
            <Select
              options={availableYears.map((y) => ({
                value: String(y),
                label: String(y),
              }))}
              value={{ value: year, label: year }}
              onChange={(selected: any) => onYearChange(selected?.value)}
              styles={selectCustomStyles}
              isSearchable={false}
              menuPortalTarget={document.body}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <span className="material-symbols-outlined text-[16px]">info</span>
        <span>
          {yearSurveysLength > 0
            ? `Data periode tahun ${year}`
            : "Belum ada data pada tahun terpilih"}
        </span>
      </div>
    </div>
  );
}
