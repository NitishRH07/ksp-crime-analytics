'use strict';
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// MOCK DATA

const DISTRICTS = ['Bengaluru Urban', 'Mysuru', 'Hubballi-Dharwad', 'Kalaburagi', 'Belagavi', 'Tumakuru', 'Shivamogga', 'Dakshina Kannada', 'Uttara Kannada', 'Raichur', 'Ballari', 'Vijayapura', 'Mandya', 'Hassan', 'Chitradurga'];

function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const MONTHLY_TRENDS = (() => {
  const months = [];
  const start = new Date('2022-07-01');
  for (let i = 0; i < 24; i++) {
    const d = new Date(start);
    d.setMonth(start.getMonth() + i);
    const label = d.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
    const festivalBoost = [0, 1, 9, 10, 11].includes(d.getMonth()) ? 1.3 : 1.0;
    const monsoonDip = [5, 6, 7].includes(d.getMonth()) ? 0.85 : 1.0;
    months.push({
      month: label,
      Theft: Math.round(120 * festivalBoost * monsoonDip + randomBetween(-10, 10)),
      Cybercrime: Math.round((60 + i * 3) * festivalBoost + randomBetween(-5, 5)),
      Assault: Math.round(55 * monsoonDip + randomBetween(-8, 8)),
      Robbery: Math.round(35 * festivalBoost + randomBetween(-5, 5)),
      Fraud: Math.round(70 + randomBetween(-10, 10)),
      Murder: Math.round(8 + randomBetween(-2, 2)),
      'Domestic Violence': Math.round(40 + randomBetween(-5, 5)),
      'Drug Trafficking': Math.round(18 + randomBetween(-3, 3)),
      Kidnapping: Math.round(6 + randomBetween(-2, 2)),
      'Eve Teasing': Math.round(22 + randomBetween(-4, 4))
    });
  }
  return months;
})();

const HOTSPOTS = [
  { id: 1, name: 'MG Road - Brigade Road', area: 'Bengaluru Urban', lat: 12.9757, lng: 77.6098, count: 287, primary_crime: 'Theft', risk: 'Critical' },
  { id: 2, name: 'Whitefield IT Corridor', area: 'Bengaluru Urban', lat: 12.9698, lng: 77.7499, count: 234, primary_crime: 'Cybercrime', risk: 'Critical' },
  { id: 3, name: 'Koramangala', area: 'Bengaluru Urban', lat: 12.9352, lng: 77.6245, count: 198, primary_crime: 'Theft', risk: 'High' },
  { id: 4, name: 'Electronic City', area: 'Bengaluru Urban', lat: 12.8458, lng: 77.6650, count: 176, primary_crime: 'Cybercrime', risk: 'High' },
  { id: 5, name: 'Hebbal', area: 'Bengaluru Urban', lat: 13.0354, lng: 77.5956, count: 163, primary_crime: 'Robbery', risk: 'High' },
  { id: 6, name: 'Indiranagar', area: 'Bengaluru Urban', lat: 12.9784, lng: 77.6408, count: 154, primary_crime: 'Assault', risk: 'High' },
  { id: 7, name: 'Yelahanka', area: 'Bengaluru Urban', lat: 13.1008, lng: 77.5963, count: 141, primary_crime: 'Drug Trafficking', risk: 'High' },
  { id: 8, name: 'Mangaluru Port Area', area: 'Dakshina Kannada', lat: 12.8698, lng: 74.8420, count: 128, primary_crime: 'Drug Trafficking', risk: 'High' },
  { id: 9, name: 'Kalaburagi Bus Stand', area: 'Kalaburagi', lat: 17.3297, lng: 76.8343, count: 119, primary_crime: 'Theft', risk: 'Medium' },
  { id: 10, name: 'Mysuru Palace Area', area: 'Mysuru', lat: 12.3051, lng: 76.6551, count: 112, primary_crime: 'Theft', risk: 'Medium' },
  { id: 11, name: 'Hubballi Industrial Area', area: 'Hubballi-Dharwad', lat: 15.3600, lng: 75.1240, count: 104, primary_crime: 'Robbery', risk: 'Medium' },
  { id: 12, name: 'Belagavi Camp Area', area: 'Belagavi', lat: 15.8497, lng: 74.4977, count: 97, primary_crime: 'Assault', risk: 'Medium' },
  { id: 13, name: 'Tumakuru NH-48', area: 'Tumakuru', lat: 13.3379, lng: 77.1010, count: 91, primary_crime: 'Robbery', risk: 'Medium' },
  { id: 14, name: 'Raichur City Centre', area: 'Raichur', lat: 16.2120, lng: 77.3439, count: 84, primary_crime: 'Fraud', risk: 'Medium' },
  { id: 15, name: 'Shivamogga Town', area: 'Shivamogga', lat: 13.9299, lng: 75.5681, count: 76, primary_crime: 'Theft', risk: 'Low' }
];

