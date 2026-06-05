import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/': { title: 'Intelligence Dashboard', desc: 'Real-time crime analytics overview' },
  '/chat': { title: 'AI Crime Chat', desc: 'Natural language query interface' },
  '/network': { title: 'Network Analysis', desc: 'Criminal relationship mapping' },
  '/analytics': { title: 'Crime Analytics', desc: 'Trends, patterns & hotspot analysis' },
  '/profiling': { title: 'Offender Profiling', desc: 'Risk scoring & behavioral analysis' },
  '/forecasting': { title: 'Crime Forecasting', desc: 'Predictive intelligence & early warning' },
  '/financial': { title: 'Financial Crime', desc: 'Transaction link analysis' },
  '/socio': { title: 'Sociological Insights', desc: 'Demographic & socio-economic analysis' },
  '/cases': { title: 'Case Investigation', desc: 'Decision support & case management' },
};

export default function Topbar() {
  const location = useLocation();
  const { user, alerts } = useAuth();
  const [now, setNow] = useState(new Date());
  const [showAlerts, setShowAlerts] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('ksp_theme') || 'dark');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ksp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const page = pageTitles[location.pathname] || { title: 'KSP Intelligence', desc: '' };
  const alertCount = alerts?.length || 0;

  const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="topbar">
      <div style={{ flex: 1 }}>
        <div className="topbar-title">{page.title}</div>
        <div className="topbar-subtitle">{page.desc}</div>
      </div>

      <div className="topbar-actions">
        {/* Theme Toggle */}
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTheme}
          style={{ fontSize: '18px' }}
          title="Toggle Theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Live time */}
        <div style={{ textAlign: 'right', marginRight: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{formatTime(now)}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{formatDate(now)}</div>
        </div>

        {/* System status */}
        <div className="status-indicator" style={{ marginRight: '8px' }}>
          <div className="status-dot" />
          <span>Live</span>
        </div>

        {/* Alerts bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setShowAlerts(!showAlerts)}
            style={{ fontSize: '18px', position: 'relative' }}
          >
            🔔
            {alertCount > 0 && (
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                background: 'var(--color-danger)', color: '#fff',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '10px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{alertCount}</span>
            )}
          </button>

          {showAlerts && alertCount > 0 && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: '8px',
              width: '360px', background: 'var(--color-bg-elevated)',
              border: '1px solid var(--border-default)', borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)', zIndex: 200, overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>⚠️ Active Alerts</span>
                <span className="badge badge-critical">{alertCount} NEW</span>
              </div>
              {alerts.map(a => (
                <div key={a.id} className="alert-item" style={{ margin: '8px', borderRadius: '8px' }}>
                  <div>
                    <div className="alert-title">{a.title}</div>
                    <div className="alert-meta"><span>📍 {a.location}</span><span>🕐 {a.time}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* District badge */}
        <div style={{
          padding: '4px 12px', background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px',
          fontSize: '11px', fontWeight: 600, color: 'var(--color-secondary)'
        }}>
          📍 {user?.district}
        </div>
      </div>
    </header>
  );
}
