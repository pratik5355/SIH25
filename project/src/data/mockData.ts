import { EmissionSource, CaptureIntervention, GridCell } from '../types';

// Mock emission sources for a city grid
export const mockEmissionSources: EmissionSource[] = [
  // Pune focus
  {
    id: 'pune-hinjawadi-traffic',
    type: 'transportation',
    name: 'Hinjawadi IT Park Corridor',
    position: [18.5916, 73.7389],
    emissionRate: 2000,
    active: true
  },
  {
    id: 'pune-chakan-industrial',
    type: 'industrial',
    name: 'Chakan MIDC Cluster',
    position: [18.7603, 73.8630],
    emissionRate: 5200,
    active: true
  },
  {
    id: 'pune-pcmc-bhosari',
    type: 'industrial',
    name: 'PCMC Bhosari Industrial Estate',
    position: [18.6436, 73.8334],
    emissionRate: 3800,
    active: true
  },
  {
    id: 'pune-kharadi-corridor',
    type: 'transportation',
    name: 'Kharadi IT Corridor Traffic',
    position: [18.5510, 73.9436],
    emissionRate: 1900,
    active: true
  },
  {
    id: 'pune-magarpatta-commercial',
    type: 'commercial',
    name: 'Magarpatta–Hadapsar Commercial District',
    position: [18.5150, 73.9270],
    emissionRate: 1200,
    active: true
  },
  {
    id: 'pune-talegaon-industrial',
    type: 'industrial',
    name: 'Talegaon Industrial Area',
    position: [18.7352, 73.6755],
    emissionRate: 2600,
    active: true
  },
  {
    id: 'pune-pcmc-ring-road-traffic',
    type: 'transportation',
    name: 'PCMC Spine/Ring Road Traffic',
    position: [18.6186, 73.8037],
    emissionRate: 1700,
    active: true
  },
  {
    id: 'pune-hadapsar-residential',
    type: 'residential',
    name: 'Hadapsar Residential Sector',
    position: [18.5005, 73.9340],
    emissionRate: 600,
    active: true
  },

  // Mumbai anchors for Maharashtra context
  {
    id: 'mumbai-expressway-1',
    type: 'transportation',
    name: 'Mumbai Western Express Highway',
    position: [19.1136, 72.8697],
    emissionRate: 2500,
    active: true
  },
  {
    id: 'tps-mumbai',
    type: 'industrial',
    name: 'Trombay Power Station',
    position: [19.0200, 72.9100],
    emissionRate: 8000,
    active: true
  }
];



export const mockInterventions: CaptureIntervention[] = [
  // Pune focus
  {
    id: 'pune-chakan-roadside-capture',
    type: 'roadside-capture',
    name: 'Chakan CO₂ Capture Unit',
    position: [18.7606, 73.8625],
    captureRate: 360,
    cost: 135000,
    maintenanceCost: 16500,
    coverage: 160,
    active: true
  },
  {
    id: 'pune-pcmc-green-wall',
    type: 'vertical-garden',
    name: 'PCMC Bhosari Green Wall',
    position: [18.6436, 73.8334],
    captureRate: 160,
    cost: 55000,
    maintenanceCost: 9000,
    coverage: 230,
    active: true
  },
  {
    id: 'pune-kharadi-green-corridor',
    type: 'vertical-garden',
    name: 'Kharadi Green Corridor',
    position: [18.5510, 73.9436],
    captureRate: 150,
    cost: 50000,
    maintenanceCost: 9500,
    coverage: 210,
    active: true
  },
  {
    id: 'pune-magarpatta-capture',
    type: 'roadside-capture',
    name: 'Magarpatta CO₂ Capture Unit',
    position: [18.5150, 73.9270],
    captureRate: 300,
    cost: 125000,
    maintenanceCost: 15500,
    coverage: 150,
    active: true
  },

  // Mumbai anchor
  {
    id: 'marine-drive-green-wall',
    type: 'vertical-garden',
    name: 'Marine Drive Vertical Garden',
    position: [18.9340, 72.8238],
    captureRate: 130,
    cost: 47000,
    maintenanceCost: 8200,
    coverage: 200,
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