'use strict';
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const OFFENDERS = [
  {
    id: 'A1',
    bio: { name: 'Ravi Kumar', alias: 'Chota Ravi', age: 28, gender: 'Male', dob: '1996-03-12', district: 'Bengaluru Urban', address: '12, 3rd Cross, Hebbal, Bengaluru', education: 'Class 10 (Failed)', occupation: 'Unemployed', marital_status: 'Single', family_background: 'Father convicted for theft in 2010; grew up in poverty', photo_url: null },
    crime_history: [
      { fir: 'FIR-2021-BLR-000234', crime: 'Theft', year: 2021, outcome: 'Convicted', sentence: '6 months' },
      { fir: 'FIR-2022-BLR-000567', crime: 'Robbery', year: 2022, outcome: 'Acquitted', sentence: null },
      { fir: 'FIR-2024-BLR-001234', crime: 'Theft', year: 2024, outcome: 'Under Trial', sentence: null }
    ],
    risk_score: 72,
    risk_level: 'High',
    behavioral_summary: 'Subject exhibits impulsive behavior and operates in groups. Escalating from petty theft to organized robbery suggests growing boldness. Known to use motorcycles for escape routes. Responds well to social intervention based on probation history.',
    modus_operandi: ['Motorcycle-borne theft', 'Targets pedestrians near ATMs and market areas', 'Operates in pairs', 'Flees via narrow lanes'],
    similar_cases: ['FIR-2021-BLR-000234', 'FIR-2023-BLR-000891', 'FIR-2024-BLR-001501'],
    gang_affiliations: ['North Bengaluru Theft Ring'],
    psychological_profile: 'Antisocial tendencies; peer-influenced criminal behavior; low impulse control'
  },
  {
    id: 'A5',
    bio: { name: 'Mohammed Farooq', alias: 'Farooq Bhai', age: 42, gender: 'Male', dob: '1982-07-19', district: 'Kalaburagi', address: 'Super Market Area, Kalaburagi', education: 'Graduate (Commerce)', occupation: 'Contractor (Front)', marital_status: 'Married', family_background: 'No prior family criminal history; uses family business as front', photo_url: null },
    crime_history: [
      { fir: 'FIR-2018-KLB-000123', crime: 'Fraud', year: 2018, outcome: 'Convicted', sentence: '2 years' },
      { fir: 'FIR-2019-BLR-000456', crime: 'Fraud', year: 2019, outcome: 'Acquitted', sentence: null },
      { fir: 'FIR-2020-MYS-000789', crime: 'Extortion', year: 2020, outcome: 'Convicted', sentence: '3 years' },
      { fir: 'FIR-2021-HBL-001234', crime: 'Money Laundering', year: 2021, outcome: 'Under Trial', sentence: null },
      { fir: 'FIR-2023-BGM-001567', crime: 'Murder (Accused)', year: 2023, outcome: 'Under Trial', sentence: null },
      { fir: 'FIR-2024-KLB-000321', crime: 'Murder', year: 2024, outcome: 'Wanted', sentence: null },
      { fir: 'FIR-2024-BLR-001600', crime: 'Kidnapping', year: 2024, outcome: 'Wanted', sentence: null }
    ],
    risk_score: 96,
    risk_level: 'Critical',
    behavioral_summary: 'Highly organized career criminal with a sophisticated understanding of legal systems. Uses shell companies and proxies to maintain distance from crimes. Has graduated from financial crimes to violent offenses. Interpol notice issued.',
    modus_operandi: ['Investment fraud via fake apps', 'Money laundering through shell companies', 'Uses mule accounts in multiple states', 'Intimidation of witnesses', 'Cross-border operations (Karnataka-Maharashtra-Telangana)'],
    similar_cases: ['FIR-2018-KLB-000123', 'FIR-2020-MYS-000789', 'FIR-2021-HBL-001234'],
    gang_affiliations: ['Karnataka Cyber Fraud Network'],
    psychological_profile: 'Narcissistic personality with high intelligence; calculated risk-taker; uses charm to gain victims trust'
  },
  {
    id: 'A6',
    bio: { name: 'Siddharth Reddy', alias: 'Sid', age: 35, gender: 'Male', dob: '1989-11-05', district: 'Bengaluru Urban', address: 'Whitefield, Bengaluru', education: 'B.Tech (Dropped out)', occupation: 'Freelancer (Tech)', marital_status: 'Single', family_background: 'Upper-middle class; estranged from family', photo_url: null },
    crime_history: [
      { fir: 'FIR-2021-BLR-001111', crime: 'Cybercrime', year: 2021, outcome: 'Convicted', sentence: '1 year + fine' },
      { fir: 'FIR-2022-BLR-001456', crime: 'Fraud', year: 2022, outcome: 'Acquitted', sentence: null },
      { fir: 'FIR-2024-BLR-001235', crime: 'Cybercrime', year: 2024, outcome: 'Chargesheeted', sentence: null },
      { fir: 'FIR-2024-BLR-001500', crime: 'Fraud', year: 2024, outcome: 'Under Trial', sentence: null }
    ],
    risk_score: 81,
    risk_level: 'High',
    behavioral_summary: 'Tech-savvy individual who exploits digital vulnerabilities. Specializes in creating convincing fake investment platforms. Has technical skills to cover digital trails. Currently on bail and likely to re-offend.',
    modus_operandi: ['Creates fake investment apps/websites', 'Targets educated professionals via LinkedIn', 'Uses VPN and cryptocurrency for transactions', 'Recruits money mules'],
    similar_cases: ['FIR-2022-BLR-001456', 'FIR-2024-BLR-001235', 'FIR-2024-BLR-001700'],
    gang_affiliations: ['Karnataka Cyber Fraud Network'],
    psychological_profile: 'Intellectually driven criminal; views crimes as puzzles; financial motivation; low empathy for victims'
  },
  {
    id: 'A2',
    bio: { name: 'Suresh Gowda', alias: null, age: 25, gender: 'Male', dob: '1999-06-21', district: 'Bengaluru Urban', address: 'Yelahanka New Town, Bengaluru', education: 'Class 8 (Dropout)', occupation: 'Part-time labourer', marital_status: 'Single', family_background: 'Grew up near Ravi Kumar; childhood friends-turned-criminals', photo_url: null },
    crime_history: [
      { fir: 'FIR-2023-BLR-000788', crime: 'Theft', year: 2023, outcome: 'Convicted', sentence: '4 months' },
      { fir: 'FIR-2024-BLR-001234', crime: 'Theft', year: 2024, outcome: 'Chargesheeted', sentence: null }
    ],
    risk_score: 61,
    risk_level: 'High',
    behavioral_summary: 'Younger offender strongly influenced by peer group. Shows some remorse but continues criminal activity due to economic desperation and gang pressure. Candidate for rehabilitation if separated from core gang members.',
    modus_operandi: ['Lookout/driver for theft operations', 'Phone theft at crowded locations'],
    similar_cases: ['FIR-2023-BLR-000788', 'FIR-2024-BLR-001234'],
    gang_affiliations: ['North Bengaluru Theft Ring'],
    psychological_profile: 'Follower personality; peer-dependent; economic motivation; redeemable with right intervention'
  },
  {
    id: 'A8',
    bio: { name: 'Arjun Hegde', alias: 'Arjun', age: 38, gender: 'Male', dob: '1986-02-14', district: 'Mysuru', address: 'Mysuru Road, Mysuru', education: 'PUC', occupation: 'Small business owner', marital_status: 'Divorced', family_background: 'Business disputes led to criminal activities', photo_url: null },
    crime_history: [
      { fir: 'FIR-2019-MYS-000345', crime: 'Fraud', year: 2019, outcome: 'Acquitted', sentence: null },
      { fir: 'FIR-2021-MYS-000567', crime: 'Robbery', year: 2021, outcome: 'Convicted', sentence: '18 months' },
      { fir: 'FIR-2022-MYS-000890', crime: 'Assault', year: 2022, outcome: 'Convicted', sentence: '6 months' },
      { fir: 'FIR-2023-HBL-001000', crime: 'Fraud', year: 2023, outcome: 'Under Trial', sentence: null },
      { fir: 'FIR-2024-MYS-000456', crime: 'Robbery', year: 2024, outcome: 'Released', sentence: null }
    ],
    risk_score: 78,
    risk_level: 'High',
    behavioral_summary: 'Repeat offender who moved from property crimes to violent robbery. Financial desperation after failed business is primary driver. Currently released and under surveillance.',
    modus_operandi: ['Armed robbery targeting shops', 'Document fraud for property', 'Physical intimidation'],
    similar_cases: ['FIR-2021-MYS-000567', 'FIR-2024-MYS-000456'],
    gang_affiliations: ['Karnataka Cyber Fraud Network'],
    psychological_profile: 'Frustration-aggression pattern; financial motivation; volatile temper; capable of violence'
  }
];

