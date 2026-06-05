import { useState, useEffect } from 'react';
import { analyticsAPI, mockTrends, mockByDistrict, mockByType } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

/* ─────────────────────────────────────────────── Helpers ──── */

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
    tooltip: {
      backgroundColor: 'rgba(15,23,42,0.95)',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(148,163,184,0.15)',
      borderWidth: 1,
      padding: 10,
    },
  },
  scales: {
    x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(148,163,184,0.08)' } },
    y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(148,163,184,0.08)' } },
  },
};

const chartOptionsNoAxis = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
    tooltip: {
      backgroundColor: 'rgba(15,23,42,0.95)',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(148,163,184,0.15)',
      borderWidth: 1,
      padding: 10,
    },
  },
};

const horizontalChartOptions = {
  ...chartOptions,
  indexAxis: 'y',
};

const heatIntensities = [0.2, 0.1, 0.1, 0.1, 0.15, 0.2, 0.3, 0.45, 0.55, 0.5, 0.48, 0.52, 0.6, 0.55, 0.5, 0.52, 0.6, 0.7, 0.85, 0.9, 0.8, 0.65, 0.45, 0.3];

function heatColor(intensity) {
  if (intensity < 0.3) return `rgba(16,185,129,${0.2 + intensity * 0.5})`;
  if (intensity < 0.6) return `rgba(245,158,11,${0.3 + intensity * 0.5})`;
  return `rgba(239,68,68,${0.4 + intensity * 0.55})`;
}

