import React, { useState, useEffect } from 'react';
import { MapPin, Train, Users, Clock, AlertTriangle } from 'lucide-react';

const LiveMetroMap: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [trains, setTrains] = useState([
    { id: 'K-101', position: 'Aluva', status: 'running', delay: 0 },
    { id: 'K-102', position: 'Kalamassery', status: 'delayed', delay: 5 },
    { id: 'K-103', position: 'Edapally', status: 'stopped', delay: 0 },
    { id: 'K-104', position: 'MG Road', status: 'running', delay: 0 }
  ]);

  const stations = [
    { name: 'Aluva', x: 10, y: 10, hasIssue: false, officers: 3 },
    { name: 'Pulinchodu', x: 20, y: 15, hasIssue: false, officers: 2 },
    { name: 'Kalamassery', x: 30, y: 20, hasIssue: true, officers: 4 },
    { name: 'Cusat', x: 40, y: 25, hasIssue: false, officers: 2 },
    { name: 'Pathadipalam', x: 50, y: 30, hasIssue: false, officers: 2 },
    { name: 'Edapally', x: 60, y: 35, hasIssue: false, officers: 3 },
    { name: 'Changampuzha Park', x: 70, y: 40, hasIssue: false, officers: 2 },
    { name: 'Palarivattom', x: 80, y: 45, hasIssue: false, officers: 3 },
    { name: 'JLN Stadium', x: 90, y: 50, hasIssue: false, officers: 2 },
    { name: 'Kaloor', x: 100, y: 55, hasIssue: false, officers: 3 },
    { name: 'Town Hall', x: 110, y: 60, hasIssue: false, officers: 2 },
    { name: 'MG Road', x: 120, y: 65, hasIssue: false, officers: 4 },
    { name: 'Maharajas', x: 130, y: 70, hasIssue: false, officers: 2 },
    { name: 'Ernakulam South', x: 140, y: 75, hasIssue: false, officers: 3 }
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => ({
          ...train,
          delay: train.status === 'delayed' ? Math.max(0, train.delay + Math.random() * 2 - 1) : train.delay
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'delayed': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Live Metro Map</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Running</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Stopped</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-96 bg-gray-50 rounded-lg relative overflow-hidden">
            {/* Metro Line */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="metroLine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
              </defs>
              <path
                d="M 40 40 Q 200 100 360 280"
                stroke="url(#metroLine)"
                strokeWidth="4"
                fill="none"
                className="drop-shadow-sm"
              />
            </svg>

            {/* Stations */}
            {stations.map((station, index) => (
              <div
                key={station.name}
                className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${
                  selectedStation === station.name ? 'z-20' : 'z-10'
                }`}
                style={{ left: `${(station.x * 3) + 20}px`, top: `${(station.y * 3) + 20}px` }}
                onClick={() => setSelectedStation(selectedStation === station.name ? null : station.name)}
              >
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                  station.hasIssue ? 'bg-red-500 animate-pulse' : 'bg-teal-600'
                }`} />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                  {station.name}
                </div>
                {station.hasIssue && (
                  <AlertTriangle className="absolute -top-2 -right-2 h-3 w-3 text-red-500" />
                )}
              </div>
            ))}

            {/* Trains */}
            {trains.map((train, index) => {
              const station = stations.find(s => s.name === train.position);
              if (!station) return null;

              return (
                <div
                  key={train.id}
                  className="absolute z-30 transition-all duration-300"
                  style={{ 
                    left: `${(station.x * 3) + 10}px`, 
                    top: `${(station.y * 3) + 10}px` 
                  }}
                >
                  <div className={`w-6 h-6 rounded-full ${getStatusColor(train.status)} border-2 border-white shadow-lg flex items-center justify-center`}>
                    <Train className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {train.id}
                    {train.delay > 0 && <span className="text-yellow-300"> (+{Math.round(train.delay)}min)</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Station Details Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Details</h3>
          
          {selectedStation ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{selectedStation}</h4>
                <p className="text-sm text-gray-600">Metro Station</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">On-duty Officers</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {stations.find(s => s.name === selectedStation)?.officers}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Train className="h-4 w-4 text-teal-600" />
                    <span className="text-sm">Trains Present</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {trains.filter(t => t.position === selectedStation).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Last Update</span>
                  </div>
                  <span className="text-sm text-gray-600">1 min ago</span>
                </div>
              </div>
              
              {stations.find(s => s.name === selectedStation)?.hasIssue && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Active Issue</p>
                      <p className="text-sm text-red-600 mt-1">Platform maintenance in progress</p>
                    </div>
                  </div>
                </div>
              )}
              
              <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                View Station Details
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Click on a station to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Train Status Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Trains</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trains.map((train) => (
            <div key={train.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{train.id}</span>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(train.status)}`} />
              </div>
              <p className="text-sm text-gray-600">{train.position}</p>
              {train.delay > 0 && (
                <p className="text-sm text-yellow-600 mt-1">Delayed by {Math.round(train.delay)} minutes</p>
              )}
              <p className="text-sm text-gray-500 mt-1 capitalize">{train.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMetroMap;