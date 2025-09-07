import React, { useState } from 'react';
import { Shield, Clock, CheckCircle, AlertTriangle, Users, MapPin } from 'lucide-react';

const VerifyOperations: React.FC = () => {
  const [showVerifyModal, setShowVerifyModal] = useState<string | null>(null);

  const stoppedTrains = [
    {
      id: 'K-103',
      station: 'Edapally',
      reason: 'Passenger medical emergency',
      duration: '15 minutes',
      priority: 'high',
      officers: ['Ravi Kumar', 'Priya Nair'],
      lastContact: '2 min ago',
      description: 'Passenger fell ill on platform. Medical team dispatched. Train held for safety.',
      actions: [
        'Medical team contacted',
        'Passengers informed',
        'Alternative arrangements being made'
      ]
    },
    {
      id: 'K-107',
      station: 'Kalamassery',
      reason: 'Signal malfunction',
      duration: '8 minutes',
      priority: 'medium',
      officers: ['Sunil Jose', 'Maya Krishnan'],
      lastContact: '5 min ago',
      description: 'Automated signal system showing fault. Manual override procedures initiated.',
      actions: [
        'Technical team notified',
        'Manual signal operation active',
        'Monitoring system status'
      ]
    },
    {
      id: 'K-109',
      station: 'MG Road',
      reason: 'Overcrowding management',
      duration: '3 minutes',
      priority: 'low',
      officers: ['Anoop Menon'],
      lastContact: '1 min ago',
      description: 'Platform overcrowding during peak hours. Managing passenger flow.',
      actions: [
        'Additional security deployed',
        'Passenger flow management active',
        'Next train ETA communicated'
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const handleVerify = (trainId: string) => {
    setShowVerifyModal(trainId);
  };

  const confirmVerification = () => {
    // Handle verification logic here
    setShowVerifyModal(null);
    // Show success message or update state
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Operations</h2>
          <p className="text-gray-600 mt-1">Review and verify stopped trains requiring attention</p>
        </div>
        <div className="text-sm text-gray-500">
          {stoppedTrains.length} trains require verification
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">High Priority</p>
              <p className="text-sm text-red-600">
                {stoppedTrains.filter(t => t.priority === 'high').length} trains
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-900">Medium Priority</p>
              <p className="text-sm text-yellow-600">
                {stoppedTrains.filter(t => t.priority === 'medium').length} trains
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Low Priority</p>
              <p className="text-sm text-blue-600">
                {stoppedTrains.filter(t => t.priority === 'low').length} trains
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stopped Trains List */}
      <div className="space-y-4">
        {stoppedTrains.map((train) => (
          <div key={train.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{train.id}</h3>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getPriorityColor(train.priority)}`}>
                    {getPriorityIcon(train.priority)}
                    <span>{train.priority.charAt(0).toUpperCase() + train.priority.slice(1)} Priority</span>
                  </div>
                  <span className="text-sm text-gray-500">Stopped for {train.duration}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Location:</span>
                      <p className="font-medium text-gray-900">{train.station}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Last Contact:</span>
                      <p className="font-medium text-gray-900">{train.lastContact}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Issue Description:</h4>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{train.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>On-site Officers</span>
                    </h4>
                    <div className="space-y-1">
                      {train.officers.map((officer, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{officer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Actions Taken:</h4>
                    <div className="space-y-1">
                      {train.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-sm text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-6 flex flex-col space-y-2">
                <button
                  onClick={() => handleVerify(train.id)}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Verify</span>
                </button>
                <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  Contact Officer
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stoppedTrains.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Operations Verified</h3>
          <p className="text-gray-500">No trains currently require verification</p>
        </div>
      )}

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">Verify Operations</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to verify the operations for train <strong>{showVerifyModal}</strong>?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  This will mark the current situation as verified and may trigger automated responses.
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
                placeholder="Add any additional notes about the verification..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={confirmVerification}
                className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Confirm Verification</span>
              </button>
              <button
                onClick={() => setShowVerifyModal(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyOperations;