import { useState, useEffect } from 'react';

const mockTransactions = [
  { id: 'TXN-2024-001', date: '2024-03-15', amount: 4850000, from: 'SBI ****4521', to: 'HDFC ****8923', bank: 'SBI→HDFC', firLink: 'FIR-2024-BLR-004521', suspicionScore: 94, status: 'Flagged', reason: 'Structured deposits below ₹10L threshold' },
  { id: 'TXN-2024-002', date: '2024-03-14', amount: 2340000, from: 'Axis ****1234', to: 'Paytm Wallet ****5678', bank: 'Axis→Paytm', firLink: 'FIR-2024-MYS-001892', suspicionScore: 87, status: 'Under Review', reason: 'Rapid fund movement to unregistered wallet' },
  { id: 'TXN-2024-003', date: '2024-03-12', amount: 1230000, from: 'HDFC ****7892', to: 'ICICI ****3456', bank: 'HDFC→ICICI', firLink: null, suspicionScore: 72, status: 'Monitoring', reason: 'Unusual transaction pattern — 47 transactions in 2 days' },
  { id: 'TXN-2024-004', date: '2024-03-10', amount: 8920000, from: 'Kotak ****2341', to: 'SBI ****9012', bank: 'Kotak→SBI', firLink: 'FIR-2024-KLG-002341', suspicionScore: 96, status: 'Flagged', reason: 'Amount matches drug seizure value. Cross-border origin.' },
  { id: 'TXN-2024-005', date: '2024-03-08', amount: 560000, from: 'PNB ****8901', to: 'PhonePe ****4123', bank: 'PNB→PhonePe', firLink: null, suspicionScore: 61, status: 'Monitoring', reason: 'Hawala pattern — multiple small amounts to same beneficiary' },
  { id: 'TXN-2024-006', date: '2024-03-07', amount: 3450000, from: 'BOI ****6712', to: 'Crypto Exchange', bank: 'BOI→Crypto', firLink: 'FIR-2024-MNG-001567', suspicionScore: 91, status: 'Flagged', reason: 'Cryptocurrency conversion — likely proceeds laundering' },
  { id: 'TXN-2024-007', date: '2024-03-05', amount: 1780000, from: 'Canara ****3421', to: 'BOB ****7823', bank: 'Canara→BOB', firLink: null, suspicionScore: 68, status: 'Under Review', reason: 'Shell company beneficiary — Registered 3 days ago' },
  { id: 'TXN-2024-008', date: '2024-03-03', amount: 9100000, from: 'HDFC ****2134', to: 'Offshore Account', bank: 'HDFC→Offshore', firLink: 'FIR-2024-BLG-000891', suspicionScore: 98, status: 'Flagged', reason: 'Cross-border transfer to high-risk jurisdiction (Dubai)' },
  { id: 'TXN-2024-009', date: '2024-03-01', amount: 430000, from: 'SBI ****8234', to: 'SBI ****4521', bank: 'SBI→SBI', firLink: null, suspicionScore: 55, status: 'Monitoring', reason: 'Round-trip transaction pattern — potential circular layering' },
  { id: 'TXN-2024-010', date: '2024-02-28', amount: 2120000, from: 'Axis ****9012', to: 'NEFT multiple', bank: 'Axis→Multiple', firLink: 'FIR-2024-TMK-000423', suspicionScore: 83, status: 'Flagged', reason: 'Smurfing — split into 23 transfers below ₹1L each' },
];

