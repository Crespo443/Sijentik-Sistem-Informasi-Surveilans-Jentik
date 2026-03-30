import { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import api from '../lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { selectCustomStyles } from '../lib/selectCustomStyles';
const INTERVENTION_TYPES = [
  'Menguras TPA (Tempat Penampungan Air)',
  'Menutup TPA (Tempat Penampungan Air)',
  'Mengubur/Mendaur Ulang Barang Bekas',
  'Menaburkan Abate/Larvasida',
  'Memelihara Ikan Pemakan Jentik',
  'Menggunakan Anti Nyamuk (Lotion/Semprot)',
  'Memakai Kelambu saat tidur'
];

export default function DataSurveyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [villages, setVillages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    villageId: '',
    rtrw: '',
    alamat: '',
    nama_kk: '',
    jumlah_penghuni: '',
    catatan: '',
    lat: '',
    lng: '',
    puskesmas: '',
    petugas: ''
  });

  const [containerData, setContainerData] = useState<any[]>([]);
  const [interventionData, setInterventionData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [villagesRes, surveyRes] = await Promise.all([
          api.get('/village/my-pkm'),
          api.get(`/survey/${id}`)
        ]);
        
        setVillages(villagesRes.data);
        const s = surveyRes.data;

        setFormData({
          villageId: s.villageId || '',
          rtrw: s.rtRw || '',
          alamat: s.address || '',
          nama_kk: s.houseOwner || '',
          jumlah_penghuni: s.occupantCount ? s.occupantCount.toString() : '',
          catatan: s.notes || '',
          lat: s.latitude ? s.latitude.toString() : '',
          lng: s.longitude ? s.longitude.toString() : '',
          puskesmas: s.accessCode?.healthCenter?.name || '-',
          petugas: s.surveyorName || '-'
        });

        // Initialize containers based on fetched data, fallback to empty array if missing
        setContainerData(s.containers || []);
        
        // Match existing interventions
        const loadedInterventions = INTERVENTION_TYPES.map(name => {
          const found = s.interventions?.find((i: any) => i.activityName === name);
          return {
            activityName: name,
            isDone: found ? found.isDone : false
          };
        });
        setInterventionData(loadedInterventions);

      } catch (err) {
        console.error('Failed to load survey data', err);
        setError('Gagal memuat data survei.');
      } finally {
        setFetching(false);
      }
    };
    if (id) loadData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContainerChange = (index: number, field: 'inspectedCount' | 'positiveCount', value: string) => {
    const numValue = parseInt(value) || 0;
    const newData = [...containerData];
    newData[index][field] = numValue;
    setContainerData(newData);
  };

  const handleInterventionChange = (index: number, checked: boolean) => {
    const newData = [...interventionData];
    newData[index].isDone = checked;
    setInterventionData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        houseOwner: formData.nama_kk,
        villageId: formData.villageId,
        surveyDate: new Date().toISOString().split('T')[0], // Use current date for update or keep original if passed
        rtRw: formData.rtrw,
        address: formData.alamat,
        occupantCount: formData.jumlah_penghuni ? parseInt(formData.jumlah_penghuni) : null,
        latitude: formData.lat ? parseFloat(formData.lat) : null,
        longitude: formData.lng ? parseFloat(formData.lng) : null,
        notes: formData.catatan,
        containers: containerData,
        interventions: interventionData
      };

      await api.put(`/survey/${id}`, payload);
      alert('Survei berhasil diperbarui!');
      navigate('/data-survey');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui survei.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-6">Memuat form edit...</div>;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <PageHeader 
        title="Edit Survei Jentik"
        breadcrumbs={[
          { label: 'Data Survey', href: '/data-survey' },
          { label: 'Edit' }
        ]}
      />

      <div className="flex-1 overflow-y-auto p-6 bg-background-light custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}
          <form className="animate-fade-in" onSubmit={handleSubmit}>
            
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
                  <div>
                    <label className="text-sm font-medium text-text-main mb-1 block">Puskesmas</label>
                    <input 
                      type="text" disabled
                      className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-slate-50 text-slate-500 cursor-not-allowed outline-none" 
                      value={formData.puskesmas}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-main mb-1 block">Nama Petugas</label>
                    <input 
                      type="text" disabled
                      className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-slate-50 text-slate-500 cursor-not-allowed outline-none" 
                      value={formData.petugas}
                    />
                  </div>
                  <div>
                    <label htmlFor="villageId" className="text-sm font-medium text-text-main mb-1 block z-20 relative">Kelurahan/Desa</label>
                    <Select
                      options={villages.map(v => ({ value: v.id, label: `${v.type === 'KELURAHAN' ? 'Kelurahan' : 'Desa'} ${v.name}` }))}
                      value={formData.villageId ? { value: formData.villageId, label: villages.find(v => v.id === formData.villageId) ? `${villages.find((v: any) => v.id === formData.villageId).type === 'KELURAHAN' ? 'Kelurahan' : 'Desa'} ${villages.find((v: any) => v.id === formData.villageId).name}` : 'Pilih Kelurahan...' } : null}
                      onChange={(selected: any) => setFormData({ ...formData, villageId: selected?.value || '' })}
                      styles={selectCustomStyles}
                      placeholder="Pilih Kelurahan/Desa..."
                      isClearable
                    />
                    <input type="text" tabIndex={-1} required value={formData.villageId} style={{opacity: 0, height: 0, padding: 0, position: 'absolute', pointerEvents: 'none'}} onChange={()=>{}} />
                  </div>
                  <div>
                    <label htmlFor="rtrw" className="text-sm font-medium text-text-main mb-1 block">RT/RW</label>
                    <input 
                      id="rtrw" name="rtrw" type="text" 
                      className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                      value={formData.rtrw} onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="alamat" className="text-sm font-medium text-text-main mb-1 block">Alamat Lengkap</label>
                    <textarea 
                      id="alamat" name="alamat" rows={2}
                      className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" 
                      value={formData.alamat} onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nama_kk" className="text-sm font-medium text-text-main mb-1 block">Nama Kepala Keluarga (KK)</label>
                    <input 
                      id="nama_kk" name="nama_kk" type="text" required
                      className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                      value={formData.nama_kk} onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="jumlah_penghuni" className="text-sm font-medium text-text-main mb-1 block">Jumlah Penghuni</label>
                    <input 
                      id="jumlah_penghuni" name="jumlah_penghuni" type="number" min="0"
                      className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                      value={formData.jumlah_penghuni} onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Kontainer Recorded */}
            <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">water_drop</span>
                </div>
                <h2 className="text-base font-bold font-heading text-text-main">2. Kontainer (Tercatat)</h2>
              </div>
              
              {containerData.length === 0 ? (
                <p className="text-sm text-text-muted italic">Tidak ada data kontainer yang dicatat pada survei ini.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border-subtle">
                        <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Kategori</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Jenis Kontainer</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider text-center w-32">Diperiksa</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-text-muted uppercase tracking-wider text-center w-32">Positif (+)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {containerData.map((c, i) => (
                        <tr key={c.id || i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 text-xs text-text-muted">
                            {c.category === 'DAILY' ? 'Harian' : c.category === 'NON_DAILY' ? 'Non Harian' : 'Alamiah'}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-text-main">{c.containerName}</td>
                          <td className="px-4 py-2">
                            <input 
                              className="w-full px-2 py-1 text-sm border border-border-subtle rounded text-center focus:border-primary outline-none" 
                              type="number" min="0" value={c.inspectedCount || 0} 
                              onChange={e => handleContainerChange(i, 'inspectedCount', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              className="w-full px-2 py-1 text-sm border border-border-subtle rounded text-center focus:border-primary outline-none" 
                              type="number" min="0" value={c.positiveCount || 0} 
                              onChange={e => handleContainerChange(i, 'positiveCount', e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 5: PSN 3M Plus */}
            <div className="bg-surface border border-border-subtle shadow-card rounded p-6 mb-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">task_alt</span>
                </div>
                <h2 className="text-base font-bold font-heading text-text-main">3. Tindakan PSN 3M Plus</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {interventionData.map((inv, i) => (
                  <label key={i} className={`flex items-center gap-3 p-3 border border-border-subtle rounded hover:bg-slate-50 cursor-pointer transition-colors ${i === 6 ? 'md:col-span-2' : ''}`}>
                    <input 
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" 
                      type="checkbox"
                      checked={inv.isDone}
                      onChange={(e) => handleInterventionChange(i, e.target.checked)}
                    />
                    <span className="text-sm text-text-main">{inv.activityName}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-4 border-t border-border-subtle pt-5">
                <div>
                  <label htmlFor="catatan" className="text-sm font-medium text-text-main mb-1 block">Catatan Tambahan Pekerja Lapangan (Opsional)</label>
                  <textarea 
                    id="catatan" name="catatan" rows={3}
                    className="w-full px-3 py-2 text-sm border border-border-subtle rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" 
                    value={formData.catatan} onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mb-10">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Batal</Button>
              <Button type="submit" variant="primary" icon="save" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
