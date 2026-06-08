import { useState, useEffect } from 'react';
import { analyzeInvestigation, fetchCriminals, fetchCases, fetchVictims } from '../services/api';
import { Play, CheckCircle2, XCircle, Clock, FileText, Target, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AGENTS = ['SupervisorAgent', 'InvestigationAgent', 'NetworkAgent', 'ProfilingAgent', 'SummaryAgent'];

const InvestigationRoom = () => {
  const [entityType, setEntityType] = useState('criminal');
  const [entityId, setEntityId] = useState('');
  const [entities, setEntities] = useState([]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [result, setResult] = useState(null);

  // Load dropdown options based on entityType
  useEffect(() => {
    setEntityId('');
    if (entityType === 'criminal') fetchCriminals().then(setEntities);
    if (entityType === 'case') fetchCases().then(setEntities);
    if (entityType === 'victim') fetchVictims().then(setEntities);
  }, [entityType]);

  const handleAnalyze = async () => {
    if (!entityId) return;
    setIsRunning(true);
    setTimeline([{ agent: 'SupervisorAgent', status: 'Running', message: 'Initiating Investigation Sequence...', time: Date.now() }]);
    setResult(null);
    
    try {
      const res = await analyzeInvestigation(entityType, entityId);
      if (res.error) {
        setTimeline(res.timeline || [{ agent: 'SupervisorAgent', status: 'Failed', message: res.error, time: Date.now() }]);
        setIsRunning(false);
      } else {
        let currentIndex = 0;
        const timelineEvents = res.timeline;
        const interval = setInterval(() => {
          if (currentIndex < timelineEvents.length) {
            setTimeline(timelineEvents.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(interval);
            setResult(res);
            setIsRunning(false);
          }
        }, 800);
      }
    } catch (err) {
       setTimeline(prev => [...prev, { agent: 'SupervisorAgent', status: 'Failed', message: 'Network error.', time: Date.now() }]);
       setIsRunning(false);
    }
  };

  const getAgentStatus = (agentName) => {
    const events = timeline.filter(t => t.agent === agentName);
    if (events.length === 0) return 'Idle';
    return events[events.length - 1].status; // 'Running', 'Completed', 'Failed'
  };

  const StatusIcon = ({ status }) => {
    if (status === 'Idle') return <Clock size={16} className="text-muted" />;
    if (status === 'Running') return <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />;
    if (status === 'Completed') return <CheckCircle2 size={16} className="text-green-500" />;
    if (status === 'Failed') return <XCircle size={16} className="text-red-500" />;
    return null;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><Target className="text-blue-500"/> Multi-Agent Investigation Room</h1>
          <p className="text-muted mt-1">Deploy an autonomous team to synthesize database and network intelligence.</p>
        </div>
      </div>
      
      {/* Target Selection Panel */}
      <div className="glass-panel p-4 flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Entity Type</label>
          <select value={entityType} onChange={e => setEntityType(e.target.value)} className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm focus:outline-none">
            <option value="criminal">Criminal Profile</option>
            <option value="case">Case / FIR</option>
            <option value="victim">Victim Manifest</option>
          </select>
        </div>
        <div className="flex-[2]">
          <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Target Entity</label>
          <select value={entityId} onChange={e => setEntityId(e.target.value)} className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm focus:outline-none" disabled={isRunning}>
            <option value="">Select Target...</option>
            {entities.map(e => (
              <option key={e.id} value={e.id}>{e.name || e.title} ({e.id.substring(0,8)})</option>
            ))}
          </select>
        </div>
        <button 
          onClick={handleAnalyze} 
          disabled={!entityId || isRunning}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          {isRunning ? <div className="w-4 h-4 rounded-full border-2 border-white/50 border-t-white animate-spin"/> : <Play size={16} />}
          {isRunning ? 'Investigating...' : 'Deploy Agents'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
        
        {/* Agent Orchestration & Timeline */}
        <div className="col-span-1 flex flex-col gap-6 overflow-hidden">
          {/* Agent Status */}
          <div className="glass-panel p-5">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Agent Roster</h2>
            <div className="space-y-3">
              {AGENTS.map(agent => {
                const status = getAgentStatus(agent);
                return (
                  <div key={agent} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={status} />
                      <span className={`text-sm font-medium ${status === 'Running' ? 'text-blue-400' : ''}`}>{agent}</span>
                    </div>
                    <span className="text-xs text-muted font-medium uppercase tracking-wider">{status}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-panel p-5 flex-1 overflow-y-auto">
             <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Execution Timeline</h2>
             <div className="space-y-4 border-l-2 border-border ml-3 pl-4 relative">
               {timeline.map((event, idx) => (
                 <div key={idx} className="relative">
                   <div className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full ${event.status==='Failed'?'bg-red-500':event.status==='Completed'?'bg-green-500':'bg-blue-500'}`}></div>
                   <div className="text-xs font-bold text-muted mb-1">{new Date(event.time * 1000).toLocaleTimeString()}</div>
                   <div className="text-sm font-medium">{event.agent}</div>
                   <div className="text-sm text-muted">{event.message}</div>
                 </div>
               ))}
               {timeline.length === 0 && <p className="text-sm text-muted">Awaiting deployment...</p>}
             </div>
          </div>
        </div>

        {/* Results Viewer */}
        <div className="col-span-2 glass-panel flex flex-col overflow-hidden relative">
          <div className="p-4 border-b border-border flex items-center gap-3 bg-surface/50">
            <FileText className="text-muted" size={18} />
            <h2 className="font-medium">Unified Investigation Report</h2>
            {result?.confidence && (
              <div className="ml-auto flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded">
                 <AlertTriangle size={14}/> {result.confidence * 100}% Agent Confidence
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {!result && !isRunning && (
               <div className="h-full flex flex-col items-center justify-center text-muted opacity-50">
                 <Target size={48} className="mb-4" />
                 <p>Select a target and deploy agents to generate a report.</p>
               </div>
            )}
            
            {isRunning && !result && (
               <div className="h-full flex flex-col items-center justify-center">
                 <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4" />
                 <p className="text-muted">Synthesizing intelligence...</p>
               </div>
            )}

            {result && (
              <div className="space-y-8">
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background prose-pre:border prose-pre:border-border">
                  <ReactMarkdown>{result.report}</ReactMarkdown>
                </div>
                
                {result.leads && result.leads.length > 0 && (
                  <div className="mt-8 border-t border-border pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-orange-400 flex items-center gap-2"><Target size={18}/> Recommended Investigative Leads</h3>
                    <ul className="space-y-3">
                      {result.leads.map((lead, idx) => (
                        <li key={idx} className="bg-surface border border-border p-4 rounded-lg text-sm text-muted flex gap-3">
                          <span className="font-bold text-orange-500">{idx+1}.</span>
                          {lead}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvestigationRoom;
