import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import api from '../lib/api';

export default function LaporanPuskesmas() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pkm, setPkm] = useState<any>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const pkmRes = await api.get(`/health-center/${id}`);
        setPkm(pkmRes.data);

        // Fetch all surveys for this PKM's villages
        const surveyRes = await api.get(`/survey?limit=1000`);
        let allSurveys = surveyRes.data.data || surveyRes.data;
        
        // Filter surveys to only include those belonging to this PKM's villages
        const pkmVillageIds = (pkmRes.data.villages || []).map((v: any) => v.id);
        const filteredSurveys = allSurveys.filter((s: any) => pkmVillageIds.includes(s.villageId));
        
        setSurveys(filteredSurveys);
      } catch (error) {
        console.error('Failed to fetch PKM report data', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center p-12 text-text-muted">
      <span className="material-symbols-outlined text-[40px] animate-spin mr-3">progress_activity</span>
      Memuat laporan...
    </div>
  );

  if (error || !pkm) return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light">
      <header className="h-16 bg-surface border-b border-border-subtle flex items-center px-6 sticky top-0 z-10 shrink-0">
        <button onClick={() => navigate(-1)} className="text-text-muted hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="h-5 w-px bg-slate-200 mx-4"></div>
        <h2 className="font-heading text-lg font-bold text-text-main">Laporan Puskesmas</h2>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-12">
        <span className="material-symbols-outlined text-[48px] text-text-muted">local_hospital</span>
        <p className="font-semibold text-text-main">Data Puskesmas Tidak Ditemukan</p>
        <p className="text-sm text-text-muted">Data untuk puskesmas ini belum tersedia atau belum ada data master.</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-sm text-primary hover:underline">Kembali</button>
      </main>
    </div>
  );

  const totalRumah = surveys.length;
  const rumahPositif = surveys.filter(s => s.containers.some((c: any) => c.positiveCount > 0)).length;
  const abj = totalRumah > 0 ? (((totalRumah - rumahPositif) / totalRumah) * 100).toFixed(1) : 0;

  // Group surveys by village for the table
  const villageStats = (pkm.villages || []).map((v: any) => {
    const vSurveys = surveys.filter(s => s.villageId === v.id);
    const vPositif = vSurveys.filter(s => s.containers.some((c: any) => c.positiveCount > 0)).length;
    const hi = vSurveys.length > 0 ? ((vPositif / vSurveys.length) * 100).toFixed(1) : 0;
    
    // get latest survey date
    const dates = vSurveys.map(s => new Date(s.surveyDate).getTime());
    const latestDate = dates.length > 0 ? new Date(Math.max(...dates)).toLocaleDateString('id-ID') : '-';
    
    // get a surveyor name (just take the first one found for this village for display)
    const surveyor = vSurveys.length > 0 ? vSurveys[0].surveyorName : '-';

    return {
      name: v.name,
      total: vSurveys.length,
      positif: vPositif,
      hi,
      latestDate,
      surveyor
    };
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light">
      <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-text-muted hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="h-5 w-px bg-slate-200"></div>
          <div>
            <h2 className="font-heading text-lg font-bold text-text-main tracking-tight leading-none">{pkm.name}</h2>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
              <span className="material-symbols-outlined text-[12px]">location_on</span>
              <span>{pkm.district?.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon="print" onClick={() => window.print()}>Cetak</Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-[1300px] mx-auto space-y-5">

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-primary/5 via-violet-50 to-transparent border border-primary/10 rounded-lg px-5 py-4 flex flex-col md:flex-row md:items-center justify-between animate-fade-in gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[26px]">local_hospital</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-text-main text-base">{pkm.name}</h3>
                <p className="text-text-muted text-xs mt-0.5">{pkm.address || 'Alamat belum diatur'}</p>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  <span className="text-xs text-text-muted flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">person</span> Kepala: {pkm.headName || '-'}</span>
                  <span className="text-xs text-text-muted flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">phone</span> {pkm.phoneNumber || '-'}</span>
                  <span className="text-xs text-text-muted flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">holiday_village</span> Wilayah: {pkm.villages?.length || 0} Kelurahan</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-center bg-white/60 p-3 rounded-lg border border-white/50 shadow-sm">
              <div>
                <p className="text-2xl font-bold text-text-main font-mono">{totalRumah}</p>
                <p className="text-[10px] text-text-muted font-semibold uppercase">Total Survei</p>
              </div>
              <div className="h-10 w-px bg-border-subtle"></div>
              <div>
                <p className="text-2xl font-bold text-danger font-mono">{rumahPositif}</p>
                <p className="text-[10px] text-text-muted font-semibold uppercase">Rumah Positif</p>
              </div>
              <div className="h-10 w-px bg-border-subtle"></div>
              <div>
                <p className={`text-2xl font-bold font-mono ${Number(abj) >= 95 ? 'text-success' : 'text-danger'}`}>{abj}%</p>
                <p className="text-[10px] text-text-muted font-semibold uppercase">ABJ Survei</p>
              </div>
            </div>
          </div>

          {/* Detail Survey Data Table */}
          <div className="bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center">
              <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">format_list_bulleted</span>
                Rekap Kinerja Kelurahan / Desa
              </h3>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-border-subtle">
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase">Kelurahan / Desa</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-center">Tgl Survey Terakhir</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-right">Rmh Diperiksa</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-right">Rmh Positif</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-center">House Index (HI)</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase text-center">Petugas Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {villageStats.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-6 text-text-muted">Tidak ada data kelurahan.</td></tr>
                  ) : (
                    villageStats.map((v: { name: string; total: number; positif: number; hi: string | number; latestDate: string; surveyor: string }, idx: number) => (
                      <tr key={idx} className="hover:bg-primary/5 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-text-main">{v.name}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center text-text-muted text-xs">{v.latestDate}</td>
                        <td className="px-4 py-3.5 text-right font-mono">{v.total}</td>
                        <td className="px-4 py-3.5 text-right font-mono text-danger">{v.positif}</td>
                        <td className="px-4 py-3.5 text-center">
                          {v.total > 0 ? (
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${Number(v.hi) > 5 ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
                              {v.hi}%
                            </span>
                          ) : (
                            <span className="text-xs text-text-muted">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center text-xs text-text-muted">{v.surveyor}</td>
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
