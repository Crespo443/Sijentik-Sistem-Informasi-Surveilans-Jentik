type ReportHeaderProps = {
  onDownloadCSV: () => void;
};

export function ReportHeader({ onDownloadCSV }: ReportHeaderProps) {
  return (
    <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="font-heading text-lg font-bold text-text-main tracking-tight">
          Laporan Surveilans
        </h2>
        <div className="h-4 w-px bg-slate-200 mx-1"></div>
        <nav className="flex items-center gap-1.5 text-sm text-text-muted">
          <span className="text-text-main font-medium">Rekap Periodik</span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white border border-border-subtle text-text-muted px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50 hover:text-text-main transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          Cetak
        </button>
        <button
          onClick={onDownloadCSV}
          className="flex items-center gap-2 bg-white border border-border-subtle text-text-muted px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50 hover:text-text-main transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            table_view
          </span>
          Export CSV
        </button>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[18px]">
            picture_as_pdf
          </span>
          Export PDF
        </button>
      </div>
    </header>
  );
}