function SkeletonBlock({ width = '100%', height = '20px', radius = '6px', style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: 'linear-gradient(90deg,rgba(148,163,184,0.08) 25%,rgba(148,163,184,0.18) 50%,rgba(148,163,184,0.08) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

/* ─────────────────────────────────────────── Component ──── */

export default function CrimeAnalytics() {
  const [loading, setLoading]         = useState(true);
  const [district, setDistrict]       = useState('All');
  const [crimeType, setCrimeType]     = useState('All');
  const [dateRange, setDateRange]     = useState('Last 18 months');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  /* ── Build chart datasets ── */
  const byDistrict    = mockByDistrict ?? [];
  const byType        = mockByType    ?? [];

  const typeColors   = ['#3b82f6','#f97316','#8b5cf6','#ef4444','#10b981','#f59e0b'];

  const lineData = {
    labels: mockTrends?.labels || [],
    datasets: (mockTrends?.datasets || []).map((d, i) => {
      const color = typeColors[i % typeColors.length];
      return {
        label: d.label,
        data: d.data,
        borderColor: color,
        backgroundColor: `${color}22`,
        tension: 0.4,
        fill: i === 0,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      };
    }),
  };

  const barData = {
    labels: byDistrict.map((d) => d.district),
    datasets: [{
      label: 'Total Crimes',
      data: byDistrict.map((d) => d.total),
      backgroundColor: 'rgba(59,130,246,0.7)',
      borderRadius: 4,
    }],
  };

  const doughnutData = {
    labels: byType.map((t) => t.type),
    datasets: [{
      data: byType.map((t) => t.count),
      backgroundColor: typeColors.map((c) => `${c}cc`),
      borderColor: typeColors,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const insights = [
    {
      icon: '🔺',
      title: 'Cybercrime Surge',
      text: '42% increase in digital fraud cases driven by UPI payment scams targeting elderly population in Tier-2 cities.',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.2)',
    },
    {
      icon: '📍',
      title: 'Geographical Concentration',
      text: '68% of all violent crimes in Bengaluru Urban concentrated in just 12 police station jurisdictions.',
      color: '#f97316',
      bg: 'rgba(249,115,22,0.08)',
      border: 'rgba(249,115,22,0.2)',
    },
    {
      icon: '🌙',
      title: 'Night Crime Peak',
      text: 'Crime rate 3.2× higher between 8 PM–11 PM vs daytime. Weekend nights show an additional 24% spike.',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.08)',
      border: 'rgba(139,92,246,0.2)',
    },
    {
      icon: '🔄',
      title: 'Recidivism Pattern',
      text: '34% of solved cases involve repeat offenders with prior convictions, indicating rehabilitation gaps.',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.08)',
      border: 'rgba(16,185,129,0.2)',
    },
  ];

  const selectStyle = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    padding: '8px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '180px',
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        select option { background: #0f172a; }
        .insight-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .heat-cell:hover {
          transform: scale(1.15);
          z-index: 10;
        }
      `}</style>

      {/* ===== PAGE HEADER ===== */}
      <div style={{ marginBottom: '24px', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ fontSize: '26px' }}>📊</span>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
            Crime Analytics
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
          Deep-dive analysis of crime patterns, trends, and predictive insights across Karnataka
        </p>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '16px 20px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '24px',
          animation: 'fadeInUp 0.5s ease 0.1s both',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🔎 Filters
        </span>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} style={selectStyle}>
          <option>All</option>
          <option>Bengaluru Urban</option>
          <option>Mysuru</option>
          <option>Kalaburagi</option>
          <option>Hubballi-Dharwad</option>
          <option>Belagavi</option>
        </select>
        <select value={crimeType} onChange={(e) => setCrimeType(e.target.value)} style={selectStyle}>
          <option>All</option>
          <option>Theft</option>
          <option>Cybercrime</option>
          <option>Assault</option>
          <option>Fraud</option>
          <option>Robbery</option>
        </select>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={selectStyle}>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last 6 months</option>
          <option>Last 12 months</option>
          <option>Last 18 months</option>
        </select>
        <button
          onClick={() => { setDistrict('All'); setCrimeType('All'); setDateRange('Last 18 months'); }}
          style={{ marginLeft: 'auto', padding: '8px 16px', background: 'rgba(148,163,184,0.1)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>

      {/* ===== CRIME TRENDS LINE CHART (full-width) ===== */}
      <div
        className="card"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '20px',
          animation: 'fadeInUp 0.5s ease 0.2s both',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📈</span> Crime Trends (18 Months)
        </h2>
        {loading ? (
          <SkeletonBlock width="100%" height="280px" radius="8px" />
        ) : (
          <div style={{ height: '280px' }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* ===== 2-COLUMN CHARTS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Bar Chart — Crime by District */}
        <div
          className="card"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            animation: 'fadeInUp 0.5s ease 0.3s both',
          }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏙️</span> Crime by District
          </h2>
          {loading ? (
            <SkeletonBlock width="100%" height="280px" radius="8px" />
          ) : (
            <div style={{ height: '280px' }}>
              <Bar data={barData} options={horizontalChartOptions} />
            </div>
          )}
        </div>

        {/* Doughnut Chart — Crime Type */}
        <div
          className="card"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            animation: 'fadeInUp 0.5s ease 0.35s both',
          }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🍩</span> Crime by Type
          </h2>
          {loading ? (
            <SkeletonBlock width="100%" height="280px" radius="8px" />
          ) : (
            <div style={{ height: '280px' }}>
              <Doughnut data={doughnutData} options={chartOptionsNoAxis} />
            </div>
          )}
        </div>
      </div>

      {/* ===== PEAK CRIME HOURS HEATMAP ===== */}
      <div
        className="card"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '20px',
          animation: 'fadeInUp 0.5s ease 0.45s both',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🕐</span> Peak Crime Hours Analysis
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 18px' }}>
          Average incident frequency by hour of day (all districts · all crime types)
        </p>
        {loading ? (
          <SkeletonBlock width="100%" height="90px" radius="8px" />
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: '4px' }}>
              {heatIntensities.map((intensity, hour) => {
                const crimeCount = Math.round(intensity * 420);
                return (
                  <div
                    key={hour}
                    className="heat-cell"
                    title={`${hour}:00 — ${crimeCount} incidents`}
                    style={{
                      background: heatColor(intensity),
                      borderRadius: '6px',
                      padding: '10px 4px 8px',
                      textAlign: 'center',
                      cursor: 'default',
                      transition: 'transform 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                      {hour.toString().padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                      {crimeCount}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Low</span>
              {['rgba(16,185,129,0.4)','rgba(16,185,129,0.6)','rgba(245,158,11,0.5)','rgba(245,158,11,0.7)','rgba(239,68,68,0.6)','rgba(239,68,68,0.9)'].map((c, i) => (
                <div key={i} style={{ width: '22px', height: '12px', background: c, borderRadius: '3px' }} />
              ))}
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>High</span>
            </div>
          </div>
        )}
      </div>

      {/* ===== EMERGING INSIGHTS ===== */}
      <div
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          animation: 'fadeInUp 0.5s ease 0.55s both',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💡</span> Emerging Insights
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {insights.map((insight, i) => (
            <div
              key={i}
              className="insight-card"
              style={{
                background: insight.bg,
                border: `1px solid ${insight.border}`,
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                cursor: 'default',
                transition: 'all 0.2s ease',
                animation: `fadeInUp 0.5s ease ${0.6 + i * 0.07}s both`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '22px' }}>{insight.icon}</span>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: insight.color, margin: 0 }}>
                  {insight.title}
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
