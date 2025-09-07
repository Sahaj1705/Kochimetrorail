import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LiveMetroMap from './components/LiveMetroMap';
import TrainOperations from './components/TrainOperations';
import VerifyOperations from './components/VerifyOperations';
import QRScanner from './components/QRScanner';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleRefresh = () => {
    // Implement global refresh logic
    console.log('Refreshing dashboard data...');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'live-map':
        return <LiveMetroMap />;
      case 'train-status':
        return <TrainOperations />;
      case 'verify-ops':
        return <VerifyOperations />;
      case 'history':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">History & Records</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">History and records functionality coming soon...</p>
            </div>
          </div>
        );
      case 'officers':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Officer Directory</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Officer directory functionality coming soon...</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Reports functionality coming soon...</p>
            </div>
          </div>
        );
      case 'incidents':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Incident Log</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Incident log functionality coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Settings functionality coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="min-h-screen flex flex-col">
        {/* Header with Navigation */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onRefresh={handleRefresh}
          onQRScan={() => setShowQRScanner(true)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
      />
    </div>
  );
}

export default App;