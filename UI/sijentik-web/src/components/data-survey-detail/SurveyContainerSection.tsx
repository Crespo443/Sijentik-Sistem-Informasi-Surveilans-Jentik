type SurveyContainerSectionProps = {
  survey: any;
  totalInspected: number;
  totalPositive: number;
};

export function SurveyContainerSection({
  survey,
  totalInspected,
  totalPositive,
}: SurveyContainerSectionProps) {
  return (
    <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[18px]">
            water_drop
          </span>
        </div>
        <h2 className="text-base font-bold font-heading text-text-main">
          2. Hasil Inspeksi Kontainer
        </h2>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 border border-border-subtle rounded text-center">
          <span className="block text-xs font-semibold text-text-muted uppercase mb-1">
            Total Diperiksa
          </span>
          <span className="text-2xl font-bold font-mono">{totalInspected}</span>
        </div>
        <div className="bg-red-50 p-4 border border-red-100 rounded text-center">
          <span className="block text-xs font-semibold text-danger uppercase mb-1">
            Total Positif Jentik
          </span>
          <span className="text-2xl font-bold font-mono text-danger">
            {totalPositive}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border-subtle">
              <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Jenis Kontainer
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider text-center w-24">
                Diperiksa
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider text-center w-24">
                Positif (+)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {survey.containers?.length > 0 ? (
              survey.containers.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 text-xs text-text-muted">
                    {c.category === "DAILY"
                      ? "Harian"
                      : c.category === "NON_DAILY"
                        ? "Non Harian"
                        : "Alamiah"}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-text-main">
                    {c.containerName}
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-text-muted">
                    {c.inspectedCount}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-center font-mono font-bold ${c.positiveCount > 0 ? "text-danger" : "text-success"}`}
                  >
                    {c.positiveCount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-text-muted"
                >
                  Tidak ada kontainer yang dicatat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
