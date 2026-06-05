'use strict';
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const ACCUSED_DB = [
  { id: 'A1', label: 'Ravi Kumar', type: 'Accused', properties: { alias: 'Chota Ravi', age: 28, district: 'Bengaluru Urban', risk_level: 'High', crimes: 3, status: 'In Custody', address: '12, 3rd Cross, Hebbal' } },
  { id: 'A2', label: 'Suresh Gowda', type: 'Accused', properties: { alias: 'Suresh', age: 25, district: 'Bengaluru Urban', risk_level: 'High', crimes: 2, status: 'Bail', address: 'Yelahanka New Town' } },
  { id: 'A3', label: 'Manoj Patel', type: 'Accused', properties: { alias: 'Mano', age: 30, district: 'Bengaluru Urban', risk_level: 'Medium', crimes: 2, status: 'Released', address: 'Jalahalli Cross' } },
  { id: 'A4', label: 'Deepak Sharma', type: 'Accused', properties: { alias: null, age: 22, district: 'Bengaluru Urban', risk_level: 'Low', crimes: 1, status: 'In Custody', address: 'Devanahalli' } },
  { id: 'A5', label: 'Mohammed Farooq', type: 'Accused', properties: { alias: 'Farooq Bhai', age: 42, district: 'Kalaburagi', risk_level: 'Critical', crimes: 7, status: 'Wanted', address: 'Super Market Area, Kalaburagi' } },
  { id: 'A6', label: 'Siddharth Reddy', type: 'Accused', properties: { alias: 'Sid', age: 35, district: 'Bengaluru Urban', risk_level: 'High', crimes: 4, status: 'Bail', address: 'Whitefield' } },
  { id: 'A7', label: 'Kavitha Nair', type: 'Accused', properties: { alias: null, age: 29, district: 'Bengaluru Urban', risk_level: 'Medium', crimes: 2, status: 'Bail', address: 'Koramangala 5th Block' } },
  { id: 'A8', label: 'Arjun Hegde', type: 'Accused', properties: { alias: 'Arjun', age: 38, district: 'Mysuru', risk_level: 'High', crimes: 5, status: 'Released', address: 'Mysuru Road' } }
];

const VICTIM_DB = [
  { id: 'V1', label: 'Priya Sharma', type: 'Victim', properties: { age: 26, district: 'Bengaluru Urban', crime: 'Theft', fir: 'FIR-2024-BLR-001234' } },
  { id: 'V2', label: 'Ramesh Nayak', type: 'Victim', properties: { age: 45, district: 'Bengaluru Urban', crime: 'Cybercrime', fir: 'FIR-2024-BLR-001235' } },
  { id: 'V3', label: 'Anitha Rao', type: 'Victim', properties: { age: 52, district: 'Bengaluru Urban', crime: 'Fraud', fir: 'FIR-2024-BLR-001500' } },
  { id: 'V4', label: 'Sunil Kumar', type: 'Victim', properties: { age: 38, district: 'Mysuru', crime: 'Robbery', fir: 'FIR-2024-MYS-000456' } },
  { id: 'V5', label: 'Leela Devi', type: 'Victim', properties: { age: 61, district: 'Bengaluru Urban', crime: 'Fraud', fir: 'FIR-2024-BLR-001500' } }
];

const LOCATION_DB = [
  { id: 'L1', label: 'Hebbal Lake Road', type: 'Location', properties: { district: 'Bengaluru Urban', lat: 13.0354, lng: 77.5956, crime_count: 15 } },
  { id: 'L2', label: 'Yelahanka New Town', type: 'Location', properties: { district: 'Bengaluru Urban', lat: 13.1008, lng: 77.5963, crime_count: 11 } },
  { id: 'L3', label: 'Whitefield Phase 2', type: 'Location', properties: { district: 'Bengaluru Urban', lat: 12.9698, lng: 77.7499, crime_count: 21 } },
  { id: 'L4', label: 'Koramangala 5th Block', type: 'Location', properties: { district: 'Bengaluru Urban', lat: 12.9352, lng: 77.6245, crime_count: 8 } },
  { id: 'L5', label: 'Kalaburagi Bus Stand', type: 'Location', properties: { district: 'Kalaburagi', lat: 17.3297, lng: 76.8343, crime_count: 18 } }
];