const moneyTrailCases = [
  {
    id: 'MT-001', title: 'UPI Fraud Network — Mysuru', amount: '₹48.2 Lakhs', accounts: 14, icon: '📱',
    trail: 'Funds collected from 847 victims via fake UPI QR codes → aggregated in 3 primary accounts (Axis Bank) → split into 14 sub-accounts → converted to USDT cryptocurrency via WazirX → withdrawn through hawala network in Hyderabad.'
  },
  {
    id: 'MT-002', title: 'Drug Money Laundering — NH-48', amount: '₹1.2 Crores', accounts: 8, icon: '💊',
    trail: 'Cash proceeds from drug sales in Tumakuru-Bengaluru corridor → deposited in 8 shell company accounts (registered in Bengaluru) → transferred as "consulting fees" to real estate company in Dubai → laundered through property purchase.'
  },
  {
    id: 'MT-003', title: 'Investment Fraud Ring — Bengaluru', amount: '₹3.6 Crores', accounts: 22, icon: '📈',
    trail: 'Collected from 312 investors as "guaranteed return" scheme → moved through 22 accounts across 7 banks in 3 days → ₹2.1Cr transferred offshore (Singapore), ₹1.5Cr converted to gold → both accused currently absconding.'
  },
];

const networkNodes = [
  { id: 'A', label: 'SBI ****4521', x: 100, y: 160, color: '#ef4444', flagged: true },
  { id: 'B', label: 'HDFC ****8923', x: 250, y: 80, color: '#f97316', flagged: false },
  { id: 'C', label: 'Paytm ****5678', x: 250, y: 240, color: '#f97316', flagged: false },
  { id: 'D', label: 'Crypto Exchange', x: 400, y: 80, color: '#ef4444', flagged: true },
  { id: 'E', label: 'Offshore Account', x: 400, y: 240, color: '#ef4444', flagged: true },
  { id: 'F', label: 'Shell Co ****3421', x: 520, y: 160, color: '#eab308', flagged: false },
];

const networkEdges = [
  { from: 'A', to: 'B', label: '₹48.5L' },
  { from: 'A', to: 'C', label: '₹23.4L' },
  { from: 'B', to: 'D', label: '₹48.5L' },
  { from: 'C', to: 'E', label: '₹23.4L' },
  { from: 'D', to: 'F', label: '₹71.9L' },
  { from: 'E', to: 'F', label: '₹23.4L' },
  { from: 'B', to: 'C', label: '₹12.1L' },
];