const TOP_RISK = [
  { id: 'A5', name: 'Mohammed Farooq', alias: 'Farooq Bhai', risk_score: 96, risk_level: 'Critical', status: 'Wanted', district: 'Kalaburagi', primary_crime: 'Murder/Fraud', total_cases: 7 },
  { id: 'A6', name: 'Siddharth Reddy', alias: 'Sid', risk_score: 81, risk_level: 'High', status: 'Bail', district: 'Bengaluru Urban', primary_crime: 'Cybercrime/Fraud', total_cases: 4 },
  { id: 'A8', name: 'Arjun Hegde', alias: null, risk_score: 78, risk_level: 'High', status: 'Released', district: 'Mysuru', primary_crime: 'Robbery/Fraud', total_cases: 5 },
  { id: 'A1', name: 'Ravi Kumar', alias: 'Chota Ravi', risk_score: 72, risk_level: 'High', status: 'In Custody', district: 'Bengaluru Urban', primary_crime: 'Theft/Robbery', total_cases: 3 },
  { id: 'A2', name: 'Suresh Gowda', alias: null, risk_score: 61, risk_level: 'High', status: 'Bail', district: 'Bengaluru Urban', primary_crime: 'Theft', total_cases: 2 },
  { id: 'A3', name: 'Manoj Patel', alias: 'Mano', risk_score: 55, risk_level: 'Medium', status: 'Released', district: 'Bengaluru Urban', primary_crime: 'Theft', total_cases: 2 },
  { id: 'A7', name: 'Kavitha Nair', alias: null, risk_score: 52, risk_level: 'Medium', status: 'Bail', district: 'Bengaluru Urban', primary_crime: 'Fraud', total_cases: 2 },
  { id: 'A4', name: 'Deepak Sharma', alias: null, risk_score: 38, risk_level: 'Low', status: 'In Custody', district: 'Bengaluru Urban', primary_crime: 'Theft', total_cases: 1 }
];

