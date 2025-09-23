import React from 'react';
import { PerformanceMetrics, CaptureIntervention, EmissionSource } from '../types';
import { TrendingUp, TrendingDown, Leaf, AlertCircle, DollarSign, MapPin } from 'lucide-react';

interface DashboardProps {
  metrics: PerformanceMetrics;
  interventions: CaptureIntervention[];
  sources: EmissionSource[];
}

export default function Dashboard({ metrics, interventions, sources }: DashboardProps) {
  const reductionPercentage = metrics.totalEmissions > 0 
    ? ((metrics.totalCapture / metrics.totalEmissions) * 100).toFixed(1)
    : '0';
    
  const totalInvestment = interventions
    .filter(i => i.active)
    .reduce((sum, i) => sum + i.cost, 0);
    
  const annualMaintenanceCost = interventions
    .filter(i => i.active)
    .reduce((sum, i) => sum + i.maintenanceCost, 0);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600 bg-green-50';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-50';
    if (aqi <= 150) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    return 'Unhealthy';
  };

  return (
    <div className="bg-white p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Urban CO₂ Management Dashboard</h2>
        <p className="text-gray-600 mt-1">Real-time simulation and performance metrics</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Emissions</p>
              <p className="text-2xl font-bold text-red-700">{metrics.totalEmissions.toLocaleString()}</p>
              <p className="text-xs text-red-500">kg CO₂/hour</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">CO₂ Captured</p>
              <p className="text-2xl font-bold text-green-700">{metrics.totalCapture.toLocaleString()}</p>
              <p className="text-xs text-green-500">kg CO₂/hour</p>
            </div>
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Net Emissions</p>
              <p className="text-2xl font-bold text-blue-700">{metrics.netEmissions.toLocaleString()}</p>
              <p className="text-xs text-blue-500">kg CO₂/hour</p>
            </div>
            <TrendingDown className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${getAQIColor(metrics.airQualityIndex)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Air Quality Index</p>
              <p className="text-2xl font-bold">{metrics.airQualityIndex}</p>
              <p className="text-xs">{getAQILabel(metrics.airQualityIndex)}</p>
            </div>
            <AlertCircle className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Reduction Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
        <h3 className="text-lg font-semibold text-emerald-800 mb-3">Intervention Impact Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">{reductionPercentage}%</p>
            <p className="text-sm text-emerald-700">Emission Reduction</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">{metrics.interventionCount}</p>
            <p className="text-sm text-emerald-700">Active Interventions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">${metrics.costEffectiveness}</p>
            <p className="text-sm text-emerald-700">Cost per kg CO₂</p>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-5 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
            Financial Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Investment</span>
              <span className="font-semibold">${totalInvestment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Maintenance</span>
              <span className="font-semibold">${annualMaintenanceCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-800 font-medium">Cost Effectiveness</span>
              <span className="font-bold text-blue-600">${metrics.costEffectiveness}/kg CO₂</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-gray-600" />
            Coverage Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Emission Sources</span>
              <span className="font-semibold">{sources.filter(s => s.active).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Capture Interventions</span>
              <span className="font-semibold">{interventions.filter(i => i.active).length}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-800 font-medium">Coverage Ratio</span>
              <span className="font-bold text-green-600">
                {sources.length > 0 ? ((interventions.filter(i => i.active).length / sources.filter(s => s.active).length) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Types Breakdown */}
      <div className="bg-gray-50 p-5 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Interventions by Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(
            interventions
              .filter(i => i.active)
              .reduce((acc, intervention) => {
                acc[intervention.type] = (acc[intervention.type] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
          ).map(([type, count]) => (
            <div key={type} className="bg-white p-3 rounded border">
              <p className="text-sm font-medium capitalize">{type.replace('-', ' ')}</p>
              <p className="text-lg font-bold text-blue-600">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}