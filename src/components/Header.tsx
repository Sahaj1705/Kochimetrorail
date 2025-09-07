import React, { useState } from 'react';
import { RefreshCw, Bell, QrCode, Search, Menu, X, ChevronDown } from 'lucide-react';
import { 
  Home, 
  Train, 
  MapPin, 
  Clock, 
  Users, 
  Settings, 
  Moon, 
  Sun,
  FileText,
  BarChart3,
  Shield
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onRefresh: () => void;
  onQRScan: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  darkMode, 
  onToggleDarkMode, 
  onRefresh, 
  onQRScan 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
  const notifications = [
    { id: 1, message: "Train K-101 delayed by 5 minutes at Aluva", time: "2 min ago", type: "warning" },
    { id: 2, message: "Maintenance scheduled for Line 1 at 10:00 PM", time: "15 min ago", type: "info" },
    { id: 3, message: "New officer assigned to Ernakulam South", time: "1 hour ago", type: "success" }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { 
      id: 'operations', 
      label: 'Operations', 
      icon: Train,
      submenu: [
        { id: 'live-map', label: 'Live Metro Map', icon: MapPin },
        { id: 'train-status', label: 'Train Operations', icon: Train },
        { id: 'verify-ops', label: 'Verify Operations', icon: Shield }
      ]
    },
    { 
      id: 'management', 
      label: 'Management', 
      icon: Users,
      submenu: [
        { id: 'officers', label: 'Officer Directory', icon: Users },
        { id: 'history', label: 'History & Records', icon: Clock },
        { id: 'incidents', label: 'Incident Log', icon: FileText }
      ]
    },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const handleMenuClick = (itemId: string) => {
    onTabChange(itemId);
    setShowMobileMenu(false);
    setShowDropdown(null);
  };

  const toggleDropdown = (itemId: string) => {
    setShowDropdown(showDropdown === itemId ? null : itemId);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Kochi Metro Service</h1>
                <p className="text-sm text-gray-500">Employee Operations Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search trains, stations, officers..."
                className="bg-transparent text-sm focus:outline-none w-64"
              />
            </div>
            
            {/* Authentication Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors">
                Login
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors">
                Sign Up
              </button>
            </div>
            
            <button
              onClick={onQRScan}
              className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              title="QR Code Scanner"
            >
              <QrCode className="h-5 w-5" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors relative"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 border-b border-gray-50 hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'warning' ? 'bg-yellow-400' :
                            notification.type === 'info' ? 'bg-blue-400' : 'bg-green-400'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={onRefresh}
              className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block border-t border-gray-100 bg-gray-50">
        <div className="px-6">
          <div className="flex items-center space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.submenu && item.submenu.some(sub => sub.id === activeTab));
              
              return (
                <div key={item.id} className="relative">
                  {item.submenu ? (
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                          isActive 
                            ? 'text-teal-700 border-b-2 border-teal-600' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          showDropdown === item.id ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {showDropdown === item.id && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <button
                                key={subItem.id}
                                onClick={() => handleMenuClick(subItem.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-sm transition-colors ${
                                  activeTab === subItem.id
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <SubIcon className="h-4 w-4" />
                                <span>{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-teal-700 border-b-2 border-teal-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
            
            <button
              onClick={() => handleMenuClick('settings')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'settings' 
                  ? 'text-teal-700 border-b-2 border-teal-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <div key={item.id}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          showDropdown === item.id ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {showDropdown === item.id && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <button
                                key={subItem.id}
                                onClick={() => handleMenuClick(subItem.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                                  activeTab === subItem.id
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <SubIcon className="h-4 w-4" />
                                <span>{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
            
            <button
              onClick={() => handleMenuClick('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            
            {/* Mobile Authentication Buttons */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors mb-2">
                Employee Login
              </button>
              <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors">
                Employee Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;