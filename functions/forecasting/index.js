const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

// Mock data
const mockForecastHotspots = [
  { lat: 13.1007, lng: 77.5963, intensity: 0.9, district: 'Yelahanka', predicted: 52, crime: 'Robbery' },
  { lat: 12.9698, lng: 77.7499, intensity: 0.85, district: 'Whitefield', predicted: 47, crime: 'Theft' },
  { lat: 17.3297, lng: 76.8343, intensity: 0.75, district: 'Kalaburagi', predicted: 38, crime: 'Robbery' },
  { lat: 12.9141, lng: 74.8560, intensity: 0.7, district: 'Mangaluru', predicted: 34, crime: 'Armed Robbery' },
  { lat: 15.8497, lng: 74.4977, intensity: 0.65, district: 'Belagavi', predicted: 31, crime: 'Drug Trafficking' },
];

const mockForecastAlerts = [
  { id: 1, severity: 'critical', type: 'Gang Activity', title: 'Organized Robbery Ring — North Bengaluru', description: 'AI model predicts 89% probability of robbery cluster in Yelahanka-Hebbal corridor in next 7 days based on historical patterns, gang member movement intelligence, and seasonal trends.', district: 'Bengaluru Urban', probability: 89, timeframe: 'Next 7 days' },
  { id: 2, severity: 'high', type: 'Cybercrime Wave', title: 'UPI Fraud Campaign Expected', description: 'Pattern analysis suggests coordinated UPI fraud targeting Mysuru and Mangaluru districts. Similar campaigns in 2022 and 2023 both preceded by same social media indicators.', district: 'Mysuru, Mangaluru', probability: 78, timeframe: 'Next 14 days' },
  { id: 3, severity: 'high', type: 'Repeat Offender', title: 'Prakash Shetty — Re-offense Likely', description: 'Risk model indicates 91% probability of re-offense within 90 days. Subject released on bail Feb 2024 with no compliance check. Last location: Mangaluru port area.', district: 'Mangaluru, Dakshina Kannada', probability: 91, timeframe: 'Next 30 days' },
  { id: 4, severity: 'medium', type: 'Drug Trafficking', title: 'NH-48 Narcotics Corridor', description: 'Intelligence inputs suggest increased movement of narcotics via NH-48 Tumakuru segment. Cross-border coordination with Tamil Nadu authorities recommended.', district: 'Tumakuru', probability: 65, timeframe: 'Next 30 days' },
  { id: 5, severity: 'medium', type: 'Vehicle Theft', title: 'Two-Wheeler Theft Ring — Belagavi', description: 'Scrapping network likely active. 47 two-wheelers stolen in similar pattern across Belagavi in last 45 days. Chop shop location suspected near industrial area.', district: 'Belagavi', probability: 72, timeframe: 'Ongoing' }
];

app.get('/api/forecast/hotspots', (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    // Scale predictions based on days
    const scaledHotspots = mockForecastHotspots.map(h => ({
      ...h,
      predicted: Math.round(h.predicted * (days / 30))
    }));
    res.status(200).json(scaledHotspots);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/forecast/alerts', (req, res) => {
  res.status(200).json(mockForecastAlerts);
});

app.get('/api/forecast/trends', (req, res) => {
  const { crime_type = 'Theft', months = 3 } = req.query;
  res.status(200).json({
    crime_type,
    projection: Array.from({ length: months }, (_, i) => ({
      month: `Month +${i + 1}`,
      predicted_count: Math.round(100 + Math.random() * 50)
    }))
  });
});

app.get('/api/forecast/district/:name', (req, res) => {
  const { name } = req.params;
  const { months = 3 } = req.query;
  res.status(200).json({
    district: name,
    predicted_crimes: Math.round(500 + Math.random() * 200 * months)
  });
});

app.get('/health', (req, res) => res.status(200).send('OK'));

module.exports = app;
