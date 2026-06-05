import { useState, useEffect } from 'react';
import { analyticsAPI, mockAlerts, mockKPIs, mockByType, mockByDistrict } from '../services/api';

const severityConfig = {
  critical: { color: 'var(--color-danger)', icon: '🚨', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  high:     { color: '#f97316',              icon: '⚠️', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  medium:   { color: '#f59e0b',              icon: '🔔', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  low:      { color: 'var(--color-success)', icon: 'ℹ️',  bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
};

function SkeletonBlock({ width = '100%', height = '20px', radius = '6px', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, rgba(148,163,184,0.08) 25%, rgba(148,163,184,0.18) 50%, rgba(148,163,184,0.08) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
    />
  );
}

function KpiCardSkeleton() {
  return (
    <div className="kpi-card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
      <SkeletonBlock width="32px" height="32px" radius="8px" style={{ marginBottom: '10px' }} />
      <SkeletonBlock width="60%" height="11px" style={{ marginBottom: '10px' }} />
      <SkeletonBlock width="80%" height="32px" style={{ marginBottom: '8px' }} />
      <SkeletonBlock width="50%" height="12px" />
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    const clock = setInterval(() => setTimestamp(new Date()), 60000);
    return () => {
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, []);

  const formatTimestamp = (date) =>
    date.toLocaleString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });

  const row1KPIs = [
    {
      icon: '📋',
      label: 'Total FIRs',
      value: mockKPIs.total_firs?.toLocaleString('en-IN') ?? '48,392',
      trend: '+8.3%',
      trendDir: 'up',
      trendColor: 'var(--color-danger)',
      trendIcon: '↑',
      accent: 'rgba(239,68,68,0.15)',
    },
    {
      icon: '🔍',
      label: 'Active Cases',
      value: mockKPIs.active_cases?.toLocaleString('en-IN') ?? '12,847',
      trend: '-2.1%',
      trendDir: 'down',
      trendColor: 'var(--color-success)',
      trendIcon: '↓',
      accent: 'rgba(16,185,129,0.15)',
    },
    {
      icon: '✅',
      label: 'Solved Rate',
      value: `${mockKPIs.solved_rate ?? '68.4'}%`,
      trend: '+1.2%',
      trendDir: 'up',
      trendColor: 'var(--color-success)',
      trendIcon: '↑',
      accent: 'rgba(16,185,129,0.15)',
    },
    {
      icon: '⚠️',
      label: 'High Risk Offenders',
      value: mockKPIs.high_risk_offenders?.toLocaleString('en-IN') ?? '347',
      trend: '+3.5%',
      trendDir: 'up',
      trendColor: '#f97316',
      trendIcon: '↑',
      accent: 'rgba(249,115,22,0.15)',
    },
  ];

  const row2KPIs = [
    {
      icon: '📈',
      label: 'Monthly Change',
      value: `+${mockKPIs.monthly_change_percent ?? '8.3'}%`,
      trend: 'vs last month',
      trendColor: '#f97316',
      trendIcon: '📊',
      accent: 'rgba(249,115,22,0.12)',
    },
    {
      icon: '🚔',
      label: 'Arrests This Month',
      value: mockKPIs.arrests_this_month?.toLocaleString('en-IN') ?? '1,284',
      trend: '+5.7% vs last month',
      trendColor: 'var(--color-success)',
      trendIcon: '↑',
      accent: 'rgba(16,185,129,0.12)',
    },
    {
      icon: '💻',
      label: 'Cybercrime',
      value: mockKPIs.cybercrime_count?.toLocaleString('en-IN') ?? '3,241',
      trend: '+42% surge',
      trendColor: '#ef4444',
      trendIcon: '↑',
      accent: 'rgba(59,130,246,0.12)',
    },
    {
      icon: '⏳',
      label: 'Pending Investigations',
      value: mockKPIs.pending_investigations?.toLocaleString('en-IN') ?? '4,076',
      trend: 'Requires attention',
      trendColor: '#f59e0b',
      trendIcon: '⚠️',
      accent: 'rgba(245,158,11,0.12)',
    },
  ];

  const topAlerts = (mockAlerts ?? []).slice(0, 5);
  const topTypes  = (mockByType ?? []).slice(0, 6);
  const topDistricts = (mockByDistrict ?? []).slice(0, 6);

  const typeColors = ['#3b82f6','#f97316','#8b5cf6','#ef4444','#10b981','#f59e0b'];

  const quickActions = [
    { icon: '📄', label: 'Generate Report',  color: '#3b82f6' },
    { icon: '🔔', label: 'Add Alert',         color: '#f97316' },
    { icon: '🗺️', label: 'View Hotspots',     color: '#8b5cf6' },
    { icon: '📤', label: 'Export Data',        color: '#10b981' },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* --- Global shimmer keyframe --- */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kpi-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          transition: all 0.25s ease;
        }
        .action-btn-custom:hover {
          filter: brightness(1.15);
          transform: translateY(-2px);
        }
        .alert-row:hover {
          background: rgba(148,163,184,0.05) !important;
        }
      `}</style>

      {/* ===== PAGE HEADER ===== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', animation: 'fadeInUp 0.5s ease' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '26px' }}>🛡️</span>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
              Executive Dashboard
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
            Karnataka State Police — Crime Intelligence Overview
          </p>
        </div>
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          <span style={{ color: '#10b981', fontSize: '10px' }}>●</span>
          <span>Live &nbsp;·&nbsp; {formatTimestamp(timestamp)}</span>
        </div>
      </div>

      {/* ===== ROW 1 — KPI CARDS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : row1KPIs.map((kpi, i) => (
              <div
                key={i}
                className="kpi-card kpi-hover"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  animation: `fadeInUp 0.5s ease ${i * 0.08}s both`,
                }}
              >
                {/* Accent glow */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: kpi.accent, borderRadius: '50%', transform: 'translate(30px,-30px)', filter: 'blur(20px)' }} />
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{kpi.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '12px', color: kpi.trendColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{kpi.trendIcon}</span>
                  <span>{kpi.trend} vs last month</span>
                </div>
              </div>
            ))}
      </div>

      {/* ===== ROW 2 — KPI CARDS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : row2KPIs.map((kpi, i) => (
              <div
                key={i}
                className="kpi-card kpi-hover"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 20px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  animation: `fadeInUp 0.5s ease ${0.32 + i * 0.08}s both`,
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: '70px', height: '70px', background: kpi.accent, borderRadius: '50%', transform: 'translate(25px,-25px)', filter: 'blur(16px)' }} />
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{kpi.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, margin: '6px 0', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '12px', color: kpi.trendColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{kpi.trendIcon}</span>
                  <span>{kpi.trend}</span>
                </div>
              </div>
            ))}
      </div>

      {/* ===== MAIN CONTENT GRID ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* ===== LEFT COLUMN ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Recent Alerts */}
          <div className="card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '20px', animation: 'fadeInUp 0.6s ease 0.7s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🚨</span> Recent Alerts
              </h2>
              <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                {topAlerts.length} Active
              </span>
            </div>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}>
                    <SkeletonBlock width="36px" height="36px" radius="8px" />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <SkeletonBlock width="70%" height="13px" />
                      <SkeletonBlock width="90%" height="11px" />
                      <SkeletonBlock width="40%" height="10px" />
                    </div>
                  </div>
                ))
              : topAlerts.map((alert, i) => {
                  const cfg = severityConfig[alert.severity] ?? severityConfig.medium;
                  return (
                    <div
                      key={alert.id ?? i}
                      className="alert-item alert-row"
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        marginBottom: '8px',
                        borderRadius: 'var(--radius-md)',
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ fontSize: '22px', flexShrink: 0 }}>{cfg.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {alert.title}
                          </span>
                          <span className="badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, padding: '1px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, flexShrink: 0, marginLeft: '8px', textTransform: 'uppercase' }}>
                            {alert.severity}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 5px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {alert.description}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>📍 {alert.location}</span>
                          <span>🕐 {alert.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Crime Type Distribution */}
          <div className="card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '20px', animation: 'fadeInUp 0.6s ease 0.8s both' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📊</span> Crime Type Distribution
            </h2>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <SkeletonBlock width="40%" height="12px" />
                      <SkeletonBlock width="15%" height="12px" />
                    </div>
                    <SkeletonBlock width="100%" height="8px" radius="4px" />
                  </div>
                ))
              : topTypes.map((item, i) => {
                  const maxCount = topTypes[0]?.count ?? 1;
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.type ?? i} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: typeColors[i], display: 'inline-block', flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.type}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.count?.toLocaleString('en-IN')}</span>
                          <span style={{ fontSize: '11px', color: typeColors[i], fontWeight: 600 }}>{pct}%</span>
                        </div>
                      </div>
                      <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(148,163,184,0.1)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, borderRadius: '4px', background: `linear-gradient(90deg, ${typeColors[i]}cc, ${typeColors[i]})`, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Top Districts Table */}
          <div className="card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '20px', animation: 'fadeInUp 0.6s ease 0.75s both' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏙️</span> Top Districts by Crime Rate
            </h2>
            {loading
              ? (
                  <div>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.4fr', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
                        {Array.from({ length: 4 }).map((__, j) => <SkeletonBlock key={j} width="100%" height="12px" />)}
                      </div>
                    ))}
                  </div>
                )
              : (
                  <div className="data-table" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {['District', 'Total Crimes', 'Solved', 'Solve Rate'].map((h) => (
                            <th key={h} style={{ textAlign: h === 'District' ? 'left' : 'right', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0 8px 12px', whiteSpace: 'nowrap' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {topDistricts.map((d, i) => {
                          const rate = d.total > 0 ? Math.round((d.solved / d.total) * 100) : 0;
                          const rateColor = rate >= 70 ? 'var(--color-success)' : rate >= 50 ? '#f59e0b' : '#ef4444';
                          return (
                            <tr key={d.district ?? i} style={{ borderTop: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                              <td style={{ padding: '11px 8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: rateColor, flexShrink: 0, display: 'inline-block' }} />
                                  {d.district}
                                </div>
                              </td>
                              <td style={{ padding: '11px 8px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>{d.total?.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '11px 8px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>{d.solved?.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '11px 8px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                  <div style={{ width: '60px', height: '6px', borderRadius: '3px', background: 'rgba(148,163,184,0.1)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${rate}%`, borderRadius: '3px', background: rateColor }} />
                                  </div>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: rateColor, minWidth: '34px' }}>{rate}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '20px', animation: 'fadeInUp 0.6s ease 0.9s both' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span> Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  className="btn action-btn-custom"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    background: `${action.color}18`,
                    border: `1px solid ${action.color}40`,
                    borderRadius: 'var(--radius-md)',
                    color: action.color,
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '20px', animation: 'fadeInUp 0.6s ease 1s both' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🖥️</span> System Status
            </h2>
            {[
              { label: 'Data Sync',       status: 'Online',  color: '#10b981' },
              { label: 'Analytics Engine',status: 'Online',  color: '#10b981' },
              { label: 'Alert System',    status: 'Online',  color: '#10b981' },
              { label: 'Predictive Model',status: 'Updating',color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--glass-border)' : 'none' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                  <span style={{ fontSize: '12px', color: s.color, fontWeight: 600 }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
