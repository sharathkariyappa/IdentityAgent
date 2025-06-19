// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import GithubCallback from './pages/github/GithubCallback';
import Profile from './pages/Profile';
import Home from './pages/Home';
import FeaturesPage from './pages/FeaturesPage';
import About from './pages/About';
import Documentation from './pages/Documentation';
import './App.css';

const AppWrapper: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const showNavbar = location.pathname !== '/';
  const showSidebar = ['/dashboard', '/profile', '/features', '/about', '/documentation'].includes(location.pathname);

  const handleSidebarNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col w-full h-screen">
    {showNavbar && <Navbar sidebarCollapsed={sidebarCollapsed} />}
  
    <div className="flex flex-1">
      {showSidebar && (
        <SideBar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onNavigate={handleSidebarNavigation}
          currentPath={location.pathname}
        />
      )}
  
      <div className="pt-8 w-full flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/github/callback" element={<GithubCallback />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </div>
    </div>
  </div>
  
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
