import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChatInterface from './pages/ChatInterface';
import NetworkGraph from './pages/NetworkGraph';
import CrimeAnalytics from './pages/CrimeAnalytics';
import OffenderProfiling from './pages/OffenderProfiling';
import Forecasting from './pages/Forecasting';
import FinancialCrime from './pages/FinancialCrime';
import SocioInsights from './pages/SocioInsights';
import CaseInvestigation from './pages/CaseInvestigation';
import { AuthContext } from './context/AuthContext';
import './index.css';

function ProtectedLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-container fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ksp_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (user) {
      // Simulate incoming alert notifications
      const timer = setTimeout(() => {
        setAlerts([
          { id: 1, severity: 'high', title: 'Repeat Offender Detected', location: 'Whitefield, Bengaluru', time: 'Just now' },
          { id: 2, severity: 'critical', title: 'Gang Activity Alert', location: 'Kalaburagi District', time: '5 min ago' },
        ]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('ksp_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ksp_user');
  };

  const rolePermissions = {
    investigator: ['/', '/chat', '/cases'],
    analyst: ['/', '/chat', '/cases', '/analytics', '/network'],
    supervisor: ['/', '/chat', '/cases', '/analytics', '/network', '/profiling', '/financial'],
    policymaker: ['/', '/chat', '/cases', '/analytics', '/network', '/profiling', '/financial', '/forecasting', '/socio'],
    admin: ['/', '/chat', '/cases', '/analytics', '/network', '/profiling', '/financial', '/forecasting', '/socio']
  };

  const isAllowed = (path) => {
    if (!user) return false;
    const allowedPaths = rolePermissions[user.role] || [];
    return allowedPaths.includes(path);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, alerts, setAlerts }}>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={isAllowed('/') ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/login" />} />
          <Route path="/chat" element={isAllowed('/chat') ? <ProtectedLayout><ChatInterface /></ProtectedLayout> : <Navigate to="/" />} />
          <Route path="/network" element={isAllowed('/network') ? <ProtectedLayout><NetworkGraph /></ProtectedLayout> : <Navigate to="/" />} />
          <Route path="/analytics" element={isAllowed('/analytics') ? <ProtectedLayout><CrimeAnalytics /></ProtectedLayout> : <Navigate to="/" />} />
          <Route path="/profiling" element={isAllowed('/profiling') ? <ProtectedLayout><OffenderProfiling /></ProtectedLayout> : <Navigate to="/" />} />
          <Route path="/forecasting" element={isAllowed('/forecasting') ? <ProtectedLayout><Forecasting /></ProtectedLayout> : <Navigate to="/" />} />
          <Route path="/financial" element={isAllowed('/financial') ? <ProtectedLayout><FinancialCrime /></ProtectedLayout> : <Navigate to="/" />} />
          <Route path="/socio" element={isAllowed('/socio') ? <ProtectedLayout><SocioInsights /></ProtectedLayout> : <Navigate to="/" />} />
          <Route path="/cases" element={isAllowed('/cases') ? <ProtectedLayout><CaseInvestigation /></ProtectedLayout> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
