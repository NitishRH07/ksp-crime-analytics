import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94a3b8' } } },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
  }
};

const doughnutOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 12, font: { size: 11 } } } }
};

const horizontalChartOpts = {
  ...chartOpts,
  indexAxis: 'y',
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
  }
};

const summaryStats = [
  { label: 'Youth 18-30 of Accused', value: '58%', color: '#ef4444' },
  { label: 'Unemployment Correlation', value: '73%', color: '#f59e0b' },
  { label: 'Below 10th Std Accused', value: '64%', color: '#8b5cf6' },
  { label: 'Rural Migrants', value: '41%', color: '#3b82f6' },
];

const ageDistributionData = {
  labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
  datasets: [
    {
      label: 'Accused',
      data: [892, 1234, 756, 423, 187],
      backgroundColor: '#ef4444',
      borderRadius: 4,
    },
    {
      label: 'Victims',
      data: [423, 567, 891, 634, 712],
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    },
  ],
};

const accusedGenderData = {
  labels: ['Male', 'Female', 'Other'],
  datasets: [{
    data: [84, 14, 2],
    backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6'],
    borderWidth: 0,
    hoverOffset: 6,
  }],
};

const victimGenderData = {
  labels: ['Male', 'Female', 'Other'],
  datasets: [{
    data: [52, 46, 2],
    backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6'],
    borderWidth: 0,
    hoverOffset: 6,
  }],
};

const educationData = {
  labels: ['No Formal Education', 'Primary (1-5)', 'Middle (6-8)', 'SSLC (10th)', 'PUC (12th)', 'Graduate+'],
  datasets: [{
    label: 'No. of Accused',
    data: [234, 456, 678, 892, 312, 89],
    backgroundColor: 'rgba(139, 92, 246, 0.7)',
    borderRadius: 4,
  }],
};

const districtLabels = ['Kalaburagi', 'Raichur', 'Vijayapura', 'Yadgir', 'Koppal', 'Bengaluru Urban', 'Belagavi'];
const districtValues = [8.9, 8.4, 7.8, 8.1, 7.5, 6.2, 7.1];
const districtColors = districtValues.map(v =>
  v > 8 ? 'rgba(239,68,68,0.7)' : v >= 7 ? 'rgba(245,158,11,0.7)' : 'rgba(16,185,129,0.7)'
);

const economicStressData = {
  labels: districtLabels,
  datasets: [{
    label: 'Economic Stress Index',
    data: districtValues,
    backgroundColor: districtColors,
    borderRadius: 4,
  }],
};

const insightCards = [
  {
    icon: '👦',
    title: 'Youth Dominance',
    stat: '58%',
    badgeClass: 'badge-danger',
    text: 'Youth aged 18-30 account for 58% of accused persons. Lack of employment opportunities and peer influence are primary drivers identified in field interviews.',
  },
  {
    icon: '💼',
    title: 'Unemployment Correlation',
    stat: '73%',
    badgeClass: 'badge-warning',
    text: '73% of accused persons were unemployed at the time of offense. Districts with higher unemployment rates show 2.3x more violent crimes.',
  },
  {
    icon: '📚',
    title: 'Education Gap',
    stat: '64%',
    badgeClass: 'badge-medium',
    text: '64% of accused had below 10th standard education. Low literacy correlates with vulnerability to gang recruitment and inability to access legitimate livelihood.',
  },
  {
    icon: '🚌',
    title: 'Urban Migration',
    stat: '41%',
    badgeClass: 'badge-info',
    text: '41% of accused migrated to urban areas within 2 years of committing the crime. Social isolation and lack of support networks increase crime risk.',
  },
  {
    icon: '🎉',
    title: 'Seasonal Crime Spike',
    stat: '23%',
    badgeClass: 'badge-high',
    text: '23% spike in theft, assault, and public disorder during major festival seasons (Dasara, Diwali, Ugadi). Crowd gatherings create opportunity for pickpockets.',
  },
  {
    icon: '💻',
    title: 'Digital Divide Victims',
    stat: '55+',
    badgeClass: 'badge-purple',
    text: 'Cybercrime victims skew heavily towards the 55+ age group (67% of online fraud victims). Unfamiliarity with digital payment security makes them prime targets.',
  },
];

