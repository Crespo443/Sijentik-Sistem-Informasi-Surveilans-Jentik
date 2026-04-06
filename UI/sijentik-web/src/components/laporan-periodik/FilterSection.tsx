import Select from "react-select";
import { selectCustomStyles } from "../../lib/selectCustomStyles";

type FilterSectionProps = {
  periodeType: string;
  setPeriodeType: (value: string) => void;
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  districtId: string;
  setDistrictId: (value: string) => void;
  districts: any[];
  loading: boolean;
  applyFilters: () => void;
};

export function FilterSection({
  periodeType,
  setPeriodeType,
  month,
  setMonth,
  year,
  setYear,
  districtId,
  setDistrictId,
  districts,
  loading,
  applyFilters,
}: FilterSectionProps) {
  return (
    <div className="bg-surface border border-border-subtle shadow-card rounded-lg p-5 animate-fade-in z-30 relative">
      <h3 className="text-sm font-bold font-heading text-text-main mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-primary">
          filter_alt
        </span>
        Filter Periode Laporan
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Jenis Periode
          </label>
          <Select
            options={[
              { value: "bulanan", label: "Bulanan" },
              { value: "tahunan", label: "Tahunan" },
            ]}
            value={{
              value: periodeType,
              label: periodeType === "bulanan" ? "Bulanan" : "Tahunan",
            }}
            onChange={(selected: any) =>
              setPeriodeType(selected?.value || "bulanan")
            }
            styles={selectCustomStyles}
            isSearchable={false}
          />
        </div>

        <div
          className={
            periodeType === "tahunan" ? "opacity-50 pointer-events-none" : ""
          }
        >
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Bulan
          </label>
          <Select
            options={Array.from({ length: 12 }, (_, i) => {
              const val = (i + 1).toString().padStart(2, "0");
              return {
                value: val,
                label: new Date(2000, i, 1).toLocaleString("id-ID", {
                  month: "long",
                }),
              };
            })}
            value={{
              value: month,
              label: new Date(2000, parseInt(month) - 1, 1).toLocaleString(
                "id-ID",
                { month: "long" },
              ),
            }}
            onChange={(selected: any) => setMonth(selected?.value || "01")}
            styles={selectCustomStyles}
            isSearchable={false}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Tahun
          </label>
          <Select
            options={[
              { value: "2026", label: "2026" },
              { value: "2025", label: "2025" },
              { value: "2024", label: "2024" },
            ]}
            value={{ value: year, label: year }}
            onChange={(selected: any) => setYear(selected?.value || "2026")}
            styles={selectCustomStyles}
            isSearchable={false}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Kecamatan
          </label>
          <Select
            options={[
              { value: "", label: "Semua Kecamatan" },
              ...districts.map((d: any) => ({ value: d.id, label: d.name })),
            ]}
            value={{
              value: districtId,
              label:
                districts.find((d: any) => d.id === districtId)?.name ||
                "Semua Kecamatan",
            }}
            onChange={(selected: any) => setDistrictId(selected?.value || "")}
            styles={selectCustomStyles}
            isSearchable={true}
            placeholder="Semua Kecamatan"
          />
        </div>

        <div>
          <button
            className="w-full bg-primary text-white px-4 py-[9px] rounded text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            onClick={applyFilters}
            disabled={loading}
          >
            <span className="material-symbols-outlined text-[18px]">
              search
            </span>
            {loading ? "Memuat..." : "Tampilkan"}
          </button>
        </div>
      </div>
    </div>
  );
}