const DISTRICT_CRIMES = [
  { district: 'Bengaluru Urban', total: 1876, Theft: 487, Cybercrime: 398, Assault: 187, Robbery: 143, Fraud: 312, Murder: 23, 'Domestic Violence': 156, 'Drug Trafficking': 89, Kidnapping: 34, 'Eve Teasing': 47 },
  { district: 'Mysuru', total: 543, Theft: 142, Cybercrime: 67, Assault: 89, Robbery: 54, Fraud: 98, Murder: 12, 'Domestic Violence': 45, 'Drug Trafficking': 18, Kidnapping: 8, 'Eve Teasing': 10 },
  { district: 'Hubballi-Dharwad', total: 412, Theft: 98, Cybercrime: 45, Assault: 76, Robbery: 43, Fraud: 87, Murder: 9, 'Domestic Violence': 34, 'Drug Trafficking': 12, Kidnapping: 5, 'Eve Teasing': 3 },
  { district: 'Kalaburagi', total: 387, Theft: 112, Cybercrime: 23, Assault: 89, Robbery: 34, Fraud: 56, Murder: 18, 'Domestic Violence': 38, 'Drug Trafficking': 9, Kidnapping: 6, 'Eve Teasing': 2 },
  { district: 'Belagavi', total: 356, Theft: 89, Cybercrime: 34, Assault: 67, Robbery: 45, Fraud: 67, Murder: 11, 'Domestic Violence': 29, 'Drug Trafficking': 7, Kidnapping: 4, 'Eve Teasing': 3 },
  { district: 'Tumakuru', total: 298, Theft: 78, Cybercrime: 45, Assault: 56, Robbery: 34, Fraud: 45, Murder: 7, 'Domestic Violence': 22, 'Drug Trafficking': 5, Kidnapping: 3, 'Eve Teasing': 3 },
  { district: 'Shivamogga', total: 267, Theft: 67, Cybercrime: 34, Assault: 45, Robbery: 28, Fraud: 56, Murder: 8, 'Domestic Violence': 19, 'Drug Trafficking': 5, Kidnapping: 3, 'Eve Teasing': 2 },
  { district: 'Dakshina Kannada', total: 312, Theft: 78, Cybercrime: 56, Assault: 43, Robbery: 32, Fraud: 67, Murder: 6, 'Domestic Violence': 18, 'Drug Trafficking': 8, Kidnapping: 2, 'Eve Teasing': 2 },
  { district: 'Uttara Kannada', total: 187, Theft: 45, Cybercrime: 23, Assault: 34, Robbery: 21, Fraud: 34, Murder: 5, 'Domestic Violence': 15, 'Drug Trafficking': 6, Kidnapping: 2, 'Eve Teasing': 2 },
  { district: 'Raichur', total: 234, Theft: 67, Cybercrime: 12, Assault: 56, Robbery: 23, Fraud: 43, Murder: 9, 'Domestic Violence': 14, 'Drug Trafficking': 6, Kidnapping: 3, 'Eve Teasing': 1 },
  { district: 'Ballari', total: 219, Theft: 56, Cybercrime: 18, Assault: 47, Robbery: 28, Fraud: 38, Murder: 8, 'Domestic Violence': 12, 'Drug Trafficking': 8, Kidnapping: 2, 'Eve Teasing': 2 },
  { district: 'Vijayapura', total: 198, Theft: 54, Cybercrime: 15, Assault: 43, Robbery: 22, Fraud: 34, Murder: 7, 'Domestic Violence': 13, 'Drug Trafficking': 5, Kidnapping: 3, 'Eve Teasing': 2 },
  { district: 'Mandya', total: 176, Theft: 47, Cybercrime: 23, Assault: 38, Robbery: 19, Fraud: 28, Murder: 5, 'Domestic Violence': 10, 'Drug Trafficking': 3, Kidnapping: 2, 'Eve Teasing': 1 },
  { district: 'Hassan', total: 167, Theft: 43, Cybercrime: 19, Assault: 34, Robbery: 18, Fraud: 27, Murder: 4, 'Domestic Violence': 12, 'Drug Trafficking': 5, Kidnapping: 3, 'Eve Teasing': 2 },
  { district: 'Chitradurga', total: 154, Theft: 39, Cybercrime: 14, Assault: 32, Robbery: 17, Fraud: 24, Murder: 6, 'Domestic Violence': 11, 'Drug Trafficking': 7, Kidnapping: 2, 'Eve Teasing': 2 }
];

