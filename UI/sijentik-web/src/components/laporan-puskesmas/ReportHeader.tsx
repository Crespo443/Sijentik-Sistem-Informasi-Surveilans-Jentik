import Select from "react-select";
import { selectCustomStyles } from "../../lib/selectCustomStyles";

type ReportHeaderProps = {
  pkm: any;
  summary: any;
  statusLabel: string;
  statusClass: string;
  healthCenters: any[];
  onBack: () => void;
  onSelectPkm: (id: string) => void;
  onPrint: () => void;
};

export default function ReportHeader({
  pkm,
  summary,
  statusLabel,
  statusClass,
  healthCenters,
  onBack,
  onSelectPkm,
  onPrint,
}: ReportHeaderProps) {
  return (
    <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onBack}
          className="text-text-muted hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
        </button>
        <div className="h-5 w-px bg-slate-200"></div>
        <div className="min-w-0">
          <h2 className="font-heading text-lg font-bold text-text-main tracking-tight leading-none truncate">
            {pkm.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5 flex-wrap">
            <span className="material-symbols-outlined text-[12px]">
              location_on
            </span>
            <span className="truncate">
              {pkm.district?.name || "Kecamatan belum diatur"}
            </span>
            <span className="text-border-subtle">•</span>
            <span>{pkm.district?.villages?.length || 0} kelurahan</span>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusClass}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${summary.abjSurvei >= 95 ? "bg-success" : summary.abjSurvei >= 80 ? "bg-warning" : "bg-danger"} animate-pulse-slow`}
          ></span>
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-64 z-[100]">
          <Select
            options={healthCenters.map((hc) => ({
              value: hc.id,
              label: hc.name,
            }))}
            value={pkm ? { value: pkm.id, label: pkm.name } : null}
            onChange={(selected: any) => onSelectPkm(selected?.value)}
            styles={selectCustomStyles}
            isSearchable={false}
            menuPortalTarget={document.body}
          />
        </div>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 bg-white border border-border-subtle text-text-muted px-3 py-1.5 rounded text-sm font-medium hover:bg-slate-50 hover:text-text-main transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          Cetak
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            picture_as_pdf
          </span>
          PDF
        </button>
      </div>
    </header>
  );
}
