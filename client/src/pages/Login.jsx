import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const demoRoles = [
  { role: 'investigator', email: 'investigator@ksp.gov.in', label: 'Investigator', icon: '🔍' },
  { role: 'analyst', email: 'analyst@ksp.gov.in', label: 'Analyst', icon: '📊' },
  { role: 'supervisor', email: 'supervisor@ksp.gov.in', label: 'Supervisor', icon: '🎖️' },
  { role: 'policymaker', email: 'policy@ksp.gov.in', label: 'Policymaker', icon: '🏛️' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleDemoRole = (role) => {
    setSelectedRole(role.role);
    setEmail(role.email);
    setPassword('demo123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authAPI.login(email, password, selectedRole);
      if (result.success) {
        login({ ...result.user, token: result.token });
        navigate('/');
      } else {
        setError(result.error || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Animated particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#3b82f6' : '#8b5cf6',
            borderRadius: '50%',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.6 + 0.2,
            animation: `orbFloat ${Math.random() * 10 + 5}s ease-in-out infinite`,
            animationDelay: Math.random() * 5 + 's',
          }} />
        ))}
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-emblem">🛡️</div>
          <div className="login-title">KSP Crime Intelligence</div>
          <div className="login-subtitle">Karnataka State Police — Secure Access Portal</div>
        </div>

        {/* Demo Quick Access */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center' }}>
            Quick Demo Access
          </div>
          <div className="role-selector">
            {demoRoles.map(r => (
              <button
                key={r.role}
                className={`role-btn ${selectedRole === r.role ? 'active' : ''}`}
                onClick={() => handleDemoRole(r)}
                type="button"
              >
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>{r.icon}</div>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', margin: '16px 0' }}>
          <div className="divider" />
          <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: 'var(--color-bg-surface)', padding: '0 12px', fontSize: '11px', color: 'var(--text-muted)' }}>OR ENTER CREDENTIALS</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label className="input-label">Official Email</label>
            <input
              className="input"
              type="email"
              placeholder="officer@ksp.gov.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label className="input-label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: 'var(--color-danger)' }}>
              ⚠️ {error}
            </div>
          )}

          <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Authenticating...</> : '🔐 Secure Login'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '6px' }}>DEMO CREDENTIALS</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Any role email + password: <strong style={{ color: 'var(--text-secondary)' }}>demo123</strong>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          🔒 Protected by Catalyst Authentication · CERT-IN Compliant
        </div>
      </div>
    </div>
  );
}
