import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import ImageSlideshow from './ImageSlideshow';
import AboutSection from './AboutSection';
import ContentPage from './ContentPage';
import LatestUpdates from './LatestUpdates';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Kochi Metro Rail Corporation
        </h1>
        <p className="text-gray-600">
          Employee Operations Portal - Connecting Communities, Enhancing Lives
        </p>
      </div>
      
      {/* Image Slideshow Section */}
      <ImageSlideshow />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Content Page Section */}
      <ContentPage />
      
      {/* Latest Updates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LatestUpdates />
        </div>
        
        {/* Quick Access Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-teal-50 hover:border-teal-200 transition-colors">
              <div className="font-medium text-gray-900">Live Metro Map</div>
              <div className="text-sm text-gray-600">View real-time train positions</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-teal-50 hover:border-teal-200 transition-colors">
              <div className="font-medium text-gray-900">Train Operations</div>
              <div className="text-sm text-gray-600">Monitor train status and schedules</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-teal-50 hover:border-teal-200 transition-colors">
              <div className="font-medium text-gray-900">Verify Operations</div>
              <div className="text-sm text-gray-600">Review stopped trains</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-teal-50 hover:border-teal-200 transition-colors">
              <div className="font-medium text-gray-900">Officer Directory</div>
              <div className="text-sm text-gray-600">Contact on-duty personnel</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;