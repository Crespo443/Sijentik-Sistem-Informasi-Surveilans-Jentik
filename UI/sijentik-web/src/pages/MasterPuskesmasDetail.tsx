import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import api from '../lib/api';

export default function MasterPuskesmasDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showKode, setShowKode] = useState(false);
  const [pkm, setPkm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPkm = async () => {
      try {
        const res = await api.get(`/health-center/${id}`);
        setPkm(res.data);
      } catch (err) {
        console.error('Failed to fetch PKM details', err);
        alert('Gagal mengambil data Puskesmas.');
        navigate('/master/puskesmas');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPkm();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Memuat data...</div>;
  if (!pkm) return <div className="p-6">Data tidak ditemukan.</div>;

  return (
    <div className="flex-1 overflow-auto p-6 bg-background-light flex flex-col gap-4">
      <PageHeader 
        title="Detail Data Puskesmas"
        breadcrumbs={[
          { label: 'Data Master' },
          { label: 'Data Puskesmas', href: '/master/puskesmas' },
          { label: 'Detail Puskesmas' }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-mono">
              ID: {pkm.id.substring(0, 8).toUpperCase()}
            </span>
            <Badge variant="success">Aktif</Badge>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto w-full animate-fade-in pb-8">
        <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">local_hospital</span>
            </div>
            <h2 className="text-base font-bold font-heading text-text-main">1. Informasi Puskesmas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-text-muted mb-1 block">Nama Puskesmas</span>
                <p className="text-sm text-text-main font-medium bg-white px-3 py-2 border border-border-subtle rounded">{pkm.name}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-text-muted mb-1 block">Kecamatan</span>
                <p className="text-sm text-text-main font-medium bg-white px-3 py-2 border border-border-subtle rounded">{pkm.district?.name || '-'}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-text-muted mb-1 block">Telepon / Kontak</span>
                <p className="text-sm text-text-main font-medium bg-white px-3 py-2 border border-border-subtle rounded font-mono">{pkm.phoneNumber || '-'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-text-muted mb-1 block">Kepala Puskesmas</span>
                <p className="text-sm text-text-main font-medium bg-white px-3 py-2 border border-border-subtle rounded">{pkm.headName || '-'}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-text-muted mb-1 block">Target Jumlah Rumah Cakupan</span>
                <p className="text-sm text-text-main font-medium bg-white px-3 py-2 border border-border-subtle rounded">{pkm.targetHouses || 0} Rumah</p>
              </div>
              
              <div>
                <span className="text-xs font-medium text-text-muted mb-1 flex items-center gap-1">
                  Kode Akses List
                </span>
                <div className="relative w-full">
                   {pkm.accessCodes?.length > 0 ? pkm.accessCodes.map((ac: any) => (
                      <div key={ac.id} className="flex gap-2 items-center mb-1">
                          <input
                            className="w-full pl-3 pr-10 py-2 border border-border-subtle rounded bg-white text-text-main text-sm font-mono tracking-widest focus:outline-none"
                            type={showKode ? 'text' : 'password'}
                            value={ac.code}
                            readOnly
                          />
                      </div>
                   )) : (
                     <p className="text-sm text-text-muted italic">Belum ada kode akses</p>
                   )}
                  <button
                    type="button"
                    onClick={() => setShowKode(!showKode)}
                    className="absolute right-2 top-2 text-text-muted hover:text-primary transition-colors flex items-center justify-center p-1"
                    title="Sembunyikan / Tampilkan Kode"
                  >
                    <span className="material-symbols-outlined text-[16px]">{showKode ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 pt-1">
              <span className="text-xs font-medium text-text-muted mb-1 block">Alamat Lengkap</span>
              <p className="text-sm text-text-main font-medium bg-white px-3 py-2 border border-border-subtle rounded h-auto min-h-10">{pkm.address || '-'}</p>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Button variant="secondary" onClick={() => navigate('/master/puskesmas')} icon="arrow_back">Kembali</Button>
          <Button variant="primary" onClick={() => navigate(`/master/puskesmas/edit/${id}`)} icon="edit">Edit Data</Button>
        </div>
      </div>
    </div>
  );
}
