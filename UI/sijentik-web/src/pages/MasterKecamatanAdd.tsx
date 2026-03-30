import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import api from '../lib/api';

export default function MasterKecamatanAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    headName: '',
    phoneNumber: '',
    address: '',
    areaSize: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        areaSize: formData.areaSize ? parseFloat(formData.areaSize) : null
      };

      await api.post('/district', payload);
      alert('Kecamatan berhasil ditambahkan!');
      navigate('/master/kecamatan');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambahkan kecamatan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-background-light flex flex-col gap-4">
      <PageHeader 
        title="Tambah Kecamatan Baru"
        breadcrumbs={[
          { label: 'Data Master' },
          { label: 'Kecamatan', href: '/master/kecamatan' },
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
            
            {/* Nama Kecamatan */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="name">
                <span className="material-symbols-outlined text-sm text-primary">map</span>
                Nama Kecamatan
              </label>
              <input 
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                id="name" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Kecamatan Alok" 
                type="text" 
              />
            </div>

            {/* Nama Camat */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="headName">
                <span className="material-symbols-outlined text-sm text-primary">person</span>
                Nama Camat
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

            {/* Row: No HP & Luas Wilayah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="phoneNumber">
                  <span className="material-symbols-outlined text-sm text-primary">call</span>
                  No HP Kantor/Camat
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="areaSize">
                  <span className="material-symbols-outlined text-sm text-primary">straighten</span>
                  Luas Wilayah (km²)
                </label>
                <input 
                  className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm" 
                  id="areaSize" 
                  name="areaSize" 
                  value={formData.areaSize}
                  onChange={handleChange}
                  placeholder="Contoh: 12.50" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                />
              </div>
            </div>

            {/* Alamat Kantor */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="address">
                <span className="material-symbols-outlined text-sm text-primary">home_pin</span>
                Alamat Kantor
              </label>
              <textarea 
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm resize-none" 
                id="address" 
                name="address" 
                value={formData.address}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap kantor kecamatan" 
                rows={3}
              ></textarea>
            </div>
          </div>
          
          <div className="px-8 py-4 bg-slate-50 border-t border-border-subtle flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button type="button" onClick={() => navigate('/master/kecamatan')} className="px-6 py-2.5 text-sm font-semibold text-text-muted hover:bg-slate-200 rounded transition-colors text-center">Batal</button>
            <Button type="submit" variant="primary" icon="save" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Kecamatan'}
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
