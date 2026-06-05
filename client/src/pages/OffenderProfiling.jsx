import { useState, useEffect } from 'react';
import { mockTopRiskOffenders, mockOffenderProfile, profilingAPI } from '../services/api';

/* ─── Helper: risk colour ─────────────────────────────────────────── */
function getRiskColor(score) {
  if (score >= 90) return '#ef4444';
  if (score >= 75) return '#f97316';
  if (score >= 60) return '#f59e0b';
  return '#10b981';
}

function getRiskLabel(score) {
  if (score >= 90) return 'CRITICAL';
  if (score >= 75) return 'HIGH';
  if (score >= 60) return 'MEDIUM';
  return 'LOW';
}

function getRiskBadgeStyle(score) {
  if (score >= 90) return badgeStyles.critical;
  if (score >= 75) return badgeStyles.high;
  if (score >= 60) return badgeStyles.medium;
  return badgeStyles.low;
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function getOutcomeBadge(outcome = '') {
  const o = outcome.toLowerCase();
  if (o.includes('convict')) return badgeStyles.danger;
  if (o.includes('acquit')) return badgeStyles.medium;
  if (o.includes('large')) return badgeStyles.critical;
  return badgeStyles.info;
}

function getSimilarityStyle(pct) {
  if (pct > 90) return { background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' };
  if (pct > 80) return { background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)' };
  return { background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' };
}

/* ─── Main Component ──────────────────────────────────────────────── */
export default function OffenderProfiling() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOffender, setSelectedOffender] = useState(mockOffenderProfile);
  const [offenders, setOffenders] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffenders(mockTopRiskOffenders || []);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredOffenders = offenders.filter((o) =>
    (o.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading Offender Profiles…</p>
      </div>
    );
  }

  const profile = selectedOffender || mockOffenderProfile;
  const riskColor = getRiskColor(profile.riskScore);

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Offender Profiling</h1>
          <p style={styles.pageSubtitle}>AI-powered behavioral analysis and risk assessment</p>
        </div>
        <div style={styles.aiBadge}>🤖 AI-Assisted</div>
      </div>

      {/* Two-Column Layout */}
      <div style={styles.layout}>
        {/* ── LEFT SIDEBAR ── */}
        <div style={styles.sidebar}>
          {/* Search */}
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search offenders…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List Header */}
          <div style={styles.listHeader}>
            <span style={styles.listTitle}>Top Risk Offenders</span>
            <span style={styles.countBadge}>{filteredOffenders.length}</span>
          </div>

          {/* Offender List */}
          <div style={styles.offenderList}>
            {filteredOffenders.length === 0 && (
              <p style={styles.emptyMsg}>No offenders match your search.</p>
            )}
            {filteredOffenders.map((o) => {
              const isSelected = selectedOffender && selectedOffender.id === o.id;
              return (
                <div
                  key={o.id}
                  style={{
                    ...styles.offenderRow,
                    ...(isSelected ? styles.offenderRowSelected : {}),
                  }}
                  onClick={() => setSelectedOffender(o)}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      ...styles.miniAvatar,
                      background: `linear-gradient(135deg, ${getRiskColor(o.riskScore)}33, ${getRiskColor(o.riskScore)}66)`,
                      border: `1px solid ${getRiskColor(o.riskScore)}55`,
                      color: getRiskColor(o.riskScore),
                    }}
                  >
                    {getInitials(o.name)}
                  </div>

                  {/* Info */}
                  <div style={styles.offenderInfo}>
                    <span style={styles.offenderName}>{o.name}</span>
                    <span style={styles.offenderMeta}>
                      {o.district} · {o.crimeCount} crimes
                    </span>
                    <span style={styles.statusLabel}>{o.status}</span>
                  </div>

                  {/* Risk Badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span
                      style={{
                        ...styles.badge,
                        ...getRiskBadgeStyle(o.riskScore),
                        fontSize: '12px',
                        fontWeight: 800,
                      }}
                    >
                      {o.riskScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT MAIN PANEL ── */}
        <div style={styles.mainPanel}>
          {/* Profile Header Card */}
          <div
            style={{
              ...styles.profileHeader,
              background: `linear-gradient(135deg, rgba(30,41,59,0.95), rgba(${
                profile.riskScore >= 90
                  ? '239,68,68'
                  : profile.riskScore >= 75
                  ? '249,115,22'
                  : '245,158,11'
              },0.08))`,
              borderColor: `${riskColor}33`,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                ...styles.avatar,
                background: `linear-gradient(135deg, ${riskColor}33, ${riskColor}66)`,
                border: `3px solid ${riskColor}88`,
                color: riskColor,
              }}
            >
              {getInitials(profile.name)}
            </div>

            {/* Name & badges */}
            <div style={styles.profileMeta}>
              <h2 style={styles.profileName}>{profile.name}</h2>
              <div style={styles.profileBadgeRow}>
                <span style={{ ...styles.badge, ...badgeStyles.info }}>ID: {profile.id}</span>
                <span
                  style={{
                    ...styles.badge,
                    ...getRiskBadgeStyle(profile.riskScore),
                  }}
                >
                  {profile.status}
                </span>
              </div>
              <div style={styles.profileStats}>
                <div style={styles.profileStat}>
                  <span style={styles.profileStatLabel}>Age</span>
                  <span style={styles.profileStatValue}>{profile.age}</span>
                </div>
                <div style={styles.profileStatDiv} />
                <div style={styles.profileStat}>
                  <span style={styles.profileStatLabel}>District</span>
                  <span style={styles.profileStatValue}>{profile.district}</span>
                </div>
                <div style={styles.profileStatDiv} />
                <div style={styles.profileStat}>
                  <span style={styles.profileStatLabel}>Last Crime</span>
                  <span style={styles.profileStatValue}>{profile.lastCrimeDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Score Section */}
          <div style={styles.card}>
            <div style={styles.riskScoreWrap}>
              <div>
                <div style={{ ...styles.riskNumber, color: riskColor }}>{profile.riskScore}</div>
                <div style={styles.riskDenominator}>/100</div>
              </div>
              <div style={styles.riskDetails}>
                <span style={styles.riskLabel}>RISK SCORE</span>
                <div style={styles.riskBarBg}>
                  <div
                    style={{
                      ...styles.riskBarFill,
                      width: `${profile.riskScore}%`,
                      background: `linear-gradient(90deg, ${riskColor}88, ${riskColor})`,
                    }}
                  />
                </div>
                <span
                  style={{
                    ...styles.badge,
                    ...getRiskBadgeStyle(profile.riskScore),
                    fontSize: '13px',
                    fontWeight: 800,
                    letterSpacing: '1px',
                  }}
                >
                  {getRiskLabel(profile.riskScore)}
                </span>
              </div>
            </div>
          </div>

          {/* Behavioral Summary */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Behavioral Summary</h3>
            <p style={{ ...styles.bodyText, fontStyle: 'italic' }}>{profile.behavioralSummary}</p>
          </div>

          {/* Modus Operandi */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Modus Operandi</h3>
            <ul style={styles.modusList}>
              {(profile.modusList || []).map((item, i) => (
                <li key={i} style={styles.modusItem}>
                  <span style={styles.modusIcon}>🔸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Crime History Timeline */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Crime History Timeline</h3>
            <div style={styles.timeline}>
              {(profile.crimeHistory || []).map((event, i) => (
                <div key={i} style={styles.timelineItem}>
                  <div style={styles.timelineDot} />
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineRow}>
                      <span style={styles.firNumber}>{event.firNumber}</span>
                      <span style={styles.timelineDate}>{event.date}</span>
                      <span
                        style={{
                          ...styles.badge,
                          ...getOutcomeBadge(event.outcome),
                        }}
                      >
                        {event.outcome}
                      </span>
                    </div>
                    <div style={styles.timelineRow2}>
                      <span style={styles.crimeType}>{event.crimeType}</span>
                      <span style={styles.districtLabel}>📍 {event.district}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Cases */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🤖 AI: Similar Past Cases</h3>
            <div style={styles.similarGrid}>
              {(profile.similarCases || []).map((sc, i) => {
                const simPct = sc.similarity || sc.similarityPct || 85;
                return (
                  <div key={i} style={styles.similarCard}>
                    <div style={styles.similarTop}>
                      <span style={styles.firNumber}>{sc.firNumber}</span>
                      <span style={{ ...styles.badge, ...getSimilarityStyle(simPct), fontSize: '11px' }}>
                        {simPct}% match
                      </span>
                    </div>
                    <div style={styles.similarCrimeType}>{sc.crimeType}</div>
                    <div style={styles.similarMeta}>
                      <span>{sc.date}</span>
                      <span
                        style={{
                          ...styles.badge,
                          ...getOutcomeBadge(sc.outcome),
                          fontSize: '10px',
                          padding: '2px 7px',
                        }}
                      >
                        {sc.outcome}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
  aiBadge: {
    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: '20px', padding: '5px 14px', fontSize: '12px', color: '#a78bfa',
    fontWeight: 600,
  },
  layout: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  /* Sidebar */
  sidebar: {
    width: '320px', flexShrink: 0,
    background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.1)',
    borderRadius: '14px', padding: '16px',
    display: 'flex', flexDirection: 'column', gap: '12px',
    position: 'sticky', top: '24px', maxHeight: 'calc(100vh - 120px)',
  },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.15)',
    borderRadius: '8px', padding: '8px 12px',
  },
  searchIcon: { fontSize: '14px', opacity: 0.7 },
  searchInput: {
    background: 'transparent', border: 'none', outline: 'none',
    color: '#e2e8f0', fontSize: '13px', flex: 1,
  },
  listHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  listTitle: { fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  countBadge: {
    background: 'rgba(249,115,22,0.2)', color: '#f97316',
    border: '1px solid rgba(249,115,22,0.4)',
    borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 700,
  },
  offenderList: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' },
  emptyMsg: { color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px 0' },
  offenderRow: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
    border: '1px solid rgba(148,163,184,0.08)',
    background: 'rgba(15,23,42,0.4)',
    transition: 'all 0.18s ease',
  },
  offenderRowSelected: {
    border: '1px solid rgba(249,115,22,0.6)',
    background: 'rgba(249,115,22,0.06)',
  },
  miniAvatar: {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 700, flexShrink: 0,
  },
  offenderInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 },
  offenderName: { fontSize: '13px', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  offenderMeta: { fontSize: '11px', color: '#64748b' },
  statusLabel: { fontSize: '10px', color: '#94a3b8' },
  /* Main Panel */
  mainPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' },
  profileHeader: {
    border: '1px solid', borderRadius: '14px', padding: '24px',
    display: 'flex', gap: '20px', alignItems: 'flex-start',
  },
  avatar: {
    width: 80, height: 80, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '26px', fontWeight: 800, flexShrink: 0,
  },
  profileMeta: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  profileName: { margin: 0, fontSize: '22px', fontWeight: 700, color: '#f1f5f9' },
  profileBadgeRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  profileStats: {
    display: 'flex', alignItems: 'center', gap: '16px',
    background: 'rgba(15,23,42,0.4)', borderRadius: '8px', padding: '10px 16px',
    marginTop: '4px',
  },
  profileStat: { display: 'flex', flexDirection: 'column', gap: '2px' },
  profileStatLabel: { fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  profileStatValue: { fontSize: '13px', fontWeight: 600, color: '#e2e8f0' },
  profileStatDiv: { width: '1px', height: '30px', background: 'rgba(148,163,184,0.15)' },
  card: {
    background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.1)',
    borderRadius: '14px', padding: '20px 24px',
  },
  cardTitle: { margin: '0 0 14px', fontSize: '14px', fontWeight: 600, color: '#e2e8f0' },
  riskScoreWrap: { display: 'flex', alignItems: 'center', gap: '24px' },
  riskNumber: { fontSize: '64px', fontWeight: 900, lineHeight: 1 },
  riskDenominator: { fontSize: '18px', color: '#64748b', lineHeight: 1 },
  riskDetails: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  riskLabel: { fontSize: '11px', color: '#64748b', letterSpacing: '2px', fontWeight: 600 },
  riskBarBg: {
    width: '100%', height: '12px', background: 'rgba(15,23,42,0.6)',
    borderRadius: '6px', overflow: 'hidden',
  },
  riskBarFill: { height: '100%', borderRadius: '6px', transition: 'width 0.8s ease' },
  bodyText: { margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 },
  modusList: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' },
  modusItem: { display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 },
  modusIcon: { fontSize: '12px', marginTop: '2px', flexShrink: 0 },
  /* Timeline */
  timeline: {
    borderLeft: '2px solid rgba(148,163,184,0.15)',
    marginLeft: '8px',
    display: 'flex', flexDirection: 'column', gap: '0',
  },
  timelineItem: {
    display: 'flex', gap: '16px', paddingBottom: '20px',
    position: 'relative', alignItems: 'flex-start',
  },
  timelineDot: {
    position: 'absolute', left: '-9px', top: '4px',
    width: 14, height: 14, borderRadius: '50%',
    background: '#f97316', border: '2px solid #0f172a',
    flexShrink: 0,
  },
  timelineContent: {
    marginLeft: '16px', flex: 1,
    background: 'rgba(15,23,42,0.4)', borderRadius: '8px',
    padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px',
  },
  timelineRow: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  timelineRow2: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  firNumber: { fontFamily: "'Courier New', monospace", fontSize: '12px', color: '#f97316', fontWeight: 700 },
  timelineDate: { fontSize: '11px', color: '#64748b' },
  crimeType: { fontSize: '13px', color: '#e2e8f0', fontWeight: 500 },
  districtLabel: { fontSize: '11px', color: '#64748b' },
  /* Similar Cases */
  similarGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' },
  similarCard: {
    background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.1)',
    borderRadius: '10px', padding: '14px',
    display: 'flex', flexDirection: 'column', gap: '8px',
    transition: 'border-color 0.2s',
  },
  similarTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  similarCrimeType: { fontSize: '13px', color: '#e2e8f0', fontWeight: 500 },
  similarMeta: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: '11px', color: '#64748b',
  },
  badge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: 700,
  },
};

const badgeStyles = {
  critical: { background: 'rgba(239,68,68,0.25)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.5)' },
  high:     { background: 'rgba(249,115,22,0.2)', color: '#f97316', border: '1px solid rgba(249,115,22,0.4)' },
  medium:   { background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)' },
  low:      { background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' },
  danger:   { background: 'rgba(239,68,68,0.2)',  color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' },
  info:     { background: 'rgba(59,130,246,0.2)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.4)' },
};
