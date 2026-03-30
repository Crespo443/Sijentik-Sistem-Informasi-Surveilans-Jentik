import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import api from '../lib/api';
import Select from 'react-select';
import { selectCustomStyles } from '../lib/selectCustomStyles';
export default function MasterPuskesmasAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [districts, setDistricts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    districtId: '',
    name: '',
    headName: '',
    phoneNumber: '',
    address: '',
    targetHouses: ''
  });

  // Fetch districts to populate dropdown
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await api.get('/district');
        setDistricts(res.data);
      } catch (err) {
        console.error('Failed to load districts', err);
      }
    };
    fetchDistricts();
  }, []);

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

      await api.post('/health-center', payload);
      alert('Puskesmas berhasil ditambahkan!');
      navigate('/master/puskesmas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambahkan puskesmas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-background-light flex flex-col gap-4">
      <PageHeader 
        title="Tambah Puskesmas Baru"
        breadcrumbs={[
          { label: 'Data Master' },
          { label: 'Puskesmas', href: '/master/puskesmas' },
          { label: 'Tambah Baru' }
        ]}
        actions={
          <Button variant="secondary" icon="help">Help Guide</Button>
        }
      />

      <div className="max-w-3xl mx-auto w-full animate-fade-in">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-surface border border-border-subtle rounded shadow-card overflow-hidden">
          <div className="p-8 space-y-6">
            
            {/* Nama Puskesmas */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="name">
                <span className="material-symbols-outlined text-sm text-primary">local_hospital</span>
                Nama Puskesmas
              </label>
              <input 
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                id="name" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: PKM Alok" 
                type="text" 
              />
            </div>

            {/* Kecamatan */}
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

            {/* Row: Kepala & Kontak */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="headName">
                  <span className="material-symbols-outlined text-sm text-primary">person</span>
                  Kepala Puskesmas
                </label>
                <input 
                  className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                  id="headName" 
                  name="headName" 
                  value={formData.headName}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap beserta gelar" 
                  type="text" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="phoneNumber">
                  <span className="material-symbols-outlined text-sm text-primary">call</span>
                  Kontak
                </label>
                <input 
                  className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                  id="phoneNumber" 
                  name="phoneNumber" 
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+62 xxx xxxx xxxx" 
                  type="tel" 
                />
              </div>
            </div>

            {/* Target Rumah */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="targetHouses">
                <span className="material-symbols-outlined text-sm text-primary">home</span>
                Target Jumlah Rumah Disurvei
              </label>
              <input 
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                id="targetHouses" 
                name="targetHouses" 
                value={formData.targetHouses}
                onChange={handleChange}
                placeholder="Contoh: 1250" 
                type="number" 
                min="0" 
              />
            </div>

            {/* Alamat Puskesmas */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="address">
                <span className="material-symbols-outlined text-sm text-primary">home_pin</span>
                Alamat Puskesmas
              </label>
              <textarea 
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm resize-none" 
                id="address" 
                name="address" 
                value={formData.address}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap puskesmas" 
                rows={3}
              ></textarea>
            </div>
          </div>
          
          <div className="px-8 py-4 bg-slate-50 border-t border-border-subtle flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button type="button" onClick={() => navigate('/master/puskesmas')} className="px-6 py-2.5 text-sm font-semibold text-text-muted hover:bg-slate-200 rounded transition-colors text-center">Batal</button>
            <Button variant="primary" type="submit" icon="save" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Puskesmas'}
            </Button>
          </div>
        </form>
        
        <div className="mt-4 flex items-start gap-3 p-4 rounded bg-blue-50 border border-blue-100 mb-8">
          <span className="material-symbols-outlined text-primary">info</span>
          <div className="text-xs text-text-muted leading-relaxed">
            Pastikan data yang dimasukkan telah sesuai dengan dokumen resmi wilayah. Data ini akan digunakan sebagai referensi utama dalam sistem pelayanan publik dan pelaporan administratif.
          </div>
        </div>
      </div>
    </div>
  );
}
