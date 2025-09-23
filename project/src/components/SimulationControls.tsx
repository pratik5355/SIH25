import React from 'react';
import { SimulationConfig } from '../types';
import { Wind, Thermometer, Droplets, Clock, Car } from 'lucide-react';

interface SimulationControlsProps {
  config: SimulationConfig;
  onConfigChange: (config: SimulationConfig) => void;
}

export default function SimulationControls({ config, onConfigChange }: SimulationControlsProps) {
  const updateConfig = (key: keyof SimulationConfig, value: number) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="bg-white p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">Simulation Parameters</h2>
        <p className="text-gray-600 mt-1">Adjust environmental and urban factors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Conditions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Wind className="h-5 w-5 mr-2 text-blue-600" />
            Environmental Conditions
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Wind className="inline h-4 w-4 mr-1" />
                Wind Speed: {config.windSpeed} m/s
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={config.windSpeed}
                onChange={(e) => updateConfig('windSpeed', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wind Direction: {config.windDirection}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={config.windDirection}
                onChange={(e) => updateConfig('windDirection', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Thermometer className="inline h-4 w-4 mr-1" />
                Temperature: {config.temperature}°C
              </label>
              <input
                type="range"
                min="-10"
                max="40"
                step="1"
                value={config.temperature}
                onChange={(e) => updateConfig('temperature', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Droplets className="inline h-4 w-4 mr-1" />
                Humidity: {config.humidity}%
              </label>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={config.humidity}
                onChange={(e) => updateConfig('humidity', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Urban Factors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Car className="h-5 w-5 mr-2 text-green-600" />
            Urban Factors
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Time of Day: {config.timeOfDay}:00
              </label>
              <input
                type="range"
                min="0"
                max="23"
                step="1"
                value={config.timeOfDay}
                onChange={(e) => updateConfig('timeOfDay', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Car className="inline h-4 w-4 mr-1" />
                Traffic Density: {(config.trafficDensity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.1"
                value={config.trafficDensity}
                onChange={(e) => updateConfig('trafficDensity', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onConfigChange({
              windSpeed: 2.5,
              windDirection: 90,
              temperature: 22,
              humidity: 55,
              timeOfDay: 8,
              trafficDensity: 1.4
            })}
            className="p-3 text-left bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <p className="font-medium text-blue-800">Rush Hour</p>
            <p className="text-sm text-blue-600">High traffic, morning conditions</p>
          </button>
          
          <button
            onClick={() => onConfigChange({
              windSpeed: 8.0,
              windDirection: 270,
              temperature: 15,
              humidity: 75,
              timeOfDay: 14,
              trafficDensity: 0.6
            })}
            className="p-3 text-left bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <p className="font-medium text-green-800">Windy Day</p>
            <p className="text-sm text-green-600">High wind, good dispersion</p>
          </button>
          
          <button
            onClick={() => onConfigChange({
              windSpeed: 1.0,
              windDirection: 0,
              temperature: 28,
              humidity: 85,
              timeOfDay: 22,
              trafficDensity: 0.3
            })}
            className="p-3 text-left bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <p className="font-medium text-orange-800">Calm Evening</p>
            <p className="text-sm text-orange-600">Low wind, poor dispersion</p>
          </button>
        </div>
      </div>
    </div>
  );
}