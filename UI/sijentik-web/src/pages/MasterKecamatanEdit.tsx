import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import api from '../lib/api';
import Select from 'react-select';
import { selectCustomStyles } from '../lib/selectCustomStyles';
interface Village {
  id: string;
  name: string;
  type: 'DESA' | 'KELURAHAN';
}

export default function MasterKecamatanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    headName: '',
    phoneNumber: '',
    address: '',
    areaSize: ''
  });

  // Village management
  const [villages, setVillages] = useState<Village[]>([]);
  const [newVillageName, setNewVillageName] = useState('');
  const [newVillageType, setNewVillageType] = useState<'DESA' | 'KELURAHAN'>('DESA');
  const [villageLoading, setVillageLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const res = await api.get(`/district/${id}`);
        const data = res.data;
        setFormData({
          name: data.name || '',
          headName: data.headName || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          areaSize: data.areaSize ? data.areaSize.toString() : ''
        });
        setVillages(data.villages || []);
      } catch (err) {
        setError('Gagal mengambil data kecamatan.');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchDistrict();
  }, [id]);

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
      await api.put(`/district/${id}`, payload);
      alert('Kecamatan berhasil diperbarui!');
      navigate('/master/kecamatan');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui kecamatan.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVillage = async () => {
    if (!newVillageName.trim()) return;
    setVillageLoading(true);
    try {
      const res = await api.post('/village', {
        name: newVillageName.trim(),
        type: newVillageType,
        districtId: id,
      });
      setVillages(prev => [...prev, res.data].sort((a, b) =>
        a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
      ));
      setNewVillageName('');
      setNewVillageType('DESA');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambah desa/kelurahan.');
    } finally {
      setVillageLoading(false);
    }
  };

  const handleDeleteVillage = async (villageId: string) => {
    if (!confirm('Hapus desa/kelurahan ini?')) return;
    setDeletingId(villageId);
    try {
      await api.delete(`/village/${villageId}`);
      setVillages(prev => prev.filter(v => v.id !== villageId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus desa/kelurahan.');
    } finally {
      setDeletingId(null);
    }
  };

  if (fetching) return <div className="p-6">Memuat data...</div>;

  return (
    <div className="flex-1 overflow-auto p-6 bg-background-light flex flex-col gap-4">
      <PageHeader
        title="Edit Data Kecamatan"
        breadcrumbs={[
          { label: 'Data Master' },
          { label: 'Kecamatan', href: '/master/kecamatan' },
          { label: 'Edit Data' }
        ]}
      />

      <div className="max-w-3xl mx-auto w-full animate-fade-in space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100">{error}</div>
        )}

        {/* Info Kecamatan */}
        <form onSubmit={handleSubmit} className="bg-surface border border-border-subtle rounded shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]">map</span>
            </div>
            <h2 className="text-sm font-bold text-text-main">1. Informasi Kecamatan</h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="name">
                <span className="material-symbols-outlined text-sm text-primary">map</span>
                Nama Kecamatan
              </label>
              <input
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm"
                id="name" name="name" type="text" required
                value={formData.name} onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="headName">
                <span className="material-symbols-outlined text-sm text-primary">person</span>
                Nama Camat
              </label>
              <input
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm"
                id="headName" name="headName" type="text"
                value={formData.headName} onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="phoneNumber">
                  <span className="material-symbols-outlined text-sm text-primary">call</span>
                  No HP
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm"
                  id="phoneNumber" name="phoneNumber" type="tel"
                  value={formData.phoneNumber} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="areaSize">
                  <span className="material-symbols-outlined text-sm text-primary">straighten</span>
                  Luas Wilayah (km²)
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm"
                  id="areaSize" name="areaSize" type="number" step="0.01" min="0"
                  value={formData.areaSize} onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="address">
                <span className="material-symbols-outlined text-sm text-primary">home_pin</span>
                Alamat Kantor
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-border-subtle rounded bg-surface focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none text-text-main text-sm resize-none"
                id="address" name="address" rows={3}
                value={formData.address} onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-border-subtle flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button type="button" onClick={() => navigate('/master/kecamatan')} className="px-6 py-2.5 text-sm font-semibold text-text-muted hover:bg-slate-200 rounded transition-colors text-center">Batal</button>
            <Button type="submit" variant="primary" icon="save" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>

        {/* Daftar Desa/Kelurahan */}
        <div className="bg-surface border border-border-subtle rounded shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]">holiday_village</span>
            </div>
            <h2 className="text-sm font-bold text-text-main">2. Daftar Desa / Kelurahan</h2>
            <span className="ml-auto text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded">
              {villages.length} wilayah
            </span>
          </div>

          {/* Add new village */}
          <div className="px-6 py-4 border-b border-border-subtle bg-slate-50">
            <p className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Tambah Desa / Kelurahan Baru</p>
            <div className="flex gap-2 relative z-20">
              <div className="w-[140px]">
                <Select
                  options={[
                    { value: 'DESA', label: 'Desa' },
                    { value: 'KELURAHAN', label: 'Kelurahan' }
                  ]}
                  value={{ value: newVillageType, label: newVillageType === 'DESA' ? 'Desa' : 'Kelurahan' }}
                  onChange={(selected: any) => setNewVillageType(selected?.value as 'DESA' | 'KELURAHAN')}
                  styles={selectCustomStyles}
                  isSearchable={false}
                />
              </div>
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-border-subtle rounded bg-white text-text-main text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="Nama desa/kelurahan..."
                value={newVillageName}
                onChange={(e) => setNewVillageName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVillage())}
              />
              <button
                type="button"
                onClick={handleAddVillage}
                disabled={villageLoading || !newVillageName.trim()}
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                {villageLoading ? 'Menambah...' : 'Tambah'}
              </button>
            </div>
          </div>

          {/* Village list */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-border-subtle">
                <tr>
                  <th className="px-6 py-3 font-semibold text-text-muted w-16">No</th>
                  <th className="px-6 py-3 font-semibold text-text-muted w-32">Tipe</th>
                  <th className="px-6 py-3 font-semibold text-text-muted">Nama</th>
                  <th className="px-6 py-3 font-semibold text-text-muted w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {villages.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                      <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">holiday_village</span>
                        <p>Belum ada desa/kelurahan. Tambahkan di atas.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  villages.map((v, index) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-3 text-text-muted">{index + 1}</td>
                      <td className="px-6 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          v.type === 'KELURAHAN'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {v.type === 'KELURAHAN' ? 'Kelurahan' : 'Desa'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-text-main font-medium">{v.name}</td>
                      <td className="px-6 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteVillage(v.id)}
                          disabled={deletingId === v.id}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all disabled:opacity-50"
                          title="Hapus"
                        >
                          {deletingId === v.id
                            ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                            : <span className="material-symbols-outlined text-[18px]">delete</span>
                          }
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
