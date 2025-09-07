import React from 'react';
import { Train, Users, MapPin, Award, Clock, Shield } from 'lucide-react';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Train,
      title: 'Modern Fleet',
      description: 'State-of-the-art metro trains with advanced safety systems'
    },
    {
      icon: Users,
      title: 'Serving Communities',
      description: 'Connecting millions of passengers across Kochi metropolitan area'
    },
    {
      icon: MapPin,
      title: 'Strategic Network',
      description: 'Comprehensive route coverage linking key destinations'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to providing world-class public transportation'
    },
    {
      icon: Clock,
      title: 'Reliable Service',
      description: 'Punctual and efficient metro operations 365 days a year'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Highest safety standards and security protocols'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          About Kochi Metro Rail Corporation
        </h2>
        <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Kochi Metro Rail Corporation Limited (KMRL) is a joint venture between the Government of India 
          and the Government of Kerala, established to implement and operate the Kochi Metro Rail Project. 
          Our mission is to provide safe, reliable, and sustainable urban transportation solutions that 
          enhance the quality of life for the people of Kochi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-teal-50 transition-colors duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-lg mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-teal-50 rounded-lg p-6 border border-teal-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-teal-600 mb-2">25.6 km</div>
            <div className="text-gray-700 font-medium">Total Network Length</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-600 mb-2">22</div>
            <div className="text-gray-700 font-medium">Metro Stations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-600 mb-2">100K+</div>
            <div className="text-gray-700 font-medium">Daily Passengers</div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
        <p className="text-gray-600 max-w-3xl mx-auto">
          To be the preferred choice for urban mobility in Kochi by providing world-class metro rail 
          services that are safe, reliable, comfortable, and environmentally sustainable, while 
          contributing to the economic and social development of the region.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;