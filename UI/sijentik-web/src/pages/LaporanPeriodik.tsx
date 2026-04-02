import { useState, useEffect } from 'react';
import { Badge } from '../components/common/Badge';
import api from '../lib/api';
import Select from 'react-select';
import { selectCustomStyles } from '../lib/selectCustomStyles';

export default function LaporanPeriodik() {
  const [periodeType, setPeriodeType] = useState('bulanan');
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [districtId, setDistrictId] = useState('');
  
  const [kpis, setKpis] = useState<any>(null);
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch districts once
    api.get('/district').then(res => setDistricts(res.data)).catch(console.error);
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let startDate, endDate;
      
      if (periodeType === 'bulanan') {
        startDate = `${year}-${month}-01`;
        endDate = `${year}-${month}-31`; 
      } else {
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
      }

      const params = new URLSearchParams({ startDate, endDate });
      if (districtId) params.append('districtId', districtId);
      
      const trendParams = new URLSearchParams({ year });
      if (districtId) trendParams.append('districtId', districtId);

      const [kpiRes, regionalRes, trendRes] = await Promise.all([
        api.get(`/analytics/dashboard?${params.toString()}`),
        api.get(`/analytics/regional-performance?${params.toString()}`),
        api.get(`/analytics/trend?${trendParams.toString()}`)
      ]);

      setKpis(kpiRes.data);
      setRegionalData(regionalRes.data);
      setTrendData(trendRes.data);
    } catch (error) {
      console.error('Failed to fetch report data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleDownloadCSV = async () => {
    try {
      const response = await api.get('/report/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `survey_report_${year}_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to download CSV', error);
      alert('Gagal mengunduh laporan');
    }
  };

  const getMonthName = (index: number) => {
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
    return months[index - 1];
  };

  if (!kpis) return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-text-muted">
        <span className="material-symbols-outlined text-[40px] animate-spin">progress_activity</span>
        <p className="font-semibold text-sm">Memuat laporan periodik...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light">
      <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-lg font-bold text-text-main tracking-tight">Laporan Surveilans</h2>
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <nav className="flex items-center gap-1.5 text-sm text-text-muted">
            <span className="text-text-main font-medium">Rekap Periodik</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-border-subtle text-text-muted px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50 hover:text-text-main transition-colors">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Cetak
          </button>
          <button onClick={handleDownloadCSV} className="flex items-center gap-2 bg-white border border-border-subtle text-text-muted px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50 hover:text-text-main transition-colors">
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            Export PDF
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-5">
          {/* Filter Section */}
          <div className="bg-surface border border-border-subtle shadow-card rounded-lg p-5 animate-fade-in z-30 relative">
            <h3 className="text-sm font-bold font-heading text-text-main mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">filter_alt</span>
              Filter Periode Laporan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Jenis Periode</label>
                <Select
                  options={[
                    { value: 'bulanan', label: 'Bulanan' },
                    { value: 'tahunan', label: 'Tahunan' }
                  ]}
                  value={{ value: periodeType, label: periodeType === 'bulanan' ? 'Bulanan' : 'Tahunan' }}
                  onChange={(selected: any) => setPeriodeType(selected?.value || 'bulanan')}
                  styles={selectCustomStyles}
                  isSearchable={false}
                />
              </div>
              
              <div className={periodeType === 'tahunan' ? 'opacity-50 pointer-events-none' : ''}>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Bulan</label>
                <Select
                  options={Array.from({ length: 12 }, (_, i) => {
                    const val = (i + 1).toString().padStart(2, '0');
                    return { value: val, label: new Date(2000, i, 1).toLocaleString('id-ID', { month: 'long' }) };
                  })}
                  value={{ value: month, label: new Date(2000, parseInt(month)-1, 1).toLocaleString('id-ID', { month: 'long' }) }}
                  onChange={(selected: any) => setMonth(selected?.value || '01')}
                  styles={selectCustomStyles}
                  isSearchable={false}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Tahun</label>
                <Select
                  options={[
                    { value: '2026', label: '2026' },
                    { value: '2025', label: '2025' },
                    { value: '2024', label: '2024' }
                  ]}
                  value={{ value: year, label: year }}
                  onChange={(selected: any) => setYear(selected?.value || '2026')}
                  styles={selectCustomStyles}
                  isSearchable={false}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Kecamatan</label>
                <Select
                  options={[
                    { value: '', label: 'Semua Kecamatan' },
                    ...districts.map(d => ({ value: d.id, label: d.name }))
                  ]}
                  value={{ value: districtId, label: districts.find(d => d.id === districtId)?.name || 'Semua Kecamatan' }}
                  onChange={(selected: any) => setDistrictId(selected?.value || '')}
                  styles={selectCustomStyles}
                  isSearchable={true}
                  placeholder="Semua Kecamatan"
                />
              </div>
              
              <div>
                <button 
                  className="w-full bg-primary text-white px-4 py-[9px] rounded text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  onClick={fetchReportData} 
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  {loading ? 'Memuat...' : 'Tampilkan'}
                </button>
              </div>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
            {/* Total Rumah */}
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
              <div className="h-[3px] rounded-b-sm bg-gradient-to-r from-[#6504ae] via-[rgb(168,85,247)] to-[#c084fc]"></div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider">Total Rumah</h3>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">home_work</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-text-main font-heading tracking-tight font-mono">{kpis?.totalSurveys || 0}</div>
                <div className="mt-2 text-xs text-text-muted">Total rumah diperiksa periode ini</div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/50 rounded-full transition-all duration-1000 ease-out" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Rumah Positif */}
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
              <div className="h-[3px] rounded-b-sm bg-gradient-to-r from-danger to-red-400"></div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider">Rumah Positif</h3>
                  <div className="w-9 h-9 rounded-lg bg-danger/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-danger text-[20px]">bug_report</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-danger font-heading tracking-tight font-mono">{kpis?.positiveHouses || 0}</div>
                <div className="mt-2 text-xs text-text-muted">Rumah ditemukan jentik</div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-danger/50 rounded-full transition-all duration-1000 ease-out" style={{ width: kpis?.totalSurveys ? `${(kpis?.positiveHouses / kpis?.totalSurveys) * 100}%` : '0%' }}></div>
                </div>
              </div>
            </div>

            {/* ABJ Survei */}
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
              <div className="h-[3px] rounded-b-sm bg-gradient-to-r from-success to-green-400"></div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider">ABJ Survei</h3>
                  <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-success text-[20px]">checklist</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-success font-heading tracking-tight font-mono">{kpis?.abjSurvei || 0}%</div>
                <div className="mt-2 text-xs text-text-muted">Angka bebas jentik survei</div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-success/50 rounded-full transition-all duration-1000 ease-out" style={{ width: `${kpis?.abjSurvei || 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* ABJ Wilayah */}
            <div className="kpi-card bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200">
              <div className="h-[3px] rounded-b-sm bg-gradient-to-r from-warning to-yellow-400"></div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider">ABJ Wilayah</h3>
                  <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-warning text-[20px]">map</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-warning font-heading tracking-tight font-mono">{kpis?.abjWilayah !== null ? `${kpis?.abjWilayah}%` : 'N/A'}</div>
                <div className="mt-2 text-xs text-text-muted">Angka bebas jentik keseluruhan</div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-warning/50 rounded-full transition-all duration-1000 ease-out" style={{ width: `${kpis?.abjWilayah || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Chart + Index Mini Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bar Chart Trend ABJ */}
            <div className="lg:col-span-2 bg-surface rounded-lg border border-border-subtle shadow-card p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">bar_chart</span>
                  Tren ABJ Survei per Bulan ({year})
                </h3>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-primary/70"></span>ABJ Survei</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-success/50"></span>Target (95%)</span>
                </div>
              </div>
              <div className="flex items-end gap-3 h-40 px-2">
                <div className="flex-1 relative flex items-end">
                  <div className="w-full flex items-end gap-2 h-full z-10 relative">
                    {trendData.map((d, index) => {
                      const mt = (index + 1).toString().padStart(2, '0');
                      const isActive = periodeType === 'bulanan' && month === mt;
                      const val = d.abjSurvei;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          {val !== null ? (
                            <span className={`text-[9px] font-mono font-bold ${isActive ? 'text-primary' : 'text-text-muted'}`}>{val}</span>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-300 font-bold">—</span>
                          )}
                          <div 
                            className={`w-full rounded-t transition-all duration-700 ease-in-out ${val === null ? 'bg-slate-100 border-2 border-dashed border-slate-200' : isActive ? 'bg-primary ring-2 ring-primary/30' : 'bg-primary/70'}`} 
                            style={{ height: val !== null ? `${Math.max(val - 10, 5)}%` : '30%' }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Target dashed line at 95% */}
                  <div className="absolute w-full border-t-2 border-dashed border-success/50 z-0" style={{ bottom: '85%' }}>
                    <span className="absolute right-0 -top-5 text-[9px] text-success font-bold bg-green-50 px-1 rounded">Target 95%</span>
                  </div>
                </div>
              </div>
              {/* Month labels */}
              <div className="flex gap-2 px-2 mt-2">
                {trendData.map((d, index) => {
                  const mt = (index + 1).toString().padStart(2, '0');
                  const isActive = periodeType === 'bulanan' && month === mt;
                  const val = d.abjSurvei;
                  
                  return (
                    <div key={index} className={`flex-1 text-center text-[9px] ${isActive ? 'text-primary font-bold' : val !== null ? 'text-text-muted font-medium' : 'text-slate-300 font-medium'}`}>
                      {getMonthName(d.month)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Epidemio Indeks Mini Cards */}
            <div className="bg-surface rounded-lg border border-border-subtle shadow-card p-5 flex flex-col gap-3">
              <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">biotech</span>
                Indeks Entomologi
              </h3>
              <div className="grid grid-cols-2 gap-2 flex-1">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">House Index</p>
                  <p className="text-xl font-bold text-primary font-mono">{kpis?.houseIndex || 0}%</p>
                  <div className="mt-1 h-1 bg-white rounded-full"><div className="h-full bg-primary/40 rounded-full" style={{ width: `${kpis?.houseIndex || 0}%` }}></div></div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Container</p>
                  <p className="text-xl font-bold text-primary font-mono">{kpis?.containerIndex || 0}%</p>
                  <div className="mt-1 h-1 bg-white rounded-full"><div className="h-full bg-primary/40 rounded-full" style={{ width: `${kpis?.containerIndex || 0}%` }}></div></div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Breteau</p>
                  <p className={`text-xl font-bold font-mono ${kpis?.breteauIndex > 5 ? 'text-warning' : 'text-primary'}`}>{kpis?.breteauIndex || 0}</p>
                  <div className="text-[9px] text-text-muted mt-1">{kpis?.breteauIndex > 5 ? 'High risk zone' : 'Normal'}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Density Fig</p>
                  <p className={`text-xl font-bold font-mono ${kpis?.densityFigure >= 3 ? 'text-warning' : 'text-primary'}`}>{kpis?.densityFigure || 0}</p>
                  <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 ${kpis?.densityFigure >= 3 ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
                    {kpis?.densityFigure < 3 ? 'Rendah' : kpis?.densityFigure < 6 ? 'Sedang' : 'Tinggi'}
                  </span>
                </div>
                <div className="col-span-2 bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Maya Index (MII)</p>
                    <p className="text-xl font-bold text-primary font-mono">{kpis?.mayaIndex || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Rekap Table */}
          <div className="bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">table_chart</span>
                  Rekap Detail Per Wilayah
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">{regionalData.length} Wilayah</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Periode: <strong className="text-text-main">{periodeType === 'bulanan' ? `${new Date(2000, parseInt(month)-1, 1).toLocaleString('id-ID', { month: 'long' })} ${year}` : `Tahun ${year}`}</strong></span>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar max-h-[500px]">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr className="border-b border-border-subtle">
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Wilayah</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Kecamatan</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Rumah Diperiksa</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Rumah Positif</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">ABJ Survei</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">ABJ Wilayah</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {regionalData.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-text-muted">Tidak ada data untuk periode ini</td></tr>
                  ) : (
                    regionalData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gradient-to-r hover:from-[rgba(101,4,174,0.03)] hover:to-transparent transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-text-main">{row.name}</p>
                        </td>
                        <td className="px-5 py-3.5 text-center text-text-muted text-sm">{row.districtName || '-'}</td>
                        <td className="px-5 py-3.5 text-right font-mono">{row.totalSurveys}</td>
                        <td className="px-5 py-3.5 text-right font-mono text-danger">{row.positiveHouses || 0}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${row.abj >= 95 ? 'bg-green-50 text-success border-green-200' : row.abj >= 80 ? 'bg-yellow-50 text-warning border-yellow-200' : 'bg-red-50 text-danger border-red-200'}`}>
                            {row.abj}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center font-mono text-sm">{row.abjWilayah !== null ? `${row.abjWilayah}%` : '-'}</td>
                        <td className="px-5 py-3.5 text-center">
                          {row.riskLevel === 'CRITICAL' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-900/10 text-red-900 border border-red-900/20 uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-900 animate-pulse"></span>Critical
                            </span>
                          )}
                          {row.riskLevel === 'WARNING' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-50 text-warning border border-yellow-200 uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>Warning
                            </span>
                          )}
                          {row.riskLevel === 'TARGET' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-success border border-green-200 uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>Target
                            </span>
                          )}
                          {row.riskLevel === 'UNKNOWN' && <Badge variant="neutral">Tidak Ada Data</Badge>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-primary/5 border-t-2 border-primary/20 sticky bottom-0 z-10">
                  <tr>
                    <td colSpan={2} className="px-5 py-3.5 font-bold text-text-main text-sm">Total / Rata-rata</td>
                    <td className="px-5 py-3.5 text-right font-bold font-mono">{kpis?.totalSurveys || 0}</td>
                    <td className="px-5 py-3.5 text-right font-bold font-mono text-danger">{kpis?.positiveHouses || 0}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${kpis?.abjSurvei >= 95 ? 'bg-green-50 text-success border-green-200' : 'bg-warning/10 text-warning border-warning/20'}`}>{kpis?.abjSurvei || 0}%</span>
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold font-mono">{kpis?.abjWilayah != null ? `${kpis?.abjWilayah}%` : '-'}</td>
                    <td className="px-5 py-3.5 text-center text-xs text-text-muted">—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