function formatAmount(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

function getScoreColor(score) {
  if (score >= 90) return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' };
  if (score >= 70) return { bg: '#ffedd5', color: '#c2410c', border: '#fdba74' };
  if (score >= 60) return { bg: '#fef9c3', color: '#a16207', border: '#fde047' };
  return { bg: '#dcfce7', color: '#15803d', border: '#86efac' };
}

function getStatusStyle(status) {
  switch (status) {
    case 'Flagged': return { bg: '#fee2e2', color: '#b91c1c' };
    case 'Under Review': return { bg: '#dbeafe', color: '#1d4ed8' };
    case 'Monitoring': return { bg: '#f3e8ff', color: '#7c3aed' };
    default: return { bg: '#f3f4f6', color: '#374151' };
  }
}

function getMidpoint(x1, y1, x2, y2) {
  return { mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
}

export default function FinancialCrime() {
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [toast, setToast] = useState(null);
  const [flaggedIds, setFlaggedIds] = useState(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFlag = (txnId) => {
    setFlaggedIds(prev => new Set([...prev, txnId]));
    showToast('Transaction flagged for investigation. Investigating officer notified.');
  };

  const filteredTransactions = filterStatus === 'All'
    ? mockTransactions
    : mockTransactions.filter(t => t.status === filterStatus);

  const nodeMap = Object.fromEntries(networkNodes.map(n => [n.id, n]));

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '4px solid rgba(239,68,68,0.2)',
          borderTop: '4px solid #ef4444',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '14px' }}>Loading Financial Crime Intelligence...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastSlide {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fc-kpi-card {
          background: var(--card-bg, #1e293b);
          border: 1px solid var(--border-color, rgba(255,255,255,0.08));
          border-radius: 12px;
          padding: 20px 24px;
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: fadeInDown 0.4s ease both;
        }
        .fc-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .fc-filter-btn {
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent;
          color: var(--text-secondary, #94a3b8);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
        }
        .fc-filter-btn:hover {
          border-color: rgba(255,255,255,0.3);
          color: #fff;
        }
        .fc-filter-btn.active {
          background: #ef4444;
          border-color: #ef4444;
          color: #fff;
          font-weight: 600;
        }
        .fc-table-row {
          transition: background 0.15s;
        }
        .fc-table-row:hover {
          background: rgba(255,255,255,0.04) !important;
        }
        .fc-flag-btn {
          padding: 4px 12px;
          border-radius: 6px;
          border: 1px solid #ef4444;
          background: rgba(239,68,68,0.1);
          color: #ef4444;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
          white-space: nowrap;
        }
        .fc-flag-btn:hover {
          background: #ef4444;
          color: #fff;
        }
        .fc-flag-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          border-color: #6b7280;
          color: #6b7280;
          background: transparent;
        }
        .fc-open-btn {
          padding: 6px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.18);
          background: transparent;
          color: var(--text-secondary, #94a3b8);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
        }
        .fc-open-btn:hover {
          border-color: #60a5fa;
          color: #60a5fa;
          background: rgba(96,165,250,0.08);
        }
        .fc-card {
          background: var(--card-bg, #1e293b);
          border: 1px solid var(--border-color, rgba(255,255,255,0.08));
          border-radius: 14px;
          padding: 24px;
          animation: fadeInUp 0.45s ease both;
        }
        .fc-node-tooltip {
          pointer-events: none;
        }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: '28px', animation: 'fadeInDown 0.35s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: '0 4px 14px rgba(239,68,68,0.4)'
          }}>💰</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary, #f1f5f9)', letterSpacing: '-0.3px' }}>
              Financial Crime Intelligence
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary, #94a3b8)', marginTop: '2px' }}>
              Transaction monitoring and money trail analysis
            </p>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { icon: '🚨', label: 'Suspicious Transactions', value: '234', badgeColor: '#ef4444', badgeBg: 'rgba(239,68,68,0.15)', delay: '0s' },
          { icon: '💰', label: 'Total Amount Flagged', value: '₹4.8 Cr', badgeColor: '#f59e0b', badgeBg: 'rgba(245,158,11,0.15)', delay: '0.07s' },
          { icon: '🔍', label: 'Active Investigations', value: '12', badgeColor: '#3b82f6', badgeBg: 'rgba(59,130,246,0.15)', delay: '0.14s' },
          { icon: '👤', label: 'Money Mules Identified', value: '47', badgeColor: '#a855f7', badgeBg: 'rgba(168,85,247,0.15)', delay: '0.21s' },
        ].map((kpi) => (
          <div key={kpi.label} className="fc-kpi-card" style={{ animationDelay: kpi.delay }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '22px' }}>{kpi.icon}</span>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                background: kpi.badgeBg, color: kpi.badgeColor, border: `1px solid ${kpi.badgeColor}40`
              }}>LIVE</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary, #f1f5f9)', lineHeight: 1.1 }}>{kpi.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Suspicious Transactions Table */}
      <div className="fc-card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)' }}>
            Suspicious Transactions
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Flagged', 'Under Review', 'Monitoring'].map(f => (
              <button
                key={f}
                className={`fc-filter-btn${filterStatus === f ? ' active' : ''}`}
                onClick={() => setFilterStatus(f)}
              >{f}</button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))' }}>
                {['TXN ID', 'Date', 'Amount', 'From → To', 'Bank', 'FIR Link', 'Score', 'Status', 'Action'].map(col => (
                  <th key={col} style={{
                    padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600,
                    color: 'var(--text-secondary, #64748b)', textTransform: 'uppercase', letterSpacing: '0.6px',
                    whiteSpace: 'nowrap'
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn, idx) => {
                const scoreStyle = getScoreColor(txn.suspicionScore);
                const statusStyle = getStatusStyle(txn.status);
                const isFlagged = flaggedIds.has(txn.id);
                return (
                  <tr
                    key={txn.id}
                    className="fc-table-row"
                    style={{ borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.05))', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
                    title={txn.reason}
                  >
                    <td style={{ padding: '11px 12px', fontFamily: 'monospace', fontSize: '12px', color: '#60a5fa', whiteSpace: 'nowrap' }}>
                      {txn.id}
                    </td>
                    <td style={{ padding: '11px 12px', color: 'var(--text-secondary, #94a3b8)', whiteSpace: 'nowrap' }}>
                      {txn.date}
                    </td>
                    <td style={{ padding: '11px 12px', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)', whiteSpace: 'nowrap' }}>
                      {formatAmount(txn.amount)}
                    </td>
                    <td style={{ padding: '11px 12px', whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px' }}>{txn.from}</span>
                      <span style={{ color: '#ef4444', margin: '0 6px' }}>→</span>
                      <span style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px' }}>{txn.to}</span>
                    </td>
                    <td style={{ padding: '11px 12px', color: 'var(--text-secondary, #94a3b8)', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {txn.bank}
                    </td>
                    <td style={{ padding: '11px 12px', whiteSpace: 'nowrap' }}>
                      {txn.firLink
                        ? <a href="#" style={{ fontFamily: 'monospace', fontSize: '12px', color: '#60a5fa', textDecoration: 'none' }}
                          onClick={e => e.preventDefault()}>{txn.firLink}</a>
                        : <span style={{ color: 'var(--text-secondary, #64748b)' }}>—</span>
                      }
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        minWidth: '44px', padding: '3px 10px', borderRadius: '20px',
                        background: scoreStyle.bg, color: scoreStyle.color, border: `1px solid ${scoreStyle.border}`,
                        fontWeight: 700, fontSize: '12px'
                      }}>{txn.suspicionScore}</span>
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        background: statusStyle.bg, color: statusStyle.color
                      }}>{isFlagged ? 'Flagged' : txn.status}</span>
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <button
                        className="fc-flag-btn"
                        disabled={isFlagged}
                        onClick={() => handleFlag(txn.id)}
                      >
                        {isFlagged ? '✅ Flagged' : '🚩 Flag'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary, #64748b)' }}>
              No transactions match this filter.
            </div>
          )}
        </div>
      </div>

      {/* Transaction Network Visualization */}
      <div className="fc-card" style={{ marginBottom: '28px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '17px', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)' }}>
          Transaction Network Graph
        </h2>
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg
            width="640"
            height="340"
            viewBox="0 0 640 340"
            style={{ display: 'block', margin: '0 auto', minWidth: '540px' }}
          >
            <defs>
              <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
              </marker>
              <marker id="arrowOrange" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#f97316" />
              </marker>
              <radialGradient id="nodeGradRed" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#b91c1c" />
              </radialGradient>
              <radialGradient id="nodeGradOrange" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#c2410c" />
              </radialGradient>
              <radialGradient id="nodeGradYellow" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#a16207" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background grid subtle */}
            <rect width="640" height="340" fill="rgba(0,0,0,0.15)" rx="10" />

            {/* Edges */}
            {networkEdges.map((edge, i) => {
              const from = nodeMap[edge.from];
              const to = nodeMap[edge.to];
              const { mx, my } = getMidpoint(from.x, from.y, to.x, to.y);

              // Offset line endpoints to touch circle edge (r=28)
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const r = 30;
              const x1 = from.x + (dx / dist) * r;
              const y1 = from.y + (dy / dist) * r;
              const x2 = to.x - (dx / dist) * (r + 6);
              const y2 = to.y - (dy / dist) * (r + 6);

              const isRed = from.flagged || to.flagged;
              const strokeColor = isRed ? '#ef4444' : '#f97316';
              const markerId = isRed ? 'arrowRed' : 'arrowOrange';

              return (
                <g key={i}>
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={strokeColor}
                    strokeWidth="1.8"
                    strokeOpacity="0.7"
                    strokeDasharray={isRed ? 'none' : '5,3'}
                    markerEnd={`url(#${markerId})`}
                  />
                  <rect
                    x={mx - 22} y={my - 10}
                    width="44" height="20"
                    rx="4"
                    fill="rgba(15,23,42,0.85)"
                    stroke={strokeColor}
                    strokeWidth="0.6"
                    strokeOpacity="0.5"
                  />
                  <text
                    x={mx} y={my + 4}
                    textAnchor="middle"
                    fill={strokeColor}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="monospace"
                  >{edge.label}</text>
                </g>
              );
            })}

            {/* Nodes */}
            {networkNodes.map(node => {
              const gradId = node.color === '#ef4444' ? 'nodeGradRed' : node.color === '#f97316' ? 'nodeGradOrange' : 'nodeGradYellow';
              const glowColor = node.color === '#ef4444' ? 'rgba(239,68,68,0.5)' : node.color === '#f97316' ? 'rgba(249,115,22,0.4)' : 'rgba(234,179,8,0.4)';

              // Wrap label to 2 lines
              const parts = node.label.split(' ');
              const line1 = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
              const line2 = parts.slice(Math.ceil(parts.length / 2)).join(' ');

              return (
                <g key={node.id} filter="url(#glow)">
                  {/* Glow ring */}
                  <circle cx={node.x} cy={node.y} r="34" fill={glowColor} opacity="0.25" />
                  {/* Main circle */}
                  <circle
                    cx={node.x} cy={node.y} r="28"
                    fill={`url(#${gradId})`}
                    stroke={node.color}
                    strokeWidth="2"
                    strokeOpacity="0.8"
                  />
                  {/* Node ID label */}
                  <text
                    x={node.x} y={node.y - 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="monospace"
                  >{node.id}</text>
                  {/* Node label below */}
                  <text
                    x={node.x} y={node.y + 46}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="9"
                    fontFamily="sans-serif"
                  >{line1}</text>
                  {line2 && (
                    <text
                      x={node.x} y={node.y + 57}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.7)"
                      fontSize="9"
                      fontFamily="sans-serif"
                    >{line2}</text>
                  )}
                  {/* Flagged badge */}
                  {node.flagged && (
                    <text x={node.x + 18} y={node.y - 18} fontSize="12">🚩</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { dot: '#ef4444', label: 'Flagged Account' },
            { dot: '#eab308', label: 'Under Monitoring' },
            { dot: '#22c55e', label: 'Cleared' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary, #94a3b8)' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.dot, display: 'inline-block', boxShadow: `0 0 6px ${item.dot}80` }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Money Trail Section */}
      <div className="fc-card" style={{ marginBottom: '28px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '17px', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)' }}>
          Money Trail Case Studies
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {moneyTrailCases.map((c, idx) => (
            <div key={c.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              animation: 'fadeInUp 0.4s ease both',
              animationDelay: `${idx * 0.08}s`,
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  fontSize: '28px', lineHeight: 1,
                  background: 'rgba(255,255,255,0.07)',
                  width: '44px', height: '44px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>{c.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)', marginBottom: '6px', lineHeight: 1.3 }}>{c.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                      background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)'
                    }}>{c.amount}</span>
                    <span style={{
                      padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)'
                    }}>{c.accounts} accounts</span>
                  </div>
                </div>
              </div>

              {/* Trail text */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '14px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: 'var(--text-secondary, #94a3b8)',
                lineHeight: 1.7,
                wordBreak: 'break-word',
              }}>
                {c.trail}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary, #64748b)', fontFamily: 'monospace' }}>{c.id}</span>
                <button className="fc-open-btn" onClick={() => showToast(`Opening investigation ${c.id}...`)}>
                  Open Investigation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
          background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
          color: '#fff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(239,68,68,0.45), 0 2px 8px rgba(0,0,0,0.4)',
          maxWidth: '340px',
          fontSize: '14px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'toastSlide 0.3s ease both',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <span style={{ fontSize: '18px' }}>🚩</span>
          <span>{toast}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer', fontSize: '16px', padding: '0 0 0 8px', lineHeight: 1
            }}
          >×</button>
        </div>
      )}
    </div>
  );
}
