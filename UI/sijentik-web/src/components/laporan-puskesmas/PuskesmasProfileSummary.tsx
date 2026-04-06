type PuskesmasProfileSummaryProps = {
  pkm: any;
  summary: any;
};

export default function PuskesmasProfileSummary({
  pkm,
  summary,
}: PuskesmasProfileSummaryProps) {
  return (
    <div className="bg-linear-to-r from-primary/5 via-violet-50 to-transparent border border-primary/10 rounded-lg px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between animate-fade-in gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[26px]">
            local_hospital
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="font-heading font-bold text-text-main text-base truncate">
            {pkm.name}
          </h3>
          <p className="text-text-muted text-xs mt-0.5 truncate">
            {pkm.address || "Alamat belum diatur"}
          </p>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <span className="text-xs text-text-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">
                person
              </span>
              Kepala: {pkm.headName || "-"}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">
                phone
              </span>
              {pkm.phoneNumber || "-"}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">
                people
              </span>
              Wilayah: {pkm.district?.villages?.length || 0} kelurahan
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-center bg-white/60 p-3 rounded-lg border border-white/50 shadow-sm flex-wrap justify-center">
        <div>
          <p className="text-2xl font-bold text-text-main data-mono font-heading">
            {summary.totalRumah}
          </p>
          <p className="text-[10px] text-text-muted font-semibold uppercase">
            Total Rumah
          </p>
        </div>
        <div className="h-10 w-px bg-border-subtle"></div>
        <div>
          <p className="text-2xl font-bold text-danger data-mono font-heading">
            {summary.rumahPositif}
          </p>
          <p className="text-[10px] text-text-muted font-semibold uppercase">
            Rumah Positif
          </p>
        </div>
        <div className="h-10 w-px bg-border-subtle"></div>
        <div>
          <p
            className={`text-2xl font-bold data-mono font-heading ${summary.abjSurvei >= 95 ? "text-success" : "text-danger"}`}
          >
            {summary.abjSurvei.toFixed(1)}%
          </p>
          <p className="text-[10px] text-text-muted font-semibold uppercase">
            ABJ Survei
          </p>
        </div>
      </div>
    </div>
  );
}
