import { KPICard } from "../common/KPICard";

type DashboardKpiCardsProps = {
  kpis: any;
};

const DashboardKpiCards = ({ kpis }: DashboardKpiCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <KPICard
        title="Total Survei"
        icon="water_drop"
        value={kpis?.totalSurveys || 0}
        subtitle="Rumah diperiksa"
        tooltipText="Total akumulasi rumah tangga yang telah diperiksa dalam periode yang dipilih."
      />
      <KPICard
        title="Rumah Positif"
        icon="pest_control"
        value={kpis?.positiveHouses || 0}
        color="danger"
        subtitle="Ditemukan jentik"
        tooltipText="Jumlah rumah yang didapati positif keberadaan jentik nyamuk pada tempat penampungan air."
      />
      <KPICard
        title="ABJ Survei"
        icon="checklist"
        value={`${kpis?.abjSurvei ?? 0}%`}
        color={(kpis?.abjSurvei ?? 0) >= 95 ? "success" : "danger"}
        subtitle="Dari rumah disurvei"
        progress={kpis?.abjSurvei || 0}
        tooltipText="ABJ Survei: % rumah bebas jentik dari total rumah yang SUDAH disurvei. Formula: (survei - positif) / survei × 100%."
      />
      <KPICard
        title="ABJ Wilayah"
        icon="map"
        value={
          kpis?.abjWilayah !== null && kpis?.abjWilayah !== undefined
            ? `${kpis.abjWilayah}%`
            : "N/A"
        }
        color={
          kpis?.abjWilayah !== null && kpis?.abjWilayah !== undefined
            ? kpis.abjWilayah >= 95
              ? "success"
              : "danger"
            : "primary"
        }
        subtitle={`Dari ${kpis?.totalTargetHouses ?? 0} rumah terdaftar`}
        progress={kpis?.abjWilayah || 0}
        tooltipText="ABJ Wilayah: % rumah bebas jentik dari TOTAL rumah terdaftar di wilayah Puskesmas. Formula: (total rumah - positif) / total rumah × 100%."
      />
    </div>
  );
};

export default DashboardKpiCards;
