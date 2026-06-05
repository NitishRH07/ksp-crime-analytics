// Central API service — connects to backend functions
// In demo mode, falls back to mock data

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const isMockMode = !BASE_URL || BASE_URL === '';

// ─────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────
export const authAPI = {
  login: async (email, password, role) => {
    if (isMockMode) {
      const demoUsers = {
        'investigator@ksp.gov.in': { id: 'U001', name: 'Ravi Kumar S', role: 'investigator', district: 'Bengaluru Urban', badge: 'KSP-INV-2341', email: 'investigator@ksp.gov.in' },
        'analyst@ksp.gov.in':      { id: 'U002', name: 'Priya Venkatesh', role: 'analyst', district: 'State HQ', badge: 'KSP-ANL-1892', email: 'analyst@ksp.gov.in' },
        'supervisor@ksp.gov.in':   { id: 'U003', name: 'DCP Anand Patil', role: 'supervisor', district: 'Bengaluru Urban', badge: 'KSP-SUP-0234', email: 'supervisor@ksp.gov.in' },
        'policy@ksp.gov.in':       { id: 'U004', name: 'Smt. Kavitha Rao', role: 'policymaker', district: 'State HQ', badge: 'KSP-POL-0012', email: 'policy@ksp.gov.in' },
        'admin@ksp.gov.in':        { id: 'U005', name: 'Admin User', role: 'admin', district: 'State HQ', badge: 'KSP-ADM-0001', email: 'admin@ksp.gov.in' },
      };
      if (demoUsers[email] && password === 'demo123') {
        return { success: true, user: demoUsers[email], token: 'mock-token-' + Date.now() };
      }
      return { success: false, error: 'Invalid credentials. Use demo123 as password.' };
    }
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return res.json();
  }
};

// ─────────────────────────────────────────
//  CHAT
// ─────────────────────────────────────────
export const chatAPI = {
  sendMessage: async (message, sessionId, language = 'en') => {
    if (isMockMode) {
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
      return generateMockChatResponse(message, language);
    }
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId, language })
    });
    return res.json();
  }
};

// ─────────────────────────────────────────
//  ANALYTICS
// ─────────────────────────────────────────
export const analyticsAPI = {
  getKPIs: async () => {
    if (isMockMode) return mockKPIs;
    const res = await fetch(`${BASE_URL}/api/analytics/kpis`);
    return res.json();
  },
  getTrends: async () => {
    if (isMockMode) return mockTrends;
    const res = await fetch(`${BASE_URL}/api/analytics/trends`);
    return res.json();
  },
  getHotspots: async () => {
    if (isMockMode) return mockHotspots;
    const res = await fetch(`${BASE_URL}/api/analytics/hotspots`);
    return res.json();
  },
  getByDistrict: async () => {
    if (isMockMode) return mockByDistrict;
    const res = await fetch(`${BASE_URL}/api/analytics/by-district`);
    return res.json();
  },
  getByType: async () => {
    if (isMockMode) return mockByType;
    const res = await fetch(`${BASE_URL}/api/analytics/by-type`);
    return res.json();
  },
  getAlerts: async () => {
    if (isMockMode) return mockAlerts;
    const res = await fetch(`${BASE_URL}/api/analytics/recent-alerts`);
    return res.json();
  },
};

// ─────────────────────────────────────────
//  NETWORK
// ─────────────────────────────────────────
export const networkAPI = {
  getGraph: async (accusedId = null, depth = 2) => {
    if (isMockMode) return mockNetworkGraph;
    const res = await fetch(`${BASE_URL}/api/network/graph?accused_id=${accusedId}&depth=${depth}`);
    return res.json();
  },
  searchAccused: async (q) => {
    if (isMockMode) return mockAccusedList.filter(a => a.name.toLowerCase().includes(q.toLowerCase()));
    const res = await fetch(`${BASE_URL}/api/network/search?q=${encodeURIComponent(q)}`);
    return res.json();
  },
  getAccused: async (id) => {
    if (isMockMode) return mockAccusedList.find(a => a.id === id) || mockAccusedList[0];
    const res = await fetch(`${BASE_URL}/api/network/accused/${id}`);
    return res.json();
  },
};

