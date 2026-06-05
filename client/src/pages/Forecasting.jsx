import { useState, useEffect } from 'react';
import { mockForecastAlerts, mockForecastHotspots, forecastingAPI } from '../services/api';

const TIME_PERIODS = [
  { label: 'Next 7 Days', value: 7 },
  { label: 'Next 30 Days', value: 30 },
  { label: 'Next 90 Days', value: 90 },
];

const DISTRICTS = [
  'Bengaluru Urban', 'Mysuru', 'Kalaburagi', 'Hubballi-Dharwad', 'Belagavi',
  'Mangaluru', 'Tumakuru', 'Shivamogga', 'Raichur', 'Vijayapura',
  'Yelahanka', 'Whitefield', 'Dakshina Kannada', 'Uttara Kannada', 'Bidar',
];

const PREDICTED_COUNTS = [487, 156, 142, 128, 119, 108, 94, 87, 76, 71, 52, 47, 38, 29, 24];

function getHotspotColor(count) {
  if (count >= 400) return 'rgba(220,38,38,0.8)';
  if (count >= 120) return 'rgba(249,115,22,0.7)';
  if (count >= 80) return 'rgba(245,158,11,0.6)';
  return 'rgba(16,185,129,0.5)';
}

function getProbabilityColor(prob) {
  if (prob >= 80) return '#ef4444';
  if (prob >= 65) return '#f97316';
  return '#eab308';
}

function getSeverityBorderColor(severity) {
  if (severity === 'critical') return '#ef4444';
  if (severity === 'high') return '#f97316';
  if (severity === 'medium') return '#eab308';
  return '#6b7280';
}

function getSeverityBadgeStyle(severity) {
  if (severity === 'critical') return { background: 'rgba(239,68,68,0.18)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.35)' };
  if (severity === 'high') return { background: 'rgba(249,115,22,0.18)', color: '#f97316', border: '1px solid rgba(249,115,22,0.35)' };
  if (severity === 'medium') return { background: 'rgba(234,179,8,0.18)', color: '#eab308', border: '1px solid rgba(234,179,8,0.35)' };
  return { background: 'rgba(107,114,128,0.18)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.35)' };
}

function getTrendArrow(count) {
  if (count >= 200) return { arrow: '↑↑', color: '#ef4444' };
  if (count >= 100) return { arrow: '↑', color: '#f97316' };
  if (count >= 50) return { arrow: '→', color: '#eab308' };
  return { arrow: '↓', color: '#10b981' };
}

function getCrimeTypeForDistrict(index, hotspots) {
  if (hotspots && hotspots[index] && hotspots[index].crimeType) return hotspots[index].crimeType;
  const types = [
    'Theft & Robbery', 'Online Fraud', 'Drug Offences', 'Vehicle Theft', 'Assault',
    'Chain Snatching', 'Burglary', 'Cybercrime', 'Armed Robbery', 'Land Disputes',
    'Theft', 'Vehicle Theft', 'Assault', 'Drug Offences', 'Fraud',
  ];
  return types[index % types.length];
}

