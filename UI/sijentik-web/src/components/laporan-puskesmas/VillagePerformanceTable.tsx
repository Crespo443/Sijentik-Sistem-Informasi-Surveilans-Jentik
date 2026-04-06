type VillagePerformanceTableProps = {
  villageStats: any[];
};

export default function VillagePerformanceTable({
  villageStats,
}: VillagePerformanceTableProps) {
  return (
    <div className="bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden animate-slide-up">
      <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center">
        <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">
            location_city
          </span>
          Rekap Kinerja Kelurahan / Desa
        </h3>
        <span className="text-xs text-text-muted">
          {villageStats.length} kelurahan
        </span>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-border-subtle">
              <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase">
                Kelurahan / Desa
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-center">
                Tgl Survey Terakhir
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-right">
                Rmh Diperiksa
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-right">
                Rmh Positif
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-center">
                House Index (HI)
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-center">
                Petugas Terakhir
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {villageStats.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-text-muted">
                  Tidak ada data kelurahan.
                </td>
              </tr>
            ) : (
              villageStats.map((village: any) => (
                <tr
                  key={village.id}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-text-main">
                      {village.name}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-center text-text-muted text-xs">
                    {village.latestDate}
                  </td>
                  <td className="px-4 py-3.5 text-right data-mono">
                    {village.total}
                  </td>
                  <td className="px-4 py-3.5 text-right data-mono text-danger">
                    {village.positive}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {village.total > 0 ? (
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${village.houseIndex > 5 ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}
                      >
                        {village.houseIndex.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs text-text-muted">
                    {village.surveyor}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