const BY_TYPE_DATA = [
  { crime_type: 'Theft', count: 1247, percentage: 28.5 },
  { crime_type: 'Cybercrime', count: 876, percentage: 20.0 },
  { crime_type: 'Fraud', count: 654, percentage: 14.9 },
  { crime_type: 'Assault', count: 521, percentage: 11.9 },
  { crime_type: 'Domestic Violence', count: 412, percentage: 9.4 },
  { crime_type: 'Robbery', count: 298, percentage: 6.8 },
  { crime_type: 'Drug Trafficking', count: 187, percentage: 4.3 },
  { crime_type: 'Eve Teasing', count: 134, percentage: 3.1 },
  { crime_type: 'Kidnapping', count: 56, percentage: 1.3 },
  { crime_type: 'Murder', count: 12, percentage: 0.3 }
];

const HOURLY_DATA = Array.from({ length: 24 }, (_, hour) => {
  let base = 15;
  if (hour >= 0 && hour <= 3) base = 25;
  if (hour >= 4 && hour <= 6) base = 8;
  if (hour >= 7 && hour <= 9) base = 30;
  if (hour >= 10 && hour <= 12) base = 22;
  if (hour >= 13 && hour <= 15) base = 18;
  if (hour >= 16 && hour <= 18) base = 35;
  if (hour >= 19 && hour <= 21) base = 42;
  if (hour >= 22 && hour <= 23) base = 32;
  return { hour, count: base + Math.floor(Math.random() * 10) - 5 };
});

const WEEKDAY_DATA = [
  { day: 'Sunday', count: 487 },
  { day: 'Monday', count: 412 },
  { day: 'Tuesday', count: 389 },
  { day: 'Wednesday', count: 401 },
  { day: 'Thursday', count: 378 },
  { day: 'Friday', count: 445 },
  { day: 'Saturday', count: 521 }
];

