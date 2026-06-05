import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

const mockFIRs = [
  { id: 'FIR-2024-BLR-004521', type: 'Chain Snatching', status: 'Under Investigation', date: '2024-03-12', district: 'Bengaluru Urban', ps: 'Koramangala PS' },
  { id: 'FIR-2024-MYS-001892', type: 'Online Fraud', status: 'Chargesheet Filed', date: '2024-02-28', district: 'Mysuru', ps: 'Mysuru North PS' },
  { id: 'FIR-2024-HUB-000734', type: 'Robbery', status: 'Solved', date: '2024-02-14', district: 'Hubballi', ps: 'Hubballi City PS' },
  { id: 'FIR-2024-KLG-002341', type: 'Drug Trafficking', status: 'Under Investigation', date: '2024-03-05', district: 'Kalaburagi', ps: 'Kalaburagi South PS' },
  { id: 'FIR-2024-BLR-003892', type: 'Vehicle Theft', status: 'Pending', date: '2024-03-08', district: 'Bengaluru Urban', ps: 'Whitefield PS' },
  { id: 'FIR-2024-MNG-001567', type: 'Armed Robbery', status: 'Chargesheet Filed', date: '2024-02-19', district: 'Mangaluru', ps: 'Mangaluru Port PS' },
  { id: 'FIR-2024-BLG-000891', type: 'Assault', status: 'Solved', date: '2024-01-30', district: 'Belagavi', ps: 'Belagavi City PS' },
  { id: 'FIR-2024-TMK-000423', type: 'Cybercrime', status: 'Under Investigation', date: '2024-03-15', district: 'Tumakuru', ps: 'Tumakuru Urban PS' },
];

const defaultCase = {
  id: 'FIR-2024-BLR-004521',
  type: 'Chain Snatching',
  status: 'Under Investigation',
  date: '2024-03-12',
  district: 'Bengaluru Urban',
  ps: 'Koramangala PS',
  summary: 'On 12th March 2024 at approximately 19:45 hours, the complainant Sunitha Devi (34F) was walking near Koramangala 4th Block when two unidentified persons on a motorcycle snatched her gold chain valued at ₹1,20,000. The suspects fled towards Sony World Signal. CCTV footage from nearby commercial establishments has been secured. One suspect has been identified as Ramesh Naik (ACC-2891), a known repeat offender with 3 prior chain snatching cases. A lookout notice has been issued.',
  timeline: [
    { date: '12 Mar 2024, 19:45', event: 'FIR Registered', detail: 'Complainant filed FIR at Koramangala PS. Initial statement recorded.', icon: '📋', status: 'done' },
    { date: '13 Mar 2024, 11:00', event: 'Scene Inspection', detail: 'Crime scene inspected. CCTV footage from 4 cameras secured from nearby establishments.', icon: '🔍', status: 'done' },
    { date: '14 Mar 2024, 14:30', event: 'Witness Statement', detail: 'Two eyewitnesses identified. Descriptions of suspects and motorcycle (KA-05-MX-3421) recorded.', icon: '👤', status: 'done' },
    { date: '15 Mar 2024, 09:00', event: 'Evidence Collected', detail: 'CCTV footage analyzed. Suspect face partially visible. Motorcycle registration traced to stolen vehicle.', icon: '🧪', status: 'done' },
    { date: '18 Mar 2024, 16:00', event: 'Suspect Identified', detail: 'ACC-2891 (Ramesh Naik) identified from CCTV and prior MO match. Lookout notice issued.', icon: '⚠️', status: 'active' },
    { date: 'Pending', event: 'Arrest', detail: 'Suspect at large. Multiple raid attempts unsuccessful. Surveillance ongoing.', icon: '🚔', status: 'pending' },
  ],
  accused: { name: 'Ramesh Naik', id: 'ACC-2891', risk: 'HIGH', age: 28, district: 'Bengaluru Urban', priors: 3 },
  victim: { name: 'Sunitha Devi', age: 34, gender: 'Female', occupation: 'Software Engineer', contact: '9876543210' },
  similarCases: [
    { id: 'FIR-2024-BLR-003241', similarity: 94, type: 'Chain Snatching', date: '2024-02-03', outcome: 'Solved — Accused Arrested', district: 'Bengaluru Urban' },
    { id: 'FIR-2023-BLR-009812', similarity: 87, type: 'Chain Snatching', date: '2023-11-28', outcome: 'Chargesheet Filed', district: 'Bengaluru Urban' },
    { id: 'FIR-2023-MYS-004521', similarity: 79, type: 'Bag Theft on Motorcycle', date: '2023-09-15', outcome: 'Acquitted', district: 'Mysuru' },
  ],
  leads: [
    { id: 1, icon: '📹', title: 'Analyze CCTV Footage', desc: 'Review remaining footage from Koramangala Signal camera (06:00–20:00 on March 12). Suspect visible in 3 frames.', action: 'View Footage', priority: 'high' },
    { id: 2, icon: '📱', title: 'Mobile Tower Analysis', desc: 'Request CDR from BSNL/Airtel for suspect last known number. Tower dump near crime scene available.', action: 'Request CDR', priority: 'high' },
    { id: 3, icon: '🏍️', title: 'Vehicle Trace', desc: 'Motorcycle KA-05-MX-3421 reported stolen from Jayanagar on March 8. Check scrapping yards and garages.', action: 'Issue Alert', priority: 'medium' },
    { id: 4, icon: '🤝', title: 'Informer Network', desc: "Activate informers in Rajajinagar and Magadi Road areas — suspect's known haunts per historical patterns.", action: 'Activate', priority: 'medium' },
  ],
};

