import { useState, useEffect } from 'react';
import { KPICard } from '../components/common/KPICard';
import api from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Select from 'react-select';
import { selectCustomStyles } from '../lib/selectCustomStyles';

const Dashboard = () => {
  const [kpis, setKpis] = useState<any>(null);
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState<'abj' | 'abjWilayah' | 'densityFigure'>('abj');

  // Example Filter States
  const [filterPeriod, setFilterPeriod] = useState('this_week');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [kpiRes, regionalRes, activityRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/regional-performance'),
          api.get('/analytics/recent-activity')
        ]);

        setKpis(kpiRes.data);
        setRegionalData(regionalRes.data);
        setActivities(activityRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filterPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto space-y-6">
      {/* ===== WEATHER & FILTER ACTIONS ===== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
        {/* Dynamic Risk Alert Banner */}
        {(() => {
          const df = kpis?.densityFigure ?? 0;
          const abj = kpis?.abjSurvei ?? 100;
          const month = new Date().getMonth() + 1; // 1-indexed
          const isRainySeason = month >= 10 || month <= 4;

          // Risk from DF (WHO standard scale 1–9)
          const dfRisk = df >= 6 ? 'CRITICAL' : df >= 3 ? 'WARNING' : 'RENDAH';
          // Also flag if ABJ is below target
          const abjRisk = abj < 80 ? 'CRITICAL' : abj < 95 ? 'WARNING' : 'RENDAH';
          const overallRisk = dfRisk === 'CRITICAL' || abjRisk === 'CRITICAL' ? 'CRITICAL'
            : dfRisk === 'WARNING' || abjRisk === 'WARNING' ? 'WARNING' : 'RENDAH';

          const riskConfig = {
            CRITICAL: {
              bg: 'bg-red-50', border: 'border-red-300', iconBg: 'bg-red-100', iconColor: 'text-red-600',
              titleColor: 'text-red-900', textColor: 'text-red-700', strongColor: 'text-red-900',
              icon: 'warning', badge: 'bg-red-100 text-red-700 border-red-200',
              label: 'Kritis', title: 'Tingkat Risiko Jentik: KRITIS',
              desc: `DF=${df} (skala WHO), ABJ=${abj}% — jauh di bawah target nasional 95%. Segera tingkatkan frekuensi survei.`,
            },
            WARNING: {
              bg: 'bg-amber-50', border: 'border-amber-300', iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
              titleColor: 'text-amber-900', textColor: 'text-amber-700', strongColor: 'text-amber-900',
              icon: 'notification_important', badge: 'bg-amber-100 text-amber-700 border-amber-200',
              label: 'Waspada', title: 'Tingkat Risiko Jentik: WASPADA',
              desc: `DF=${df} (skala WHO), ABJ=${abj}% — belum mencapai target 95%. Pantau wilayah dengan ABJ rendah.`,
            },
            RENDAH: {
              bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
              titleColor: 'text-blue-900', textColor: 'text-blue-700', strongColor: 'text-blue-900',
              icon: isRainySeason ? 'thunderstorm' : 'wb_sunny', badge: 'bg-blue-100 text-blue-700 border-blue-200',
              label: 'Rendah', title: isRainySeason ? 'Musim Hujan — Risiko Terkendali' : 'Musim Kemarau — Kondisi Baik',
              desc: `DF=${df}, ABJ=${abj}% — telah memenuhi target nasional ≥95%. Pertahankan survei rutin.`,
            },
          };
          const cfg = riskConfig[overallRisk];
          return (
            <div className={`flex-1 w-full ${cfg.bg} border ${cfg.border} rounded-lg p-3 flex items-center gap-3 shadow-sm`}>
              <div className={`w-10 h-10 rounded-full ${cfg.iconBg} flex items-center justify-center shrink-0 ${cfg.iconColor}`}>
                <span className="material-symbols-outlined">{cfg.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-bold ${cfg.titleColor}`}>{cfg.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
                </div>
                <p className={`text-xs ${cfg.textColor} mt-0.5`}>{cfg.desc}</p>
              </div>
            </div>
          );
        })()}

        {/* Quick Filter */}
        <div className="shrink-0 flex items-center gap-2 z-30 relative min-w-[200px]">
          <Select
            options={[
              { value: 'all', label: 'Semua Waktu' },
              { value: 'this_week', label: 'Minggu Ini' },
              { value: 'last_week', label: 'Minggu Lalu' },
              { value: 'this_month', label: 'Bulan Ini' }
            ]}
            value={{ 
              value: filterPeriod, 
              label: filterPeriod === 'all' ? 'Semua Waktu' : filterPeriod === 'this_week' ? 'Minggu Ini' : filterPeriod === 'last_week' ? 'Minggu Lalu' : 'Bulan Ini' 
            }}
            onChange={(selected: any) => setFilterPeriod(selected?.value || 'all')}
            styles={{...selectCustomStyles, control: (base) => ({...base, minHeight: '38px', borderRadius: '0.5rem', borderColor: '#E2E8F0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'})}}
            isSearchable={false}
            className="w-full text-sm font-medium"
          />
        </div>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <KPICard title="Total Survei" icon="water_drop" value={kpis?.totalSurveys || 0} subtitle="Rumah diperiksa" tooltipText="Total akumulasi rumah tangga yang telah diperiksa dalam periode yang dipilih." />
        <KPICard title="Rumah Positif" icon="pest_control" value={kpis?.positiveHouses || 0} color="danger" subtitle="Ditemukan jentik" tooltipText="Jumlah rumah yang didapati positif keberadaan jentik nyamuk pada tempat penampungan air." />
        <KPICard title="ABJ Survei" icon="checklist" value={`${kpis?.abjSurvei ?? 0}%`} color={(kpis?.abjSurvei ?? 0) >= 95 ? "success" : "danger"} subtitle="Dari rumah disurvei" progress={kpis?.abjSurvei || 0} tooltipText="ABJ Survei: % rumah bebas jentik dari total rumah yang SUDAH disurvei. Formula: (survei - positif) / survei × 100%." />
        <KPICard title="ABJ Wilayah" icon="map" value={kpis?.abjWilayah !== null && kpis?.abjWilayah !== undefined ? `${kpis.abjWilayah}%` : 'N/A'} color={kpis?.abjWilayah !== null && kpis?.abjWilayah !== undefined ? ((kpis.abjWilayah >= 95) ? "success" : "danger") : "primary"} subtitle={`Dari ${kpis?.totalTargetHouses ?? 0} rumah terdaftar`} progress={kpis?.abjWilayah || 0} tooltipText="ABJ Wilayah: % rumah bebas jentik dari TOTAL rumah terdaftar di wilayah Puskesmas. Formula: (total rumah - positif) / total rumah × 100%." />
      </div>

      {/* ===== OPERATIONAL OVERVIEW ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ====== LEFT COLUMN: Entomological Indices ====== */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KPICard title="Jumlah Puskesmas" icon="local_hospital" value={kpis?.jumlahPuskesmas || 0} subtitle="Puskesmas aktif" color="primary" tooltipText="Jumlah Puskesmas yang saat ini aktif melaporkan data survei jentik." />
            <KPICard title="House Index (HI)" icon="home" value={`${kpis?.houseIndex || 0}%`} color="danger" subtitle="Persentase rumah positif" tooltipText="House Index (HI): Persentase rumah/bangunan yang positif ditemukan keberadaan jentik nyamuk. (Idealnya: < 5%)." />
            <KPICard title="Container Index (CI)" icon="layers" value={`${kpis?.containerIndex || 0}%`} color="warning" subtitle="Persentase wadah positif" tooltipText="Container Index (CI): Persentase wadah penampungan air (container) yang positif jentik dari total wadah yang diperiksa." />
            <KPICard title="Breteau Index (BI)" icon="pest_control" value={kpis?.breteauIndex || 0} color="danger" subtitle="Wadah positif per 100 rumah" tooltipText="Breteau Index (BI): Menandakan jumlah rata-rata wadah/kontainer yang positif jentik per 100 rumah yang disurvei." />
            <KPICard title="Density Figure (DF)" icon="bar_chart" value={kpis?.densityFigure || 0} color="warning" subtitle="Skala 1-9" tooltipText="Density Figure (DF): Skala angka kepadatan jentik (1-9) yang ditentukan dari rata-rata gabungan nilai HI, CI, dan BI untuk melihat tingkat kewaspadaan." />
            <KPICard title="Maya Index" icon="query_stats" value={kpis?.mayaIndex || 'Low'} color={kpis?.mayaIndex === 'Low' ? 'success' : kpis?.mayaIndex === 'Medium' ? 'warning' : 'danger'} subtitle="Tingkat Risiko" tooltipText="Maya Index: Menilai tingkat potensi tempat perkembangbiakan nyamuk berdasarkan keseimbangan/ketersediaan jenis objek tampungan." />
          </div>
          <RegionalSummary data={regionalData} metric={chartMetric} onMetricChange={setChartMetric} />
        </div>

        {/* ====== RIGHT COLUMN: Activity Feed ====== */}
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
};

// -- Mini Components for Dashboard --

type ChartMetric = 'abj' | 'abjWilayah' | 'densityFigure';

const METRIC_OPTIONS: { value: ChartMetric; label: string; unit: string }[] = [
  { value: 'abj',          label: 'ABJ Survei',   unit: '%' },
  { value: 'abjWilayah',   label: 'ABJ Wilayah',  unit: '%' },
  { value: 'densityFigure',label: 'Density Figure (DF)', unit: '' },
];

const RegionalSummary = ({
  data,
  metric,
  onMetricChange,
}: {
  data: any[];
  metric: ChartMetric;
  onMetricChange: (m: ChartMetric) => void;
}) => {
  const chartData = data.map(d => ({
    name: d.name.replace(/PKM /g, ''),
    abj: d.abj,
    // Store null flag separately — recharts can't render null bar values so we use 0
    abjWilayah: d.abjWilayah ?? 0,
    abjWilayahNull: d.abjWilayah === null || d.abjWilayah === undefined,
    densityFigure: d.densityFigure ?? 0,
    totalSurveys: d.totalSurveys,
    targetHouses: d.targetHouses ?? 0,
    riskLevel: d.riskLevel,
  }));

  const isDF = metric === 'densityFigure';
  const currentOpt = METRIC_OPTIONS.find(o => o.value === metric)!;

  // DF uses a 0–9 scale (WHO), ABJ uses 0–100
  const yDomain: [number, number] = isDF ? [0, 9] : [0, 100];
  const yTicks = isDF ? [0, 3, 6, 9] : [0, 25, 50, 75, 100];

  // Reference line value for ABJ target (95) — not applicable for DF
  const getBarColor = (entry: any) => {
    // For abjWilayah: grey bar when no targetHouses data
    if (metric === 'abjWilayah' && entry.abjWilayahNull) return '#CBD5E1';

    if (isDF) {
      const df = entry.densityFigure;
      if (df >= 6) return '#ef4444'; // red
      if (df >= 3) return '#eab308'; // yellow
      return '#22c55e';              // green
    }

    // For ABJ metrics: color based on the ACTUAL displayed value
    const value: number = entry[metric] ?? 0;
    if (value >= 95) return '#22c55e'; // green  ≥95%
    if (value >= 80) return '#eab308'; // yellow 80–94%
    return '#ef4444';                  // red    <80%
  };

  const chartHeight = 300;

  return (
    <div className="bg-surface rounded-lg border border-border-subtle shadow-card p-5">
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">bar_chart</span>
          Performa per Wilayah
        </h3>
        {/* Metric Picker */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {METRIC_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onMetricChange(opt.value)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-md transition-all duration-150 ${
                metric === opt.value
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full mt-2" style={{ height: `${chartHeight}px` }}>
        {data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-sm text-text-muted">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">bar_chart</span>
            Belum ada data survei di wilayah ini.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
              <defs>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#fca5a5" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#fde047" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#86efac" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                type="number"
                domain={yDomain}
                ticks={yTicks}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748B' }}
                width={36}
                tickFormatter={(v) => isDF ? String(v) : `${v}%`}
              />
              <Tooltip
                cursor={{ fill: '#F1F5F9' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const color = d.riskLevel === 'CRITICAL' ? '#ef4444' : d.riskLevel === 'WARNING' ? '#eab308' : '#22c55e';
                    const isWilayah = metric === 'abjWilayah';
                    const wilayahNull = isWilayah && d.abjWilayahNull;
                    return (
                      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg min-w-[170px]">
                        <p className="font-bold text-sm text-slate-800 mb-2">{d.name}</p>
                        <p className="text-xs text-slate-600">
                          {currentOpt.label}:{' '}
                          {wilayahNull ? (
                            <span className="font-bold text-slate-400">N/A</span>
                          ) : (
                            <span className="font-bold" style={{ color }}>
                              {isDF ? d.densityFigure : `${payload[0].value}%`}
                            </span>
                          )}
                        </p>
                        {isWilayah && d.targetHouses > 0 && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Rumah terdaftar: <span className="font-semibold">{d.targetHouses}</span>
                          </p>
                        )}
                        {isWilayah && wilayahNull && (
                          <p className="text-[10px] text-slate-400 mt-0.5">Data rumah wilayah belum tersedia</p>
                        )}
                        {isDF && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            {d.densityFigure >= 6 ? '🔴 Kepadatan Tinggi' : d.densityFigure >= 3 ? '🟡 Kepadatan Sedang' : '🟢 Kepadatan Rendah'}
                          </p>
                        )}
                        {!isDF && !isWilayah && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            {d.riskLevel === 'CRITICAL' ? '🔴 Kritis' : d.riskLevel === 'WARNING' ? '🟡 Waspada' : '🟢 Aman (≥95%)'}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">Survei dilakukan: <span className="font-bold">{d.totalSurveys}</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey={metric} radius={[4, 4, 0, 0]} maxBarSize={40} minPointSize={3}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 justify-center flex-wrap">
        {isDF ? (
          <>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block"></span>Rendah (DF 1–2)</span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block"></span>Sedang (DF 3–5)</span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block"></span>Kritis (DF 6–9)</span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block"></span>Aman (≥95%)</span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block"></span>Waspada (80–94%)</span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block"></span>Kritis (&lt;80%)</span>
          </>
        )}
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities }: { activities: any[] }) => (
  <div className="bg-surface rounded-lg border border-border-subtle shadow-card flex flex-col h-130">
    <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-slate-50/50">
      <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">history</span>
        Aktivitas Terbaru
      </h3>
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
      </span>
    </div>
    
    <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-10 text-sm text-text-muted">Belum ada aktivitas terbaru</div>
      ) : (
        activities.map((activity, idx) => {
          const positiveCount = activity.containers.reduce((acc: number, c: any) => acc + c.positiveCount, 0);
          const isPositive = positiveCount > 0;
          const date = new Date(activity.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
          });

          return (
            <div key={activity.id} className={`relative pl-4 border-l-2 pb-4 ${idx === activities.length - 1 ? 'pb-0' : ''} ${isPositive ? 'border-red-200' : 'border-slate-200'}`}>
              <div className={`absolute -left-1.25 top-1 w-2 h-2 rounded-full ring-4 ring-white ${isPositive ? 'bg-danger' : 'bg-primary'}`}></div>
              <div className="mb-1 flex items-center justify-between">
                <span className={`text-xs font-bold ${isPositive ? 'text-danger' : 'text-text-main'}`}>
                  {isPositive ? 'Ditemukan Jentik' : 'Survei Bersih'}
                </span>
                <span className="text-[10px] text-text-muted">{date}</span>
              </div>
              <p className="text-xs text-text-muted mb-1.5">
                <strong className="text-text-main font-medium">{activity.surveyorName}</strong> menginput rumah <strong>{activity.houseOwner}</strong> di <strong className="text-text-main font-medium">{activity.village?.name || 'Wilayah'}</strong>.
              </p>
              {isPositive && (
                <div className="inline-flex gap-2">
                  <span className="bg-red-50 text-danger border border-red-100 text-[10px] px-1.5 py-0.5 rounded font-medium">
                    {positiveCount} Kontainer Positif
                  </span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
    <div className="p-3 border-t border-border-subtle bg-slate-50 text-center">
      <a href="/data-survey" className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline">Lihat Semua Data Survei →</a>
    </div>
  </div>
);

export default Dashboard;
