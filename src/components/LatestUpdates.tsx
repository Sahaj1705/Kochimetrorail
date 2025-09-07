import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';

const LatestUpdates: React.FC = () => {
  const updates = [
    {
      id: 1,
      title: 'New Safety Protocols Implemented',
      description: 'Enhanced safety measures and emergency response procedures have been deployed across all metro stations.',
      date: '2024-01-15',
      time: '10:30 AM',
      type: 'safety',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Extended Service Hours During Festival Season',
      description: 'Metro services will operate until 11:30 PM during the upcoming festival period to accommodate increased passenger traffic.',
      date: '2024-01-12',
      time: '2:15 PM',
      type: 'service',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Digital Ticketing System Upgrade Complete',
      description: 'The new digital ticketing system is now fully operational, offering faster transactions and improved user experience.',
      date: '2024-01-10',
      time: '9:45 AM',
      type: 'technology',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Monthly Maintenance Schedule - Line 1',
      description: 'Scheduled maintenance work on Line 1 will be conducted during off-peak hours this weekend.',
      date: '2024-01-08',
      time: '4:20 PM',
      type: 'maintenance',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Employee Training Program Launch',
      description: 'New comprehensive training program for all operational staff begins next week, focusing on customer service excellence.',
      date: '2024-01-05',
      time: '11:00 AM',
      type: 'training',
      priority: 'medium'
    }
  ];

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'safety':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'service':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'technology':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'maintenance':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'training':
        return <Info className="h-5 w-5 text-purple-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return `px-2 py-1 text-xs font-medium rounded-full border ${styles[priority as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-5 w-5 text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Latest Updates</h2>
        </div>
        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
          View All Updates →
        </button>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getUpdateIcon(update.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {update.title}
                  </h3>
                  <span className={getPriorityBadge(update.priority)}>
                    {update.priority}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {update.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(update.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{update.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </span>
          <button className="text-teal-600 hover:text-teal-700 font-medium">
            Subscribe to Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatestUpdates;