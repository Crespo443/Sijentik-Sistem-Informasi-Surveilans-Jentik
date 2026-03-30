import { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { SearchBar } from '../components/common/SearchBar';
import api from '../lib/api';

export default function MasterPuskesmasList() {
  const [healthCenters, setHealthCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchHealthCenters = async () => {
      setLoading(true);
      try {
        const res = await api.get('/health-center');
        setHealthCenters(res.data);
      } catch (err) {
        console.error('Failed to fetch health centers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHealthCenters();
  }, []);

  return (
    <div className="flex-1 overflow-hidden p-6 bg-background-light flex flex-col gap-4">
      <PageHeader 
        title="Data Puskesmas"
        breadcrumbs={[
          { label: 'Data Master' },
          { label: 'Puskesmas' }
        ]}
        actions={
          <Button variant="secondary" icon="help">Help Guide</Button>
        }
      />

      {user?.role === 'ADMIN' && (
        <SearchBar
          placeholder="Cari ID, Puskesmas, Kepala Puskesmas dll..."
          addLabel="Tambah Puskesmas"
          addHref="/master/puskesmas/add"
        />
      )}
      {user?.role !== 'ADMIN' && (
        <SearchBar
          placeholder="Cari ID, Puskesmas, Kepala Puskesmas dll..."
        />
      )}

      {/* Data Table Container */}
      <div className="bg-surface border border-border-subtle rounded shadow-card flex-1 flex flex-col overflow-hidden animate-fade-in">
        <div className="overflow-x-auto no-scrollbar flex-1 relative">
          <table className="min-w-full divide-y divide-border-subtle text-left">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle w-16 text-center">No</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">Puskesmas</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">Kecamatan</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">Kepala</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">Kontak</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-right">Jumlah Rumah</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border-subtle text-sm">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-4">Memuat data...</td></tr>
              ) : healthCenters.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4">Belum ada data Puskesmas.</td></tr>
              ) : (
                healthCenters.map((p, index) => (
                  <TableRow
                    id={index + 1}
                    fullId={p.id}
                    pusk={p.name}
                    kec={p.district?.name || '-'}
                    kepala={p.headName || '-'}
                    kontak={p.phoneNumber || '-'}
                    rumah={p.targetHouses || 0}
                    bg={index % 2 === 1 ? 'bg-slate-50/50' : ''}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableRow({ id, fullId, pusk, kec, kepala, kontak, rumah, bg = "" }: any) {
  return (
    <tr className={`hover:bg-primary/5 transition-colors h-10 ${bg}`}>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        <span className="text-xs text-text-muted font-medium">{id}</span>
      </td>
      <td className="px-4 py-2 whitespace-nowrap font-medium text-text-main">{pusk}</td>
      <td className="px-4 py-2 whitespace-nowrap text-text-muted">{kec}</td>
      <td className="px-4 py-2 whitespace-nowrap text-text-muted">{kepala}</td>
      <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-text-muted">{kontak}</td>
      <td className="px-4 py-2 whitespace-nowrap text-right text-text-muted font-mono text-xs">{rumah}</td>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-1">
          <a href={`/master/puskesmas/detail/${fullId}`} className="inline-flex items-center justify-center w-8 h-8 rounded text-text-muted hover:text-primary hover:bg-primary/5 transition-colors" title="Detail">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </a>
          <a href={`/master/puskesmas/edit/${fullId}`} className="inline-flex items-center justify-center w-8 h-8 rounded text-text-muted hover:text-primary hover:bg-primary/5 transition-colors" title="Edit">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </a>
        </div>
      </td>
    </tr>
  );
}
