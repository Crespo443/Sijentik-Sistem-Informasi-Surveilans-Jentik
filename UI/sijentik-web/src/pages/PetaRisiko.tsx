import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../lib/api';

export default function PetaRisiko() {
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState<any[]>([]);

  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analytics/risk-map');
        setMapData(res.data);
      } catch (err) {
        console.error('Failed to fetch risk map data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();
  }, []);

  const stats = useMemo(() => {
    const total = mapData.length;
    const positif = mapData.filter(r => r.riskLevel === 'HIGH').length;
    const negatif = total - positif;
    const abjSurvei = total > 0 ? ((negatif / total) * 100) : 0;
    
    return { total, positif, negatif, abjSurvei };
  }, [mapData]);

  // Center on Maumere/Sikka generally, or use the first data point if available
  const mapCenter: [number, number] = mapData.length > 0 && mapData[0].lat && mapData[0].lng
    ? [parseFloat(mapData[0].lat), parseFloat(mapData[0].lng)]
    : [-8.62, 122.21]; 

  return (
    <div className="max-w-350 mx-auto space-y-4 fade-in">
      <PageHeader 
        title="Peta Risiko Jentik"
        icon="map"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Peta Risiko' }
        ]}
        actions={
          <>
            <Button variant="secondary" icon="download">Export</Button>
            <Button variant="primary" icon="info" onClick={() => setShowInfo(!showInfo)}>Panduan</Button>
          </>
        }
      />

      {/* Info Panel */}
      {showInfo ? (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[22px] shrink-0">info</span>
          <div className="text-sm text-text-main">
            <p className="font-semibold mb-1">Cara Membaca Peta Risiko</p>
            <p className="text-text-muted">Peta menampilkan lokasi setiap rumah yang disurvei. <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 align-middle"></span> Merah = rumah positif jentik, <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 align-middle"></span> Hijau = rumah negatif jentik. Klik marker untuk detail.</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-220px)] min-h-150">
        {/* Left Panel: Analytics & Lists */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
          {/* Quick Stats */}
          <div className="bg-surface rounded-lg shadow-card border border-border-subtle p-4">
            <h3 className="text-sm font-bold text-text-main mb-3 uppercase tracking-wide">Ringkasan Wilayah</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-slate-50 p-2.5 rounded border border-border-subtle text-center">
                <span className="block text-[10px] font-semibold text-text-muted uppercase">Rumah</span>
                <span className="text-lg font-bold text-text-main data-mono">{stats.total}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-border-subtle text-center">
                <span className="block text-[10px] font-semibold text-text-muted uppercase">Positif</span>
                <span className="text-lg font-bold text-danger data-mono">{stats.positif}</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="block text-[10px] font-semibold text-text-muted uppercase mb-0.5">Angka Bebas Jentik</span>
                <span className={`text-xl font-bold data-mono ${stats.abjSurvei >= 95 ? 'text-success' : 'text-danger'}`}>{stats.abjSurvei.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-surface rounded-lg shadow-card border border-border-subtle p-4 flex-1 flex flex-col min-h-62.5">
            <h3 className="text-sm font-bold text-text-main mb-3 uppercase tracking-wide flex items-center justify-between">
              <span>Detail Survei</span>
            </h3>
            
            {loading ? (
              <div className="text-center py-4 text-sm text-text-muted">Memuat data...</div>
            ) : mapData.length === 0 ? (
              <div className="text-center py-4 text-sm text-text-muted">Belum ada data dengan lokasi GPS</div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                {mapData.map(rumah => (
                  <div key={rumah.id} className="p-2.5 rounded border border-border-subtle hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-text-main group-hover:text-primary transition-colors">{rumah.houseOwner}</span>
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${rumah.riskLevel === 'HIGH' ? 'bg-danger' : 'bg-success'}`}></span>
                    </div>
                    <p className="text-[10px] text-text-muted mb-0.5 line-clamp-1">{rumah.village}</p>
                    <p className="text-[9px] text-slate-400 font-mono">{rumah.lat}, {rumah.lng}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: The Map */}
        <div className="lg:col-span-3 bg-slate-100 rounded-lg border border-border-subtle shadow-inner overflow-hidden relative isolate">
          <MapContainer 
            center={mapCenter} 
            zoom={14} 
            style={{ height: '100%', width: '100%', zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapData.map(rumah => {
              // Ensure valid coordinates
              if (!rumah.lat || !rumah.lng) return null;
              
              const pos: [number, number] = [parseFloat(rumah.lat), parseFloat(rumah.lng)];
              const isPositif = rumah.riskLevel === 'HIGH';
              return (
                <CircleMarker
                  key={rumah.id}
                  center={pos}
                  pathOptions={{ 
                    color: isPositif ? '#ef4444' : '#10b981', 
                    fillColor: isPositif ? '#ef4444' : '#10b981',
                    fillOpacity: 0.7,
                    weight: 2
                  }}
                  radius={isPositif ? 4 : 3}
                >
                  <Popup>
                    <div className="text-sm font-sans min-w-37.5">
                      <div className="font-bold border-b pb-1 mb-1">{rumah.houseOwner}</div>
                      <div className="text-xs text-gray-600 mb-2">{rumah.village}</div>
                      <div className={`text-xs font-bold px-2 py-1 rounded inline-block ${isPositif ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {isPositif ? 'Positif Jentik' : 'Negatif Jentik'}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
