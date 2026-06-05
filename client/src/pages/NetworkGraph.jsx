import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { networkAPI, mockNetworkGraph, mockAccusedList } from '../services/api';

const NODE_COLORS = {
  accused:   { fill: '#ef4444', stroke: '#dc2626', icon: '👤' },
  victim:    { fill: '#3b82f6', stroke: '#2563eb', icon: '🧑' },
  location:  { fill: '#10b981', stroke: '#059669', icon: '📍' },
  fir:       { fill: '#f97316', stroke: '#ea580c', icon: '📋' },
  financial: { fill: '#f59e0b', stroke: '#d97706', icon: '💰' },
};

const RISK_COLORS = { critical: '#dc2626', high: '#f97316', medium: '#f59e0b', low: '#10b981' };

export default function NetworkGraph() {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState(mockNetworkGraph);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [zoom, setZoom] = useState(1);
  const simulationRef = useRef(null);

  useEffect(() => {
    drawGraph();
    return () => { if (simulationRef.current) simulationRef.current.stop(); };
  }, [graphData, filter]);

  const drawGraph = () => {
    const container = svgRef.current?.parentElement;
    if (!container || !svgRef.current) return;
    const W = container.clientWidth || 800;
    const H = container.clientHeight || 500;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', W).attr('height', H);

    // Defs: arrow marker, glow filter
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow').attr('viewBox', '0 -5 10 10').attr('refX', 28).attr('refY', 0)
      .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('fill', 'rgba(148,163,184,0.5)').attr('d', 'M0,-5L10,0L0,5');

    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g');

    // Zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoom(Math.round(event.transform.k * 100));
      });
    svg.call(zoomBehavior);

    const nodes = graphData.nodes.map(n => ({ ...n }));
    const edges = graphData.edges.map(e => ({ ...e }));

    // Simulation
    simulationRef.current = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(120).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(40));

    // Draw edges
    const link = g.append('g').selectAll('line')
      .data(edges).join('line')
      .attr('stroke', 'rgba(148,163,184,0.3)')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)');

    // Edge labels
    const edgeLabel = g.append('g').selectAll('text')
      .data(edges).join('text')
      .attr('font-size', 9).attr('fill', 'rgba(148,163,184,0.6)')
      .attr('text-anchor', 'middle').attr('font-family', 'Inter, sans-serif')
      .text(d => d.label);

    // Draw nodes
    const node = g.append('g').selectAll('g')
      .data(nodes).join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => { if (!event.active) simulationRef.current.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => { if (!event.active) simulationRef.current.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on('click', (_, d) => setSelectedNode(d));

    node.append('circle')
      .attr('r', d => d.type === 'accused' ? 22 : d.type === 'fir' ? 18 : d.type === 'location' ? 20 : 16)
      .attr('fill', d => {
        const c = NODE_COLORS[d.type];
        return c ? c.fill + '33' : '#ffffff22';
      })
      .attr('stroke', d => {
        const c = NODE_COLORS[d.type];
        return c ? c.stroke : '#ffffff';
      })
      .attr('stroke-width', d => d.type === 'accused' ? 2.5 : 1.5)
      .attr('filter', 'url(#glow)');

    node.append('text')
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', d => d.type === 'accused' ? 16 : 13)
      .text(d => NODE_COLORS[d.type]?.icon || '⬟');

    node.append('text')
      .attr('text-anchor', 'middle').attr('y', d => (d.type === 'accused' ? 22 : 18) + 14)
      .attr('font-size', 10).attr('fill', '#f1f5f9').attr('font-family', 'Inter, sans-serif')
      .attr('font-weight', 600)
      .text(d => d.label.length > 14 ? d.label.substring(0, 13) + '…' : d.label);

    // Risk ring for accused
    node.filter(d => d.type === 'accused' && d.risk).append('circle')
      .attr('r', 26).attr('fill', 'none')
      .attr('stroke', d => RISK_COLORS[d.risk] || '#f97316')
      .attr('stroke-width', 2).attr('stroke-dasharray', '4,3').attr('opacity', 0.8);

    simulationRef.current.on('tick', () => {
      link
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      edgeLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q) { setGraphData(mockNetworkGraph); return; }
    const filtered = mockNetworkGraph.nodes.filter(n => n.label.toLowerCase().includes(q.toLowerCase()));
    if (filtered.length === 0) return;
    const filteredIds = new Set(filtered.map(n => n.id));
    const relatedEdges = mockNetworkGraph.edges.filter(e =>
      filteredIds.has(typeof e.source === 'object' ? e.source.id : e.source) ||
      filteredIds.has(typeof e.target === 'object' ? e.target.id : e.target)
    );
    const relatedIds = new Set([
      ...filteredIds,
      ...relatedEdges.map(e => typeof e.source === 'object' ? e.source.id : e.source),
      ...relatedEdges.map(e => typeof e.target === 'object' ? e.target.id : e.target),
    ]);
    setGraphData({
      nodes: mockNetworkGraph.nodes.filter(n => relatedIds.has(n.id)),
      edges: relatedEdges
    });
  };

  const legendItems = [
    { type: 'accused', color: '#ef4444', label: 'Accused' },
    { type: 'victim', color: '#3b82f6', label: 'Victim' },
    { type: 'location', color: '#10b981', label: 'Location' },
    { type: 'fir', color: '#f97316', label: 'FIR / Case' },
    { type: 'financial', color: '#f59e0b', label: 'Financial Account' },
  ];

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">🕸️ Criminal Network Analysis</div>
            <div className="page-desc">Interactive visualization of criminal relationships, co-accused networks, and crime linkages</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="input search-input"
                style={{ width: '220px' }}
                placeholder="Search accused, location..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => handleSearch('')}>Reset</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 220px)' }}>
        {/* Graph */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'Nodes', value: graphData.nodes.length, color: 'var(--color-primary)' },
              { label: 'Connections', value: graphData.edges.length, color: 'var(--color-secondary)' },
              { label: 'Accused', value: graphData.nodes.filter(n=>n.type==='accused').length, color: '#ef4444' },
              { label: 'Zoom', value: zoom + '%', color: 'var(--color-info)' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ flex: 1, padding: '10px 14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="card" style={{ padding: '10px 16px', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>LEGEND:</span>
            {legendItems.map(l => (
              <div key={l.type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color }} />
                {l.label}
              </div>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>🖱️ Drag nodes to rearrange</span>
              <span>🖱️ Scroll to zoom</span>
              <span>👆 Click node for details</span>
            </div>
          </div>

          {/* Graph canvas */}
          <div className="network-container" style={{ flex: 1, minHeight: 0 }}>
            <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        {/* Node detail panel */}
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          {selectedNode ? (
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: (NODE_COLORS[selectedNode.type]?.fill || '#666') + '33',
                  border: `2px solid ${NODE_COLORS[selectedNode.type]?.stroke || '#666'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
                }}>
                  {NODE_COLORS[selectedNode.type]?.icon || '⬟'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{selectedNode.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedNode.type}</div>
                </div>
              </div>

              {selectedNode.type === 'accused' && (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Risk Score</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{
                          width: (selectedNode.properties?.riskScore || 70) + '%',
                          background: `linear-gradient(90deg, ${RISK_COLORS[selectedNode.risk] || '#f97316'}, ${RISK_COLORS[selectedNode.risk] || '#f97316'}88)`
                        }} />
                      </div>
                      <span className={`badge badge-${selectedNode.risk === 'critical' ? 'critical' : selectedNode.risk === 'high' ? 'high' : 'medium'}`}>
                        {selectedNode.risk?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>ID</div>
                  <div className="font-mono" style={{ fontSize: '12px', marginBottom: '12px', color: 'var(--color-secondary)' }}>{selectedNode.id}</div>
                </>
              )}

              {selectedNode.properties && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>PROPERTIES</div>
                  {Object.entries(selectedNode.properties).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '5px' }}>
                      <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: '11px' }}>👁️ Full Profile</button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1, fontSize: '11px' }}>📋 View FIRs</button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🕸️</div>
              <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Click a node</div>
              <div style={{ fontSize: '12px' }}>Select any node in the graph to view detailed information about accused, victims, locations, or cases.</div>
            </div>
          )}

          {/* Gang Clusters */}
          <div className="card" style={{ padding: '16px' }}>
            <div className="card-title" style={{ marginBottom: '12px' }}>🔴 Gang Networks</div>
            {[
              { name: 'North Bengaluru Theft Ring', members: 3, firs: 7, status: 'Active', severity: 'critical' },
              { name: 'Coastal Fraud Network', members: 4, firs: 5, status: 'Under Surveillance', severity: 'high' },
            ].map((g, i) => (
              <div key={i} style={{ padding: '10px', background: 'var(--color-bg-surface)', borderRadius: '8px', marginBottom: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{g.name}</div>
                  <span className={`badge badge-${g.severity}`}>{g.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>👤 {g.members} members</span>
                  <span>📋 {g.firs} FIRs</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search results */}
          <div className="card" style={{ padding: '16px' }}>
            <div className="card-title" style={{ marginBottom: '12px' }}>📋 All Accused</div>
            {mockAccusedList.map(a => (
              <div
                key={a.id}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '6px', cursor: 'pointer', marginBottom: '4px', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--border-subtle)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => setSelectedNode(mockNetworkGraph.nodes.find(n => n.id === a.id) || { ...a, type: 'accused', properties: { age: a.age, crimes: a.crimes } })}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: (RISK_COLORS[a.risk] || '#f97316') + '22', border: `1.5px solid ${RISK_COLORS[a.risk] || '#f97316'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: RISK_COLORS[a.risk], flexShrink: 0 }}>
                  {a.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{a.district} · {a.crimes} crimes</div>
                </div>
                <span className={`badge badge-${a.risk === 'critical' ? 'critical' : a.risk === 'high' ? 'high' : 'medium'}`} style={{ fontSize: '9px' }}>{a.riskScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
