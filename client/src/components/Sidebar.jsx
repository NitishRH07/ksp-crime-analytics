import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navGroups = [
  {
    label: 'Intelligence',
    items: [
      { path: '/', icon: '🏠', label: 'Dashboard', exact: true },
      { path: '/chat', icon: '💬', label: 'AI Crime Chat' },
      { path: '/cases', icon: '📁', label: 'Case Investigation' },
    ]
  },
  {
    label: 'Analysis',
    items: [
      { path: '/analytics', icon: '📊', label: 'Crime Analytics' },
      { path: '/network', icon: '🕸️', label: 'Network Analysis' },
      { path: '/socio', icon: '👥', label: 'Socio Insights' },
    ]
  },
  {
    label: 'Prediction',
    items: [
      { path: '/profiling', icon: '🎯', label: 'Offender Profiling' },
      { path: '/forecasting', icon: '🔮', label: 'Crime Forecasting', badge: '3' },
      { path: '/financial', icon: '💰', label: 'Financial Crime' },
    ]
  }
];

const rolePermissions = {
  investigator: ['/', '/chat', '/cases'],
  analyst: ['/', '/chat', '/cases', '/analytics', '/network'],
  supervisor: ['/', '/chat', '/cases', '/analytics', '/network', '/profiling', '/financial'],
  policymaker: ['/', '/chat', '/cases', '/analytics', '/network', '/profiling', '/financial', '/forecasting', '/socio'],
  admin: ['/', '/chat', '/cases', '/analytics', '/network', '/profiling', '/financial', '/forecasting', '/socio']
};

const roleColors = {
  investigator: '#3b82f6',
  analyst: '#8b5cf6',
  supervisor: '#f97316',
  policymaker: '#10b981',
  admin: '#dc2626',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : '??';
  const roleColor = roleColors[user?.role] || '#f97316';

  const allowedPaths = user ? (rolePermissions[user.role] || []) : [];
  const filteredNavGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => allowedPaths.includes(item.path))
  })).filter(group => group.items.length > 0);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🛡️</div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-title">KSP Intelligence</div>
          <div className="sidebar-logo-sub">Crime Analytics Platform</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {filteredNavGroups.map(group => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)` }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div className="user-role" style={{ color: roleColor }}>{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
            title="Logout"
          >⏻</button>
        </div>
      </div>
    </aside>
  );
}
