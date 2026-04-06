import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../lib/api';

export default function DataSurveyMap() {
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
        console.error('Failed to fetch survey details for map', err);
        alert('Gagal memuat koordinat survei');
        navigate('/data-survey');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSurvey();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Memuat peta...</div>;
  if (!survey) return <div className="p-6">Survei tidak ditemukan.</div>;
  if (!survey.latitude || !survey.longitude) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full gap-4">
        <span className="material-symbols-outlined text-6xl text-slate-300">location_off</span>
        <p className="text-text-muted">Survei ini tidak memiliki data koordinat GPS.</p>
        <Button onClick={() => navigate(-1)}>Kembali</Button>
      </div>
    );
  }

  const pos: [number, number] = [parseFloat(survey.latitude), parseFloat(survey.longitude)];
  const isPositif = survey.containers?.some((c: any) => c.positiveCount > 0);

  return (
    <div className="flex-1 overflow-hidden p-6 bg-background-light flex flex-col gap-4 fade-in">
      <PageHeader 
        title="Lokasi Survei"
        icon="map"
        breadcrumbs={[
          { label: 'Data Survey', href: '/data-survey' },
          { label: 'Detail', href: `/data-survey/detail/${id}` },
          { label: 'Peta Lokasi' }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={isPositif ? 'danger' : 'success'}>
              {isPositif ? 'Positif Jentik' : 'Negatif Jentik'}
            </Badge>
            <Button variant="secondary" onClick={() => navigate(-1)} icon="arrow_back">Kembali</Button>
          </div>
        }
      />

      {/* Info Card Overlay Top Right */}
      <div className="bg-surface rounded-lg border border-border-subtle shadow-card flex-1 relative overflow-hidden isolate">
        <div className="absolute top-4 right-4 z-400 bg-white/95 backdrop-blur rounded-lg shadow-lg border border-border-subtle p-4 w-72">
          <h3 className="text-sm font-bold text-text-main mb-2">Detail Lokasi</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-xs text-text-muted block">Nama KK</span>
              <span className="font-semibold">{survey.houseOwner}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Alamat</span>
              <span>{survey.address || '-'}</span>, <span>{survey.village?.name}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-xs text-text-muted block">Koordinat</span>
              <span className="font-mono text-xs text-slate-500">{survey.latitude}, {survey.longitude}</span>
            </div>
          </div>
        </div>

        <MapContainer 
          center={pos} 
          zoom={18} 
          style={{ height: '100%', minHeight: '500px', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker
            center={pos}
            pathOptions={{ 
              color: isPositif ? '#ef4444' : '#10b981', 
              fillColor: isPositif ? '#ef4444' : '#10b981',
              fillOpacity: 0.8,
              weight: 2
            }}
            radius={10}
          >
            <Popup>
              <div className="font-bold">{survey.houseOwner}</div>
              <div className="text-xs text-gray-600">{survey.village?.name}</div>
            </Popup>
          </CircleMarker>
        </MapContainer>
      </div>
    </div>
  );
}
