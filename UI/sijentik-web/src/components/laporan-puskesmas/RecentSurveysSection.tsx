import Select from "react-select";
import { selectCustomStyles } from "../../lib/selectCustomStyles";
import { monthNames } from "../../lib/surveyReportUtils";

type RecentSurveysSectionProps = {
  year: string;
  searchTerm: string;
  villageFilter: string;
  pkm: any;
  recentSurveys: any[];
  filteredSurveys: any[];
  onSearchTermChange: (value: string) => void;
  onVillageFilterChange: (value: string) => void;
  onViewSurvey: (surveyId: string) => void;
  onResetFilter: () => void;
};

export default function RecentSurveysSection({
  year,
  searchTerm,
  villageFilter,
  pkm,
  recentSurveys,
  filteredSurveys,
  onSearchTermChange,
  onVillageFilterChange,
  onViewSurvey,
  onResetFilter,
}: RecentSurveysSectionProps) {
  return (
    <div className="bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden animate-slide-up">
      <div className="px-5 py-4 border-b border-border-subtle flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">
            format_list_bulleted
          </span>
          Data Survey Terakhir
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 ml-1">
            {monthNames[new Date().getMonth()]} {year}
          </span>
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <span className="material-symbols-outlined text-text-muted text-[16px] absolute left-2.5 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Cari alamat / RT..."
              className="pl-8 pr-3 py-1.5 text-xs border border-border-subtle rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all w-44"
            />
          </div>
          <div className="w-56 z-40 relative">
            <Select
              options={[
                { value: "", label: "Semua Kelurahan" },
                ...(pkm.district?.villages || []).map((v: any) => ({
                  value: v.id,
                  label: v.name,
                })),
              ]}
              value={
                villageFilter
                  ? {
                      value: villageFilter,
                      label:
                        pkm.district?.villages?.find(
                          (v: any) => v.id === villageFilter,
                        )?.name || "Semua Kelurahan",
                    }
                  : { value: "", label: "Semua Kelurahan" }
              }
              onChange={(selected: any) =>
                onVillageFilterChange(selected?.value || "")
              }
              styles={selectCustomStyles}
              isClearable={false}
              menuPortalTarget={document.body}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-border-subtle">
              <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Kelurahan / RT
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                Tgl Survey
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                Container Diperiksa
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                Container Positif
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                Nama KK
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                Jumlah Penghuni
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                Petugas
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {recentSurveys.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-text-muted">
                  Tidak ada data survey pada filter yang dipilih.
                </td>
              </tr>
            ) : (
              recentSurveys.map((survey) => {
                return (
                  <tr
                    key={survey.id}
                    className="table-row-hover transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-text-main">
                        {survey.villageName}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {survey.rtRw !== "-" ? `RT/RW ${survey.rtRw}` : "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-center text-text-muted text-xs">
                      {survey.date}
                    </td>
                    <td className="px-4 py-3.5 text-right data-mono">
                      {survey.inspected}
                    </td>
                    <td className="px-4 py-3.5 text-right data-mono text-danger">
                      {survey.positive}
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-text-main truncate max-w-40">
                      {survey.houseOwner}
                    </td>
                    <td className="px-4 py-3.5 text-center data-mono text-xs">
                      {survey.occupantCount}
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs text-text-muted">
                      {survey.surveyor}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => onViewSurvey(survey.id)}
                        className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          visibility
                        </span>
                        Lihat
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-text-muted">
          Menampilkan {recentSurveys.length} dari {filteredSurveys.length} data
          survey terfilter
        </span>
        <button
          onClick={onResetFilter}
          className="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
        >
          Reset Filter{" "}
          <span className="material-symbols-outlined text-[14px]">refresh</span>
        </button>
      </div>
    </div>
  );
}
