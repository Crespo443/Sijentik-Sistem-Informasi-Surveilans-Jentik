import { Badge } from "../common/Badge";

type RegionalRecapTableProps = {
  regionalDataLength: number;
  periodeType: string;
  month: string;
  year: string;
  sortBy: string;
  sortAsc: boolean;
  handleSort: (field: string) => void;
  sortedRegionalData: any[];
  kpis: any;
};

export function RegionalRecapTable({
  regionalDataLength,
  periodeType,
  month,
  year,
  sortBy,
  sortAsc,
  handleSort,
  sortedRegionalData,
  kpis,
}: RegionalRecapTableProps) {
  return (
    <div className="bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden animate-slide-up">
      <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-3">
          <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">
              table_chart
            </span>
            Rekap Per Puskesmas
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
            {regionalDataLength} Wilayah
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            Periode:{" "}
            <strong className="text-text-main">
              {periodeType === "bulanan"
                ? `${new Date(2000, parseInt(month) - 1, 1).toLocaleString("id-ID", { month: "long" })} ${year}`
                : `Tahun ${year}`}
            </strong>
          </span>
        </div>
      </div>
      <div className="overflow-x-auto no-scrollbar max-h-125">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="border-b border-border-subtle">
              <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Wilayah
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                Kecamatan
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                Rumah Diperiksa
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                Rumah Positif
              </th>
              <th
                className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center cursor-pointer hover:bg-slate-200 transition-colors"
                title="Sort by ABJ Survei"
                onClick={() => handleSort("abj")}
              >
                ABJ Survei{" "}
                {sortBy === "abj" && (
                  <span className="text-primary">{sortAsc ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center cursor-pointer hover:bg-slate-200 transition-colors"
                title="Sort by ABJ Wilayah"
                onClick={() => handleSort("abjWilayah")}
              >
                ABJ Wilayah{" "}
                {sortBy === "abjWilayah" && (
                  <span className="text-primary">{sortAsc ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center cursor-pointer hover:bg-slate-200 transition-colors"
                title="Sort by Density Figure"
                onClick={() => handleSort("densityFigure")}
              >
                DF{" "}
                {sortBy === "densityFigure" && (
                  <span className="text-primary">{sortAsc ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {sortedRegionalData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-text-muted">
                  Tidak ada data untuk periode ini
                </td>
              </tr>
            ) : (
              sortedRegionalData.map((row: any, idx: number) => (
                <tr
                  key={idx}
                  className="hover:bg-liner-to-r hover:from-[rgba(101,4,174,0.03)] hover:to-transparent transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-text-main">{row.name}</p>
                  </td>
                  <td className="px-5 py-3.5 text-center text-text-muted text-sm">
                    {row.districtName || "-"}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono">
                    {row.totalSurveys}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-danger">
                    {row.positiveHouses || 0}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${row.abj >= 95 ? "bg-green-50 text-success border-green-200" : row.abj >= 80 ? "bg-yellow-50 text-warning border-yellow-200" : "bg-red-50 text-danger border-red-200"}`}
                    >
                      {row.abj}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-sm">
                    {row.abjWilayah !== null ? `${row.abjWilayah}%` : "-"}
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-sm">
                    {row.densityFigure}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {row.riskLevel === "CRITICAL" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-900/10 text-red-900 border border-red-900/20 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-900 animate-pulse"></span>
                        Critical
                      </span>
                    )}
                    {row.riskLevel === "WARNING" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-50 text-warning border border-yellow-200 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                        Warning
                      </span>
                    )}
                    {row.riskLevel === "TARGET" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-success border border-green-200 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                        Target
                      </span>
                    )}
                    {row.riskLevel === "UNKNOWN" && (
                      <Badge variant="neutral">Tidak Ada Data</Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-primary/5 border-t-2 border-primary/20">
            <tr>
              <td
                colSpan={2}
                className="px-5 py-3.5 font-bold text-text-main text-sm"
              >
                Total / Rata-rata
              </td>
              <td className="px-5 py-3.5 text-right font-bold font-mono">
                {kpis?.totalSurveys || 0}
              </td>
              <td className="px-5 py-3.5 text-right font-bold font-mono text-danger">
                {kpis?.positiveHouses || 0}
              </td>
              <td className="px-5 py-3.5 text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${kpis?.abjSurvei >= 95 ? "bg-green-50 text-success border-green-200" : "bg-warning/10 text-warning border-warning/20"}`}
                >
                  {kpis?.abjSurvei || 0}%
                </span>
              </td>
              <td className="px-5 py-3.5 text-center font-bold font-mono">
                {kpis?.abjWilayah != null ? `${kpis?.abjWilayah}%` : "-"}
              </td>
              <td className="px-5 py-3.5 text-center font-bold font-mono">
                {kpis?.densityFigure || 0}
              </td>
              <td className="px-5 py-3.5 text-center text-xs text-text-muted">
                —
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
