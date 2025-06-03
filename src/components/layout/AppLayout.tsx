import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  CreditCard, 
  SendHorizontal, 
  Receipt, 
  Settings, 
  Bell, 
  LogOut, 
  User
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Logo } from '../../assets/logo';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: SendHorizontal, label: 'Transfer', path: '/transfer' },
    { icon: Receipt, label: 'Bill Payment', path: '/bill-payment' },
    { icon: CreditCard, label: 'Cards', path: '/cards' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <aside className="hidden md:flex md:w-64 flex-col bg-blue-900 text-white">
        <div className="p-5 border-b border-blue-800">
          <Logo className="h-10" />
        </div>
        
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-700 p-2 rounded-full">
              <User size={24} />
            </div>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-blue-200">{user?.accountNumber}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center w-full px-4 py-3 rounded-lg transition-colors",
                    location.pathname === item.path 
                      ? "bg-blue-800 text-white" 
                      : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  )}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-blue-100 hover:bg-blue-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} />
              </button>
              
              {/* Mobile menu */}
              <div className="md:hidden">
                <div className="relative">
                  <button 
                    onClick={() => handleLogout()} 
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile navigation */}
          <nav className="md:hidden border-t border-gray-200">
            <div className="flex justify-between px-2 py-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-1 flex-col items-center py-2 px-1",
                    location.pathname === item.path 
                      ? "text-blue-900" 
                      : "text-gray-500 hover:text-blue-900"
                  )}
                >
                  <item.icon size={20} className="mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;