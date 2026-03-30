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
        {/* Seasonal Context Alert */}
        <div className="flex-1 w-full bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <span className="material-symbols-outlined">thunderstorm</span>
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900">Musim Hujan Berlangsung</p>
            <p className="text-xs text-blue-700">
              Risiko kejadian jentik diprediksi <strong className="text-blue-900">meningkat 23%</strong> minggu ini. Prioritaskan survei di daerah Kritis.
            </p>
          </div>
        </div>

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
        <KPICard title="ABJ Survei" icon="checklist" value={`${kpis?.abjSurvei || 0}%`} color={kpis?.abjSurvei >= 95 ? "success" : "danger"} subtitle="Angka Bebas Jentik" progress={kpis?.abjSurvei || 0} tooltipText="Angka Bebas Jentik (ABJ): Persentase rumah yang terbebas dari jentik nyamuk (Target Nasional: ≥ 95%)." />
        <KPICard title="ABJ Wilayah" icon="map" value={`${kpis?.abjWilayah || 0}%`} color={kpis?.abjWilayah >= 95 ? "success" : "danger"} subtitle="Rata-rata regional" progress={kpis?.abjWilayah || 0} tooltipText="Rata-rata Angka Bebas Jentik gabungan dari seluruh wilayah Puskesmas / Kecamatan target." />
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
          <RegionalSummary data={regionalData} />
        </div>

        {/* ====== RIGHT COLUMN: Activity Feed ====== */}
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
};

// -- Mini Components for Dashboard --

const RegionalSummary = ({ data }: { data: any[] }) => {
  const chartData = data.map(d => ({
    name: d.name.replace(/PKM /g, ''), // shorten names for the chart y-axis
    abj: d.abj,
    totalSurveys: d.totalSurveys,
    riskLevel: d.riskLevel
  }));

  // Increase height slightly if there are many data points to prevent squishing
  const chartHeight = Math.max(280, data.length * 40 + 40);

  return (
    <div className="bg-surface rounded-lg border border-border-subtle shadow-card p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">bar_chart</span>
          Performa per Wilayah (ABJ)
        </h3>
        <a href="/peta-risiko" className="text-xs text-primary font-semibold hover:underline">Lihat Peta →</a>
      </div>
      
      <div className="w-full mt-2" style={{ height: `${chartHeight}px` }}>
        {data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-sm text-text-muted">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">bar_chart</span>
            Belum ada data survei di wilayah ini.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="colorWarning" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fde047" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#eab308" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#86efac" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
              <XAxis 
                type="number"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748B' }}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                width={80}
              />
              <Tooltip 
                cursor={{ fill: '#F1F5F9' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const color = data.riskLevel === 'CRITICAL' ? '#ef4444' : data.riskLevel === 'WARNING' ? '#eab308' : '#22c55e';
                    return (
                      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                        <p className="font-bold text-sm text-slate-800 mb-1">{data.name}</p>
                        <p className="text-xs text-slate-600">ABJ: <span className="font-bold whitespace-nowrap" style={{ color }}>{data.abj}%</span></p>
                        <p className="text-xs text-slate-600">Total Survei: <span className="font-bold">{data.totalSurveys}</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="abj" 
                radius={[0, 4, 4, 0]}
                maxBarSize={28}
              >
                {chartData.map((entry, index) => {
                  const gradientId = entry.riskLevel === 'CRITICAL' ? 'url(#colorCritical)' : entry.riskLevel === 'WARNING' ? 'url(#colorWarning)' : 'url(#colorSafe)';
                  return <Cell key={`cell-${index}`} fill={gradientId} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