// ─────────────────────────────────────────
//  PROFILING
// ─────────────────────────────────────────
export const profilingAPI = {
  getTopRisk: async () => {
    if (isMockMode) return mockTopRiskOffenders;
    const res = await fetch(`${BASE_URL}/api/profiling/top-risk`);
    return res.json();
  },
  getOffender: async (id) => {
    if (isMockMode) return mockOffenderProfile;
    const res = await fetch(`${BASE_URL}/api/profiling/offender/${id}`);
    return res.json();
  },
};

// ─────────────────────────────────────────
//  FORECASTING
// ─────────────────────────────────────────
export const forecastingAPI = {
  getAlerts: async () => {
    if (isMockMode) return mockForecastAlerts;
    const res = await fetch(`${BASE_URL}/api/forecast/alerts`);
    return res.json();
  },
  getHotspots: async (days = 30) => {
    if (isMockMode) return mockForecastHotspots;
    const res = await fetch(`${BASE_URL}/api/forecast/hotspots?days=${days}`);
    return res.json();
  },
};

// ─────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────

function generateMockChatResponse(message, language) {
  const msg = message.toLowerCase();
  let response = '';
  let citations = [];

  if (msg.includes('fir') || msg.includes('case') || msg.includes('ಪ್ರಕರಣ')) {
    response = language === 'kn'
      ? `**FIR ವಿವರಗಳು:**\n\nFIR-2024-BLR-004521 - ಬ್ಯಾಗ್ ಕಳ್ಳತನ, ಕೋರಮಂಗಲ, ಬೆಂಗಳೂರು\n• ದಿನಾಂಕ: 12 ಮಾರ್ಚ್ 2024\n• ಶಂಕಿತ: ರಮೇಶ್ ನಾಯ್ಕ್ (ಹಿಂದಿನ 3 ಅಪರಾಧಗಳು)\n• ಸ್ಥಿತಿ: ತನಿಖೆ ನಡೆಯುತ್ತಿದೆ\n\nFIR-2024-MYS-001892 - ವಂಚನೆ, ಮೈಸೂರು\n• ₹4.2 ಲಕ್ಷ ವಂಚನೆ\n• ಸ್ಥಿತಿ: ಆರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಸಲಾಗಿದೆ`
      : `**FIR Search Results:**\n\nFound **3 FIRs** matching your query:\n\n📋 **FIR-2024-BLR-004521** — Chain Snatching, Koramangala, Bengaluru\n• Filed: 12 Mar 2024 | Status: **Under Investigation**\n• Accused: Ramesh Naik (3 prior offenses) — **High Risk**\n• Victim: Sunitha Devi, 34F, Software Engineer\n\n📋 **FIR-2024-MYS-001892** — Online Fraud, Mysuru\n• Amount Defrauded: ₹4.2 Lakhs | Status: **Chargesheet Filed**\n• Modus Operandi: Fake investment scheme via WhatsApp\n\n📋 **FIR-2024-HUB-000734** — Robbery, Hubballi\n• Status: **Solved** — Accused arrested 14 Mar 2024`;
    citations = ['FIR-2024-BLR-004521', 'FIR-2024-MYS-001892', 'FIR-2024-HUB-000734'];
  } else if (msg.includes('hotspot') || msg.includes('area') || msg.includes('location')) {
    response = `**Crime Hotspot Analysis — Bengaluru Urban (Last 30 Days):**\n\n🔴 **High Intensity Zones:**\n1. **Whitefield** — 47 incidents (↑23% vs prev month)\n   *Primary crime types: Theft, Vehicle Theft, Cybercrime*\n2. **KR Puram** — 41 incidents\n   *Primary crime types: Robbery, Assault*\n3. **Electronic City** — 38 incidents\n   *Primary crime types: Chain Snatching, Bag Theft*\n\n🟡 **Emerging Hotspots:**\n4. **Yelahanka** — 29 incidents (↑41% — rapidly increasing)\n5. **Hebbal** — 25 incidents\n\n💡 **Intelligence Insight:** Whitefield spike correlates with new residential complexes and inadequate street lighting. Recommend additional patrolling 8PM–12AM.`;
    citations = ['Analytics-Hotspot-2024Q1', 'District-BLR-Report'];
  } else if (msg.includes('accused') || msg.includes('suspect') || msg.includes('offender')) {
    response = `**Accused Profile:**\n\n👤 **Ramesh Naik** (Accused ID: ACC-2891)\n• Age: 28 | Gender: Male\n• Last known address: Rajajinagar, Bengaluru\n• **Risk Score: 82/100 (HIGH)**\n\n📊 **Criminal History:**\n• 2019: Theft — Sentenced 6 months\n• 2021: Robbery — Acquitted (lack of evidence)\n• 2022: Chain Snatching — Bail pending trial\n• 2024: Chain Snatching — **Currently under investigation**\n\n🔗 **Network Links:**\n• Associated with 2 known gang members\n• Shares MO with North Bengaluru theft ring\n\n⚠️ **Investigative Recommendation:** Cross-reference with CCTV footage from Koramangala Sector 4 between 6PM-9PM on March 12.`;
    citations = ['ACC-2891', 'FIR-2024-BLR-004521', 'Network-Analysis'];
  } else if (msg.includes('trend') || msg.includes('pattern') || msg.includes('statistics')) {
    response = `**Karnataka State Crime Trends — Q1 2024:**\n\n📈 **Overall Crime Rate:** +8.3% vs Q1 2023\n\n**Top Trending Crime Types:**\n1. 🔺 **Cybercrime** — +42% (highest growth)\n   *Mostly online fraud, UPI scams, fake job offers*\n2. 🔺 **Vehicle Theft** — +18%\n3. 🔻 **Robbery** — -12% (improved patrolling)\n4. 🔺 **Domestic Violence** — +7%\n\n**Peak Crime Hours:** 8PM – 11PM (34% of all incidents)\n**Peak Day:** Saturday (18% higher than weekday avg)\n\n💡 **Insight:** Cybercrime surge is driven by unemployed youth targeting elderly. Recommend cyber awareness campaigns in Tier 2 cities.`;
    citations = ['State-Q1-2024-Report', 'Crime-Trend-Analysis'];
  } else if (msg.includes('predict') || msg.includes('forecast') || msg.includes('next')) {
    response = `**Crime Forecast — Next 30 Days:**\n\n🔮 **AI Prediction (87% confidence):**\n\n⚠️ **HIGH ALERT Zones:**\n• **Whitefield, Bengaluru** — Predicted 52 incidents (+11%)\n  *Trigger: Festival season, historical patterns*\n• **Kalaburagi** — Robbery cluster likely\n  *Based on gang movement intelligence*\n\n📊 **Projected Statewide:**\n• Total predicted incidents: 4,280 (±180)\n• Cybercrime likely to remain highest category\n• Drug trafficking routes: NH-48 corridor watch\n\n🛡️ **Recommended Pre-emptive Actions:**\n1. Deploy 2 additional mobile patrol units in Whitefield\n2. Coordinate with Kalaburagi SP for gang surveillance\n3. Issue public advisory on festival season safety`;
    citations = ['Forecast-Model-v2.1', 'Historical-Pattern-2020-2024'];
  } else {
    response = language === 'kn'
      ? `ನಮಸ್ಕಾರ! ನಾನು **KSP ಅಪರಾಧ ಬುದ್ಧಿಮತ್ತೆ ಸಹಾಯಕ**. ನಿಮಗೆ ಈ ವಿಷಯಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n\n• FIR ಮಾಹಿತಿ ಮತ್ತು ಪ್ರಕರಣದ ಸ್ಥಿತಿ\n• ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್ ವಿಶ್ಲೇಷಣೆ\n• ಶಂಕಿತ ಪ್ರೊಫೈಲ್ ಮತ್ತು ನೆಟ್‌ವರ್ಕ್\n• ಅಪರಾಧ ಮುನ್ಸೂಚನೆ\n\nನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ!`
      : `Hello! I'm the **KSP Crime Intelligence Assistant**. I can help you with:\n\n🔍 **Query Examples:**\n• *"Show me recent FIRs in Whitefield area"*\n• *"Who are the top 5 high-risk offenders in Bengaluru?"*\n• *"What are the crime hotspots in Mysuru?"*\n• *"Show robbery trends for last 6 months"*\n• *"Are there any gang-related activities in Kalaburagi?"*\n• *"Predict crime hotspots for next month"*\n\nType your query in English or Kannada, or use the microphone for voice input.`;
    citations = [];
  }

  return { response, citations, session_id: 'mock-session', language };
}

