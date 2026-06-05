const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins for demo

// Demo users mock data
const demoUsers = {
  'investigator@ksp.gov.in': { id: 'U001', name: 'Ravi Kumar S', role: 'investigator', district: 'Bengaluru Urban', badge: 'KSP-INV-2341', email: 'investigator@ksp.gov.in' },
  'analyst@ksp.gov.in':      { id: 'U002', name: 'Priya Venkatesh', role: 'analyst', district: 'State HQ', badge: 'KSP-ANL-1892', email: 'analyst@ksp.gov.in' },
  'supervisor@ksp.gov.in':   { id: 'U003', name: 'DCP Anand Patil', role: 'supervisor', district: 'Bengaluru Urban', badge: 'KSP-SUP-0234', email: 'supervisor@ksp.gov.in' },
  'policy@ksp.gov.in':       { id: 'U004', name: 'Smt. Kavitha Rao', role: 'policymaker', district: 'State HQ', badge: 'KSP-POL-0012', email: 'policy@ksp.gov.in' },
  'admin@ksp.gov.in':        { id: 'U005', name: 'Admin User', role: 'admin', district: 'State HQ', badge: 'KSP-ADM-0001', email: 'admin@ksp.gov.in' },
};

const rolePermissions = {
  'investigator': ['can_query_firs', 'can_view_accused', 'can_view_victims'],
  'analyst': ['can_query_firs', 'can_view_accused', 'can_view_victims', 'can_view_analytics', 'can_run_reports'],
  'supervisor': ['can_query_firs', 'can_view_accused', 'can_view_victims', 'can_view_analytics', 'can_run_reports', 'can_view_financial', 'can_profile_offenders'],
  'policymaker': ['can_query_firs', 'can_view_accused', 'can_view_victims', 'can_view_analytics', 'can_run_reports', 'can_view_financial', 'can_profile_offenders', 'can_forecast', 'can_view_sociological'],
  'admin': ['can_query_firs', 'can_view_accused', 'can_view_victims', 'can_view_analytics', 'can_run_reports', 'can_view_financial', 'can_profile_offenders', 'can_forecast', 'can_view_sociological', 'can_manage_users']
};

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check credentials (mocking authentication)
    if (demoUsers[email] && password === 'demo123') {
      const user = demoUsers[email];
      const permissions = rolePermissions[user.role] || [];
      
      return res.status(200).json({
        success: true,
        token: 'mock-token-' + Date.now(),
        user: user,
        role: user.role,
        permissions: permissions
      });
    }
    
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }
    // Return a mock user for demo
    res.status(200).json({
      success: true,
      user: demoUsers['investigator@ksp.gov.in']
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

app.get('/health', (req, res) => res.status(200).send('OK'));

module.exports = app;
