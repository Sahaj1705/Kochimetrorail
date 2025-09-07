import React, { useState } from 'react';
import { QrCode, X, Camera, User, AlertTriangle, Train } from 'lucide-react';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose }) => {
  const [scanMode, setScanMode] = useState<'auth' | 'incident' | 'train'>('auth');
  const [scannedData, setScannedData] = useState<string>('');

  if (!isOpen) return null;

  const scanModes = [
    { id: 'auth', label: 'Employee Authentication', icon: User },
    { id: 'incident', label: 'Incident Reporting', icon: AlertTriangle },
    { id: 'train', label: 'Train Identification', icon: Train }
  ];

  const handleScan = () => {
    // Simulate QR code scanning
    const mockData = {
      auth: 'EMP001-RAVI-KUMAR-STATION-MASTER',
      incident: 'INC-2024-001-PLATFORM-SAFETY-ISSUE',
      train: 'TRAIN-K-101-STATUS-RUNNING-DRIVER-RAJESH'
    };
    
    setScannedData(mockData[scanMode]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <QrCode className="h-6 w-6 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">QR Code Scanner</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scan Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Scan Purpose</label>
          <div className="space-y-2">
            {scanModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setScanMode(mode.id as any)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    scanMode === mode.id
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scanner Area */}
        <div className="mb-6">
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-8">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Point camera at QR code</p>
              <button
                onClick={handleScan}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Simulate Scan
              </button>
            </div>
          </div>
        </div>

        {/* Scanned Results */}
        {scannedData && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Scan Successful!</h4>
            <p className="text-sm text-green-700 font-mono">{scannedData}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          {scannedData && (
            <button className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
              Process Scan
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;