export const mockKPIs = {
  total_firs: 48392,
  active_cases: 12847,
  solved_rate: 68.4,
  pending_investigations: 5291,
  high_risk_offenders: 347,
  monthly_change_percent: 8.3,
  cybercrime_count: 3421,
  arrests_this_month: 891
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const mockTrends = {
  labels: [...months.slice(3), ...months, ...months.slice(0, 3)].slice(-18),
  datasets: [
    { label: 'Theft', data: [312, 298, 334, 367, 345, 389, 421, 403, 378, 412, 445, 467, 389, 412, 456, 478, 501, 489] },
    { label: 'Cybercrime', data: [45, 52, 67, 89, 102, 134, 156, 178, 201, 234, 267, 312, 289, 334, 378, 412, 445, 489] },
    { label: 'Robbery', data: [89, 94, 78, 82, 91, 88, 76, 82, 79, 71, 68, 64, 61, 58, 62, 55, 52, 48] },
    { label: 'Assault', data: [134, 128, 141, 136, 148, 152, 145, 139, 152, 148, 162, 155, 148, 159, 164, 172, 168, 175] },
  ]
};

export const mockHotspots = [
  { id: 1, name: 'Whitefield', lat: 12.9698, lng: 77.7499, count: 247, primary_crime: 'Theft' },
  { id: 2, name: 'KR Puram', lat: 13.0074, lng: 77.6968, count: 198, primary_crime: 'Robbery' },
  { id: 3, name: 'Electronic City', lat: 12.8456, lng: 77.6603, count: 187, primary_crime: 'Chain Snatching' },
  { id: 4, name: 'Koramangala', lat: 12.9352, lng: 77.6245, count: 176, primary_crime: 'Bag Theft' },
  { id: 5, name: 'Hebbal', lat: 13.0358, lng: 77.5970, count: 165, primary_crime: 'Vehicle Theft' },
  { id: 6, name: 'Yelahanka', lat: 13.1007, lng: 77.5963, count: 154, primary_crime: 'Assault' },
  { id: 7, name: 'Mysuru City', lat: 12.2958, lng: 76.6394, count: 143, primary_crime: 'Fraud' },
  { id: 8, name: 'Kalaburagi', lat: 17.3297, lng: 76.8343, count: 132, primary_crime: 'Robbery' },
  { id: 9, name: 'Hubballi', lat: 15.3647, lng: 75.1240, count: 128, primary_crime: 'Theft' },
  { id: 10, name: 'Mangaluru', lat: 12.9141, lng: 74.8560, count: 121, primary_crime: 'Cybercrime' },
  { id: 11, name: 'Belagavi', lat: 15.8497, lng: 74.4977, count: 115, primary_crime: 'Drug Trafficking' },
  { id: 12, name: 'Tumakuru', lat: 13.3379, lng: 77.1173, count: 108, primary_crime: 'Theft' },
];

export const mockByDistrict = [
  { district: 'Bengaluru Urban', count: 14823, solved: 9891 },
  { district: 'Mysuru', count: 3241, solved: 2134 },
  { district: 'Kalaburagi', count: 2891, solved: 1823 },
  { district: 'Hubballi-Dharwad', count: 2634, solved: 1756 },
  { district: 'Belagavi', count: 2489, solved: 1634 },
  { district: 'Mangaluru', count: 2134, solved: 1489 },
  { district: 'Tumakuru', count: 1892, solved: 1234 },
  { district: 'Shivamogga', count: 1723, solved: 1145 },
  { district: 'Raichur', count: 1634, solved: 1012 },
  { district: 'Vijayapura', count: 1523, solved: 989 },
];

export const mockByType = [
  { type: 'Theft', count: 12891, color: '#f97316' },
  { type: 'Cybercrime', count: 8234, color: '#3b82f6' },
  { type: 'Assault', count: 6789, color: '#ef4444' },
  { type: 'Fraud', count: 5632, color: '#f59e0b' },
  { type: 'Robbery', count: 4234, color: '#8b5cf6' },
  { type: 'Domestic Violence', count: 3891, color: '#ec4899' },
  { type: 'Drug Trafficking', count: 2345, color: '#10b981' },
  { type: 'Murder', count: 892, color: '#dc2626' },
  { type: 'Kidnapping', count: 567, color: '#06b6d4' },
  { type: 'Other', count: 3017, color: '#475569' },
];

export const mockAlerts = [
  { id: 1, severity: 'critical', title: 'Gang Activity Detected', description: 'Organized theft ring operating in North Bengaluru. 4 suspects identified, 2 FIRs in last 48 hours.', location: 'Yelahanka, Bengaluru', time: '12 min ago', type: 'Gang Activity' },
  { id: 2, severity: 'high', title: 'Repeat Offender Active', description: 'Accused ACC-2891 (Ramesh Naik) spotted in Whitefield area. Active bail violation.', location: 'Whitefield, Bengaluru', time: '1 hour ago', type: 'Repeat Offender' },
  { id: 3, severity: 'high', title: 'Cybercrime Spike', description: 'UPI fraud incidents up 340% in Mysuru. Estimated 120+ victims in last 7 days.', location: 'Mysuru District', time: '3 hours ago', type: 'Cybercrime' },
  { id: 4, severity: 'medium', title: 'Drug Trafficking Alert', description: 'Intelligence report: contraband movement expected via NH-48 tonight.', location: 'Tumakuru-Bengaluru Corridor', time: '5 hours ago', type: 'Drug Trafficking' },
  { id: 5, severity: 'medium', title: 'Missing Person - Juvenile', description: '14-year-old missing since yesterday from Kalaburagi. Last seen near bus stand.', location: 'Kalaburagi City', time: '8 hours ago', type: 'Missing Person' },
  { id: 6, severity: 'low', title: 'Vehicle Theft Trend', description: 'Two-wheeler theft up 28% in Belagavi. Scrapping yard suspected.', location: 'Belagavi District', time: '1 day ago', type: 'Vehicle Theft' },
];

export const mockNetworkGraph = {
  nodes: [
    { id: 'ACC-001', label: 'Ramesh Naik', type: 'accused', risk: 'high', properties: { age: 28, crimes: 4, district: 'Bengaluru Urban' } },
    { id: 'ACC-002', label: 'Suresh Gowda', type: 'accused', risk: 'high', properties: { age: 32, crimes: 6, district: 'Bengaluru Urban' } },
    { id: 'ACC-003', label: 'Manoj Kumar', type: 'accused', risk: 'medium', properties: { age: 24, crimes: 2, district: 'Bengaluru Urban' } },
    { id: 'ACC-004', label: 'Prakash Shetty', type: 'accused', risk: 'critical', properties: { age: 41, crimes: 9, district: 'Mangaluru' } },
    { id: 'ACC-005', label: 'Abdul Razak', type: 'accused', risk: 'medium', properties: { age: 35, crimes: 3, district: 'Hubballi' } },
    { id: 'ACC-006', label: 'Ravi Shankar', type: 'accused', risk: 'high', properties: { age: 29, crimes: 5, district: 'Mysuru' } },
    { id: 'VIC-001', label: 'Sunitha Devi', type: 'victim', properties: { age: 34, gender: 'F' } },
    { id: 'VIC-002', label: 'Krishnappa', type: 'victim', properties: { age: 58, gender: 'M' } },
    { id: 'VIC-003', label: 'Rekha B', type: 'victim', properties: { age: 27, gender: 'F' } },
    { id: 'LOC-001', label: 'Koramangala', type: 'location', properties: { district: 'Bengaluru Urban', crime_count: 176 } },
    { id: 'LOC-002', label: 'Whitefield', type: 'location', properties: { district: 'Bengaluru Urban', crime_count: 247 } },
    { id: 'LOC-003', label: 'KR Puram', type: 'location', properties: { district: 'Bengaluru Urban', crime_count: 198 } },
    { id: 'FIR-001', label: 'FIR-2024-BLR-004521', type: 'fir', properties: { crime: 'Chain Snatching', date: '2024-03-12' } },
    { id: 'FIR-002', label: 'FIR-2024-BLR-003891', type: 'fir', properties: { crime: 'Robbery', date: '2024-02-28' } },
    { id: 'FIN-001', label: 'HDFC Acct ending 4521', type: 'financial', properties: { bank: 'HDFC', suspicious: true } },
    { id: 'FIN-002', label: 'Paytm Wallet', type: 'financial', properties: { bank: 'Paytm', suspicious: true } },
  ],
  edges: [
    { source: 'ACC-001', target: 'ACC-002', label: 'gang member' },
    { source: 'ACC-001', target: 'ACC-003', label: 'associate' },
    { source: 'ACC-002', target: 'ACC-004', label: 'known contact' },
    { source: 'ACC-004', target: 'ACC-005', label: 'family' },
    { source: 'ACC-005', target: 'ACC-006', label: 'associate' },
    { source: 'ACC-001', target: 'VIC-001', label: 'accused in' },
    { source: 'ACC-002', target: 'VIC-002', label: 'accused in' },
    { source: 'ACC-003', target: 'VIC-003', label: 'accused in' },
    { source: 'ACC-001', target: 'LOC-001', label: 'operates in' },
    { source: 'ACC-002', target: 'LOC-002', label: 'operates in' },
    { source: 'ACC-002', target: 'LOC-003', label: 'operates in' },
    { source: 'ACC-001', target: 'FIR-001', label: 'listed in' },
    { source: 'ACC-002', target: 'FIR-002', label: 'listed in' },
    { source: 'FIR-001', target: 'LOC-001', label: 'occurred at' },
    { source: 'ACC-004', target: 'FIN-001', label: 'owns' },
    { source: 'ACC-006', target: 'FIN-002', label: 'owns' },
    { source: 'FIN-001', target: 'FIN-002', label: 'transferred to' },
  ]
};

export const mockAccusedList = [
  { id: 'ACC-001', name: 'Ramesh Naik', age: 28, district: 'Bengaluru Urban', crimes: 4, risk: 'high', riskScore: 82 },
  { id: 'ACC-002', name: 'Suresh Gowda', age: 32, district: 'Bengaluru Urban', crimes: 6, risk: 'high', riskScore: 87 },
  { id: 'ACC-003', name: 'Manoj Kumar', age: 24, district: 'Bengaluru Urban', crimes: 2, risk: 'medium', riskScore: 54 },
  { id: 'ACC-004', name: 'Prakash Shetty', age: 41, district: 'Mangaluru', crimes: 9, risk: 'critical', riskScore: 94 },
  { id: 'ACC-005', name: 'Abdul Razak', age: 35, district: 'Hubballi', crimes: 3, risk: 'medium', riskScore: 61 },
  { id: 'ACC-006', name: 'Ravi Shankar', age: 29, district: 'Mysuru', crimes: 5, risk: 'high', riskScore: 79 },
];

export const mockTopRiskOffenders = [
  { id: 'ACC-004', name: 'Prakash Shetty', age: 41, district: 'Mangaluru', crimes: 9, riskScore: 94, lastCrime: '2024-04-15', status: 'At Large' },
  { id: 'ACC-007', name: 'Deepak Naidu', age: 37, district: 'Kalaburagi', crimes: 8, riskScore: 91, lastCrime: '2024-03-28', status: 'Under Surveillance' },
  { id: 'ACC-002', name: 'Suresh Gowda', age: 32, district: 'Bengaluru Urban', crimes: 6, riskScore: 87, lastCrime: '2024-04-02', status: 'Bail' },
  { id: 'ACC-001', name: 'Ramesh Naik', age: 28, district: 'Bengaluru Urban', crimes: 4, riskScore: 82, lastCrime: '2024-03-12', status: 'Under Investigation' },
  { id: 'ACC-006', name: 'Ravi Shankar', age: 29, district: 'Mysuru', crimes: 5, riskScore: 79, lastCrime: '2024-02-19', status: 'Convicted' },
  { id: 'ACC-008', name: 'Mohammed Salim', age: 44, district: 'Belagavi', crimes: 7, riskScore: 76, lastCrime: '2024-01-30', status: 'Bail' },
  { id: 'ACC-009', name: 'Hanumantha Rao', age: 52, district: 'Raichur', crimes: 11, riskScore: 73, lastCrime: '2023-12-15', status: 'Parole' },
  { id: 'ACC-010', name: 'Santhosh Kumar', age: 26, district: 'Tumakuru', crimes: 3, riskScore: 71, lastCrime: '2024-04-18', status: 'Arrested' },
];

export const mockOffenderProfile = {
  id: 'ACC-004',
  name: 'Prakash Shetty',
  age: 41,
  gender: 'Male',
  dob: '1983-06-15',
  address: 'Bunder Road, Mangaluru',
  occupation: 'Unemployed (formerly construction worker)',
  education: 'SSLC',
  district: 'Mangaluru',
  riskScore: 94,
  riskLevel: 'CRITICAL',
  status: 'At Large',
  behavioralSummary: 'Prakash Shetty exhibits a well-established pattern of opportunistic violent crime with calculated escalation. His criminal trajectory shows a clear progression from petty theft (2010) to armed robbery (2018-present). He primarily operates in coastal Karnataka, exploiting knowledge of local terrain. Analysis indicates a preference for weekend operations between 7PM-10PM. Evidence suggests involvement in an organized group with connections to Goa-based fencing networks. His recidivism rate and escalating violence suggest a high probability of repeat offending within 90 days.',
  modusList: ['Armed robbery with country-made weapons', 'Operates in groups of 2-4', 'Targets lone travelers at night', 'Uses stolen motorcycles as getaway vehicles', 'Fences goods through Goa border networks'],
  crimeHistory: [
    { fir: 'FIR-2010-MNG-000234', date: '2010-03-15', crime: 'Petty Theft', outcome: 'Convicted — 3 months', district: 'Mangaluru' },
    { fir: 'FIR-2012-MNG-000892', date: '2012-07-22', crime: 'Robbery', outcome: 'Acquitted', district: 'Mangaluru' },
    { fir: 'FIR-2015-MNG-002341', date: '2015-11-08', crime: 'Assault', outcome: 'Convicted — 1 year', district: 'Mangaluru' },
    { fir: 'FIR-2018-MNG-004521', date: '2018-04-30', crime: 'Armed Robbery', outcome: 'Bail — Trial ongoing', district: 'Mangaluru' },
    { fir: 'FIR-2020-DKS-001823', date: '2020-09-14', crime: 'Armed Robbery', outcome: 'Convicted — 3 years', district: 'Dakshina Kannada' },
    { fir: 'FIR-2023-MNG-006712', date: '2023-08-22', crime: 'Robbery + Assault', outcome: 'Under investigation', district: 'Mangaluru' },
    { fir: 'FIR-2024-MNG-001234', date: '2024-01-15', crime: 'Armed Robbery', outcome: 'At Large — Warrant issued', district: 'Mangaluru' },
  ],
  similarCases: [
    { fir: 'FIR-2023-DKS-004892', similarity: 94, crime: 'Armed Robbery', outcome: 'Solved — Accused arrested', date: '2023-05-12' },
    { fir: 'FIR-2022-MNG-003451', similarity: 87, crime: 'Armed Robbery', outcome: 'Chargesheet filed', date: '2022-11-08' },
    { fir: 'FIR-2021-KAR-002341', similarity: 82, crime: 'Robbery + Vehicle Theft', outcome: 'Acquitted', date: '2021-07-19' },
  ]
};

export const mockForecastAlerts = [
  { id: 1, severity: 'critical', type: 'Gang Activity', title: 'Organized Robbery Ring — North Bengaluru', description: 'AI model predicts 89% probability of robbery cluster in Yelahanka-Hebbal corridor in next 7 days based on historical patterns, gang member movement intelligence, and seasonal trends.', district: 'Bengaluru Urban', probability: 89, timeframe: 'Next 7 days' },
  { id: 2, severity: 'high', type: 'Cybercrime Wave', title: 'UPI Fraud Campaign Expected', description: 'Pattern analysis suggests coordinated UPI fraud targeting Mysuru and Mangaluru districts. Similar campaigns in 2022 and 2023 both preceded by same social media indicators.', district: 'Mysuru, Mangaluru', probability: 78, timeframe: 'Next 14 days' },
  { id: 3, severity: 'high', type: 'Repeat Offender', title: 'Prakash Shetty — Re-offense Likely', description: 'Risk model indicates 91% probability of re-offense within 90 days. Subject released on bail Feb 2024 with no compliance check. Last location: Mangaluru port area.', district: 'Mangaluru, Dakshina Kannada', probability: 91, timeframe: 'Next 30 days' },
  { id: 4, severity: 'medium', type: 'Drug Trafficking', title: 'NH-48 Narcotics Corridor', description: 'Intelligence inputs suggest increased movement of narcotics via NH-48 Tumakuru segment. Cross-border coordination with Tamil Nadu authorities recommended.', district: 'Tumakuru', probability: 65, timeframe: 'Next 30 days' },
  { id: 5, severity: 'medium', type: 'Vehicle Theft', title: 'Two-Wheeler Theft Ring — Belagavi', description: 'Scrapping network likely active. 47 two-wheelers stolen in similar pattern across Belagavi in last 45 days. Chop shop location suspected near industrial area.', district: 'Belagavi', probability: 72, timeframe: 'Ongoing' },
];

export const mockForecastHotspots = [
  { lat: 13.1007, lng: 77.5963, intensity: 0.9, district: 'Yelahanka', predicted: 52, crime: 'Robbery' },
  { lat: 12.9698, lng: 77.7499, intensity: 0.85, district: 'Whitefield', predicted: 47, crime: 'Theft' },
  { lat: 17.3297, lng: 76.8343, intensity: 0.75, district: 'Kalaburagi', predicted: 38, crime: 'Robbery' },
  { lat: 12.9141, lng: 74.8560, intensity: 0.7, district: 'Mangaluru', predicted: 34, crime: 'Armed Robbery' },
  { lat: 15.8497, lng: 74.4977, intensity: 0.65, district: 'Belagavi', predicted: 31, crime: 'Drug Trafficking' },
];
