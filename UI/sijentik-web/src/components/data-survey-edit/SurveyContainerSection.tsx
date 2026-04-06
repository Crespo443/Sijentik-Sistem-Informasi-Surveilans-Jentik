type SurveyContainerSectionProps = {
  title: string;
  icon: string;
  category: "DAILY" | "NON_DAILY" | "NATURAL";
  containerData: any[];
  handleContainerChange: (
    index: number,
    field: "inspectedCount" | "positiveCount",
    value: string,
  ) => void;
  compact?: boolean;
};

export function SurveyContainerSection({
  title,
  icon,
  category,
  containerData,
  handleContainerChange,
  compact = false,
}: SurveyContainerSectionProps) {
  return (
    <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[18px]">
            {icon}
          </span>
        </div>
        <h2 className="text-base font-bold font-heading text-text-main">
          {title}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border-subtle">
              <th
                className={`${compact ? "px-3" : "px-4"} py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider`}
              >
                {compact ? "Jenis" : "Jenis Kontainer"}
              </th>
              <th
                className={`${compact ? "px-3 w-20" : "px-4 w-32"} py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider text-center`}
              >
                {compact ? "Periksa" : "Diperiksa"}
              </th>
              <th
                className={`${compact ? "px-3 w-20" : "px-4 w-32"} py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider text-center`}
              >
                {compact ? "Positif" : "Positif (+)"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {containerData.map(
              (c, i) =>
                c.category === category && (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td
                      className={`${compact ? "px-3 py-2" : "px-4 py-2.5"} font-medium text-text-main`}
                    >
                      {c.name}
                    </td>
                    <td className={`${compact ? "px-3 py-1.5" : "px-4 py-2"}`}>
                      <input
                        className="w-full px-2 py-1 text-sm border border-border-subtle rounded text-center focus:border-primary outline-none"
                        type="number"
                        min="0"
                        value={c.inspectedCount}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleContainerChange(
                            i,
                            "inspectedCount",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td className={`${compact ? "px-3 py-1.5" : "px-4 py-2"}`}>
                      <input
                        className="w-full px-2 py-1 text-sm border border-border-subtle rounded text-center focus:border-primary outline-none"
                        type="number"
                        min="0"
                        value={c.positiveCount}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleContainerChange(
                            i,
                            "positiveCount",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                  </tr>
                ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
