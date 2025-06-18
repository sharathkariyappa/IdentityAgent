import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User, 
  LogOut, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface SideBarProps {
  className?: string;
  onNavigate?: (path: string) => void;
  currentPath?: string;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}


const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    description: 'Overview and analytics'
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: User,
    description: 'Your ZK verified profile'
  }
];

const SideBar: React.FC<SideBarProps> = ({ 
  className = '', 
  onNavigate,
  currentPath = '/dashboard',
  collapsed,
  setCollapsed
}) => {
  
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const toggleCollapse = (): void => {
    setCollapsed(!collapsed);
  };
  

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else if (window.innerWidth > 1024) {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path: string): void => {
    if (onNavigate) {
      onNavigate(path);
    }
    setIsMobileOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
  
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Clearing authentication data...');
      
      // Clear all localStorage data
      localStorage.clear();
  
      // Navigate after clearing
      if (onNavigate) {
        onNavigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  

  const isActiveRoute = (path: string): boolean => {
    return currentPath === path;
  };

  const toggleMobileMenu = (): void => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Mobile menu button
  const MobileMenuButton = () => (
    <button
      onClick={toggleMobileMenu}
      className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
      aria-label="Toggle menu"
    >
      {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );

  // Navigation item component
  const NavigationItem: React.FC<{ item: NavigationItem }> = ({ item }) => {
    const IconComponent = item.icon;
    const isActive = isActiveRoute(item.path);

    return (
      <button
        onClick={() => handleNavigation(item.path)}
        className={`
          group relative w-full flex items-center space-x-3 px-4 py-4 rounded-2xl
          transition-all duration-300 ease-in-out transform hover:scale-105
          ${isActive 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl' 
            : 'text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-white/10 hover:border-white/20'
          }
          ${collapsed ? 'justify-center px-2' : ''}
        `}
        title={collapsed ? item.label : ''}
      >
        <IconComponent className={` pl-2 w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
        
        {!collapsed && (
          <div className="flex-1 text-left">
            <div className="font-semibold text-lg">{item.label}</div>
            {item.description && (
              <div className="text-sm opacity-75 mt-1">{item.description}</div>
            )}
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-400 rounded-r-full shadow-lg" />
        )}

        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 shadow-2xl">
            {item.label}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-purple-600 rotate-45" />
          </div>
        )}
      </button>
    );
  };

  // Main sidebar content
  const SidebarContent = () => (
    <div className={`
      h-screen overflow-hidden
      ${collapsed ? 'items-center' : ''}
    `}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 h-full">
        {/* Header */}
        <div className={`
          flex items-center justify-between mb-10
          ${collapsed ? 'flex-col space-y-4' : ''}
        `}>
          <div className={`flex items-center space-x-3 ${collapsed ? 'flex-col space-x-0 space-y-2' : ''}`}>
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl">
              <Shield className="w-7 h-7 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                IdentityAgent
                </h1>
                <p className="text-sm text-gray-400 mt-1">Secure & Verified</p>
              </div>
            )}
          </div>

          {/* Collapse toggle - hidden on mobile */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/10 hover:border-white/20"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-4 mb-10">
          {navigationItems.map((item) => (
            <NavigationItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Footer - positioned at bottom */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-white/10 pt-6">
           {/* Logout button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`
                w-full flex items-center space-x-3 px-4 py-4 rounded-2xl
                bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white
                transition-all duration-300 ease-in-out transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl
                ${collapsed ? 'justify-center px-2' : ''}
              `}
              title={collapsed ? 'Logout' : ''}
            >
              {isLoggingOut ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogOut className="w-6 h-6 flex-shrink-0" />
              )}
              
              {!collapsed && (
                <span className="font-semibold text-lg">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${className}
        ${collapsed ? 'w-24' : 'w-80'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed inset-y-0 left-0 z-40 h-screen
        bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900
        text-white
        transition-all duration-300 ease-in-out
        shadow-2xl border-r border-white/10
        backdrop-blur-sm
      `}>
        <SidebarContent />
      </div>

      {/* Spacer for desktop layout */}
      <div className={`hidden md:block ${collapsed ? 'w-24' : 'w-80'} flex-shrink-0 transition-all duration-300`} />
    </>
  );
};

export default SideBar;