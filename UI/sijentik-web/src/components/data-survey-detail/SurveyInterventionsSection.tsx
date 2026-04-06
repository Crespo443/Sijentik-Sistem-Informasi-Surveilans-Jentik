type SurveyInterventionsSectionProps = {
  survey: any;
};

export function SurveyInterventionsSection({
  survey,
}: SurveyInterventionsSectionProps) {
  return (
    <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[18px]">
            task_alt
          </span>
        </div>
        <h2 className="text-base font-bold font-heading text-text-main">
          3. Tindakan PSN 3M Plus
        </h2>
      </div>

      <ul className="space-y-2 mb-6">
        {survey.interventions?.map((inv: any) => (
          <li
            key={inv.id}
            className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200"
          >
            {inv.isDone ? (
              <span className="material-symbols-outlined text-success text-lg">
                check_circle
              </span>
            ) : (
              <span className="material-symbols-outlined text-slate-300 text-lg">
                radio_button_unchecked
              </span>
            )}
            <span
              className={`text-sm ${inv.isDone ? "text-text-main font-medium" : "text-text-muted line-through"}`}
            >
              {inv.activityName}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-border-subtle pt-5">
        <span className="text-xs font-medium text-text-muted mb-1 block">
          Catatan Tambahan Pekerja Lapangan
        </span>
        <div className="p-3 bg-slate-50 border border-border-subtle rounded text-sm text-text-main min-h-15 whitespace-pre-wrap">
          {survey.notes || (
            <span className="italic text-slate-400">Tidak ada catatan</span>
          )}
        </div>
      </div>
    </div>
  );
}
