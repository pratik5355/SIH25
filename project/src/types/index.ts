// Types for the CO₂ simulation system
export interface EmissionSource {
  id: string;
  type: 'transportation' | 'industrial' | 'residential' | 'commercial';
  name: string;
  position: [number, number];
  emissionRate: number; // kg CO₂/hour
  active: boolean;
}

export interface CaptureIntervention {
  id: string;
  type: 'roadside-capture' | 'vertical-garden' | 'biofilter' | 'urban-forest' | 'green-roof';
  name: string;
  position: [number, number];
  captureRate: number; // kg CO₂/hour
  cost: number; // installation cost in USD
  maintenanceCost: number; // annual maintenance cost
  coverage: number; // effective radius in meters
  active: boolean;
}

export interface SimulationConfig {
  windSpeed: number;
  windDirection: number; // degrees
  temperature: number; // celsius
  humidity: number; // percentage
  timeOfDay: number; // 0-23 hours
  trafficDensity: number; // 0-1 scale
}

export interface GridCell {
  id: string;
  position: [number, number];
  co2Level: number; // ppm
  airQuality: number; // 0-500 AQI scale
}

export interface PerformanceMetrics {
  totalEmissions: number;
  totalCapture: number;
  netEmissions: number;
  airQualityIndex: number;
  costEffectiveness: number;
  interventionCount: number;
}