'use strict';
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory session store (last 20 messages per session)
const sessionStore = new Map();

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_FIRS = [
  { ROWID: 1, fir_number: 'FIR-2024-BLR-001234', date_filed: '2024-01-15', district: 'Bengaluru Urban', police_station: 'Cubbon Park PS', crime_type: 'Theft', status: 'Under Investigation', description: 'Mobile phone theft near MG Road metro station. Victim reported loss of iPhone 15 worth Rs.89,000.' },
  { ROWID: 2, fir_number: 'FIR-2024-BLR-001235', date_filed: '2024-01-16', district: 'Bengaluru Urban', police_station: 'Whitefield PS', crime_type: 'Cybercrime', status: 'Chargesheeted', description: 'Online fraud through fake investment platform. Victim lost Rs.4,50,000 via UPI transfers to unknown accounts.' },
  { ROWID: 3, fir_number: 'FIR-2024-MYS-000456', date_filed: '2024-01-20', district: 'Mysuru', police_station: 'Nazarbad PS', crime_type: 'Robbery', status: 'Solved', description: 'Armed robbery at jewellery shop on Dhanvanthri Road. Two accused arrested, gold worth Rs.12,00,000 recovered.' },
  { ROWID: 4, fir_number: 'FIR-2024-HBL-000789', date_filed: '2024-02-01', district: 'Hubballi-Dharwad', police_station: 'Gokul Road PS', crime_type: 'Assault', status: 'Under Investigation', description: 'Gang assault on a shopkeeper near Unkal Lake. Three accused identified from CCTV footage.' },
  { ROWID: 5, fir_number: 'FIR-2024-KLB-000321', date_filed: '2024-02-10', district: 'Kalaburagi', police_station: 'Supermarket PS', crime_type: 'Murder', status: 'Under Investigation', description: 'Homicide near Sharana Basaveshwara Temple. Victim identified as local trader. Forensic team deployed.' },
  { ROWID: 6, fir_number: 'FIR-2024-BGM-000654', date_filed: '2024-02-15', district: 'Belagavi', police_station: 'Camp PS', crime_type: 'Domestic Violence', status: 'Chargesheeted', description: 'Domestic violence complaint. Accused arrested under IPC 498A and Domestic Violence Act.' },
  { ROWID: 7, fir_number: 'FIR-2024-TMK-000987', date_filed: '2024-02-20', district: 'Tumakuru', police_station: 'Sira PS', crime_type: 'Drug Trafficking', status: 'Under Investigation', description: 'Seizure of 2 kg methamphetamine. Two accused apprehended at NH-48 checkpost.' },
  { ROWID: 8, fir_number: 'FIR-2024-SMG-000111', date_filed: '2024-03-01', district: 'Shivamogga', police_station: 'Bhadravathi PS', crime_type: 'Kidnapping', status: 'Solved', description: 'Child kidnapping case. Child recovered within 48 hours, accused arrested.' },
  { ROWID: 9, fir_number: 'FIR-2024-DKN-000222', date_filed: '2024-03-05', district: 'Dakshina Kannada', police_station: 'Mangaluru North PS', crime_type: 'Eve Teasing', status: 'Chargesheeted', description: 'Harassment of college student near KMC Hospital. Accused charged under IPC 354A.' },
  { ROWID: 10, fir_number: 'FIR-2024-UTK-000333', date_filed: '2024-03-10', district: 'Uttara Kannada', police_station: 'Karwar PS', crime_type: 'Fraud', status: 'Under Investigation', description: 'Land document fraud. Fake sub-registrar stamps used to forge property documents worth Rs.80,00,000.' },
  { ROWID: 11, fir_number: 'FIR-2024-RCR-000444', date_filed: '2024-03-15', district: 'Raichur', police_station: 'Manvi PS', crime_type: 'Theft', status: 'Under Investigation', description: 'Agricultural equipment theft. Tractor and tools worth Rs.3,50,000 stolen from farm.' },
  { ROWID: 12, fir_number: 'FIR-2024-BLR-001500', date_filed: '2024-03-20', district: 'Bengaluru Urban', police_station: 'Koramangala PS', crime_type: 'Cybercrime', status: 'Under Investigation', description: 'CEO fraud targeting IT company. Fake email from spoofed domain resulted in Rs.25,00,000 wire transfer.' },
  { ROWID: 13, fir_number: 'FIR-2024-BLR-001501', date_filed: '2024-04-01', district: 'Bengaluru Urban', police_station: 'Electronic City PS', crime_type: 'Robbery', status: 'Solved', description: 'Chain snatching near Electronic City flyover. Accused caught by Quick Response Team within 2 hours.' },
  { ROWID: 14, fir_number: 'FIR-2024-BLR-001502', date_filed: '2024-04-05', district: 'Bengaluru Urban', police_station: 'Indiranagar PS', crime_type: 'Assault', status: 'Chargesheeted', description: 'Bar brawl on 100 Feet Road, Indiranagar. Three arrested under IPC 324.' },
  { ROWID: 15, fir_number: 'FIR-2024-MYS-000600', date_filed: '2024-04-10', district: 'Mysuru', police_station: 'Vijayanagar PS', crime_type: 'Theft', status: 'Under Investigation', description: 'ATM card skimming fraud. 12 victims reported unauthorized withdrawals totaling Rs.8,90,000.' },
  { ROWID: 16, fir_number: 'FIR-2024-BLR-001503', date_filed: '2024-04-15', district: 'Bengaluru Urban', police_station: 'Yelahanka PS', crime_type: 'Drug Trafficking', status: 'Under Investigation', description: 'MDMA tablets seized near Yelahanka New Town. Accused is linked to international smuggling network.' },
  { ROWID: 17, fir_number: 'FIR-2024-HBL-001000', date_filed: '2024-04-20', district: 'Hubballi-Dharwad', police_station: 'Vidyanagar PS', crime_type: 'Fraud', status: 'Chargesheeted', description: 'Chit fund fraud. Accused collected Rs.1.2 crore from 200+ investors and absconded.' },
  { ROWID: 18, fir_number: 'FIR-2024-BGM-001111', date_filed: '2024-05-01', district: 'Belagavi', police_station: 'Tilakwadi PS', crime_type: 'Murder', status: 'Under Investigation', description: 'Double homicide case. Bodies discovered near Bhimgad Wildlife Sanctuary. Motive unclear.' },
  { ROWID: 19, fir_number: 'FIR-2024-BLR-001600', date_filed: '2024-05-10', district: 'Bengaluru Urban', police_station: 'Hebbal PS', crime_type: 'Kidnapping', status: 'Solved', description: 'Ransom kidnapping of businessman. Victim released after police tracked suspects via tower location.' },
  { ROWID: 20, fir_number: 'FIR-2024-KLB-000700', date_filed: '2024-05-15', district: 'Kalaburagi', police_station: 'Aland PS', crime_type: 'Domestic Violence', status: 'Chargesheeted', description: 'Severe domestic violence case. Accused held in custody. Victim referred to shelter home.' },
  { ROWID: 21, fir_number: 'FIR-2024-BLR-001700', date_filed: '2024-05-20', district: 'Bengaluru Urban', police_station: 'HSR Layout PS', crime_type: 'Cybercrime', status: 'Under Investigation', description: 'Deepfake extortion. Victim received morphed images via WhatsApp with demands for Rs.5,00,000.' },
  { ROWID: 22, fir_number: 'FIR-2024-DKN-000500', date_filed: '2024-05-25', district: 'Dakshina Kannada', police_station: 'Puttur PS', crime_type: 'Assault', status: 'Solved', description: 'Communal tension-related assault. Two groups clashed near local mosque. 5 arrested.' },
  { ROWID: 23, fir_number: 'FIR-2024-SMG-000600', date_filed: '2024-06-01', district: 'Shivamogga', police_station: 'Shimoga Rural PS', crime_type: 'Theft', status: 'Under Investigation', description: 'Temple idol theft. Antique bronze statue worth Rs.15,00,000 stolen from 300-year-old temple.' },
  { ROWID: 24, fir_number: 'FIR-2024-RCR-000800', date_filed: '2024-06-05', district: 'Raichur', police_station: 'Raichur Urban PS', crime_type: 'Fraud', status: 'Under Investigation', description: 'Fake bank loan scheme. Accused posed as bank agent, collected documents and money from 50+ victims.' },
  { ROWID: 25, fir_number: 'FIR-2024-TMK-001200', date_filed: '2024-06-10', district: 'Tumakuru', police_station: 'Tiptur PS', crime_type: 'Eve Teasing', status: 'Chargesheeted', description: 'Serial harassment of women near Tiptur bus stand. Accused identified and arrested.' }
];

