import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { PerformanceMetrics, EmissionSource, CaptureIntervention } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartContainerProps {
  metrics: PerformanceMetrics;
  sources: EmissionSource[];
  interventions: CaptureIntervention[];
}

export default function ChartContainer({ metrics, sources, interventions }: ChartContainerProps) {
  // Generate hourly data for line chart
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const baseEmissions = metrics.totalEmissions;
    const baseCapture = metrics.totalCapture;
    
    // Apply time-of-day modifiers
    let emissionModifier = 1.0;
    let captureModifier = 1.0;
    
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      emissionModifier = 1.4; // Rush hour
    } else if (hour >= 22 || hour <= 5) {
      emissionModifier = 0.4; // Night time
      captureModifier = 0.8; // Reduced capture efficiency at night
    }
    
    return {
      hour,
      emissions: Math.round(baseEmissions * emissionModifier),
      capture: Math.round(baseCapture * captureModifier),
      net: Math.round((baseEmissions * emissionModifier) - (baseCapture * captureModifier))
    };
  });

  const lineChartData = {
    labels: hourlyData.map(d => `${d.hour}:00`),
    datasets: [
      {
        label: 'Total Emissions',
        data: hourlyData.map(d => d.emissions),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
      {
        label: 'CO₂ Captured',
        data: hourlyData.map(d => d.capture),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Net Emissions',
        data: hourlyData.map(d => d.net),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      }
    ],
  };

  // Emission sources breakdown
  const sourceTypeData = sources
    .filter(s => s.active)
    .reduce((acc, source) => {
      acc[source.type] = (acc[source.type] || 0) + source.emissionRate;
      return acc;
    }, {} as Record<string, number>);

  const sourceChartData = {
    labels: Object.keys(sourceTypeData).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [
      {
        label: 'Emissions by Source',
        data: Object.values(sourceTypeData),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Intervention effectiveness
  const interventionData = {
    labels: interventions.filter(i => i.active).map(i => i.name),
    datasets: [
      {
        label: 'Capture Rate (kg/hr)',
        data: interventions.filter(i => i.active).map(i => i.captureRate),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  return (
    <div className="bg-white p-6 space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
        <p className="text-gray-600 mt-1">Data visualization and trend analysis</p>
      </div>

      {/* 24-Hour Trend */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">24-Hour CO₂ Trend</h3>
        <div className="h-80">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emission Sources Breakdown */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Emissions by Source Type</h3>
          <div className="h-64">
            <Doughnut data={sourceChartData} options={doughnutOptions} />
          </div>
        </div>

        {/* Intervention Effectiveness */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Intervention Capture Rates</h3>
          <div className="h-64">
            <Bar data={interventionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Daily CO₂ Reduction</h4>
          <p className="text-3xl font-bold text-blue-600">
            {((metrics.totalCapture * 24) / 1000).toFixed(1)} tons
          </p>
          <p className="text-sm text-blue-600 mt-1">Per day with current interventions</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-2">Annual Impact</h4>
          <p className="text-3xl font-bold text-green-600">
            {((metrics.totalCapture * 24 * 365) / 1000).toFixed(0)} tons
          </p>
          <p className="text-sm text-green-600 mt-1">Projected annual CO₂ capture</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <h4 className="text-lg font-semibold text-purple-800 mb-2">Efficiency Score</h4>
          <p className="text-3xl font-bold text-purple-600">
            {metrics.totalEmissions > 0 ? Math.round((metrics.totalCapture / metrics.totalEmissions) * 100) : 0}%
          </p>
          <p className="text-sm text-purple-600 mt-1">Capture vs emissions ratio</p>
        </div>
      </div>
    </div>
  );
}