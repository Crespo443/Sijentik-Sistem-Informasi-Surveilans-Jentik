import { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';

import { Pagination } from '../components/common/Pagination';
import api from '../lib/api';
import Select from 'react-select';
import { selectCustomStyles } from '../lib/selectCustomStyles';

export default function DataSurveyList() {
  const [showFilter, setShowFilter] = useState(true);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, lastPage: 1 });
  
  // Filters
  const [search, setSearch] = useState('');
  const [puskesmasId, setPuskesmasId] = useState('');
  const [villageId, setVillageId] = useState('');
  const [villages, setVillages] = useState<any[]>([]);
  const [puskesmasList, setPuskesmasList] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusJentik, setStatusJentik] = useState('');

  const fetchSurveys = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: meta.limit.toString(),
      });
      if (search) params.append('search', search);
      if (puskesmasId) params.append('puskesmasId', puskesmasId);
      if (villageId) params.append('villageId', villageId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (statusJentik) params.append('status', statusJentik);

      const res = await api.get(`/survey?${params.toString()}`);
      
      // If the backend returns an array without pagination (older version), handle it:
      if (Array.isArray(res.data)) {
        setSurveys(res.data);
        setMeta({ total: res.data.length, page: 1, limit: res.data.length, lastPage: 1 });
      } else {
        // Expected paginated response
        setSurveys(res.data.data);
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error('Failed to fetch surveys', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const resVil = await api.get('/village/my-pkm');
        setVillages(resVil.data);
      } catch (err) {
        console.error('Failed to fetch villages', err);
      }
      try {
        const resPkm = await api.get('/health-center');
        if (Array.isArray(resPkm.data.data)) {
          setPuskesmasList(resPkm.data.data);
        } else if (Array.isArray(resPkm.data)) {
          setPuskesmasList(resPkm.data);
        }
      } catch (err) {
        // user might not have access, fail gracefully
      }
    };
    fetchDropdowns();
    fetchSurveys();
  }, []);

  const handleSearch = () => {
    fetchSurveys(1);
  };

  const handleReset = () => {
    setSearch('');
    setPuskesmasId('');
    setVillageId('');
    setStartDate('');
    setEndDate('');
    setStatusJentik('');
    // Need a slight delay to allow state to update before fetch, or pass directly
    setTimeout(() => fetchSurveys(1), 0);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus data survei ini?')) {
      try {
        await api.delete(`/survey/${id}`);
        fetchSurveys(meta.page);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Gagal menghapus survei');
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-background-light flex flex-col gap-5">
      <PageHeader 
        title="Data Survey"
        icon="fact_check"
        breadcrumbs={[
          { label: 'Surveilans', href: '/' },
          { label: 'Data Survey' }
        ]}
        actions={
          <Button variant="secondary" icon="help">Help Guide</Button>
        }
      />

      {/* Filter & Pencarian Card */}
      <div className="bg-surface border border-border-subtle rounded shadow-card animate-fade-in">
        <div className="w-full flex items-center justify-between p-4 rounded-t">
          <h3 className="font-heading text-base font-semibold text-text-main flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">search</span>
            Filter & Pencarian
          </h3>
          <div className="flex items-center gap-4">
            <button onClick={handleReset} className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
              Reset Filter
            </button>
            <button 
              aria-label="Toggle Filter"
              onClick={() => setShowFilter(!showFilter)}
              className="p-1 rounded hover:bg-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-center"
            >
              <span className={`material-symbols-outlined text-text-muted transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`}>expand_less</span>
            </button>
          </div>
        </div>

        {showFilter ? (
          <div className="px-5 pb-5 border-t border-border-subtle">
            <div className="pt-4"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted">Cari</label>
                <div className="flex gap-2">
                  <input 
                    className="w-full px-3 py-2 border border-border-subtle rounded bg-surface text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" 
                    placeholder="Nama KK, alamat, petugas..." 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted z-20 relative">Puskesmas</label>
                <Select
                  options={[
                    { value: '', label: 'Semua Puskesmas' },
                    ...puskesmasList.map(p => ({ value: p.id, label: p.name }))
                  ]}
                  value={{ value: puskesmasId, label: puskesmasId ? (puskesmasList.find(p => p.id === puskesmasId)?.name || 'Semua Puskesmas') : 'Semua Puskesmas' }}
                  onChange={(selected: any) => setPuskesmasId(selected?.value || '')}
                  styles={selectCustomStyles}
                  placeholder="Cari Puskesmas..."
                  isClearable
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted z-20 relative">Kelurahan/Desa</label>
                <Select
                  options={[
                    { value: '', label: 'Semua Kelurahan' },
                    ...villages.map(v => ({ value: v.id, label: `${v.type === 'KELURAHAN' ? 'Kelurahan' : 'Desa'} ${v.name}` }))
                  ]}
                  value={{ value: villageId, label: villageId ? (villages.find(v => v.id === villageId) ? `${villages.find(v => v.id === villageId).type === 'KELURAHAN' ? 'Kelurahan' : 'Desa'} ${villages.find(v => v.id === villageId).name}` : 'Semua Kelurahan') : 'Semua Kelurahan' }}
                  onChange={(selected: any) => setVillageId(selected?.value || '')}
                  styles={selectCustomStyles}
                  placeholder="Cari Kelurahan..."
                  isClearable
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1.5 align-middle">
                <label className="text-xs font-medium text-text-muted">Dari Tanggal</label>
                <div className="relative">
                  <input 
                    className="w-full px-3 py-2 border border-border-subtle rounded bg-surface text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm min-h-[38px]" 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5 align-middle">
                <label className="text-xs font-medium text-text-muted">Sampai Tanggal</label>
                <div className="relative">
                  <input 
                    className="w-full px-3 py-2 border border-border-subtle rounded bg-surface text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm min-h-[38px]" 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5 align-middle">
                <label className="text-xs font-medium text-text-muted z-10 relative">Status Jentik</label>
                <Select
                  options={[
                    { value: '', label: 'Semua Status' },
                    { value: 'Positif', label: 'Positif' },
                    { value: 'Negatif', label: 'Negatif' }
                  ]}
                  value={{ value: statusJentik, label: statusJentik ? statusJentik : 'Semua Status' }}
                  onChange={(selected: any) => setStatusJentik(selected?.value || '')}
                  styles={selectCustomStyles}
                  placeholder="Pilih Status"
                  isSearchable={false}
                />
              </div>
              <div className="flex items-end md:col-start-4">
                <Button variant="primary" onClick={handleSearch} className="w-full">Terapkan Filter</Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Data Table */}
      <div className="bg-surface border border-border-subtle rounded shadow-card flex-1 flex flex-col overflow-hidden animate-fade-in">
        <div className="overflow-auto custom-scrollbar flex-1 relative">
          <table className="min-w-full divide-y divide-border-subtle text-left">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle w-12" scope="col">No</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle" scope="col">Tanggal</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle" scope="col">Puskesmas</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle" scope="col">Kelurahan/Desa</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle" scope="col">Nama KK</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center" scope="col">Kontainer</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center" scope="col">Positif</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center" scope="col">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle" scope="col">Petugas</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center" scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border-subtle text-sm">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-4">Memuat data...</td></tr>
              ) : surveys.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-4">Tidak ada data survei.</td></tr>
              ) : (
                surveys.map((survey, index) => {
                  const no = (meta.page - 1) * meta.limit + index + 1;
                  const date = new Date(survey.surveyDate).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
                  const kontainer = survey.containers?.reduce((acc: number, c: any) => acc + c.inspectedCount, 0) || 0;
                  const positif = survey.containers?.reduce((acc: number, c: any) => acc + c.positiveCount, 0) || 0;
                  const status = positif > 0 ? 'Positif' : 'Negatif';
                  
                  return (
                    <SurveyRow 
                      key={survey.id}
                      id={survey.id}
                      no={no} 
                      date={date} 
                      puskesmas={survey.accessCode?.healthCenter?.name || survey.puskesmas?.name || '-'}
                      kel={survey.village?.name || '-'} 
                      kk={survey.houseOwner} 
                      kontainer={kontainer} 
                      positif={positif} 
                      status={status} 
                      surveyor={survey.surveyorName} 
                      onDelete={() => handleDelete(survey.id)}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && meta.total > 0 && (
          <Pagination 
            label={`Menampilkan ${(meta.page - 1) * meta.limit + 1}-${Math.min(meta.page * meta.limit, meta.total)} dari ${meta.total} data`} 
            currentPage={meta.page} 
            totalPages={meta.lastPage} 
            onPageChange={(page) => fetchSurveys(page)}
          />
        )}
      </div>
    </div>
  );
}

function SurveyRow({ id, no, date, puskesmas, kel, kk, kontainer, positif, status, surveyor, onDelete }: any) {
  return (
    <tr className="hover:bg-primary/5 transition-colors h-12">
      <td className="px-4 py-2 whitespace-nowrap text-text-muted font-mono text-xs">{no}</td>
      <td className="px-4 py-2 whitespace-nowrap text-text-main text-sm">{date}</td>
      <td className="px-4 py-2 whitespace-nowrap text-text-muted text-sm">{puskesmas}</td>
      <td className="px-4 py-2 whitespace-nowrap text-text-main text-sm uppercase">{kel}</td>
      <td className="px-4 py-2 whitespace-nowrap text-text-muted text-sm">{kk}</td>
      <td className="px-4 py-2 whitespace-nowrap text-center text-text-muted font-mono text-xs">{kontainer}</td>
      <td className="px-4 py-2 whitespace-nowrap text-center font-semibold text-danger font-mono text-xs">{positif}</td>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        {status === 'Negatif' ? (
           <span className="inline-flex items-center gap-1 px-2 py-0.5  text-xs font-medium bg-green-50 text-green-700 ">
             
             Negatif
           </span>
        ) : (
           <span className="inline-flex items-center gap-1 px-2 py-0.5  text-xs font-medium bg-red-50 text-red-700">
             
             Positif
           </span>
        )}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-text-muted text-sm">{surveyor}</td>
      <td className="px-4 py-2 whitespace-nowrap text-center flex gap-2 justify-center">
        <a href={`/data-survey/detail/${id}`} className="inline-flex items-center justify-center w-8 h-8 rounded text-primary hover:bg-primary/10 transition-colors" title="Detail">
          <span className="material-symbols-outlined text-[18px]">visibility</span>
        </a>
        <a href={`/data-survey/edit/${id}`} className="inline-flex items-center justify-center w-8 h-8 rounded text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="Edit">
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </a>
        {JSON.parse(localStorage.getItem('user') || '{}').role !== 'SURVEYOR' && (
          <button onClick={onDelete} aria-label="Delete" className="inline-flex items-center justify-center w-8 h-8 rounded text-danger hover:bg-danger/10 transition-colors" title="Hapus">
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        )}
      </td>
    </tr>
  );
}
