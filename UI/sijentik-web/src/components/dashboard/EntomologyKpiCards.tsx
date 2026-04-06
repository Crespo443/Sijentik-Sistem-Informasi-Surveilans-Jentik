import { KPICard } from "../common/KPICard";

type EntomologyKpiCardsProps = {
  kpis: any;
};

const EntomologyKpiCards = ({ kpis }: EntomologyKpiCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <KPICard
        title="Jumlah Puskesmas"
        icon="local_hospital"
        value={kpis?.jumlahPuskesmas || 0}
        subtitle="Puskesmas aktif"
        color="primary"
        tooltipText="Jumlah Puskesmas yang saat ini aktif melaporkan data survei jentik."
      />
      <KPICard
        title="House Index (HI)"
        icon="home"
        value={`${kpis?.houseIndex || 0}%`}
        color="danger"
        subtitle="Persentase rumah positif"
        tooltipText="House Index (HI): Persentase rumah/bangunan yang positif ditemukan keberadaan jentik nyamuk. (Idealnya: < 5%)."
      />
      <KPICard
        title="Container Index (CI)"
        icon="layers"
        value={`${kpis?.containerIndex || 0}%`}
        color="warning"
        subtitle="Persentase wadah positif"
        tooltipText="Container Index (CI): Persentase wadah penampungan air (container) yang positif jentik dari total wadah yang diperiksa."
      />
      <KPICard
        title="Breteau Index (BI)"
        icon="pest_control"
        value={kpis?.breteauIndex || 0}
        color="danger"
        subtitle="Wadah positif per 100 rumah"
        tooltipText="Breteau Index (BI): Menandakan jumlah rata-rata wadah/kontainer yang positif jentik per 100 rumah yang disurvei."
      />
      <KPICard
        title="Density Figure (DF)"
        icon="bar_chart"
        value={kpis?.densityFigure || 0}
        color="warning"
        subtitle="Skala 1-9"
        tooltipText="Density Figure (DF): Skala angka kepadatan jentik (1-9) yang ditentukan dari rata-rata gabungan nilai HI, CI, dan BI untuk melihat tingkat kewaspadaan."
      />
      <KPICard
        title="Maya Index"
        icon="query_stats"
        value={kpis?.mayaIndex || "Low"}
        color={
          kpis?.mayaIndex === "Low"
            ? "success"
            : kpis?.mayaIndex === "Medium"
              ? "warning"
              : "danger"
        }
        subtitle="Tingkat Risiko"
        tooltipText="Maya Index: Menilai tingkat potensi tempat perkembangbiakan nyamuk berdasarkan keseimbangan/ketersediaan jenis objek tampungan."
      />
    </div>
  );
};

export default EntomologyKpiCards;
