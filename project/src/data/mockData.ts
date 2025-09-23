import { EmissionSource, CaptureIntervention, GridCell } from '../types';

// Mock emission sources for a city grid
export const mockEmissionSources: EmissionSource[] = [
  {
    id: 'highway-1',
    type: 'transportation',
    name: 'Highway Interchange',
    position: [40.7589, -73.9851],
    emissionRate: 2500,
    active: true
  },
  {
    id: 'power-plant-1',
    type: 'industrial',
    name: 'Power Generation Facility',
    position: [40.7505, -73.9934],
    emissionRate: 8000,
    active: true
  },
  {
    id: 'downtown-traffic',
    type: 'transportation',
    name: 'Downtown Traffic Corridor',
    position: [40.7614, -73.9776],
    emissionRate: 1800,
    active: true
  },
  {
    id: 'residential-1',
    type: 'residential',
    name: 'Residential District',
    position: [40.7505, -73.9680],
    emissionRate: 450,
    active: true
  },
  {
    id: 'industrial-zone',
    type: 'industrial',
    name: 'Manufacturing District',
    position: [40.7686, -73.9918],
    emissionRate: 3200,
    active: true
  },
  {
    id: 'commercial-center',
    type: 'commercial',
    name: 'Commercial District',
    position: [40.7549, -73.9840],
    emissionRate: 1100,
    active: true
  }
];

export const mockInterventions: CaptureIntervention[] = [
  {
    id: 'green-wall-1',
    type: 'vertical-garden',
    name: 'Vertical Garden System',
    position: [40.7580, -73.9855],
    captureRate: 120,
    cost: 45000,
    maintenanceCost: 8000,
    coverage: 200,
    active: true
  },
  {
    id: 'roadside-1',
    type: 'roadside-capture',
    name: 'Roadside CO₂ Capture Unit',
    position: [40.7615, -73.9780],
    captureRate: 300,
    cost: 125000,
    maintenanceCost: 15000,
    coverage: 150,
    active: true
  }
];

// Generate mock grid data for heatmap
export const generateMockGridData = (
  emissionSources: EmissionSource[],
  interventions: CaptureIntervention[],
  config: any
): GridCell[] => {
  const gridCells: GridCell[] = [];
  const bounds = {
    minLat: 40.7400,
    maxLat: 40.7700,
    minLng: -74.0100,
    maxLng: -73.9600
  };
  
  const gridSize = 0.002; // Approximately 200m grid cells
  
  for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += gridSize) {
    for (let lng = bounds.minLng; lng <= bounds.maxLng; lng += gridSize) {
      let co2Level = 400; // Background CO₂ level (ppm)
      
      // Calculate emissions from sources
      emissionSources.forEach(source => {
        if (!source.active) return;
        
        const distance = Math.sqrt(
          Math.pow((lat - source.position[0]) * 111000, 2) +
          Math.pow((lng - source.position[1]) * 111000 * Math.cos(lat * Math.PI / 180), 2)
        );
        
        // Simplified emission dispersion model
        const influence = Math.max(0, 1 - (distance / 2000));
        const emissionContribution = (source.emissionRate / 1000) * influence * config.trafficDensity;
        co2Level += emissionContribution;
      });
      
      // Calculate capture effects
      interventions.forEach(intervention => {
        if (!intervention.active) return;
        
        const distance = Math.sqrt(
          Math.pow((lat - intervention.position[0]) * 111000, 2) +
          Math.pow((lng - intervention.position[1]) * 111000 * Math.cos(lat * Math.PI / 180), 2)
        );
        
        if (distance <= intervention.coverage) {
          const captureEffect = (intervention.captureRate / 1000) * (1 - distance / intervention.coverage);
          co2Level = Math.max(380, co2Level - captureEffect);
        }
      });
      
      const airQuality = Math.max(0, Math.min(500, (co2Level - 400) * 0.5 + 50));
      
      gridCells.push({
        id: `${lat}-${lng}`,
        position: [lat, lng],
        co2Level: Math.round(co2Level),
        airQuality: Math.round(airQuality)
      });
    }
  }
  
  return gridCells;
};