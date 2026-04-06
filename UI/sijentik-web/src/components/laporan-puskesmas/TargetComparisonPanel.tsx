type TargetComparisonPanelProps = {
  summary: any;
  onBackToRekap: () => void;
};

export default function TargetComparisonPanel({
  summary,
  onBackToRekap,
}: TargetComparisonPanelProps) {
  return (
    <div className="bg-surface rounded-lg border border-border-subtle shadow-card p-5 flex flex-col gap-4">
      <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">
          flag
        </span>
        Capaian vs Target
      </h3>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-text-muted">
            ABJ Survei
          </span>
          <span className="text-xs font-bold text-danger data-mono">
            {summary.abjSurvei.toFixed(1)}% / 95%
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="progress-fill h-full rounded-full"
            style={{
              width: `${Math.min(summary.abjSurvei, 100)}%`,
              background: "linear-gradient(90deg, #DC2626, #f87171)",
            }}
          ></div>
        </div>
        <p className="text-[10px] text-danger mt-1 font-medium">
          {summary.abjSurvei >= 95
            ? "Target tercapai"
            : `Kurang ${(95 - summary.abjSurvei).toFixed(1)}% dari target`}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-text-muted">
            ABJ Wilayah
          </span>
          <span className="text-xs font-bold text-danger data-mono">
            {summary.abjWilayah !== null
              ? `${summary.abjWilayah.toFixed(1)}% / 95%`
              : "-"}
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="progress-fill h-full rounded-full"
            style={{
              width: `${Math.min(summary.abjWilayah ?? 0, 100)}%`,
              background: "linear-gradient(90deg, #DC2626, #f87171)",
            }}
          ></div>
        </div>
        <p className="text-[10px] text-danger mt-1 font-medium">
          {summary.abjWilayah !== null
            ? summary.abjWilayah >= 95
              ? "Target tercapai"
              : `Kurang ${(95 - summary.abjWilayah).toFixed(1)}% dari target`
            : "Belum ada target rumah terdaftar"}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-text-muted">
            Density Figure
          </span>
          <span className="text-xs font-bold text-warning data-mono">
            {summary.densityFigure} / 9
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="progress-fill h-full rounded-full"
            style={{
              width: `${(summary.densityFigure / 9) * 100}%`,
              background: "linear-gradient(90deg, #D97706, #fbbf24)",
            }}
          ></div>
        </div>
        <p className="text-[10px] text-warning mt-1 font-medium">
          Maya Index: {summary.mayaIndex}
        </p>
      </div>

      <div className="border-t border-border-subtle pt-3">
        <h4 className="text-xs font-bold text-text-muted uppercase mb-3">
          Rekomendasi Tindakan
        </h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2.5 rounded bg-red-50 border border-red-100">
            <span className="material-symbols-outlined text-danger text-[16px] mt-0.5 shrink-0">
              priority_high
            </span>
            <p className="text-[11px] text-danger leading-relaxed">
              Intensifikasi PSN di kelurahan dengan rumah positif terbanyak.
            </p>
          </div>
          <div className="flex items-start gap-2 p-2.5 rounded bg-orange-50 border border-orange-100">
            <span className="material-symbols-outlined text-orange-600 text-[16px] mt-0.5 shrink-0">
              campaign
            </span>
            <p className="text-[11px] text-orange-700 leading-relaxed">
              Sosialisasi 3M Plus pada wilayah dengan ABJ di bawah target.
            </p>
          </div>
          <div className="flex items-start gap-2 p-2.5 rounded bg-violet-50 border border-violet-100">
            <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">
              fact_check
            </span>
            <p className="text-[11px] text-primary leading-relaxed">
              Tingkatkan coverage survei dan lengkapi pencatatan RT/RW untuk
              seluruh kunjungan.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onBackToRekap}
        className="flex items-center justify-center gap-2 mt-auto py-2 border border-border-subtle rounded text-xs text-text-muted hover:text-primary hover:border-primary/40 transition-colors font-medium"
      >
        <span className="material-symbols-outlined text-[16px]">
          arrow_back
        </span>
        Kembali ke Rekap Periodik
      </button>
    </div>
  );
}
