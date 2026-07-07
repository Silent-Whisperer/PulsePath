/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle } from 'react-leaflet';
import { STADIUM_CENTER, ZONES, GATES, VENDORS } from '../../data/stadium';
import { Icon, divIcon } from 'leaflet';
import { useSimulationStore } from '../../store/simulation-store';
import { useAppStore } from '../../store/app-store';
import { cn } from '../../lib/utils';

// Helper to create themed icons
const createIcon = (color: string) => divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px ${color};"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

export default function StadiumMap({ showHeatmap = false }: { showHeatmap?: boolean }) {
  const { zones, gates } = useSimulationStore();
  const { isHighContrast } = useAppStore();

  return (
    <div className="w-full h-full relative group">
      <MapContainer 
        center={STADIUM_CENTER} 
        zoom={17} 
        scrollWheelZoom={false}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Stadium Footprint (Placeholder for zones) */}
        {ZONES.map((zone) => {
          const simZone = zones.find(z => z.id === zone.id) || zone;
          const density = simZone.currentDensity;
          const color = density > 0.8 ? '#ef4444' : density > 0.6 ? '#f59e0b' : '#ccff00';
          
          return (
            <Polygon
              key={zone.id}
              positions={zone.polygon}
              pathOptions={{
                fillColor: showHeatmap ? color : 'transparent',
                fillOpacity: showHeatmap ? 0.6 : 0,
                color: showHeatmap ? color : '#ffffff40',
                weight: 2,
                dashArray: showHeatmap ? '' : '5, 5'
              }}
            >
              <Popup>
                <div className="text-black p-2">
                  <div className="font-bold text-sm">{zone.name}</div>
                  <div className="text-xs font-medium text-gray-600">Crowd Density: {Math.round(density * 100)}%</div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Gates */}
        {GATES.map((gate) => (
          <Marker 
            key={gate.id} 
            position={gate.location} 
            icon={createIcon(gate.status === 'open' ? '#ccff00' : '#ef4444')}
          >
            <Popup>
              <div className="text-black p-2">
                <div className="font-bold text-sm">{gate.name}</div>
                <div className="text-xs font-medium text-gray-600">Current Wait: {Math.round(gate.currentQueueTime)} mins</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Vendors */}
        {VENDORS.map((vendor) => (
          <Marker 
            key={vendor.id} 
            position={vendor.location} 
            icon={createIcon('#3b82f6')}
          >
            <Popup>
              <div className="text-black p-2">
                <div className="font-bold text-sm">{vendor.name}</div>
                <div className="text-xs font-medium text-gray-600">{vendor.type} • {Math.round(vendor.queueTime)}m queue</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Current Location (Mocked) */}
        <Circle 
          center={[19.303, -99.151]} 
          radius={5} 
          pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.8, color: 'white', weight: 2 }} 
        />
      </MapContainer>

      {/* Map Overlay Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-[#0a0a0b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[120px]">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-2">Legend</div>
          <div className="space-y-2.5">
            <LegendItem color="#ccff00" label="Open Gate" />
            <LegendItem color="#ef4444" label="Restricted" />
            <LegendItem color="#3b82f6" label="Current Pos" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
    </div>
  );
}