export default function Forecasting() {
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState(30);
  const [alerts, setAlerts] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [toast, setToast] = useState(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts(mockForecastAlerts || []);
      setHotspots(mockForecastHotspots || []);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  function handleGenerateReport() {
    setToast('✅ AI Forecast Report generated and sent to registered email.');
    setTimeout(() => setToast(null), 3000);
  }

  function handleAcknowledge(id) {
    setAcknowledgedAlerts(prev => new Set([...prev, id]));
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Loading AI Forecast Engine...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div style={styles.headerLeft}>
          <div style={styles.headerTitleRow}>
            <span style={styles.aiBadge}>AI Forecast Engine</span>
            <h1 style={styles.pageTitle}>Crime Forecasting &amp; Predictive Analysis</h1>
          </div>
          <p style={styles.pageSubtitle}>
            Machine learning powered predictions for proactive policing across Karnataka
          </p>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.accuracyPill}>87.3% Accuracy</span>
        </div>
      </div>

      {/* Time Period Selector */}
      <div style={styles.timePeriodBar}>
        <span style={styles.timePeriodLabel}>Forecast Period:</span>
        <div style={styles.timePeriodButtons}>
          {TIME_PERIODS.map(tp => (
            <button
              key={tp.value}
              style={timePeriod === tp.value ? styles.timeBtnActive : styles.timeBtnInactive}
              onClick={() => setTimePeriod(tp.value)}
            >
              {tp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={styles.twoCol}>
        {/* LEFT: Alerts + Hotspots */}
        <div style={styles.leftCol}>
          {/* Early Warning Alerts */}
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <h2 style={styles.cardTitle}>⚠️ Early Warning Alerts</h2>
              <span style={styles.countBadge}>{alerts.length} Active</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {alerts.length === 0 ? (
                <p style={styles.emptyText}>No active alerts for this period.</p>
              ) : (
                alerts.map((alert, idx) => {
                  const prob = alert.probability || 89;
                  const probColor = getProbabilityColor(prob);
                  const isAcknowledged = acknowledgedAlerts.has(alert.id || idx);
                  return (
                    <div
                      key={alert.id || idx}
                      style={{
                        ...styles.alertCard,
                        borderLeft: `4px solid ${getSeverityBorderColor(alert.severity)}`,
                        opacity: isAcknowledged ? 0.6 : 1,
                      }}
                    >
                      <div style={styles.alertTopRow}>
                        <span style={{ ...styles.badge, ...getSeverityBadgeStyle(alert.severity) }}>
                          {(alert.severity || 'medium').toUpperCase()}
                        </span>
                        <span style={styles.badgeBlue}>{alert.type || 'Crime Alert'}</span>
                        <span style={{ ...styles.probPill, background: probColor }}>
                          {prob}% probability
                        </span>
                      </div>
                      <div style={styles.alertTitle}>{alert.title || `Alert #${idx + 1}`}</div>
                      <div style={styles.alertDesc}>{alert.description || 'Elevated crime probability detected in this area.'}</div>
                      <div style={styles.alertMeta}>
                        <span>📍 {alert.district || 'Unknown District'}</span>
                        <span style={styles.metaDivider}>•</span>
                        <span>⏱️ {alert.timeframe || 'Within ' + timePeriod + ' days'}</span>
                      </div>
                      <div style={styles.alertBtnRow}>
                        <button
                          style={styles.btnGhostSm}
                          onClick={() => handleAcknowledge(alert.id || idx)}
                          disabled={isAcknowledged}
                        >
                          {isAcknowledged ? '✓ Acknowledged' : '✓ Acknowledge'}
                        </button>
                        <button style={styles.btnSecondarySmall}>→ View Details</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Predicted Hotspots */}
          <div style={{ ...styles.card, marginTop: '20px' }}>
            <div style={styles.cardHeaderRow}>
              <div>
                <h2 style={styles.cardTitle}>🗺️ Predicted Crime Hotspots — Karnataka</h2>
                <p style={styles.cardSubtitle}>AI model prediction for selected time period</p>
              </div>
            </div>
            <div style={styles.hotspotsGrid}>
              {DISTRICTS.map((district, idx) => {
                const count = PREDICTED_COUNTS[idx];
                const bgColor = getHotspotColor(count);
                const trend = getTrendArrow(count);
                const crimeType = getCrimeTypeForDistrict(idx, hotspots);
                return (
                  <div key={district} style={{ ...styles.hotspotCard, background: bgColor }}>
                    <div style={styles.hotspotDistrict}>{district}</div>
                    <div style={styles.hotspotCount}>{count}</div>
                    <div style={styles.hotspotType}>{crimeType}</div>
                    <div style={styles.hotspotTrend}>
                      <span style={{ color: trend.color, fontWeight: 700 }}>{trend.arrow}</span>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginLeft: '4px' }}>trend</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Model Insights */}
        <div style={styles.rightCol}>
          <h2 style={{ ...styles.cardTitle, marginBottom: '12px' }}>🔬 AI Model Insights</h2>

          <div style={styles.insightCard}>
            <div style={styles.insightIcon}>🧠</div>
            <div style={styles.insightTitle}>Model Performance</div>
            <div style={styles.insightText}>
              Gradient Boosting ensemble trained on 5 years of Karnataka crime data. 87.3% accuracy on test set, 91% precision for critical alerts.
            </div>
          </div>

          <div style={{ ...styles.insightCard, marginTop: '14px' }}>
            <div style={styles.insightIcon}>📊</div>
            <div style={styles.insightTitle}>Data Sources</div>
            <div style={styles.insightText}>
              Real-time FIR feeds, historical crime patterns (2018–2024), socioeconomic indicators, weather data, event calendars, gang movement intelligence.
            </div>
          </div>

          <div style={{ ...styles.insightCard, marginTop: '14px' }}>
            <div style={styles.insightIcon}>📐</div>
            <div style={styles.insightTitle}>Confidence Intervals</div>
            <div style={styles.insightText}>
              95% CI for predictions: ±12% for 7-day window, ±18% for 30-day, ±27% for 90-day forecasts. Model retrained weekly with new data.
            </div>
          </div>

          {/* Stats summary */}
          <div style={{ ...styles.insightCard, marginTop: '14px' }}>
            <div style={styles.insightIcon}>📈</div>
            <div style={styles.insightTitle}>Forecast Summary</div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Active Alerts</span>
              <span style={styles.statValue}>{alerts.length}</span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Hotspot Districts</span>
              <span style={styles.statValue}>{DISTRICTS.length}</span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Period</span>
              <span style={styles.statValue}>{timePeriod} days</span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Model Version</span>
              <span style={styles.statValue}>v4.2.1</span>
            </div>
          </div>

          {/* Generate Report */}
          <button style={styles.btnPrimaryLg} onClick={handleGenerateReport}>
            📄 Generate AI Forecast Report
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={styles.toast}>
          {toast}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: '24px',
    minHeight: '100vh',
    color: '#e2e8f0',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'relative',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTop: '3px solid #f97316',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: '14px',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  headerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  aiBadge: {
    background: 'rgba(59,130,246,0.2)',
    color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.4)',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
  pageTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  pageSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#6b7280',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  accuracyPill: {
    background: 'rgba(16,185,129,0.15)',
    color: '#10b981',
    border: '1px solid rgba(16,185,129,0.35)',
    borderRadius: '20px',
    padding: '5px 14px',
    fontSize: '13px',
    fontWeight: 700,
  },
  timePeriodBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  timePeriodLabel: {
    fontSize: '13px',
    color: '#9ca3af',
    fontWeight: 500,
  },
  timePeriodButtons: {
    display: 'flex',
    gap: '8px',
  },
  timeBtnActive: {
    background: '#f97316',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  timeBtnInactive: {
    background: 'rgba(255,255,255,0.05)',
    color: '#9ca3af',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  twoCol: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: '2',
    minWidth: '300px',
  },
  rightCol: {
    flex: '1',
    minWidth: '260px',
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
  },
  cardHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  cardSubtitle: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#6b7280',
  },
  countBadge: {
    background: 'rgba(249,115,22,0.2)',
    color: '#f97316',
    border: '1px solid rgba(249,115,22,0.35)',
    borderRadius: '12px',
    padding: '3px 10px',
    fontSize: '12px',
    fontWeight: 600,
  },
  alertCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px',
    padding: '14px',
    transition: 'all 0.2s',
  },
  alertTopRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: '5px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  badgeBlue: {
    background: 'rgba(59,130,246,0.18)',
    color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: '5px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 600,
  },
  probPill: {
    color: '#fff',
    borderRadius: '12px',
    padding: '2px 10px',
    fontSize: '11px',
    fontWeight: 700,
    marginLeft: 'auto',
  },
  alertTitle: {
    fontWeight: 700,
    fontSize: '15px',
    color: '#f1f5f9',
    marginBottom: '5px',
  },
  alertDesc: {
    fontSize: '13px',
    color: '#9ca3af',
    lineHeight: '1.5',
    marginBottom: '10px',
  },
  alertMeta: {
    display: 'flex',
    gap: '6px',
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  metaDivider: {
    color: '#374151',
  },
  alertBtnRow: {
    display: 'flex',
    gap: '8px',
  },
  btnGhostSm: {
    background: 'transparent',
    color: '#9ca3af',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnSecondarySmall: {
    background: 'rgba(255,255,255,0.07)',
    color: '#e2e8f0',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  hotspotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
  },
  hotspotCard: {
    borderRadius: '10px',
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    cursor: 'pointer',
    transition: 'transform 0.15s',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  hotspotDistrict: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#fff',
    lineHeight: '1.2',
  },
  hotspotCount: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#fff',
    lineHeight: '1',
  },
  hotspotType: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: '1.2',
  },
  hotspotTrend: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  insightCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px',
  },
  insightIcon: {
    fontSize: '20px',
    marginBottom: '8px',
  },
  insightTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: '8px',
  },
  insightText: {
    fontSize: '12px',
    color: '#9ca3af',
    lineHeight: '1.6',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  statValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f97316',
  },
  btnPrimaryLg: {
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    marginTop: '16px',
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '13px',
    textAlign: 'center',
    padding: '20px 0',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: '#059669',
    color: '#fff',
    borderRadius: '10px',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: 600,
    zIndex: 9999,
    boxShadow: '0 8px 24px rgba(5,150,105,0.4)',
    animation: 'slideIn 0.3s ease',
    maxWidth: '360px',
  },
};
