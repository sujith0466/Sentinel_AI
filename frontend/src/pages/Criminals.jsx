import { useEffect, useState } from 'react';
import { fetchCriminals, fetchRiskEntity } from '../services/api';
import { User, Activity, AlertTriangle, Network, Shield } from 'lucide-react';

const Criminals = () => {
  const [criminals, setCriminals] = useState([]);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    fetchCriminals().then(data => {
      setCriminals(data);
      if (data.length > 0) handleSelectCriminal(data[0]);
    }).catch(console.error);
  }, []);

  const handleSelectCriminal = (criminal) => {
    setSelectedCriminal(criminal);
    setRiskData(null);
    fetchRiskEntity(criminal.id).then(setRiskData).catch(console.error);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-red-500';
    if (score >= 70) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      
      {/* Left Sidebar: Directory */}
      <div className="w-80 glass-panel flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border bg-surface/50">
          <h2 className="font-semibold flex items-center gap-2"><User size={18} className="text-blue-500"/> Criminal Directory</h2>
          <div className="mt-3 relative">
            <input type="text" placeholder="Search profiles..." className="w-full bg-background border border-border rounded-lg pl-3 pr-3 py-2 text-sm focus:outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {criminals.map(c => (
            <div 
              key={c.id} 
              onClick={() => handleSelectCriminal(c)}
              className={`p-4 border-b border-border cursor-pointer transition-colors ${selectedCriminal?.id === c.id ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : 'hover:bg-surface border-l-4 border-l-transparent'}`}
            >
              <h4 className="font-medium text-sm">{c.name}</h4>
              <p className="text-xs text-muted mt-1 truncate">Alias: {c.alias || 'Unknown'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Digital Twin Profile */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden">
        {selectedCriminal ? (
          <>
            <div className="p-6 border-b border-border bg-surface/30 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-2xl font-bold uppercase border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  {selectedCriminal.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{selectedCriminal.name}</h1>
                  <p className="text-muted mt-1 text-sm flex items-center gap-2">
                    <span className="uppercase text-xs font-semibold tracking-wider px-2 py-0.5 bg-background rounded border border-border">ID: {selectedCriminal.id.substring(0,8)}</span>
                    <span>DOB: {selectedCriminal.dob || 'Unknown'}</span>
                  </p>
                </div>
              </div>
              
              {/* Risk Gauge Header */}
              {riskData && (
                 <div className={`text-right ${getScoreColor(riskData.score)}`}>
                   <div className="text-4xl font-black">{riskData.score}</div>
                   <div className="text-xs font-bold uppercase tracking-widest">{riskData.category} RISK</div>
                 </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Risk Intelligence Breakdown */}
              {riskData && (
                <div className="bg-surface border border-border p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                     <AlertTriangle size={150} />
                  </div>
                  <h2 className="text-sm font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2"><Activity size={16}/> Explainable Risk Analysis</h2>
                  
                  <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-3">
                      {riskData.factors.map((f, i) => (
                        <div key={i} className="flex flex-col gap-1 pb-3 border-b border-border last:border-0">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{f.factor}</span>
                            <span className="text-blue-400">+{f.points} pts</span>
                          </div>
                          <span className="text-xs text-muted">{f.desc}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-background border border-border rounded-lg p-4 flex flex-col justify-center items-center">
                       <Shield size={32} className="text-blue-500 mb-2"/>
                       <div className="text-xl font-bold">{riskData.confidence * 100}%</div>
                       <div className="text-xs text-muted uppercase tracking-wider font-semibold">Engine Confidence</div>
                       
                       {/* Mini Sparkline for Trend */}
                       <div className="mt-6 w-full px-4">
                          <div className="text-[10px] text-muted mb-2 uppercase tracking-widest text-center">Risk Trend</div>
                          <div className="flex items-end justify-between h-8 gap-2">
                             {riskData.trend.map((t, idx) => (
                               <div key={idx} className={`w-full bg-blue-500/50 rounded-t ${idx === riskData.trend.length-1 ? 'bg-red-500 opacity-100' : 'opacity-40'}`} style={{height: `${t}%`}}></div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* General Profile Data */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2"><Network size={16}/> Modus Operandi</h3>
                  <div className="bg-surface border border-border p-4 rounded-lg text-sm text-muted min-h-32">
                    {selectedCriminal.modus_operandi || "No modus operandi recorded."}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2"><Activity size={16}/> Known Aliases</h3>
                  <div className="bg-surface border border-border p-4 rounded-lg text-sm font-medium">
                    {selectedCriminal.alias || "None"}
                  </div>
                </div>
              </div>

            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted opacity-50">
            <User size={48} className="mb-4" />
            <p>Select a profile from the directory.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Criminals;
