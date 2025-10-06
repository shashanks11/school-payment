import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Plus, 
  Search, 
  LogOut, 
  User 
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Create Payment', path: '/create-payment', icon: Plus },
    { name: 'Check Status', path: '/transaction-status', icon: Search },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Only this div triggers the hover */}
      <div 
        className="fixed top-0 left-0 h-full bg-white shadow-lg border-r transition-all duration-300 z-50"
        style={{ width: isSidebarExpanded ? '256px' : '80px' }}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* Logo */}
        <div className="p-6 border-b flex items-center" style={{ justifyContent: isSidebarExpanded ? 'flex-start' : 'center' }}>
          {isSidebarExpanded ? (
            <h1 className="text-2xl font-bold text-blue-600">School Pay</h1>
          ) : (
            <span className="text-blue-600 font-bold text-lg">SP</span>
          )}
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span 
                  className="whitespace-nowrap overflow-hidden transition-all duration-300"
                  style={{ 
                    opacity: isSidebarExpanded ? 1 : 0,
                    width: isSidebarExpanded ? 'auto' : '0'
                  }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-blue-600" />
            </div>
            <div 
              className="flex-1 overflow-hidden transition-all duration-300"
              style={{ 
                opacity: isSidebarExpanded ? 1 : 0,
                width: isSidebarExpanded ? 'auto' : '0'
              }}
            >
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span 
              className="whitespace-nowrap overflow-hidden transition-all duration-300"
              style={{ 
                opacity: isSidebarExpanded ? 1 : 0,
                width: isSidebarExpanded ? 'auto' : '0'
              }}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content - Adjusts based on sidebar width */}
      <div 
        className="flex-1 transition-all duration-300 min-h-screen"
        style={{ marginLeft: isSidebarExpanded ? '256px' : '80px' }}
      >
        <div className="p-6 lg:p-8 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;