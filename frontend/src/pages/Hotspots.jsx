import { useEffect, useState, useMemo } from 'react';
import { fetchHotspots, fetchHotspotClusters, fetchHotspotAlerts, fetchHotspotRanking } from '../services/api';
import { MapPin, Map as MapIcon, ShieldAlert, AlertTriangle, Layers, Activity, ChevronRight, Briefcase } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Safely fix leaflet icon paths for Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to dynamically change map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const Hotspots = () => {
  const [hotspots, setHotspots] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Bangalore Base
  const [mapZoom, setMapZoom] = useState(12);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetchHotspots().then(data => {
      setHotspots(data);
      if (data.length > 0) setSelectedDistrict(data[0]);
    }).catch(console.error);
    fetchHotspotClusters().then(setClusters).catch(console.error);
    fetchHotspotAlerts().then(setAlerts).catch(console.error);
    fetchHotspotRanking().then(setRanking).catch(console.error);
  }, []);

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setMapCenter([district.center.lat, district.center.lng]);
    setMapZoom(14);
  };

  const getLevelColor = (level) => {
    if (level === 'Critical') return '#ef4444'; // Red
    if (level === 'High') return '#f97316'; // Orange
    if (level === 'Medium') return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  const getLevelClass = (level) => {
    if (level === 'Critical') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (level === 'High') return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    if (level === 'Medium') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  const allPoints = useMemo(() => {
    let pts = [];
    hotspots.forEach(h => {
       h.points.forEach(p => {
         if (filterType === 'All' || p.type === filterType) pts.push(p);
       });
    });
    return pts;
  }, [hotspots, filterType]);

  const uniqueCrimeTypes = ['All', ...new Set(hotspots.flatMap(h => h.crime_types))];

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      
      {/* Left Panel: Rankings & Alerts */}
      <div className="w-80 flex flex-col gap-6 overflow-hidden">
        
        {/* District Rankings */}
        <div className="flex-1 glass-panel flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-surface/50">
             <h2 className="font-semibold flex items-center gap-2"><MapIcon size={18} className="text-blue-500"/> Hotspot Ranking</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {ranking.map((r, i) => (
              <div 
                key={i} 
                onClick={() => handleSelectDistrict(hotspots.find(h => h.district === r.district))}
                className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-surface flex items-center justify-between ${selectedDistrict?.district === r.district ? 'bg-blue-500/10' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted w-4">{i+1}.</span>
                  <div>
                    <h4 className="font-medium text-sm">{r.district}</h4>
                    <p className="text-[10px] text-muted mt-1 uppercase tracking-wider">{r.cases} Cases Active</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getLevelClass(r.level)}`}>
                  {r.level}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Alerts */}
        <div className="h-1/3 glass-panel flex flex-col overflow-hidden">
           <div className="p-4 border-b border-border bg-red-500/10">
             <h2 className="font-semibold flex items-center gap-2 text-red-400"><ShieldAlert size={18}/> Executive Alerts</h2>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {alerts.length === 0 && <p className="text-xs text-muted">No active alerts.</p>}
             {alerts.map((a, i) => (
               <div key={i} className="bg-background border border-red-500/20 p-3 rounded-lg border-l-2 border-l-red-500">
                 <p className="text-xs leading-relaxed">{a.message}</p>
                 <span className="text-[10px] text-muted mt-2 block">{new Date(a.timestamp).toLocaleTimeString()}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Main Map View */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
        <div className="absolute top-4 left-4 z-[400] bg-[#0f172a]/90 backdrop-blur border border-border p-2 rounded-lg flex gap-2">
           {uniqueCrimeTypes.map(t => (
             <button 
               key={t}
               onClick={() => setFilterType(t)}
               className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filterType === t ? 'bg-blue-600 text-white' : 'bg-surface hover:bg-surface/80'}`}
             >
               {t}
             </button>
           ))}
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-gray-900 w-full h-full relative z-0">
          <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full" zoomControl={false}>
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {allPoints.map((p, i) => (
               <CircleMarker 
                 key={i}
                 center={[p.lat, p.lng]} 
                 radius={p.priority === 'High' ? 8 : 5}
                 pathOptions={{ 
                   color: p.priority === 'High' ? '#ef4444' : '#3b82f6',
                   fillColor: p.priority === 'High' ? '#ef4444' : '#3b82f6',
                   fillOpacity: 0.6,
                   weight: 1
                 }}
               >
                 <Popup className="bg-surface text-white">
                   <div className="p-1">
                     <h4 className="font-bold text-sm text-gray-800">{p.title}</h4>
                     <p className="text-xs text-gray-600 mt-1">{p.type} • {p.priority} Priority</p>
                     <p className="text-[10px] text-gray-400 mt-1">ID: {p.id.substring(0,8)}</p>
                   </div>
                 </Popup>
               </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Right Panel: District Intelligence */}
      <div className="w-80 flex flex-col gap-6 overflow-hidden">
         {selectedDistrict ? (
           <>
             {/* District Overview */}
             <div className="glass-panel p-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-blue-500"/> {selectedDistrict.district}</h2>
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-black">{selectedDistrict.score.toFixed(0)}</div>
                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Hotspot Score</div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg text-sm font-bold uppercase border ${getLevelClass(selectedDistrict.level)}`}>
                    {selectedDistrict.level}
                  </div>
                </div>
             </div>

             {/* Metric Cards */}
             <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 bg-surface/50">
                   <Briefcase size={16} className="text-blue-500 mb-2"/>
                   <div className="text-xl font-bold">{selectedDistrict.case_count}</div>
                   <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Total Cases</div>
                </div>
                <div className="glass-panel p-4 bg-surface/50">
                   <AlertTriangle size={16} className="text-red-500 mb-2"/>
                   <div className="text-xl font-bold">{selectedDistrict.high_risk_criminals}</div>
                   <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">High-Risk Suspects</div>
                </div>
             </div>

             {/* Detected Clusters */}
             <div className="flex-1 glass-panel flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border bg-surface/50">
                  <h2 className="font-semibold flex items-center gap-2 text-sm"><Layers size={16} className="text-blue-500"/> Detected Crime Clusters</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {clusters.filter(c => c.district === selectedDistrict.district).length === 0 && <p className="text-xs text-muted">No active clusters detected.</p>}
                  {clusters.filter(c => c.district === selectedDistrict.district).map((c, i) => (
                    <div key={i} className="bg-background border border-border p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                         <div>
                           <h4 className="font-medium text-sm text-blue-400">{c.crime_type} Ring</h4>
                           <p className="text-xs text-muted mt-1">{c.count} Interconnected Cases</p>
                         </div>
                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${c.severity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>{c.severity}</span>
                      </div>
                      <div className="mt-3 bg-surface p-2 rounded border border-border flex justify-between items-center">
                         <span className="text-[10px] uppercase text-muted">Detection Confidence</span>
                         <span className="text-xs font-bold text-green-400">{(c.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           </>
         ) : (
           <div className="glass-panel h-full flex flex-col items-center justify-center text-muted opacity-50 p-6 text-center">
             <MapPin size={48} className="mb-4" />
             <p>Select a district from the ranking panel to view localized intelligence.</p>
           </div>
         )}
      </div>

    </div>
  );
};

export default Hotspots;