const SIMILAR_CASES = {
  'FIR-2024-BLR-001234': [
    { fir: 'FIR-2023-BLR-000788', crime_type: 'Theft', match_score: 95, location: 'Yelahanka', similarity: 'Same MO: motorcycle theft, same accused' },
    { fir: 'FIR-2024-BLR-001501', crime_type: 'Robbery', match_score: 88, location: 'Electronic City', similarity: 'Same accused network; two-wheeler escape route' },
    { fir: 'FIR-2021-BLR-000234', crime_type: 'Theft', match_score: 82, location: 'Hebbal', similarity: 'Same primary accused (A1) history' },
    { fir: 'FIR-2023-BLR-000891', crime_type: 'Theft', match_score: 79, location: 'Kodigehalli', similarity: 'Similar time pattern and escape route' },
    { fir: 'FIR-2022-BLR-000567', crime_type: 'Robbery', match_score: 71, location: 'Jalahalli', similarity: 'Gang member (A3) involvement' }
  ]
};

app.get('/api/profiling/offender/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const offender = OFFENDERS.find(o => o.id === id);
    if (!offender) return res.status(404).json({ error: 'Offender ' + id + ' not found' });
    res.json({ success: true, data: offender });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/profiling/top-risk', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    res.json({ success: true, data: TOP_RISK.slice(0, limit), count: Math.min(limit, TOP_RISK.length) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/profiling/similar-cases/:fir_id', async (req, res) => {
  try {
    const fir_id = req.params.fir_id;
    const similar = SIMILAR_CASES[fir_id] || SIMILAR_CASES['FIR-2024-BLR-001234'];
    res.json({ success: true, fir_id, similar_cases: similar, count: similar.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profiling/score', async (req, res) => {
  try {
    const { offender_id, new_crime, new_status } = req.body;
    const offender = OFFENDERS.find(o => o.id === offender_id);
    if (!offender) return res.status(404).json({ error: 'Offender not found' });
    let score = offender.risk_score;
    if (new_crime) {
      const violentCrimes = ['Murder', 'Robbery', 'Kidnapping', 'Assault'];
      score += violentCrimes.includes(new_crime) ? 10 : 5;
    }
    if (new_status === 'Wanted') score += 15;
    if (new_status === 'In Custody') score -= 5;
    score = Math.min(100, Math.max(0, score));
    const risk_level = score >= 90 ? 'Critical' : score >= 70 ? 'High' : score >= 50 ? 'Medium' : 'Low';
    res.json({ success: true, offender_id, previous_score: offender.risk_score, new_score: score, risk_level, factors: { new_crime: new_crime || null, new_status: new_status || null, base_score: offender.risk_score } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'offender-profiling', timestamp: new Date().toISOString() }));

module.exports = app;