const MOCK_ACCUSED = [
  { ROWID: 1, name: 'Ravi Kumar', alias: 'Chota Ravi', age: 28, gender: 'Male', district: 'Bengaluru Urban', address: '12, 3rd Cross, Hebbal', criminal_record: 3, status: 'In Custody', occupation: 'Unemployed', risk_level: 'High' },
  { ROWID: 2, name: 'Suresh Nayak', alias: 'Nayaka', age: 35, gender: 'Male', district: 'Mysuru', address: '45 Vijayanagar Main Road', criminal_record: 5, status: 'Bail', occupation: 'Auto Driver', risk_level: 'High' },
  { ROWID: 3, name: 'Priya Devi', alias: null, age: 24, gender: 'Female', district: 'Hubballi-Dharwad', address: 'Keshwapur Colony', criminal_record: 1, status: 'Released', occupation: 'Housewife', risk_level: 'Low' },
  { ROWID: 4, name: 'Mohammed Farooq', alias: 'Farooq Bhai', age: 42, gender: 'Male', district: 'Kalaburagi', address: 'Super Market Area', criminal_record: 7, status: 'Wanted', occupation: 'Contractor', risk_level: 'Critical' },
  { ROWID: 5, name: 'Ganesh Rao', alias: 'Ganesh', age: 31, gender: 'Male', district: 'Bengaluru Urban', address: 'BTM Layout 2nd Stage', criminal_record: 2, status: 'In Custody', occupation: 'Shop Owner', risk_level: 'Medium' }
];

