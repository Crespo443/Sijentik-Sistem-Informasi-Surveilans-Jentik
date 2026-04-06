import { monthNames } from "../../lib/surveyReportUtils";

type MonthlyRecapTableProps = {
  monthlyStats: any[];
  summary: any;
  year: string;
};

export default function MonthlyRecapTable({
  monthlyStats,
  summary,
  year,
}: MonthlyRecapTableProps) {
  return (
    <div className="lg:col-span-2 bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center">
        <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">
            calendar_month
          </span>
          Rekap Bulanan {year}
        </h3>
        <span className="text-xs text-text-muted">
          ABJ Target: <strong className="text-success">&ge; 95%</strong>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-border-subtle">
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Bulan
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                Rmh Diperiksa
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                Rmh Positif
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                ABJ Survei
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                ABJ Wilayah
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {monthlyStats.map((month) => {
              const isCurrent =
                month.totalSurveys > 0 &&
                month.label === monthNames[new Date().getMonth()];
              return (
                <tr
                  key={month.label}
                  className={`table-row-hover transition-colors ${isCurrent ? "bg-primary/5" : ""}`}
                >
                  <td
                    className={`px-4 py-3 font-semibold ${isCurrent ? "text-primary" : "text-text-main"}`}
                  >
                    {month.label}
                    {isCurrent ? " ← saat ini" : ""}
                  </td>
                  <td className="px-4 py-3 text-right data-mono">
                    {month.totalSurveys || "—"}
                  </td>
                  <td className="px-4 py-3 text-right data-mono text-danger">
                    {month.positiveHouses || "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {month.abj !== null ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-danger/10 text-danger">
                        {month.abj.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center data-mono text-sm">
                    {summary.abjWilayah !== null
                      ? `${summary.abjWilayah.toFixed(1)}%`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {month.totalSurveys > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-danger border border-red-100 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
                        {month.abj !== null && month.abj >= 95
                          ? "Target"
                          : "At Risk"}
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">
                        Belum tersedia
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-primary/5 border-t-2 border-primary/20">
            <tr>
              <td className="px-4 py-3 font-bold text-text-main">
                Rata-rata (YTD)
              </td>
              <td className="px-4 py-3 text-right font-bold data-mono">
                {summary.totalRumah}
              </td>
              <td className="px-4 py-3 text-right font-bold data-mono text-danger">
                {summary.rumahPositif}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-danger/10 text-danger">
                  {summary.abjSurvei.toFixed(1)}%
                </span>
              </td>
              <td className="px-4 py-3 text-center font-bold data-mono">
                {summary.abjWilayah !== null
                  ? `${summary.abjWilayah.toFixed(1)}%`
                  : "—"}
              </td>
              <td className="px-4 py-3 text-center text-xs text-text-muted">
                —
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
