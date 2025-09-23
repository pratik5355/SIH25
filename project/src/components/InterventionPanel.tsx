import React, { useState } from 'react';
import { CaptureIntervention } from '../types';
import { Plus, Trash2, Power, Edit3 } from 'lucide-react';

interface InterventionPanelProps {
  interventions: CaptureIntervention[];
  onAddIntervention: (intervention: Omit<CaptureIntervention, 'id'>) => void;
  onToggleIntervention: (id: string) => void;
  onRemoveIntervention: (id: string) => void;
}

const interventionTypes = [
  {
    type: 'roadside-capture' as const,
    name: 'Roadside CO₂ Capture',
    captureRate: 300,
    cost: 125000,
    maintenanceCost: 15000,
    coverage: 150,
    description: 'High-efficiency roadside units for traffic corridors'
  },
  {
    type: 'vertical-garden' as const,
    name: 'Vertical Garden System',
    captureRate: 120,
    cost: 45000,
    maintenanceCost: 8000,
    coverage: 200,
    description: 'Living walls with integrated CO₂ absorption'
  },
  {
    type: 'biofilter' as const,
    name: 'Biofilter Array',
    captureRate: 200,
    cost: 75000,
    maintenanceCost: 12000,
    coverage: 180,
    description: 'Biological filtration systems for air purification'
  },
  {
    type: 'urban-forest' as const,
    name: 'Urban Forest Patch',
    captureRate: 800,
    cost: 200000,
    maintenanceCost: 25000,
    coverage: 500,
    description: 'Dense urban forestry for large-scale carbon capture'
  },
  {
    type: 'green-roof' as const,
    name: 'Green Roof System',
    captureRate: 150,
    cost: 90000,
    maintenanceCost: 10000,
    coverage: 300,
    description: 'Rooftop vegetation systems with air filtration'
  }
];

export default function InterventionPanel({
  interventions,
  onAddIntervention,
  onToggleIntervention,
  onRemoveIntervention
}: InterventionPanelProps) {
  const [selectedType, setSelectedType] = useState(interventionTypes[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddIntervention = () => {
    const newIntervention = {
      type: selectedType.type,
      name: selectedType.name,
      position: [40.7550, -73.9840] as [number, number], // Default position
      captureRate: selectedType.captureRate,
      cost: selectedType.cost,
      maintenanceCost: selectedType.maintenanceCost,
      coverage: selectedType.coverage,
      active: true
    };
    
    onAddIntervention(newIntervention);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">Carbon Capture Interventions</h2>
        <p className="text-gray-600 mt-1">Manage and deploy capture technologies</p>
      </div>

      {/* Add New Intervention */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-green-800">Deploy New Intervention</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>

        {showAddForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervention Type
              </label>
              <select
                value={selectedType.type}
                onChange={(e) => setSelectedType(interventionTypes.find(t => t.type === e.target.value) || interventionTypes[0])}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {interventionTypes.map(type => (
                  <option key={type.type} value={type.type}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-gray-800 mb-2">{selectedType.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{selectedType.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Capture Rate:</span> {selectedType.captureRate} kg/hr
                </div>
                <div>
                  <span className="font-medium">Coverage:</span> {selectedType.coverage}m
                </div>
                <div>
                  <span className="font-medium">Cost:</span> ${selectedType.cost.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Maintenance:</span> ${selectedType.maintenanceCost.toLocaleString()}/yr
                </div>
              </div>
            </div>

            <button
              onClick={handleAddIntervention}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Deploy Intervention
            </button>
          </div>
        )}
      </div>

      {/* Existing Interventions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Active Interventions ({interventions.length})</h3>
        
        {interventions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No interventions deployed yet.</p>
            <p className="text-sm">Click on the map or use the form above to add interventions.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {interventions.map(intervention => (
              <div
                key={intervention.id}
                className={`p-4 border rounded-lg transition-all ${
                  intervention.active 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{intervention.name}</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onToggleIntervention(intervention.id)}
                      className={`p-1 rounded transition-colors ${
                        intervention.active 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onRemoveIntervention(intervention.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Type:</span> {intervention.type.replace('-', ' ')}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {intervention.active ? 'Active' : 'Inactive'}
                  </div>
                  <div>
                    <span className="font-medium">Capture:</span> {intervention.captureRate} kg/hr
                  </div>
                  <div>
                    <span className="font-medium">Coverage:</span> {intervention.coverage}m
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Installation: ${intervention.cost.toLocaleString()}</span>
                    <span>Annual Maintenance: ${intervention.maintenanceCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}