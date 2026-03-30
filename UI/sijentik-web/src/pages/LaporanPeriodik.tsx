import { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { KPICard } from '../components/common/KPICard';
import { Badge } from '../components/common/Badge';
import api from '../lib/api';
import Select from 'react-select';
import { selectCustomStyles } from '../lib/selectCustomStyles';
export default function LaporanPeriodik() {
  const [periodeType, setPeriodeType] = useState('bulanan');
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  const [kpis, setKpis] = useState<any>(null);
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      
      const [kpiRes, regionalRes] = await Promise.all([
        api.get(`/analytics/dashboard?${params.toString()}`),
        api.get('/analytics/regional-performance') 
      ]);

      setKpis(kpiRes.data);
      setRegionalData(regionalRes.data);
    } catch (error) {
      console.error('Failed to fetch report data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
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
          <Button variant="secondary" icon="print" onClick={() => window.print()}>Cetak</Button>
          <button onClick={handleDownloadCSV} className="flex items-center gap-2 bg-white text-text-main border border-border-subtle hover:bg-slate-50 px-3 md:px-4 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            Export CSV
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="bg-surface border border-border-subtle shadow-card rounded-lg p-5 animate-fade-in">
            <h3 className="text-sm font-bold font-heading text-text-main mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">filter_alt</span>
              Filter Periode Laporan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="z-30 relative">
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
              
              {periodeType === 'bulanan' && (
                <div className="z-20 relative">
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Bulan</label>
                  <Select
                    options={[
                      { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' }, { value: '03', label: 'Maret' },
                      { value: '04', label: 'April' }, { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
                      { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' }, { value: '09', label: 'September' },
                      { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' }
                    ]}
                    value={{ value: month, label: new Date(2000, parseInt(month)-1, 1).toLocaleString('id-ID', { month: 'long' }) }}
                    onChange={(selected: any) => setMonth(selected?.value || '01')}
                    styles={selectCustomStyles}
                    isSearchable={false}
                  />
                </div>
              )}
              
              <div className="z-10 relative">
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
                <Button variant="primary" className="w-full flex items-center justify-center gap-2" icon="search" onClick={fetchReportData} disabled={loading}>
                  {loading ? 'Memuat...' : 'Tampilkan Data'}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
            <KPICard title="Total Rumah Diperiksa" value={kpis?.totalSurveys || 0} icon="home_work" subtitle="Periode ini" color="primary" />
            <KPICard title="Rumah Positif" value={kpis?.positiveHouses || 0} icon="bug_report" subtitle="Ditemukan Jentik" color="danger" />
            <KPICard title="ABJ Survei" value={`${kpis?.abjSurvei || 0}%`} icon="checklist" subtitle="Angka Bebas Jentik" color={kpis?.abjSurvei >= 95 ? 'success' : 'danger'} progress={kpis?.abjSurvei || 0} />
            <KPICard title="Container Index" value={`${kpis?.containerIndex || 0}%`} icon="layers" subtitle="Persentase Wadah Positif" color="warning" />
          </div>

          <div className="bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden animate-slide-up mt-6">
            <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">table_chart</span>
                  Rekap Detail Per Wilayah
                </h3>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar max-h-[500px]">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr className="border-b border-border-subtle">
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider bg-slate-50">Wilayah</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center bg-slate-50">Rumah Diperiksa</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right bg-slate-50">ABJ</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center bg-slate-50">Status Risiko</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {regionalData.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-text-muted">Tidak ada data untuk periode ini</td></tr>
                  ) : (
                    regionalData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-text-main">{row.name}</td>
                        <td className="px-5 py-3 text-sm text-center text-text-muted font-mono">{row.totalSurveys}</td>
                        <td className="px-5 py-3 text-sm text-right font-mono font-bold">{row.abj}%</td>
                        <td className="px-5 py-3 text-center">
                          {row.riskLevel === 'CRITICAL' && <Badge variant="danger">Kritis</Badge>}
                          {row.riskLevel === 'WARNING' && <Badge variant="warning">Waspada</Badge>}
                          {row.riskLevel === 'TARGET' && <Badge variant="success">Aman</Badge>}
                          {row.riskLevel === 'UNKNOWN' && <Badge variant="neutral">Tidak Ada Data</Badge>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
