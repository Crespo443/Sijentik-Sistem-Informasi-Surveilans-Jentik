type SurveyInterventionsSectionProps = {
  title?: string;
  interventionData: any[];
  formData: any;
  handleInterventionChange: (index: number, checked: boolean) => void;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
};

export function SurveyInterventionsSection({
  title = "5. Tindakan PSN 3M Plus",
  interventionData,
  formData,
  handleInterventionChange,
  handleInputChange,
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
          {title}
        </h2>
      </div>
      <p className="text-sm text-text-muted mb-4">
        Centang aktivitas yang dilakukan oleh keluarga/pemilik rumah:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {interventionData.map((inv, i) => (
          <label
            key={i}
            className={`flex items-center gap-3 p-3 border border-border-subtle rounded hover:bg-slate-50 cursor-pointer transition-colors ${i === 6 ? "md:col-span-2" : ""}`}
          >
            <input
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
              type="checkbox"
              checked={inv.isDone}
              onChange={(e) => handleInterventionChange(i, e.target.checked)}
            />
            <span className="text-sm text-text-main">{inv.activityName}</span>
          </label>
        ))}
      </div>

      <div className="space-y-4 border-t border-border-subtle pt-5">
        <div>
          <label
            htmlFor="catatan"
            className="text-sm font-medium text-text-main mb-1 block"
          >
            Catatan Tambahan Pekerja Lapangan (Opsional)
          </label>
          <textarea
            id="catatan"
            name="catatan"
            rows={3}
            className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
            placeholder="Masukkan catatan tambahan…"
            value={formData.catatan}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
