import { Button } from "../common/Button";
import { DataField } from "./DataField";

type SurveyLocationSectionProps = {
  survey: any;
  onViewMap: () => void;
};

export function SurveyLocationSection({
  survey,
  onViewMap,
}: SurveyLocationSectionProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <DataField
            label="Puskesmas"
            value={survey.accessCode?.healthCenter?.name || "-"}
          />
          <DataField label="Nama Petugas" value={survey.surveyorName || "-"} />
          <DataField
            label="Kelurahan/Desa"
            value={survey.village?.name || "-"}
          />
          <DataField label="RT/RW" value={survey.rtRw || "-"} />
          <DataField
            label="Alamat Lengkap"
            value={survey.address || "-"}
            className="min-h-16"
          />
        </div>
        <div className="space-y-4">
          <DataField
            label="Nama Kepala Keluarga (KK)"
            value={survey.houseOwner}
          />
          <DataField
            label="Jumlah Penghuni (Orang)"
            value={survey.occupantCount?.toString() || "-"}
          />
          <div className="pt-1">
            <span className="text-xs font-medium text-text-muted mb-1 block">
              Koordinat GPS
            </span>
            <div className="flex justify-between items-center gap-2 bg-white px-3 py-2 border border-border-subtle rounded text-sm text-text-main font-medium shadow-sm mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-text-muted text-[16px]">
                  pin_drop
                </span>
                {survey.latitude && survey.longitude
                  ? `${survey.latitude}, ${survey.longitude}`
                  : "Tidak ada koordinat"}
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={onViewMap}
              className="w-full"
              icon="map"
            >
              Lihat di Peta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