function getStatusStyle(status) {
  if (status === 'Under Investigation') return { background: 'rgba(249,115,22,0.18)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' };
  if (status === 'Chargesheet Filed') return { background: 'rgba(59,130,246,0.18)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' };
  if (status === 'Solved') return { background: 'rgba(16,185,129,0.18)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' };
  if (status === 'Pending') return { background: 'rgba(107,114,128,0.18)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.3)' };
  return { background: 'rgba(107,114,128,0.18)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.3)' };
}

function getSimilarityStyle(sim) {
  if (sim >= 90) return { background: '#059669', color: '#fff' };
  if (sim >= 80) return { background: '#d97706', color: '#fff' };
  return { background: '#9a3412', color: '#fff' };
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function CaseInvestigation() {
  const [loading, setLoading] = useState(true);
  const [selectedFIR, setSelectedFIR] = useState(mockFIRs[0]);
  const [selectedCase, setSelectedCase] = useState(defaultCase);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAISummary, setShowAISummary] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  function handleSelectFIR(fir) {
    setSelectedFIR(fir);
    // For demo: always show defaultCase but update header info from selected FIR
    setSelectedCase({
      ...defaultCase,
      id: fir.id,
      type: fir.type,
      status: fir.status,
      date: fir.date,
      district: fir.district,
      ps: fir.ps,
    });
    setShowAISummary(true);
  }

  const filteredFIRs = mockFIRs.filter(f =>
    f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Loading Case Investigation...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        {/* LEFT SIDEBAR */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>🗂️ Recent FIRs</h2>
          <input
            style={styles.searchInput}
            placeholder="Search FIR number or type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div style={styles.firList}>
            {filteredFIRs.map(fir => (
              <div
                key={fir.id}
                style={{
                  ...styles.firItem,
                  ...(selectedFIR.id === fir.id ? styles.firItemActive : {}),
                }}
                onClick={() => handleSelectFIR(fir)}
              >
                <div style={styles.firId}>{fir.id}</div>
                <div style={styles.firType}>{fir.type}</div>
                <div style={styles.firMeta}>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(fir.status) }}>{fir.status}</span>
                </div>
                <div style={styles.firBottom}>
                  <span style={styles.firDistrict}>📍 {fir.district}</span>
                  <span style={styles.firDate}>{fir.date}</span>
                </div>
              </div>
            ))}
            {filteredFIRs.length === 0 && (
              <p style={styles.emptyText}>No FIRs match your search.</p>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div style={styles.content}>
          {/* Case Header */}
          <div style={styles.card}>
            <div style={styles.caseHeaderRow}>
              <div style={styles.caseHeaderLeft}>
                <div style={styles.caseId}>{selectedCase.id}</div>
                <div style={styles.caseHeaderBadges}>
                  <span style={styles.typeBadge}>{selectedCase.type}</span>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(selectedCase.status) }}>{selectedCase.status}</span>
                </div>
                <div style={styles.caseMeta}>
                  <span>📅 Filed: {selectedCase.date}</span>
                  <span style={styles.metaDivider}>•</span>
                  <span>📍 {selectedCase.district}</span>
                  <span style={styles.metaDivider}>•</span>
                  <span>🏢 {selectedCase.ps}</span>
                </div>
              </div>
              <button
                style={styles.btnSecondary}
                onClick={() => setShowAISummary(v => !v)}
              >
                🤖 AI Summary
              </button>
            </div>
          </div>

          {/* AI Case Summary */}
          {showAISummary && (
            <div style={{ ...styles.card, marginTop: '16px', borderLeft: '3px solid #f97316' }}>
              <div style={styles.aiSummaryLabel}>🤖 AI-Generated Case Summary</div>
              <p style={styles.aiSummaryText}>{selectedCase.summary}</p>
            </div>
          )}

          {/* Investigation Timeline */}
          <div style={{ ...styles.card, marginTop: '16px' }}>
            <h3 style={styles.sectionTitle}>🕐 Investigation Timeline</h3>
            <div style={styles.timeline}>
              {selectedCase.timeline.map((item, idx) => (
                <div key={idx} style={styles.timelineItem}>
                  <div style={styles.timelineLeft}>
                    <div style={{
                      ...styles.timelineNode,
                      ...(item.status === 'done' ? styles.nodesDone : item.status === 'active' ? styles.nodeActive : styles.nodePending),
                    }}>
                      {item.icon}
                    </div>
                    {idx < selectedCase.timeline.length - 1 && (
                      <div style={{
                        ...styles.timelineLine,
                        background: item.status === 'done' ? '#059669' : 'rgba(255,255,255,0.08)',
                      }} />
                    )}
                  </div>
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineDate}>{item.date}</div>
                    <div style={styles.timelineEvent}>{item.event}</div>
                    <div style={styles.timelineDetail}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accused + Victim */}
          <div style={{ ...styles.twoColGrid, marginTop: '16px' }}>
            {/* Accused */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>⚠️ Accused Profile</h3>
              <div style={styles.profileRow}>
                <div style={styles.avatarRed}>{getInitials(selectedCase.accused.name)}</div>
                <div style={styles.profileInfo}>
                  <div style={styles.profileName}>{selectedCase.accused.name}</div>
                  <div style={styles.profileId}>{selectedCase.accused.id}</div>
                  <div style={styles.profileMeta}>
                    <span>Age: {selectedCase.accused.age}</span>
                    <span style={styles.metaDivider}>•</span>
                    <span>{selectedCase.accused.district}</span>
                  </div>
                </div>
              </div>
              <div style={styles.profileBadgeRow}>
                <span style={styles.riskBadge}>⚡ {selectedCase.accused.risk} RISK</span>
                <span style={styles.priorsBadge}>Prior Cases: {selectedCase.accused.priors}</span>
              </div>
            </div>

            {/* Victim */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>👤 Victim Profile</h3>
              <div style={styles.profileRow}>
                <div style={styles.avatarBlue}>{getInitials(selectedCase.victim.name)}</div>
                <div style={styles.profileInfo}>
                  <div style={styles.profileName}>{selectedCase.victim.name}</div>
                  <div style={styles.profileMeta}>
                    <span>Age: {selectedCase.victim.age}</span>
                    <span style={styles.metaDivider}>•</span>
                    <span>{selectedCase.victim.gender}</span>
                  </div>
                  <div style={styles.profileOccupation}>{selectedCase.victim.occupation}</div>
                </div>
              </div>
              <div style={styles.victimContactRow}>
                <span style={styles.contactLabel}>📞 Contact:</span>
                <span style={styles.contactValue}>{selectedCase.victim.contact}</span>
              </div>
            </div>
          </div>

          {/* Similar Cases */}
          <div style={{ ...styles.card, marginTop: '16px' }}>
            <h3 style={styles.sectionTitle}>🔗 Similar Cases — AI Pattern Match</h3>
            <div style={styles.similarCasesGrid}>
              {selectedCase.similarCases.map((sc, idx) => (
                <div key={idx} style={styles.similarCard}>
                  <div style={styles.similarTopRow}>
                    <span style={styles.similarId}>{sc.id}</span>
                    <span style={{ ...styles.simPill, ...getSimilarityStyle(sc.similarity) }}>{sc.similarity}% match</span>
                  </div>
                  <div style={styles.similarType}>{sc.type}</div>
                  <div style={styles.similarDate}>📅 {sc.date} • 📍 {sc.district}</div>
                  <div style={styles.outcomeBadge}>{sc.outcome}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Investigative Leads */}
          <div style={{ ...styles.card, marginTop: '16px' }}>
            <h3 style={styles.sectionTitle}>🧠 AI Investigative Leads</h3>
            <div style={styles.leadsGrid}>
              {selectedCase.leads.map(lead => (
                <div key={lead.id} style={styles.leadCard}>
                  <div style={styles.leadTopRow}>
                    <span style={styles.leadIcon}>{lead.icon}</span>
                    <span style={lead.priority === 'high' ? styles.priorityHigh : styles.priorityMedium}>
                      {lead.priority === 'high' ? '🔴 HIGH' : '🟡 MEDIUM'}
                    </span>
                  </div>
                  <div style={styles.leadTitle}>{lead.title}</div>
                  <div style={styles.leadDesc}>{lead.desc}</div>
                  <button style={styles.btnPrimarySmall}>{lead.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '24px',
    minHeight: '100vh',
    color: '#e2e8f0',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  layout: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
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
  sidebar: {
    width: '280px',
    flexShrink: 0,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px',
    position: 'sticky',
    top: '24px',
  },
  sidebarTitle: {
    margin: '0 0 12px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  searchInput: {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#e2e8f0',
    outline: 'none',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  firList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
  },
  firItem: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  firItemActive: {
    border: '1px solid rgba(249,115,22,0.6)',
    background: 'rgba(249,115,22,0.07)',
  },
  firId: {
    fontFamily: "'Fira Code', 'Consolas', monospace",
    fontSize: '11px',
    color: '#f97316',
    fontWeight: 600,
    marginBottom: '4px',
  },
  firType: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f1f5f9',
    marginBottom: '6px',
  },
  firMeta: {
    marginBottom: '6px',
  },
  firBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  firDistrict: {
    fontSize: '11px',
    color: '#6b7280',
  },
  firDate: {
    fontSize: '11px',
    color: '#6b7280',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
  },
  caseHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
  },
  caseHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  caseId: {
    fontFamily: "'Fira Code', 'Consolas', monospace",
    fontSize: '20px',
    fontWeight: 800,
    color: '#f97316',
    letterSpacing: '0.5px',
  },
  caseHeaderBadges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  typeBadge: {
    background: 'rgba(59,130,246,0.18)',
    color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '12px',
    fontWeight: 600,
  },
  statusBadge: {
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: 600,
  },
  caseMeta: {
    display: 'flex',
    gap: '6px',
    fontSize: '12px',
    color: '#6b7280',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaDivider: {
    color: '#374151',
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.07)',
    color: '#e2e8f0',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  aiSummaryLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#f97316',
    marginBottom: '10px',
  },
  aiSummaryText: {
    fontSize: '13px',
    color: '#9ca3af',
    lineHeight: '1.7',
    margin: 0,
  },
  sectionTitle: {
    margin: '0 0 16px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
  },
  timelineLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  timelineNode: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
    zIndex: 1,
  },
  nodesDone: {
    background: 'rgba(16,185,129,0.2)',
    border: '2px solid #059669',
  },
  nodeActive: {
    background: 'rgba(249,115,22,0.2)',
    border: '2px solid #f97316',
    boxShadow: '0 0 10px rgba(249,115,22,0.4)',
  },
  nodePending: {
    background: 'rgba(107,114,128,0.15)',
    border: '2px solid rgba(107,114,128,0.3)',
  },
  timelineLine: {
    width: '2px',
    flex: 1,
    minHeight: '16px',
    margin: '2px 0',
  },
  timelineContent: {
    paddingBottom: '20px',
    flex: 1,
    paddingTop: '6px',
  },
  timelineDate: {
    fontSize: '11px',
    color: '#6b7280',
    marginBottom: '2px',
  },
  timelineEvent: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  timelineDetail: {
    fontSize: '12px',
    color: '#9ca3af',
    lineHeight: '1.5',
  },
  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  profileRow: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    marginBottom: '14px',
  },
  avatarRed: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #991b1b, #ef4444)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 800,
    color: '#fff',
    flexShrink: 0,
  },
  avatarBlue: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 800,
    color: '#fff',
    flexShrink: 0,
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  profileName: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  profileId: {
    fontFamily: "'Fira Code', 'Consolas', monospace",
    fontSize: '12px',
    color: '#f97316',
  },
  profileMeta: {
    display: 'flex',
    gap: '6px',
    fontSize: '12px',
    color: '#6b7280',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  profileOccupation: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  profileBadgeRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  riskBadge: {
    background: 'rgba(239,68,68,0.18)',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.35)',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: 700,
  },
  priorsBadge: {
    background: 'rgba(239,68,68,0.12)',
    color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: 600,
  },
  victimContactRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    padding: '8px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  contactLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  contactValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#60a5fa',
    fontFamily: "'Fira Code', 'Consolas', monospace",
  },
  similarCasesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  similarCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  similarTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'wrap',
  },
  similarId: {
    fontFamily: "'Fira Code', 'Consolas', monospace",
    fontSize: '10px',
    color: '#9ca3af',
  },
  simPill: {
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 700,
  },
  similarType: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f1f5f9',
  },
  similarDate: {
    fontSize: '11px',
    color: '#6b7280',
  },
  outcomeBadge: {
    fontSize: '11px',
    color: '#9ca3af',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
    padding: '3px 8px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  leadsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  leadCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  leadTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadIcon: {
    fontSize: '22px',
  },
  priorityHigh: {
    background: 'rgba(239,68,68,0.18)',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '5px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: 700,
  },
  priorityMedium: {
    background: 'rgba(234,179,8,0.18)',
    color: '#eab308',
    border: '1px solid rgba(234,179,8,0.3)',
    borderRadius: '5px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: 700,
  },
  leadTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f1f5f9',
  },
  leadDesc: {
    fontSize: '12px',
    color: '#9ca3af',
    lineHeight: '1.5',
    flex: 1,
  },
  btnPrimarySmall: {
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '7px 14px',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(249,115,22,0.25)',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '12px',
    textAlign: 'center',
    padding: '16px 0',
  },
};