export default function SocioInsights() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading Socio-Demographic Data…</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Socio-Demographic Insights</h1>
          <p style={styles.pageSubtitle}>Understanding crime through social and economic lenses</p>
        </div>
        <div style={styles.headerBadge}>
          <span style={styles.liveDot} />
          Live Data
        </div>
      </div>

      {/* Summary Stat Strip */}
      <div style={styles.statStrip}>
        {summaryStats.map((s, i) => (
          <div key={i} style={styles.statCard}>
            <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Age Distribution Bar Chart */}
      <div style={styles.chartCard}>
        <h2 style={styles.chartTitle}>Age Distribution — Accused vs Victims</h2>
        <div style={{ height: 260 }}>
          <Bar data={ageDistributionData} options={chartOpts} />
        </div>
      </div>

      {/* Gender Distribution — two doughnuts side by side */}
      <div style={styles.row}>
        <div style={{ ...styles.chartCard, flex: 1 }}>
          <h2 style={styles.chartTitle}>Gender Distribution — Accused</h2>
          <div style={{ height: 220 }}>
            <Doughnut data={accusedGenderData} options={doughnutOpts} />
          </div>
        </div>
        <div style={{ ...styles.chartCard, flex: 1 }}>
          <h2 style={styles.chartTitle}>Gender Distribution — Victims</h2>
          <div style={{ height: 220 }}>
            <Doughnut data={victimGenderData} options={doughnutOpts} />
          </div>
        </div>
      </div>

      {/* Education Level vs Crime */}
      <div style={styles.chartCard}>
        <h2 style={styles.chartTitle}>Education Level vs Crime (Accused Count)</h2>
        <div style={{ height: 260 }}>
          <Bar data={educationData} options={horizontalChartOpts} />
        </div>
      </div>

      {/* Economic Stress Index by District */}
      <div style={styles.chartCard}>
        <h2 style={styles.chartTitle}>Economic Stress Index by District</h2>
        <div style={styles.legendRow}>
          <span style={styles.legendDot('#ef4444')} /> <span style={styles.legendText}>High (&gt;8.0)</span>
          <span style={styles.legendDot('#f59e0b')} /> <span style={styles.legendText}>Moderate (7–8)</span>
          <span style={styles.legendDot('#10b981')} /> <span style={styles.legendText}>Low (&lt;7)</span>
        </div>
        <div style={{ height: 240 }}>
          <Bar data={economicStressData} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } } }} />
        </div>
      </div>

      {/* Key Sociological Findings */}
      <div style={styles.chartCard}>
        <h2 style={styles.chartTitle}>Key Sociological Findings</h2>
        <p style={styles.sectionSubtitle}>Evidence-based insights from field data and socioeconomic analysis</p>
        <div style={styles.insightGrid}>
          {insightCards.map((card, i) => (
            <div key={i} style={styles.insightCard}>
              <div style={styles.insightHeader}>
                <span style={styles.insightIcon}>{card.icon}</span>
                <span style={{ ...styles.badge, ...badgeStyles[card.badgeClass] }}>{card.stat}</span>
              </div>
              <h3 style={styles.insightTitle}>{card.title}</h3>
              <p style={styles.insightText}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Inline styles ──────────────────────────────────────────────────── */

const styles = {
  page: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    color: '#e2e8f0',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  loadingWrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '60vh', gap: '16px',
    backgroundColor: '#0f172a',
  },
  spinner: {
    width: 40, height: 40,
    border: '3px solid rgba(148,163,184,0.2)',
    borderTop: '3px solid #f97316',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: { color: '#94a3b8', fontSize: '14px' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    borderBottom: '1px solid rgba(148,163,184,0.1)', paddingBottom: '16px',
  },
  pageTitle: {
    margin: 0, fontSize: '24px', fontWeight: 700,
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  pageSubtitle: { margin: '4px 0 0', fontSize: '13px', color: '#64748b' },
  headerBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#10b981',
  },
  liveDot: {
    width: 7, height: 7, borderRadius: '50%',
    backgroundColor: '#10b981', display: 'inline-block',
    boxShadow: '0 0 6px #10b981',
  },
  statStrip: {
    display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px',
  },
  statCard: {
    background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.1)',
    borderRadius: '12px', padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: '4px',
    transition: 'border-color 0.2s',
  },
  statValue: { fontSize: '28px', fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: '12px', color: '#94a3b8' },
  chartCard: {
    background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.1)',
    borderRadius: '14px', padding: '20px 24px',
  },
  chartTitle: {
    margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#e2e8f0',
  },
  sectionSubtitle: { margin: '-8px 0 16px', fontSize: '12px', color: '#64748b' },
  row: { display: 'flex', gap: '20px' },
  legendRow: {
    display: 'flex', alignItems: 'center', gap: '8px',
    marginBottom: '12px', fontSize: '12px', color: '#94a3b8',
  },
  legendDot: (color) => ({
    display: 'inline-block', width: 10, height: 10,
    borderRadius: '50%', backgroundColor: color, marginLeft: '12px',
  }),
  legendText: { marginRight: '4px' },
  insightGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px',
  },
  insightCard: {
    background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)',
    borderRadius: '12px', padding: '18px',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  insightHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '10px',
  },
  insightIcon: { fontSize: '24px' },
  insightTitle: { margin: '0 0 8px', fontSize: '14px', fontWeight: 600, color: '#e2e8f0' },
  insightText: { margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 },
  badge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: 700,
  },
};

const badgeStyles = {
  'badge-danger':  { background: 'rgba(239,68,68,0.2)',   color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' },
  'badge-warning': { background: 'rgba(245,158,11,0.2)',  color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)' },
  'badge-medium':  { background: 'rgba(148,163,184,0.15)',color: '#94a3b8', border: '1px solid rgba(148,163,184,0.3)' },
  'badge-info':    { background: 'rgba(59,130,246,0.2)',  color: '#3b82f6', border: '1px solid rgba(59,130,246,0.4)' },
  'badge-high':    { background: 'rgba(239,68,68,0.15)',  color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' },
  'badge-purple':  { background: 'rgba(139,92,246,0.2)',  color: '#a78bfa', border: '1px solid rgba(139,92,246,0.4)' },
};
