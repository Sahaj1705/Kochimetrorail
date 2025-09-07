import React from 'react';

const ContentPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Featured Image */}
        <div className="order-2 lg:order-1">
          <img
            src="https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
            alt="Modern Kochi Metro station interior with passengers"
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
          <p className="text-sm text-gray-500 mt-2 text-center">
            Modern metro station facilities designed for passenger comfort and safety
          </p>
        </div>

        {/* Content Text Box */}
        <div className="order-1 lg:order-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transforming Urban Mobility in Kochi
            </h2>
            <div className="w-16 h-1 bg-teal-600 mb-6"></div>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              The Kochi Metro Rail system represents a revolutionary step forward in urban transportation 
              for the city of Kochi. Since its inception, the metro has transformed the way people 
              commute, offering a clean, efficient, and reliable alternative to traditional transportation methods.
            </p>

            <p>
              Our commitment to excellence extends beyond just moving passengers from point A to point B. 
              We focus on creating an integrated transportation ecosystem that promotes sustainable urban 
              development, reduces traffic congestion, and improves air quality throughout the metropolitan area.
            </p>

            <p>
              With cutting-edge technology, modern infrastructure, and a dedicated team of professionals, 
              Kochi Metro continues to set new standards in public transportation. Our employee dashboard 
              system ensures seamless operations, real-time monitoring, and efficient management of all 
              metro services across the network.
            </p>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-lg">
            <h3 className="font-semibold text-teal-900 mb-2">Key Achievements</h3>
            <ul className="text-teal-800 space-y-1 text-sm">
              <li>• First metro system in Kerala state</li>
              <li>• ISO 9001:2015 certified operations</li>
              <li>• Green building certified stations</li>
              <li>• Award-winning safety protocols</li>
            </ul>
          </div>

          <div className="flex space-x-4 pt-4">
            <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              Learn More
            </button>
            <button className="border border-teal-600 text-teal-600 px-6 py-2 rounded-lg hover:bg-teal-50 transition-colors">
              View Routes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;