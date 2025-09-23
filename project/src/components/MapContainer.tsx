import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { EmissionSource, CaptureIntervention, GridCell } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapContainerProps {
  emissionSources: EmissionSource[];
  interventions: CaptureIntervention[];
  gridData: GridCell[];
  onAddIntervention: (position: [number, number]) => void;
}

// Custom icons for different source types
const createEmissionIcon = (type: string) => {
  const colors = {
    transportation: '#FF6B6B',
    industrial: '#4ECDC4',
    residential: '#45B7D1',
    commercial: '#96CEB4'
  };
  
  return L.divIcon({
    html: `<div style="background-color: ${colors[type as keyof typeof colors] || '#999'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const createInterventionIcon = (type: string) => {
  const colors = {
    'roadside-capture': '#2ECC71',
    'vertical-garden': '#27AE60',
    'biofilter': '#16A085',
    'urban-forest': '#1E8449',
    'green-roof': '#229954'
  };
  
  return L.divIcon({
    html: `<div style="background-color: ${colors[type as keyof typeof colors] || '#27AE60'}; width: 24px; height: 24px; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

function MapClickHandler({ onAddIntervention }: { onAddIntervention: (position: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onAddIntervention([lat, lng]);
    },
  });
  return null;
}

export default function MapView({ emissionSources, interventions, gridData, onAddIntervention }: MapContainerProps) {
  const [heatmapVisible, setHeatmapVisible] = useState(true);
  
  const centerPosition: [number, number] = [40.7550, -73.9840];
  
  const getHeatmapColor = (co2Level: number) => {
    // Color scale based on CO₂ levels
    if (co2Level < 420) return 'rgba(0, 255, 0, 0.3)';
    if (co2Level < 450) return 'rgba(255, 255, 0, 0.4)';
    if (co2Level < 500) return 'rgba(255, 165, 0, 0.5)';
    if (co2Level < 600) return 'rgba(255, 69, 0, 0.6)';
    return 'rgba(255, 0, 0, 0.7)';
  };
  
  return (
    <div className="relative h-full">
      <MapContainer
        center={centerPosition}
        zoom={14}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapClickHandler onAddIntervention={onAddIntervention} />
        
        {/* Emission Sources */}
        {emissionSources.map(source => (
          <Marker
            key={source.id}
            position={source.position}
            icon={createEmissionIcon(source.type)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-red-600">{source.name}</h3>
                <p className="text-sm capitalize">Type: {source.type}</p>
                <p className="text-sm">Emission Rate: {source.emissionRate} kg CO₂/hr</p>
                <p className="text-sm">Status: {source.active ? 'Active' : 'Inactive'}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Carbon Capture Interventions */}
        {interventions.map(intervention => (
          <React.Fragment key={intervention.id}>
            <Marker
              position={intervention.position}
              icon={createInterventionIcon(intervention.type)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-green-600">{intervention.name}</h3>
                  <p className="text-sm capitalize">Type: {intervention.type.replace('-', ' ')}</p>
                  <p className="text-sm">Capture Rate: {intervention.captureRate} kg CO₂/hr</p>
                  <p className="text-sm">Coverage: {intervention.coverage}m radius</p>
                  <p className="text-sm">Cost: ${intervention.cost.toLocaleString()}</p>
                  <p className="text-sm">Status: {intervention.active ? 'Active' : 'Inactive'}</p>
                </div>
              </Popup>
            </Marker>
            {/* Coverage area */}
            <Circle
              center={intervention.position}
              radius={intervention.coverage}
              pathOptions={{
                fillColor: '#27AE60',
                fillOpacity: 0.1,
                color: '#27AE60',
                weight: 1
              }}
            />
          </React.Fragment>
        ))}
        
        {/* Heatmap overlay */}
        {heatmapVisible && gridData.map(cell => (
          <Circle
            key={cell.id}
            center={cell.position}
            radius={100}
            pathOptions={{
              fillColor: getHeatmapColor(cell.co2Level),
              fillOpacity: 0.4,
              color: 'transparent',
              weight: 0
            }}
          />
        ))}
      </MapContainer>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="flex flex-col space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={heatmapVisible}
              onChange={(e) => setHeatmapVisible(e.target.checked)}
              className="text-blue-600"
            />
            <span className="text-sm">Show CO₂ Heatmap</span>
          </label>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Emission Sources</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>Carbon Capture</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs font-medium mb-1">CO₂ Levels (ppm)</p>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 opacity-60"></div>
            <span className="text-xs">Low</span>
            <div className="w-3 h-3 bg-yellow-400 opacity-60"></div>
            <span className="text-xs">Moderate</span>
            <div className="w-3 h-3 bg-red-500 opacity-60"></div>
            <span className="text-xs">High</span>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 z-[1000] bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Click anywhere on the map to add a new carbon capture intervention.
        </p>
      </div>
    </div>
  );
}