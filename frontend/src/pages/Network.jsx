import { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { fetchNetworkGraph } from '../services/api';
import { Network as NetworkIcon, Search, Filter, ShieldAlert, Zap, Layers, MapPin } from 'lucide-react';

const NODE_COLORS = {
  criminal: '#ef4444', // Red
  victim: '#3b82f6',   // Blue
  case: '#eab308',     // Yellow
  evidence: '#10b981', // Green
  alert: '#f97316'     // Orange
};

const Network = () => {
  const fgRef = useRef();
  const [data, setData] = useState({ nodes: [], links: [] });
  const [associations, setAssociations] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    criminal: true, victim: true, case: true, evidence: true, alert: true
  });

  useEffect(() => {
    fetchNetworkGraph().then(res => {
      setData(res.graph);
      setAssociations(res.hidden_associations);
      setMetrics(res.global_metrics);
    }).catch(console.error);
  }, []);

  // Filter Data
  const filteredData = {
    nodes: data.nodes.filter(n => activeFilters[n.type]),
    links: data.links.filter(l => 
      activeFilters[data.nodes.find(n => n.id === (typeof l.source === 'object' ? l.source.id : l.source))?.type] && 
      activeFilters[data.nodes.find(n => n.id === (typeof l.target === 'object' ? l.target.id : l.target))?.type]
    )
  };

  const handleNodeClick = useCallback(node => {
    setSelectedNode(node);
    
    // Zoom to node
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(4, 2000);
    }
  }, [fgRef]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const node = data.nodes.find(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (node) {
      handleNodeClick(node);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      
      {/* Graph Canvas Panel */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface/80 z-10">
          <div className="flex gap-2">
            {Object.keys(NODE_COLORS).map(type => (
              <button 
                key={type}
                onClick={() => setActiveFilters(prev => ({...prev, [type]: !prev[type]}))}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border transition-colors ${activeFilters[type] ? 'bg-surface text-primary border-border' : 'bg-transparent text-muted border-transparent opacity-50'}`}
                style={{ borderLeftColor: activeFilters[type] ? NODE_COLORS[type] : 'transparent', borderLeftWidth: activeFilters[type] ? '3px' : '0' }}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-lg">
            <input 
              type="text" 
              placeholder="Search entity..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="bg-transparent text-sm focus:outline-none w-48"
            />
            <Search size={14} className="text-muted cursor-pointer hover:text-primary" onClick={handleSearch} />
          </div>
        </div>

        <div className="flex-1 bg-black/20">
          <ForceGraph2D
            ref={fgRef}
            graphData={filteredData}
            nodeLabel="label"
            nodeColor={node => NODE_COLORS[node.type] || '#fff'}
            nodeRelSize={6}
            nodeVal={node => (node.influence_score * 10) + 1}
            linkColor={() => '#334155'}
            linkOpacity={0.6}
            linkWidth={link => link.confidence ? link.confidence * 2 : 1}
            onNodeClick={handleNodeClick}
            width={800} // Dynamic width handling in production, hardcoded here for simplicity
            height={600}
            backgroundColor="#0f172a00" // transparent
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        
        {/* Entity Inspector */}
        <div className="glass-panel p-5 flex-1 overflow-y-auto">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center gap-2 mb-4"><Layers size={16}/> Inspector</h2>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{selectedNode.label}</h3>
                  <p className="text-xs font-medium text-muted uppercase mt-1" style={{color: NODE_COLORS[selectedNode.type]}}>{selectedNode.type}</p>
                </div>
              </div>
              
              <div className="bg-surface border border-border p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Influence Score</span>
                  <span className="font-medium">{(selectedNode.influence_score || 0).toFixed(3)}</span>
                </div>
                {selectedNode.type === 'criminal' && (
                  <div className="flex justify-between text-sm text-red-400">
                    <span>Risk Score</span>
                    <span className="font-medium">{selectedNode.risk_score}</span>
                  </div>
                )}
                {selectedNode.type === 'case' && (
                  <div className="text-xs text-muted">FIR: {selectedNode.fir}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-muted opacity-50">
              <NetworkIcon size={32} className="mb-2" />
              <p className="text-sm text-center">Select a node in the graph to inspect its properties.</p>
            </div>
          )}
        </div>

        {/* Hidden Associations */}
        <div className="glass-panel p-5 flex-1 overflow-y-auto">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center gap-2 mb-4"><Zap size={16}/> Hidden Links</h2>
          <div className="space-y-3">
            {associations.length > 0 ? associations.map((assoc, i) => (
              <div key={i} className="p-3 bg-surface border border-border rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => {
                setSearchQuery(assoc.source_label); handleSearch();
              }}>
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-red-400">{assoc.source_label}</div>
                  <div className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                    {(assoc.confidence * 100).toFixed(0)}% Match
                  </div>
                </div>
                <div className="text-xs text-muted flex items-center gap-2 my-1">
                  <div className="h-[1px] flex-1 bg-border"></div>
                  <span>Linked via</span>
                  <div className="h-[1px] flex-1 bg-border"></div>
                </div>
                <div className="text-sm font-medium text-blue-400">{assoc.target_label}</div>
                
                <div className="mt-2 text-xs text-muted">
                  <span className="block mb-1">Shared Nodes:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {assoc.shared_entities.slice(0, 3).map((e, idx) => <li key={idx} className="truncate">{e}</li>)}
                    {assoc.shared_entities.length > 3 && <li>+{assoc.shared_entities.length - 3} more</li>}
                  </ul>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted">No hidden associations detected in the current network.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Network;