const RECENT_ALERTS = [
  { id: 1, title: 'Surge in UPI Fraud Cases', description: 'Bengaluru Urban reported 34 new UPI fraud cases in 48 hours', severity: 'HIGH', district: 'Bengaluru Urban', timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(), crime_type: 'Cybercrime' },
  { id: 2, title: 'Chain Snatching Spree - Hebbal', description: '6 chain snatching incidents reported in Hebbal area within 24 hours', severity: 'HIGH', district: 'Bengaluru Urban', timestamp: new Date(Date.now() - 5*60*60*1000).toISOString(), crime_type: 'Robbery' },
  { id: 3, title: 'Drug Bust - Yelahanka', description: 'MDMA tablets seized, accused linked to interstate network', severity: 'HIGH', district: 'Bengaluru Urban', timestamp: new Date(Date.now() - 8*60*60*1000).toISOString(), crime_type: 'Drug Trafficking' },
  { id: 4, title: 'Wanted Accused Spotted', description: 'Mohammed Farooq (alias Farooq Bhai) spotted near Kalaburagi bus stand', severity: 'CRITICAL', district: 'Kalaburagi', timestamp: new Date(Date.now() - 10*60*60*1000).toISOString(), crime_type: 'Murder' },
  { id: 5, title: 'Domestic Violence Cluster', description: 'Unusual spike in domestic violence FIRs in Belagavi Camp area', severity: 'MEDIUM', district: 'Belagavi', timestamp: new Date(Date.now() - 14*60*60*1000).toISOString(), crime_type: 'Domestic Violence' },
  { id: 6, title: 'Temple Theft Recurrence', description: 'Second temple idol theft reported in Shivamogga - possible serial offender', severity: 'MEDIUM', district: 'Shivamogga', timestamp: new Date(Date.now() - 18*60*60*1000).toISOString(), crime_type: 'Theft' },
  { id: 7, title: 'Land Dispute Violence Alert', description: 'Intelligence reports suggest escalating land conflict in Raichur district', severity: 'MEDIUM', district: 'Raichur', timestamp: new Date(Date.now() - 22*60*60*1000).toISOString(), crime_type: 'Assault' },
  { id: 8, title: 'Festival Season Patrol Advisory', description: 'Increase mobile patrols in Mysuru Palace area for upcoming Dasara', severity: 'LOW', district: 'Mysuru', timestamp: new Date(Date.now() - 26*60*60*1000).toISOString(), crime_type: 'General' },
  { id: 9, title: 'Chit Fund Fraud Investigation', description: 'New victim complaints in Hubballi-Dharwad linked to existing fraud case', severity: 'MEDIUM', district: 'Hubballi-Dharwad', timestamp: new Date(Date.now() - 30*60*60*1000).toISOString(), crime_type: 'Fraud' },
  { id: 10, title: 'Cybercrime Awareness Drive Needed', description: 'Tumakuru reports 40% increase in phone fraud targeting elderly citizens', severity: 'LOW', district: 'Tumakuru', timestamp: new Date(Date.now() - 36*60*60*1000).toISOString(), crime_type: 'Cybercrime' }
];

async function withCatalystFallback(req, zcqlQuery, fallbackData) {
  try {
    const catalyst = require('zcatalyst-sdk-node');
    const appInst = catalyst.initialize(req);
    const zcql = appInst.zcql();
    const result = await zcql.executeZCQLQuery(zcqlQuery);
    if (result && result.length) return result;
    return fallbackData;
  } catch (_) {
    return fallbackData;
  }
}

app.get('/api/analytics/trends', async (req, res) => {
  try {
    const data = await withCatalystFallback(req, "SELECT crime_type, COUNT(*) AS count FROM FIR GROUP BY crime_type", MONTHLY_TRENDS);
    res.json({ success: true, data: MONTHLY_TRENDS, count: MONTHLY_TRENDS.length });
  } catch (err) {
    res.status(500).json({ error: err.message, data: MONTHLY_TRENDS });
  }
});

app.get('/api/analytics/hotspots', async (req, res) => {
  try {
    res.json({ success: true, data: HOTSPOTS, count: HOTSPOTS.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/by-district', async (req, res) => {
  try {
    res.json({ success: true, data: DISTRICT_CRIMES, count: DISTRICT_CRIMES.length });
  } catch (err) {
    res.status(500).json({ error: err.message, data: DISTRICT_CRIMES });
  }
});

app.get('/api/analytics/by-type', async (req, res) => {
  try {
    res.json({ success: true, data: BY_TYPE_DATA, total: BY_TYPE_DATA.reduce((s, d) => s + d.count, 0) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/hourly', async (req, res) => {
  try {
    res.json({ success: true, data: HOURLY_DATA, peak_hour: HOURLY_DATA.reduce((m, d) => d.count > m.count ? d : m, HOURLY_DATA[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/weekday', async (req, res) => {
  try {
    res.json({ success: true, data: WEEKDAY_DATA, peak_day: WEEKDAY_DATA.reduce((m, d) => d.count > m.count ? d : m, WEEKDAY_DATA[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/kpis', async (req, res) => {
  try {
    const kpis = { total_firs: 4397, active_cases: 2156, solved_rate: 51.2, pending_investigations: 1834, high_risk_offenders: 87, monthly_change_percent: 3.7, chargesheeted: 407, total_accused: 312, districts_covered: 30, avg_resolution_days: 47 };
    res.json({ success: true, data: kpis, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/recent-alerts', async (req, res) => {
  try {
    res.json({ success: true, data: RECENT_ALERTS, count: RECENT_ALERTS.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'crime-analytics', timestamp: new Date().toISOString() }));

module.exports = app;