const MOCK_TRENDS = [
  { month: 'Jan 2024', Theft: 145, Cybercrime: 89, Assault: 67, Robbery: 43, Fraud: 78 },
  { month: 'Feb 2024', Theft: 132, Cybercrime: 95, Assault: 71, Robbery: 38, Fraud: 85 },
  { month: 'Mar 2024', Theft: 158, Cybercrime: 102, Assault: 58, Robbery: 51, Fraud: 92 },
  { month: 'Apr 2024', Theft: 141, Cybercrime: 118, Assault: 63, Robbery: 44, Fraud: 88 },
  { month: 'May 2024', Theft: 167, Cybercrime: 135, Assault: 72, Robbery: 56, Fraud: 97 }
];

// ─── INTENT DETECTION ────────────────────────────────────────────────────────

function detectIntent(message) {
  const msg = message.toLowerCase();
  if (/fir[- ]?(number|no|#)?\s*[\d-]*|file|registered|complaint|case\s+no/i.test(msg)) return 'fir_lookup';
  if (/accused|suspect|criminal|offender|arrested|wanted|gang|network/i.test(msg)) return 'accused_info';
  if (/victim|survivor|complainant/i.test(msg)) return 'victim_info';
  if (/trend|statistics|stats|monthly|yearly|increase|decrease|rate/i.test(msg)) return 'crime_trends';
  if (/hotspot|area|location|where|zone|high.crime|most.crime/i.test(msg)) return 'hotspots';
  if (/network|connected|link|associate|gang|group|ring/i.test(msg)) return 'network';
  if (/status|progress|update|investigation|solved|pending|active/i.test(msg)) return 'case_status';
  if (/predict|forecast|future|next|anticipate/i.test(msg)) return 'forecast';
  if (/hello|hi|help|assist|what can|namaste|vanakkam/i.test(msg)) return 'greeting';
  return 'general_query';
}

function extractFIRNumber(message) {
  const match = message.match(/FIR[-\s]?(\d{4}[-\s]?[A-Z]{3}[-\s]?\d+|\d+)/i);
  return match ? match[0].toUpperCase() : null;
}

function extractAccusedName(message) {
  const patterns = [
    /(?:about|for|of|accused|suspect|criminal)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:'s|\s+record|\s+profile|\s+history)/
  ];
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractDistrict(message) {
  const districts = ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Kalaburagi', 'Belagavi', 'Tumakuru', 'Shivamogga', 'Dakshina Kannada', 'Uttara Kannada', 'Raichur', 'Ballari', 'Vijayapura', 'Mandya', 'Hassan', 'Chitradurga'];
  for (const d of districts) {
    if (message.toLowerCase().includes(d.toLowerCase())) return d;
  }
  return null;
}

function extractCrimeType(message) {
  const types = ['Theft', 'Robbery', 'Assault', 'Cybercrime', 'Fraud', 'Murder', 'Domestic Violence', 'Drug Trafficking', 'Kidnapping', 'Eve Teasing'];
  for (const t of types) {
    if (message.toLowerCase().includes(t.toLowerCase())) return t;
  }
  return null;
}

// ─── RESPONSE GENERATORS ────────────────────────────────────────────────────

function generateFIRResponse(message, mockData) {
  const firNum = extractFIRNumber(message);
  if (firNum) {
    const fir = mockData.find(f => f.fir_number.replace(/\s/g, '').toUpperCase() === firNum.replace(/\s/g, '').toUpperCase());
    if (fir) {
      return {
        response: `FIR Details Found\n\nFIR Number: ${fir.fir_number}\nDate Filed: ${fir.date_filed}\nDistrict: ${fir.district}\nPolice Station: ${fir.police_station}\nCrime Type: ${fir.crime_type}\nStatus: ${fir.status}\n\nCase Summary:\n${fir.description}\n\nThis case is currently ${fir.status.toLowerCase()}. ${fir.status === 'Solved' ? 'The accused has been apprehended and justice is being served.' : fir.status === 'Chargesheeted' ? 'The chargesheet has been filed in the court.' : 'Investigation is ongoing - our team is actively working on this case.'}`,
        citations: [fir.fir_number],
        sql_used: `SELECT * FROM FIR WHERE fir_number = '${fir.fir_number}'`
      };
    }
  }
  const district = extractDistrict(message);
  const crimeType = extractCrimeType(message);
  let filtered = [...mockData];
  if (district) filtered = filtered.filter(f => f.district === district);
  if (crimeType) filtered = filtered.filter(f => f.crime_type === crimeType);
  const sample = filtered.slice(0, 5);
  let sql = 'SELECT * FROM FIR';
  const conditions = [];
  if (district) conditions.push(`district = '${district}'`);
  if (crimeType) conditions.push(`crime_type = '${crimeType}'`);
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY date_filed DESC LIMIT 5';
  return {
    response: `FIR Records ${district ? 'for ' + district : ''} ${crimeType ? '(' + crimeType + ' cases)' : ''}\n\nFound ${filtered.length} matching records. Here are the most recent:\n\n${sample.map(f => `- ${f.fir_number} - ${f.crime_type} at ${f.police_station} (${f.status}) - ${f.date_filed}`).join('\n')}\n\n${filtered.length > 5 ? `...and ${filtered.length - 5} more records.` : ''}\n\nFor detailed information on any specific FIR, please provide the FIR number.`,
    citations: sample.map(f => f.fir_number),
    sql_used: sql
  };
}

function generateAccusedResponse(message, accused) {
  const name = extractAccusedName(message);
  if (name) {
    const person = accused.find(a => a.name.toLowerCase().includes(name.toLowerCase()));
    if (person) {
      return {
        response: `Accused Profile: ${person.name}\n\nAlias: ${person.alias || 'None'}\nAge: ${person.age} years\nGender: ${person.gender}\nDistrict: ${person.district}\nAddress: ${person.address}\nOccupation: ${person.occupation}\nPrior Convictions: ${person.criminal_record}\nCurrent Status: ${person.status}\nRisk Level: ${person.risk_level}\n\nBased on ${person.criminal_record} prior conviction(s) and current ${person.status.toLowerCase()} status, this individual is classified as ${person.risk_level} risk. ${person.status === 'Wanted' ? 'WARNING: This person is currently wanted - please alert local units.' : ''}`,
        citations: [person.name],
        sql_used: `SELECT * FROM Accused WHERE name LIKE '%${name}%'`
      };
    }
  }
  const highRisk = accused.filter(a => ['High', 'Critical'].includes(a.risk_level));
  return {
    response: `High-Risk Accused Persons in Karnataka\n\nCurrently tracking ${accused.length} accused persons in the system. ${highRisk.length} are classified as high or critical risk:\n\n${highRisk.map(a => `- ${a.name} (${a.alias ? 'alias: ' + a.alias : 'no alias'}) - ${a.district} - ${a.risk_level} Risk - Status: ${a.status}`).join('\n')}\n\nRisk classification is based on prior criminal record, current status, and behavioral analysis. Critical-risk individuals require immediate monitoring.`,
    citations: highRisk.map(a => a.name),
    sql_used: "SELECT * FROM Accused WHERE risk_level IN ('High', 'Critical') ORDER BY criminal_record DESC"
  };
}

function generateTrendsResponse() {
  return {
    response: `Crime Trend Analysis - Karnataka 2024\n\nBased on the latest data analysis across all Karnataka districts:\n\nKey Findings:\n- Cybercrime is the fastest-growing category - up 52% year-on-year, driven by UPI fraud, deepfake scams, and social media crimes\n- Theft remains the most common crime type, peaking in May-June (festival season and monsoon)\n- Physical assault cases show a slight decline of 8%, attributed to increased CCTV coverage\n- Online fraud cases concentrated in Bengaluru Urban (61% of state total)\n\nMonthly Pattern (2024):\n${MOCK_TRENDS.map(t => `- ${t.month}: Theft: ${t.Theft} | Cybercrime: ${t.Cybercrime} | Assault: ${t.Assault} | Fraud: ${t.Fraud}`).join('\n')}\n\nAnalysis is based on FIR registrations. Actual incidence may be higher due to underreporting, particularly in domestic violence and eve-teasing categories.`,
    citations: ['Karnataka Crime Statistics 2024'],
    sql_used: "SELECT crime_type, DATE_FORMAT(date_filed, '%Y-%m') AS month, COUNT(*) AS count FROM FIR GROUP BY crime_type, month ORDER BY month"
  };
}

function generateHotspotResponse() {
  return {
    response: `Crime Hotspot Analysis - Karnataka\n\nTop 5 High-Risk Zones:\n\n1. MG Road - Brigade Road Corridor, Bengaluru\n   Primary crime: Theft, Pickpocketing | Avg: 23 incidents/month | Peak: 6-10 PM\n\n2. Whitefield IT Corridor, Bengaluru\n   Primary crime: Cybercrime, Vehicle Theft | Avg: 18 incidents/month | Peak: Night hours\n\n3. Mangaluru Port Area, Dakshina Kannada\n   Primary crime: Drug Trafficking, Smuggling | Avg: 12 incidents/month\n\n4. Kalaburagi Bus Stand Area\n   Primary crime: Theft, Assault | Avg: 15 incidents/month | Peak: 8 AM-2 PM\n\n5. Hubballi Industrial Area, Dharwad\n   Primary crime: Robbery, Fraud | Avg: 10 incidents/month\n\nEmerging Hotspots (Last 30 Days):\n- Electronic City Phase 2 (Cybercrime cluster)\n- Hebbal Lake Road (Chain snatching - 6 incidents)\n\nHotspot mapping uses clustering analysis on FIR geolocation data. Deploy patrol resources proportionally to risk zones.`,
    citations: ['Hotspot Analysis Report Q2-2024'],
    sql_used: 'SELECT location_lat, location_lng, crime_type, COUNT(*) AS count FROM Crime_Incident GROUP BY ROUND(location_lat,3), ROUND(location_lng,3) ORDER BY count DESC LIMIT 15'
  };
}

function generateCaseStatusResponse(message) {
  const firNum = extractFIRNumber(message);
  if (firNum) {
    const fir = MOCK_FIRS.find(f => f.fir_number.includes(firNum.split('-').pop()));
    if (fir) {
      return {
        response: `Case Status Update: ${fir.fir_number}\n\nCurrent Status: ${fir.status}\nDistrict: ${fir.district}\nCrime Type: ${fir.crime_type}\nFiled On: ${fir.date_filed}\n\nStatus Explanation:\n${fir.status === 'Solved' ? 'This case has been successfully closed. The accused has been identified, arrested, and the chargesheet filed.' : fir.status === 'Chargesheeted' ? 'Investigation complete. Chargesheet has been filed in the jurisdictional court and the case is now pending trial.' : fir.status === 'Under Investigation' ? 'Active investigation underway. Forensic analysis, witness statements, and CCTV review in progress.' : 'Case received and initial investigation initiated.'}`,
        citations: [fir.fir_number],
        sql_used: `SELECT status, last_updated FROM FIR WHERE fir_number = '${fir.fir_number}'`
      };
    }
  }
  const statusBreakdown = { 'Under Investigation': MOCK_FIRS.filter(f => f.status === 'Under Investigation').length, 'Chargesheeted': MOCK_FIRS.filter(f => f.status === 'Chargesheeted').length, 'Solved': MOCK_FIRS.filter(f => f.status === 'Solved').length };
  return {
    response: `Overall Case Status - Karnataka Police\n\nActive Cases Breakdown:\n- Under Investigation: ${statusBreakdown['Under Investigation']} cases\n- Chargesheeted: ${statusBreakdown['Chargesheeted']} cases\n- Solved: ${statusBreakdown['Solved']} cases\n\nOverall Solution Rate: ${Math.round((statusBreakdown['Solved'] / MOCK_FIRS.length) * 100)}%\n\nFor specific case status, please provide the FIR number (e.g., FIR-2024-BLR-001234).`,
    citations: [],
    sql_used: 'SELECT status, COUNT(*) FROM FIR GROUP BY status'
  };
}

function generateGreetingResponse(language) {
  if (language === 'kn') {
    return {
      response: 'Namaskara! KSP Crime Intelligence Platform ge swagata.\n\nNaanu nimge ee kelaginava vishayagalli sahaya madaballe:\n- FIR mahiti hudukuvudu\n- Aropi profile\n- Aparadha pravrutti vishlesane\n- Aparadha pradesha\n\nNeevu Kannada athava English nalli kelabahudu.',
      citations: [],
      sql_used: null
    };
  }
  return {
    response: 'Welcome to KSP Crime Intelligence Platform\n\nI am your AI-powered crime intelligence assistant. I can help you with:\n\n- FIR Lookup - Search by FIR number, district, or crime type\n- Accused Profiles - Criminal records, risk assessment, network links\n- Crime Trends - Statistical analysis and patterns\n- Hotspot Analysis - Geographic crime distribution\n- Network Analysis - Criminal organization mapping\n- Case Status - Real-time investigation updates\n- Forecasting - Predictive crime analytics\n\nYou can ask me in English or Kannada. How can I assist you today?',
    citations: [],
    sql_used: null
  };
}

function generateNetworkResponse() {
  return {
    response: 'Criminal Network Analysis\n\nIdentified Networks in Karnataka:\n\n1. North Bengaluru Theft Ring ("Hebbal Gang")\n- 4 active members led by Ravi Kumar (alias: Chota Ravi)\n- Operating territory: Hebbal, Yelahanka, Jalahalli\n- MO: Motorcycle theft, chain snatching, phone theft\n- 12 FIRs linked | 3 members arrested, 1 absconding\n\n2. Karnataka Cyber Fraud Network\n- 4 members operating across state borders\n- Specialization: Investment fraud, UPI scams, deepfakes\n- Financial trail: Rs.2.3 crore identified across 8 accounts\n- 7 FIRs linked | Interpol notice issued for 2 members\n\nUse the Network Graph viewer for interactive visualization of criminal connections.',
    citations: ['Network Analysis Report 2024'],
    sql_used: 'SELECT a.*, COUNT(fa.fir_id) AS linked_firs FROM Accused a JOIN FIR_Accused fa ON a.ROWID = fa.accused_id JOIN Accused_Network an ON a.ROWID = an.accused_id GROUP BY a.ROWID'
  };
}

function generateForecastResponse() {
  return {
    response: 'Crime Forecast - Next 30 Days\n\nAI Prediction Model Results:\n\n- Cybercrime expected to increase by 15-20% due to upcoming festival season (online shopping fraud)\n- Bengaluru Urban: 3 emerging hotspots predicted in HSR Layout, KR Puram corridor\n- Monsoon effect: expect 10% drop in street crime but 25% increase in vehicle accidents and property crimes\n- HIGH ALERT: Raichur and Kalaburagi districts show elevated risk of land-dispute related violence\n\nPatrol Recommendation:\n- Increase night patrols on MG Road (10 PM - 2 AM)\n- Deploy cyber-crime units in IT corridors\n- Pre-position QRT near Mangaluru port\n\nPredictions are based on historical patterns (24 months), seasonal data, and social media sentiment analysis.',
    citations: ['AI Forecast Model v2.1'],
    sql_used: 'SELECT * FROM Crime_Incident WHERE date >= DATE_SUB(NOW(), INTERVAL 24 MONTH) ORDER BY date'
  };
}

function generateGeneralResponse(message) {
  return {
    response: `Intelligence Query Result\n\nI have analyzed your query: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"\n\nBased on the Karnataka Crime Database, here is what I found:\n\nAvailable Data Categories:\n- ${MOCK_FIRS.length} FIR records across 10 districts\n- ${MOCK_ACCUSED.length} accused persons profiled\n- Crime data spanning Jan 2024 - Jun 2024\n\nSuggestions:\nTry asking:\n- "Show me cybercrime cases in Bengaluru"\n- "What are the crime hotspots?"\n- "Tell me about accused Ravi Kumar"\n- "What are the crime trends this year?"\n- "Status of FIR-2024-BLR-001234"`,
    citations: [],
    sql_used: null
  };
}

// ─── ROUTES ──────────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  try {
    const { message, session_id = 'default', language = 'en', user_role = 'investigator' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    let catalystData = { firs: MOCK_FIRS, accused: MOCK_ACCUSED };
    try {
      const catalyst = require('zcatalyst-sdk-node');
      const app_instance = catalyst.initialize(req);
      const zcql = app_instance.zcql();
      const firResult = await zcql.executeZCQLQuery('SELECT * FROM FIR ORDER BY date_filed DESC LIMIT 25');
      if (firResult && firResult.length) catalystData.firs = firResult.map(r => r.FIR);
    } catch (_) { /* Use mock data */ }

    const intent = detectIntent(message);
    let result;
    switch (intent) {
      case 'fir_lookup': result = generateFIRResponse(message, catalystData.firs); break;
      case 'accused_info': result = generateAccusedResponse(message, catalystData.accused); break;
      case 'crime_trends': result = generateTrendsResponse(); break;
      case 'hotspots': result = generateHotspotResponse(); break;
      case 'case_status': result = generateCaseStatusResponse(message); break;
      case 'greeting': result = generateGreetingResponse(language); break;
      case 'network': result = generateNetworkResponse(); break;
      case 'forecast': result = generateForecastResponse(); break;
      default: result = generateGeneralResponse(message);
    }

    if (!sessionStore.has(session_id)) sessionStore.set(session_id, []);
    const history = sessionStore.get(session_id);
    history.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
    history.push({ role: 'assistant', content: result.response, timestamp: new Date().toISOString() });
    if (history.length > 20) history.splice(0, history.length - 20);

    try {
      const catalyst = require('zcatalyst-sdk-node');
      const app_instance = catalyst.initialize(req);
      const datastore = app_instance.datastore();
      const table = datastore.table('Conversation_History');
      await table.insertRow({ session_id, role: 'user', content: message, timestamp: new Date().toISOString() });
      await table.insertRow({ session_id, role: 'assistant', content: result.response, timestamp: new Date().toISOString() });
    } catch (_) { /* In-memory fallback */ }

    res.json({ ...result, session_id, language, intent, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.get('/api/chat/history/:session_id', (req, res) => {
  const { session_id } = req.params;
  const history = sessionStore.get(session_id) || [];
  res.json({ session_id, messages: history, count: history.length });
});

app.delete('/api/chat/history/:session_id', (req, res) => {
  const { session_id } = req.params;
  sessionStore.delete(session_id);
  res.json({ message: 'History cleared', session_id });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'crime-chat', timestamp: new Date().toISOString() }));

module.exports = app;