const FIR_NODES = [
  { id: 'F1', label: 'FIR-2024-BLR-001234', type: 'FIR', properties: { crime_type: 'Theft', status: 'Under Investigation', district: 'Bengaluru Urban', date: '2024-01-15' } },
  { id: 'F2', label: 'FIR-2024-BLR-001235', type: 'FIR', properties: { crime_type: 'Cybercrime', status: 'Chargesheeted', district: 'Bengaluru Urban', date: '2024-01-16' } },
  { id: 'F3', label: 'FIR-2024-BLR-001500', type: 'FIR', properties: { crime_type: 'Fraud', status: 'Under Investigation', district: 'Bengaluru Urban', date: '2024-03-20' } },
  { id: 'F4', label: 'FIR-2024-MYS-000456', type: 'FIR', properties: { crime_type: 'Robbery', status: 'Solved', district: 'Mysuru', date: '2024-01-20' } },
  { id: 'F5', label: 'FIR-2024-KLB-000321', type: 'FIR', properties: { crime_type: 'Murder', status: 'Under Investigation', district: 'Kalaburagi', date: '2024-02-10' } }
];

const FINANCIAL_NODES = [
  { id: 'FA1', label: 'Acc: HDFC-****4521', type: 'FinancialAccount', properties: { bank: 'HDFC', transactions: 23, total_amount: 'Rs.8,45,000', suspicious: true } },
  { id: 'FA2', label: 'Acc: SBI-****8832', type: 'FinancialAccount', properties: { bank: 'SBI', transactions: 15, total_amount: 'Rs.3,12,000', suspicious: true } },
  { id: 'FA3', label: 'Acc: ICICI-****2210', type: 'FinancialAccount', properties: { bank: 'ICICI', transactions: 31, total_amount: 'Rs.12,78,000', suspicious: true } }
];

const ALL_NODES = [...ACCUSED_DB, ...VICTIM_DB, ...LOCATION_DB, ...FIR_NODES, ...FINANCIAL_NODES];

const ALL_EDGES = [
  { source: 'A1', target: 'A2', label: 'Gang Member', weight: 3 },
  { source: 'A1', target: 'A3', label: 'Gang Member', weight: 2 },
  { source: 'A1', target: 'A4', label: 'Gang Member', weight: 2 },
  { source: 'A2', target: 'A3', label: 'Associate', weight: 2 },
  { source: 'A1', target: 'F1', label: 'Accused In', weight: 1 },
  { source: 'A2', target: 'F1', label: 'Accused In', weight: 1 },
  { source: 'A1', target: 'V1', label: 'Targeted', weight: 1 },
  { source: 'A1', target: 'L1', label: 'Operates In', weight: 2 },
  { source: 'A2', target: 'L2', label: 'Operates In', weight: 2 },
  { source: 'A3', target: 'L1', label: 'Operates In', weight: 1 },
  { source: 'A5', target: 'A6', label: 'Gang Leader', weight: 4 },
  { source: 'A5', target: 'A7', label: 'Gang Member', weight: 3 },
  { source: 'A5', target: 'A8', label: 'Associate', weight: 2 },
  { source: 'A6', target: 'A7', label: 'Co-Conspirator', weight: 3 },
  { source: 'A5', target: 'F5', label: 'Prime Accused', weight: 1 },
  { source: 'A6', target: 'F2', label: 'Accused In', weight: 1 },
  { source: 'A6', target: 'F3', label: 'Accused In', weight: 1 },
  { source: 'A7', target: 'F3', label: 'Accused In', weight: 1 },
  { source: 'A6', target: 'V2', label: 'Targeted', weight: 1 },
  { source: 'A6', target: 'V3', label: 'Targeted', weight: 1 },
  { source: 'A7', target: 'V5', label: 'Targeted', weight: 1 },
  { source: 'A6', target: 'L3', label: 'Operates In', weight: 2 },
  { source: 'A7', target: 'L4', label: 'Operates In', weight: 1 },
  { source: 'A5', target: 'L5', label: 'Operates In', weight: 2 },
  { source: 'A6', target: 'FA1', label: 'Linked Account', weight: 2 },
  { source: 'A7', target: 'FA2', label: 'Linked Account', weight: 2 },
  { source: 'A5', target: 'FA3', label: 'Linked Account', weight: 3 },
  { source: 'A8', target: 'F4', label: 'Accused In', weight: 1 },
  { source: 'A8', target: 'V4', label: 'Targeted', weight: 1 }
];

