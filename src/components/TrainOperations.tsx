import React, { useState } from 'react';
import { Train, Plus, Filter, Search, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const TrainOperations: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTrain, setShowAddTrain] = useState(false);

  const trains = [
    {
      id: 'K-101',
      route: 'Aluva → Ernakulam South',
      status: 'running',
      currentStation: 'MG Road',
      delay: 0,
      lastUpdate: '2 min ago',
      driver: 'Rajesh Kumar',
      issues: []
    },
    {
      id: 'K-102',
      route: 'Ernakulam South → Aluva',
      status: 'delayed',
      currentStation: 'Kalamassery',
      delay: 5,
      lastUpdate: '1 min ago',
      driver: 'Suresh Nair',
      issues: ['Technical delay at signal']
    },
    {
      id: 'K-103',
      route: 'Aluva → Ernakulam South',
      status: 'stopped',
      currentStation: 'Edapally',
      delay: 0,
      lastUpdate: '15 min ago',
      driver: 'Manoj Thomas',
      issues: ['Passenger medical emergency', 'Awaiting clearance']
    },
    {
      id: 'K-104',
      route: 'Ernakulam South → Aluva',
      status: 'running',
      currentStation: 'Town Hall',
      delay: 0,
      lastUpdate: '30 sec ago',
      driver: 'Vinod Kumar',
      issues: []
    },
    {
      id: 'K-105',
      route: 'Aluva → Ernakulam South',
      status: 'maintenance',
      currentStation: 'Depot',
      delay: 0,
      lastUpdate: '2 hours ago',
      driver: 'N/A',
      issues: ['Scheduled maintenance']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'delayed': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'stopped': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'maintenance': return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      running: 'bg-green-100 text-green-800',
      delayed: 'bg-yellow-100 text-yellow-800',
      stopped: 'bg-red-100 text-red-800',
      maintenance: 'bg-blue-100 text-blue-800'
    };
    
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`;
  };

  const filteredTrains = trains.filter(train => {
    const matchesStatus = statusFilter === 'all' || train.status === statusFilter;
    const matchesSearch = train.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         train.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         train.currentStation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: trains.length,
    running: trains.filter(t => t.status === 'running').length,
    delayed: trains.filter(t => t.status === 'delayed').length,
    stopped: trains.filter(t => t.status === 'stopped').length,
    maintenance: trains.filter(t => t.status === 'maintenance').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Train Operations</h2>
        <button
          onClick={() => setShowAddTrain(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Train</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: 'all', label: 'All Trains', color: 'text-gray-600' },
            { key: 'running', label: 'Running', color: 'text-green-600' },
            { key: 'delayed', label: 'Delayed', color: 'text-yellow-600' },
            { key: 'stopped', label: 'Stopped', color: 'text-red-600' },
            { key: 'maintenance', label: 'Maintenance', color: 'text-blue-600' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === filter.key
                  ? 'bg-teal-100 text-teal-700 border border-teal-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({statusCounts[filter.key as keyof typeof statusCounts]})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search trains, drivers, stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Trains List */}
      <div className="space-y-4">
        {filteredTrains.map((train) => (
          <div key={train.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusIcon(train.status)}
                  <h3 className="text-lg font-semibold text-gray-900">{train.id}</h3>
                  <span className={getStatusBadge(train.status)}>
                    {train.status.charAt(0).toUpperCase() + train.status.slice(1)}
                  </span>
                  {train.delay > 0 && (
                    <span className="text-sm text-yellow-600 font-medium">
                      +{train.delay} min delayed
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Route:</span>
                    <p className="font-medium text-gray-900">{train.route}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Station:</span>
                    <p className="font-medium text-gray-900">{train.currentStation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Driver:</span>
                    <p className="font-medium text-gray-900">{train.driver}</p>
                  </div>
                </div>

                {train.issues.length > 0 && (
                  <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Active Issues:</h4>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                      {train.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-2">Last updated</p>
                <p className="text-sm font-medium text-gray-900">{train.lastUpdate}</p>
                <div className="mt-3 space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    View Details
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrains.length === 0 && (
        <div className="text-center py-12">
          <Train className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No trains found matching your criteria</p>
        </div>
      )}

      {/* Add Train Modal */}
      {showAddTrain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Train</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Train ID</label>
                <input
                  type="text"
                  placeholder="K-106"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                <input
                  type="text"
                  placeholder="Driver Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Aluva → Ernakulam South</option>
                  <option>Ernakulam South → Aluva</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Add Train
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTrain(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainOperations;