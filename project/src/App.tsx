import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import Dashboard from './components/Dashboard';
import SimulationControls from './components/SimulationControls';
import InterventionPanel from './components/InterventionPanel';
import ChartContainer from './components/ChartContainer';
import { EmissionSource, CaptureIntervention, SimulationConfig, PerformanceMetrics, GridCell } from './types';
import { mockEmissionSources, mockInterventions, generateMockGridData } from './data/mockData';
import { CO2SimulationEngine } from './utils/simulationEngine';
import { Leaf, BarChart3, Settings, Map, Activity } from 'lucide-react';

function App() {
  const [emissionSources] = useState<EmissionSource[]>(mockEmissionSources);
  const [interventions, setInterventions] = useState<CaptureIntervention[]>(mockInterventions);
  const [activeTab, setActiveTab] = useState<'map' | 'dashboard' | 'controls' | 'interventions' | 'analytics'>('map');
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
    windSpeed: 3.2,
    windDirection: 90,
    temperature: 22,
    humidity: 65,
    timeOfDay: 12,
    trafficDensity: 0.8
  });

  const [gridData, setGridData] = useState<GridCell[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalEmissions: 0,
    totalCapture: 0,
    netEmissions: 0,
    airQualityIndex: 150,
    costEffectiveness: 0,
    interventionCount: 0
  });

  // Update simulation when config or interventions change
  useEffect(() => {
    const engine = new CO2SimulationEngine(emissionSources, interventions, simulationConfig);
    const newMetrics = engine.calculatePerformanceMetrics();
    const newGridData = generateMockGridData(emissionSources, interventions, simulationConfig);
    
    setMetrics(newMetrics);
    setGridData(newGridData);
  }, [emissionSources, interventions, simulationConfig]);

  const handleAddIntervention = (intervention: Omit<CaptureIntervention, 'id'>) => {
    const newIntervention: CaptureIntervention = {
      ...intervention,
      id: `intervention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setInterventions(prev => [...prev, newIntervention]);
  };

  const handleAddInterventionFromMap = (position: [number, number]) => {
    const types = [
      {
        type: 'vertical-garden' as const,
        name: 'Vertical Garden System',
        captureRate: 120,
        cost: 45000,
        maintenanceCost: 8000,
        coverage: 200
      },
      {
        type: 'roadside-capture' as const,
        name: 'Roadside CO₂ Capture Unit',
        captureRate: 300,
        cost: 125000,
        maintenanceCost: 15000,
        coverage: 150
      }
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const newIntervention: CaptureIntervention = {
      id: `map-intervention-${Date.now()}`,
      ...randomType,
      position,
      active: true
    };
    
    setInterventions(prev => [...prev, newIntervention]);
  };

  const handleToggleIntervention = (id: string) => {
    setInterventions(prev =>
      prev.map(intervention =>
        intervention.id === id
          ? { ...intervention, active: !intervention.active }
          : intervention
      )
    );
  };

  const handleRemoveIntervention = (id: string) => {
    setInterventions(prev => prev.filter(intervention => intervention.id !== id));
  };

  const tabs = [
    { id: 'map', label: 'Urban Map', icon: Map },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'interventions', label: 'Interventions', icon: Leaf },
    { id: 'controls', label: 'Simulation', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Urban CO₂ Simulator</h1>
                <p className="text-sm text-gray-600">Carbon Emission Management & Planning Tool</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Net Emissions: {metrics.netEmissions.toLocaleString()} kg/hr
                </p>
                <p className="text-xs text-gray-600">
                  {((metrics.totalCapture / (metrics.totalEmissions || 1)) * 100).toFixed(1)}% reduction
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'map' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
                <MapContainer
                  emissionSources={emissionSources}
                  interventions={interventions}
                  gridData={gridData}
                  onAddIntervention={handleAddInterventionFromMap}
                />
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="rounded-lg shadow-lg overflow-hidden">
                <Dashboard
                  metrics={metrics}
                  interventions={interventions}
                  sources={emissionSources}
                />
              </div>
            )}

            {activeTab === 'controls' && (
              <div className="rounded-lg shadow-lg overflow-hidden">
                <SimulationControls
                  config={simulationConfig}
                  onConfigChange={setSimulationConfig}
                />
              </div>
            )}

            {activeTab === 'interventions' && (
              <div className="rounded-lg shadow-lg overflow-hidden">
                <InterventionPanel
                  interventions={interventions}
                  onAddIntervention={handleAddIntervention}
                  onToggleIntervention={handleToggleIntervention}
                  onRemoveIntervention={handleRemoveIntervention}
                />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="rounded-lg shadow-lg overflow-hidden">
                <ChartContainer
                  metrics={metrics}
                  sources={emissionSources}
                  interventions={interventions}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Sources</span>
                  <span className="font-semibold">{emissionSources.filter(s => s.active).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Interventions</span>
                  <span className="font-semibold text-green-600">{interventions.filter(i => i.active).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Air Quality</span>
                  <span className={`font-semibold ${
                    metrics.airQualityIndex <= 50 ? 'text-green-600' :
                    metrics.airQualityIndex <= 100 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metrics.airQualityIndex} AQI
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Conditions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature</span>
                  <span>{simulationConfig.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wind Speed</span>
                  <span>{simulationConfig.windSpeed} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Traffic Density</span>
                  <span>{(simulationConfig.trafficDensity * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span>{simulationConfig.timeOfDay}:00</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Impact Summary</h3>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600">
                  {((metrics.totalCapture / (metrics.totalEmissions || 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-green-700">CO₂ Reduction Rate</p>
                <p className="text-xs text-green-600">
                  Capturing {metrics.totalCapture.toLocaleString()} kg/hr
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;