const CLUSTERS = [
  {
    id: 'CL1',
    name: 'North Bengaluru Theft Ring (Hebbal Gang)',
    type: 'Theft / Robbery',
    members: ['A1', 'A2', 'A3', 'A4'],
    member_details: ['Ravi Kumar (Leader)', 'Suresh Gowda', 'Manoj Patel', 'Deepak Sharma'],
    territory: 'Hebbal, Yelahanka, Jalahalli, Devanahalli',
    firs_linked: 8,
    total_crime_value: 'Rs.12,50,000',
    active_since: '2023-06',
    risk: 'High',
    modus_operandi: 'Motorcycle-borne theft - target pedestrians on narrow roads, snatch valuables and flee on NH-44 towards Yelahanka'
  },
  {
    id: 'CL2',
    name: 'Karnataka Cyber Fraud Network',
    type: 'Fraud / Cybercrime',
    members: ['A5', 'A6', 'A7', 'A8'],
    member_details: ['Mohammed Farooq (Leader, Wanted)', 'Siddharth Reddy', 'Kavitha Nair', 'Arjun Hegde'],
    territory: 'Bengaluru Urban, Mysuru, Kalaburagi (cross-state operations)',
    firs_linked: 12,
    total_crime_value: 'Rs.2,30,00,000',
    active_since: '2023-01',
    risk: 'Critical',
    modus_operandi: 'Investment app fraud - create fake trading platforms, recruit victims via WhatsApp/Telegram, collect deposits then disappear.'
  }
];

function getConnectedGraph(startId, depth) {
  const visitedNodes = new Set();
  const visitedEdges = new Set();
  const resultNodes = [];
  const resultEdges = [];

  function traverse(nodeId, currentDepth) {
    if (currentDepth > depth || visitedNodes.has(nodeId)) return;
    visitedNodes.add(nodeId);
    const node = ALL_NODES.find(n => n.id === nodeId);
    if (node) resultNodes.push(node);
    ALL_EDGES.forEach(edge => {
      if (edge.source === nodeId || edge.target === nodeId) {
        const edgeKey = edge.source + '-' + edge.target;
        if (!visitedEdges.has(edgeKey)) {
          visitedEdges.add(edgeKey);
          resultEdges.push(edge);
          const nextId = edge.source === nodeId ? edge.target : edge.source;
          traverse(nextId, currentDepth + 1);
        }
      }
    });
  }

  traverse(startId, 0);
  return { nodes: resultNodes, edges: resultEdges };
}

app.get('/api/network/graph', async (req, res) => {
  try {
    const accused_id = req.query.accused_id || 'A1';
    const depth = Math.min(parseInt(req.query.depth) || 2, 4);
    const graph = getConnectedGraph(accused_id, depth);
    if (!graph.nodes.length) return res.status(404).json({ error: 'No graph found for accused_id: ' + accused_id });
    res.json({ success: true, accused_id, depth, nodes: graph.nodes, edges: graph.edges, node_count: graph.nodes.length, edge_count: graph.edges.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/network/clusters', async (req, res) => {
  try {
    res.json({ success: true, data: CLUSTERS, count: CLUSTERS.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/network/accused/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const accused = ACCUSED_DB.find(a => a.id === id || a.label.toLowerCase().replace(/\s/g, '') === id.toLowerCase());
    if (!accused) return res.status(404).json({ error: 'Accused not found' });
    const linkedEdges = ALL_EDGES.filter(e => e.source === accused.id || e.target === accused.id);
    const linkedNodeIds = new Set(linkedEdges.flatMap(e => [e.source, e.target]).filter(n => n !== accused.id));
    const linkedNodes = ALL_NODES.filter(n => linkedNodeIds.has(n.id));
    const cluster = CLUSTERS.find(c => c.members.includes(accused.id));
    res.json({
      success: true,
      profile: accused,
      connections: linkedNodes,
      gang_membership: cluster ? { cluster_id: cluster.id, name: cluster.name, role: cluster.members[0] === accused.id ? 'Leader' : 'Member' } : null,
      linked_firs: linkedNodes.filter(n => n.type === 'FIR').map(n => n.label),
      linked_victims: linkedNodes.filter(n => n.type === 'Victim').map(n => n.label),
      financial_accounts: linkedNodes.filter(n => n.type === 'FinancialAccount').map(n => n.label)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/network/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
    const results = ACCUSED_DB.filter(a => a.label.toLowerCase().includes(q.toLowerCase()) || (a.properties.alias && a.properties.alias.toLowerCase().includes(q.toLowerCase())));
    res.json({ success: true, data: results, count: results.length, query: q });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'network-analysis', timestamp: new Date().toISOString() }));

module.exports = app;
