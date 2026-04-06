import Select from "react-select";
import { selectCustomStyles } from "../../lib/selectCustomStyles";

type SurveyInputLocationSectionProps = {
  villages: any[];
  formData: any;
  setFormData: (data: any) => void;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleGetLocation: () => void;
};

export function SurveyInputLocationSection({
  villages,
  formData,
  setFormData,
  handleInputChange,
  handleGetLocation,
}: SurveyInputLocationSectionProps) {
  return (
    <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[18px]">
            location_on
          </span>
        </div>
        <h2 className="text-base font-bold font-heading text-text-main">
          1. Data Rumah & Lokasi
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="villageId"
              className="text-sm font-medium text-text-main mb-1 block z-20 relative"
            >
              Kelurahan/Desa
            </label>
            <Select
              options={villages.map((v) => ({
                value: v.id,
                label: `${v.type === "KELURAHAN" ? "Kelurahan" : "Desa"} ${v.name}`,
              }))}
              value={
                formData.villageId
                  ? {
                      value: formData.villageId,
                      label: villages.find((v) => v.id === formData.villageId)
                        ? `${villages.find((v: any) => v.id === formData.villageId).type === "KELURAHAN" ? "Kelurahan" : "Desa"} ${villages.find((v: any) => v.id === formData.villageId).name}`
                        : "Pilih Kelurahan...",
                    }
                  : null
              }
              onChange={(selected: any) =>
                setFormData({ ...formData, villageId: selected?.value || "" })
              }
              styles={selectCustomStyles}
              placeholder="Pilih Kelurahan/Desa..."
              isClearable
            />
            <input
              type="text"
              tabIndex={-1}
              required
              value={formData.villageId}
              style={{
                opacity: 0,
                height: 0,
                padding: 0,
                position: "absolute",
                pointerEvents: "none",
              }}
              onChange={() => {}}
            />
          </div>
          <div>
            <label
              htmlFor="rtrw"
              className="text-sm font-medium text-text-main mb-1 block"
            >
              RT/RW
            </label>
            <input
              id="rtrw"
              name="rtrw"
              className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="001/005"
              type="text"
              value={formData.rtrw}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="nama_kk"
              className="text-sm font-medium text-text-main mb-1 block"
            >
              Nama Kepala Keluarga (KK)
            </label>
            <input
              id="nama_kk"
              name="nama_kk"
              required
              className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="Nama Lengkap"
              type="text"
              value={formData.nama_kk}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="jumlah_penghuni"
              className="text-sm font-medium text-text-main mb-1 block"
            >
              Jumlah Penghuni
            </label>
            <input
              id="jumlah_penghuni"
              name="jumlah_penghuni"
              className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="Orang"
              type="number"
              min="0"
              value={formData.jumlah_penghuni}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div>
          <label
            htmlFor="alamat"
            className="text-sm font-medium text-text-main mb-1 block"
          >
            Alamat Lengkap
          </label>
          <textarea
            id="alamat"
            name="alamat"
            className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
            placeholder="Jl. Merdeka No. 123…"
            rows={2}
            value={formData.alamat}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium text-text-main mb-1 block">
            Koordinat GPS
          </span>
          <button
            onClick={handleGetLocation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/5 text-primary border border-primary/20 rounded text-sm font-semibold hover:bg-primary/10 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              my_location
            </span>
            {formData.lat ? "Koordinat Didapatkan ✓" : "Ambil Koordinat GPS"}
          </button>
          {formData.lat && (
            <p className="text-xs text-text-muted text-center">
              {formData.lat}, {formData.lng}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
