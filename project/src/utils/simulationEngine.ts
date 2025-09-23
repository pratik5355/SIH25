import { EmissionSource, CaptureIntervention, SimulationConfig, PerformanceMetrics, GridCell } from '../types';

export class CO2SimulationEngine {
  private emissionSources: EmissionSource[];
  private interventions: CaptureIntervention[];
  private config: SimulationConfig;
  
  constructor(
    sources: EmissionSource[],
    interventions: CaptureIntervention[],
    config: SimulationConfig
  ) {
    this.emissionSources = sources;
    this.interventions = interventions;
    this.config = config;
  }
  
  calculateTotalEmissions(): number {
    return this.emissionSources
      .filter(source => source.active)
      .reduce((total, source) => {
        // Apply time-of-day and traffic density modifiers
        const timeModifier = this.getTimeOfDayModifier(source.type);
        const trafficModifier = source.type === 'transportation' ? this.config.trafficDensity : 1;
        return total + (source.emissionRate * timeModifier * trafficModifier);
      }, 0);
  }
  
  calculateTotalCapture(): number {
    return this.interventions
      .filter(intervention => intervention.active)
      .reduce((total, intervention) => {
        // Weather affects capture efficiency
        const weatherModifier = this.getWeatherModifier();
        return total + (intervention.captureRate * weatherModifier);
      }, 0);
  }
  
  calculatePerformanceMetrics(): PerformanceMetrics {
    const totalEmissions = this.calculateTotalEmissions();
    const totalCapture = this.calculateTotalCapture();
    const netEmissions = Math.max(0, totalEmissions - totalCapture);
    
    const totalCost = this.interventions
      .filter(intervention => intervention.active)
      .reduce((sum, intervention) => sum + intervention.cost, 0);
    
    const annualMaintenanceCost = this.interventions
      .filter(intervention => intervention.active)
      .reduce((sum, intervention) => sum + intervention.maintenanceCost, 0);
    
    const costEffectiveness = totalCapture > 0 ? totalCost / totalCapture : 0;
    
    // Simplified AQI calculation based on CO₂ reduction
    const reductionPercentage = totalEmissions > 0 ? (totalCapture / totalEmissions) * 100 : 0;
    const airQualityIndex = Math.max(50, 150 - reductionPercentage * 1.5);
    
    return {
      totalEmissions: Math.round(totalEmissions),
      totalCapture: Math.round(totalCapture),
      netEmissions: Math.round(netEmissions),
      airQualityIndex: Math.round(airQualityIndex),
      costEffectiveness: Math.round(costEffectiveness),
      interventionCount: this.interventions.filter(i => i.active).length
    };
  }
  
  private getTimeOfDayModifier(sourceType: string): number {
    const hour = this.config.timeOfDay;
    
    switch (sourceType) {
      case 'transportation':
        // Peak hours: 7-9 AM and 5-7 PM
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
          return 1.5;
        } else if (hour >= 22 || hour <= 5) {
          return 0.3;
        }
        return 1.0;
      
      case 'industrial':
        // Higher during business hours
        if (hour >= 8 && hour <= 18) {
          return 1.2;
        } else if (hour >= 22 || hour <= 6) {
          return 0.6;
        }
        return 1.0;
      
      case 'residential':
        // Higher in morning and evening
        if ((hour >= 6 && hour <= 8) || (hour >= 18 && hour <= 22)) {
          return 1.3;
        }
        return 0.8;
      
      case 'commercial':
        // Business hours
        if (hour >= 9 && hour <= 21) {
          return 1.1;
        }
        return 0.5;
      
      default:
        return 1.0;
    }
  }
  
  private getWeatherModifier(): number {
    // Weather affects capture efficiency
    let modifier = 1.0;
    
    // Wind helps dispersion but reduces capture efficiency
    modifier -= (this.config.windSpeed * 0.02);
    
    // Temperature affects biological capture methods
    if (this.config.temperature < 5 || this.config.temperature > 35) {
      modifier -= 0.2;
    }
    
    // Humidity can improve some capture methods
    modifier += (this.config.humidity - 50) * 0.002;
    
    return Math.max(0.5, Math.min(1.5, modifier));
  }
  
  predictInterventionImpact(intervention: CaptureIntervention): {
    co2Reduction: number;
    aqiImprovement: number;
    costBenefit: number;
  } {
    const weatherModifier = this.getWeatherModifier();
    const co2Reduction = intervention.captureRate * weatherModifier;
    const aqiImprovement = co2Reduction * 0.1; // Simplified AQI improvement
    const annualCapture = co2Reduction * 24 * 365;
    const totalCost = intervention.cost + (intervention.maintenanceCost * 10); // 10-year projection
    const costBenefit = totalCost / annualCapture;
    
    return {
      co2Reduction: Math.round(co2Reduction),
      aqiImprovement: Math.round(aqiImprovement),
      costBenefit: Math.round(costBenefit * 100) / 100
    };
  }
}