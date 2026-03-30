import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import api from '../lib/api';
import Select from 'react-select';
import { selectCustomStyles } from '../lib/selectCustomStyles';
export default function MasterPuskesmasEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [districts, setDistricts] = useState<any[]>([]);
  const [accessCodes, setAccessCodes] = useState<any[]>([]);
  const [showAccordion, setShowAccordion] = useState(false);
  const [showKode, setShowKode] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    districtId: '',
    name: '',
    headName: '',
    phoneNumber: '',
    address: '',
    targetHouses: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [distRes, pkmRes] = await Promise.all([
          api.get('/district'),
          api.get(`/health-center/${id}`)
        ]);
        
        setDistricts(distRes.data);
        
        const data = pkmRes.data;
        setFormData({
          districtId: data.districtId || '',
          name: data.name || '',
          headName: data.headName || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          targetHouses: data.targetHouses ? data.targetHouses.toString() : ''
        });
        setAccessCodes(data.accessCodes || []);
      } catch (err) {
        setError('Gagal mengambil data Puskesmas.');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        targetHouses: formData.targetHouses ? parseInt(formData.targetHouses) : 0
      };

      await api.put(`/health-center/${id}`, payload);
      alert('Puskesmas berhasil diperbarui!');
      navigate('/master/puskesmas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui puskesmas.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!formData.name) {
      alert("Nama Puskesmas harus diisi terlebih dahulu untuk men-generate kode.");
      return;
    }
    
    setGenerating(true);
    try {
      const shortName = formData.name.replace('PKM ', '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 5);
      const randomCode = `PKM${shortName}${Math.floor(1000 + Math.random() * 9000)}`;
      
      const res = await api.post('/access-code', {
        code: randomCode,
        type: 'PKM_UNIT',
        healthCenterId: id
      });
      
      setAccessCodes([res.data, ...accessCodes]);
      setShowKode({ ...showKode, [res.data.id]: true });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat kode akses');
    } finally {
      setGenerating(false);
    }
  };

  const toggleShowKode = (codeId: string) => {
    setShowKode({ ...showKode, [codeId]: !showKode[codeId] });
  };

  if (fetching) return <div className="p-6">Memuat data...</div>;

  return (
    <div className="flex-1 overflow-auto p-6 bg-background-light flex flex-col gap-4">
      <PageHeader 
        title="Edit Data Puskesmas"
        breadcrumbs={[
          { label: 'Data Master' },
          { label: 'Puskesmas', href: '/master/puskesmas' },
          { label: 'Edit Data' }
        ]}
      />

      <div className="max-w-3xl mx-auto w-full animate-fade-in">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-surface border border-border-subtle rounded shadow-card overflow-hidden">
          <div className="p-8 space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="name">
                <span className="material-symbols-outlined text-sm text-primary">local_hospital</span>
                Nama Puskesmas
              </label>
              <input 
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                id="name" name="name" type="text" required
                value={formData.name} onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2 z-20 relative" htmlFor="districtId">
                <span className="material-symbols-outlined text-sm text-primary">map</span>
                Kecamatan
              </label>
              <Select
                options={districts.map(d => ({ value: d.id, label: d.name }))}
                value={formData.districtId ? { value: formData.districtId, label: districts.find(d => d.id === formData.districtId)?.name || 'Pilih Kecamatan' } : null}
                onChange={(selected: any) => setFormData({ ...formData, districtId: selected?.value || '' })}
                styles={selectCustomStyles}
                placeholder="Pilih Kecamatan..."
                isClearable
              />
              <input type="text" tabIndex={-1} required value={formData.districtId} style={{opacity: 0, height: 0, padding: 0, position: 'absolute', pointerEvents: 'none'}} onChange={()=>{}} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="headName">
                  <span className="material-symbols-outlined text-sm text-primary">person</span>
                  Kepala Puskesmas
                </label>
                <input 
                  className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                  id="headName" name="headName" type="text"
                  value={formData.headName} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="phoneNumber">
                  <span className="material-symbols-outlined text-sm text-primary">call</span>
                  Kontak
                </label>
                <input 
                  className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                  id="phoneNumber" name="phoneNumber" type="tel"
                  value={formData.phoneNumber} onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="targetHouses">
                <span className="material-symbols-outlined text-sm text-primary">home</span>
                Target Jumlah Rumah Disurvei
              </label>
              <input 
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                id="targetHouses" name="targetHouses" type="number" min="0"
                value={formData.targetHouses} onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="address">
                <span className="material-symbols-outlined text-sm text-primary">home_pin</span>
                Alamat Puskesmas
              </label>
              <textarea 
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm resize-none" 
                id="address" name="address" rows={3}
                value={formData.address} onChange={handleChange}
              ></textarea>
            </div>

            <div className="border border-border-subtle rounded-lg overflow-hidden mt-6">
              <button
                type="button"
                className="w-full px-5 py-4 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors"
                onClick={() => setShowAccordion(!showAccordion)}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">key</span>
                  <span className="font-semibold text-text-main text-sm">Kelola Kode Akses</span>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{accessCodes.length}</span>
                </div>
                <span className={`material-symbols-outlined text-text-muted transition-transform duration-200 ${showAccordion ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              
              {showAccordion && (
                <div className="p-5 border-t border-border-subtle space-y-4">
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={handleGenerateCode} 
                      disabled={generating}
                      icon="add_circle"
                    >
                      {generating ? 'Membuat...' : 'Buat Kode Baru'}
                    </Button>
                  </div>
                  
                  {accessCodes.length > 0 ? (
                    <div className="space-y-3">
                      {accessCodes.map((ac: any) => (
                        <div key={ac.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-3 border border-border-subtle rounded shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-xs text-text-muted mb-1">Kode Akses</span>
                            <div className="relative">
                              <input
                                className="pl-3 pr-10 py-1.5 border border-border-subtle rounded bg-slate-50 text-text-main font-mono text-sm tracking-widest focus:outline-none w-48"
                                type={showKode[ac.id] ? 'text' : 'password'}
                                value={ac.code}
                                readOnly
                              />
                              <button
                                type="button"
                                onClick={() => toggleShowKode(ac.id)}
                                className="absolute right-2 top-1.5 text-text-muted hover:text-primary transition-colors h-6 w-6 flex items-center justify-center p-0.5"
                                title="Sembunyikan / Tampilkan Kode"
                              >
                                <span className="material-symbols-outlined text-[16px]">{showKode[ac.id] ? 'visibility_off' : 'visibility'}</span>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {ac.isActive ? (
                              <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktif
                              </span>
                            ) : (
                              <span className="bg-rose-100 text-rose-700 border border-rose-200 text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Tidak Aktif
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50/50 rounded border border-dashed border-border-subtle">
                      <p className="text-sm text-text-muted">Puskesmas ini belum memiliki kode akses.</p>
                      <p className="text-xs text-text-muted mt-1">Klik "Buat Kode Baru" untuk membuat.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="px-8 py-4 bg-slate-50 border-t border-border-subtle flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button type="button" onClick={() => navigate('/master/puskesmas')} className="px-6 py-2.5 text-sm font-semibold text-text-muted hover:bg-slate-200 rounded transition-colors text-center">Batal</button>
            <Button variant="primary" type="submit" icon="save" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
