import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import api from '../lib/api';

export default function DataSurveyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await api.get(`/survey/${id}`);
        setSurvey(res.data);
      } catch (err) {
        console.error('Failed to fetch survey details', err);
        alert('Gagal memuat detail survei');
        navigate('/data-survey');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSurvey();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Memuat detail survei...</div>;
  if (!survey) return <div className="p-6">Survei tidak ditemukan.</div>;

  const totalInspected = survey.containers?.reduce((acc: number, c: any) => acc + c.inspectedCount, 0) || 0;
  const totalPositive = survey.containers?.reduce((acc: number, c: any) => acc + c.positiveCount, 0) || 0;
  const isPositive = totalPositive > 0;
  const statusColor = isPositive ? 'danger' : 'success';
  const statusText = isPositive ? 'Positif' : 'Negatif';

  return (
    <div className="flex-1 overflow-auto p-6 bg-background-light flex flex-col gap-5">
      <PageHeader 
        title="Detail Data Survey"
        breadcrumbs={[
          { label: 'Surveilans', href: '/' },
          { label: 'Data Survey', href: '/data-survey' },
          { label: 'Detail Survey' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-mono">
              ID: {survey.id.substring(0, 8).toUpperCase()}
            </span>
            <Badge variant={statusColor}>{statusText}</Badge>
            <Button variant="secondary" onClick={() => navigate('/data-survey')} icon="arrow_back">Kembali</Button>
            <Button variant="primary" onClick={() => navigate(`/data-survey/edit/${id}`)} icon="edit">Edit</Button>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto w-full animate-fade-in pb-8">
        
        {/* Section 1: Data Rumah & Lokasi */}
        <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
            </div>
            <h2 className="text-base font-bold font-heading text-text-main">1. Data Rumah & Lokasi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <DataField label="Puskesmas" value={survey.accessCode?.healthCenter?.name || '-'} />
              <DataField label="Nama Petugas" value={survey.surveyorName || '-'} />
              <DataField label="Kelurahan/Desa" value={survey.village?.name || '-'} />
              <DataField label="RT/RW" value={survey.rtRw || '-'} />
              <DataField label="Alamat Lengkap" value={survey.address || '-'} className="min-h-16" />
            </div>
            <div className="space-y-4">
              <DataField label="Nama Kepala Keluarga (KK)" value={survey.houseOwner} />
              <DataField label="Jumlah Penghuni (Orang)" value={survey.occupantCount?.toString() || '-'} />
              <div className="pt-1">
                <span className="text-xs font-medium text-text-muted mb-1 block">Koordinat GPS</span>
                <div className="flex justify-between items-center gap-2 bg-white px-3 py-2 border border-border-subtle rounded text-sm text-text-main font-medium shadow-sm mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-text-muted text-[16px]">pin_drop</span>
                    {survey.latitude && survey.longitude ? `${survey.latitude}, ${survey.longitude}` : 'Tidak ada koordinat'}
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate(`/data-survey/map/${id}`)} 
                  className="w-full"
                  icon="map"
                >
                  Lihat di Peta
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Hasil Inspeksi Kontainer */}
        <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">water_drop</span>
            </div>
            <h2 className="text-base font-bold font-heading text-text-main">2. Hasil Inspeksi Kontainer</h2>
          </div>
          
          <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 border border-border-subtle rounded text-center">
                  <span className="block text-xs font-semibold text-text-muted uppercase mb-1">Total Diperiksa</span>
                  <span className="text-2xl font-bold font-mono">{totalInspected}</span>
              </div>
              <div className="bg-red-50 p-4 border border-red-100 rounded text-center">
                  <span className="block text-xs font-semibold text-danger uppercase mb-1">Total Positif Jentik</span>
                  <span className="text-2xl font-bold font-mono text-danger">{totalPositive}</span>
              </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border-subtle">
                  <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Kategori</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Jenis Kontainer</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider text-center w-24">Diperiksa</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider text-center w-24">Positif (+)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {survey.containers?.length > 0 ? survey.containers.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 text-xs text-text-muted">
                      {c.category === 'DAILY' ? 'Harian' : c.category === 'NON_DAILY' ? 'Non Harian' : 'Alamiah'}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-text-main">{c.containerName}</td>
                    <td className="px-4 py-2.5 text-center font-mono text-text-muted">{c.inspectedCount}</td>
                    <td className={`px-4 py-2.5 text-center font-mono font-bold ${c.positiveCount > 0 ? 'text-danger' : 'text-success'}`}>{c.positiveCount}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="px-4 py-4 text-center text-text-muted">Tidak ada kontainer yang dicatat.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: PSN 3M Plus */}
        <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">task_alt</span>
            </div>
            <h2 className="text-base font-bold font-heading text-text-main">3. Tindakan PSN 3M Plus</h2>
          </div>
          
          <ul className="space-y-2 mb-6">
              {survey.interventions?.map((inv: any) => (
                  <li key={inv.id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200">
                      {inv.isDone ? (
                         <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                      ) : (
                         <span className="material-symbols-outlined text-slate-300 text-lg">radio_button_unchecked</span>
                      )}
                      <span className={`text-sm ${inv.isDone ? 'text-text-main font-medium' : 'text-text-muted line-through'}`}>{inv.activityName}</span>
                  </li>
              ))}
          </ul>

          <div className="space-y-2 border-t border-border-subtle pt-5">
            <span className="text-xs font-medium text-text-muted mb-1 block">Catatan Tambahan Pekerja Lapangan</span>
            <div className="p-3 bg-slate-50 border border-border-subtle rounded text-sm text-text-main min-h-15 whitespace-pre-wrap">
                {survey.notes || <span className="italic text-slate-400">Tidak ada catatan</span>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-1">
          <Button variant="secondary" onClick={() => navigate('/data-survey')} icon="arrow_back">Kembali ke Daftar</Button>
          <Button variant="primary" onClick={() => navigate(`/data-survey/edit/${id}`)} icon="edit">Edit Data</Button>
        </div>
      </div>
    </div>
  );
}

function DataField({ label, value, className = "" }: { label: string, value: string, className?: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-text-muted mb-1 block">{label}</span>
      <div className={`text-sm text-text-main font-medium bg-white px-3 py-2 border border-border-subtle rounded flex items-center ${className}`}>
        {value}
      </div>
    </div>
  );
}
