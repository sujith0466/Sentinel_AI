import { useEffect, useState } from 'react';
import { fetchRiskDashboard, fetchRiskTop } from '../services/api';
import { ShieldAlert, TrendingUp, BarChart3, AlertTriangle, Target, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Risk = () => {
  const [distribution, setDistribution] = useState({ Critical: 0, High: 0, Medium: 0, Low: 0 });
  const [topRisks, setTopRisks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRiskDashboard().then(res => setDistribution(res.distribution)).catch(console.error);
    fetchRiskTop().then(setTopRisks).catch(console.error);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (score >= 70) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    if (score >= 40) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><ShieldAlert className="text-red-500"/> Risk Intelligence Engine</h1>
          <p className="text-muted mt-1">Explainable AI scoring based on network topology, repeat offenses, and severity.</p>
        </div>
      </div>
      
      {/* Top Analytics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 glass-panel p-6 border bg-red-500/5 border-red-500/20 flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Critical Targets</p>
          <h3 className="text-5xl font-bold text-red-400">{distribution.Critical}</h3>
        </div>
        
        <div className="col-span-3 glass-panel p-6 flex items-center gap-8">
           <div className="flex-1">
             <p className="text-sm font-medium text-muted uppercase tracking-wider mb-4 flex items-center gap-2"><BarChart3 size={16}/> Risk Distribution</p>
             <div className="flex h-12 w-full rounded-lg overflow-hidden">
                <div style={{width: `${(distribution.Critical / 30) * 100}%`}} className="bg-red-500 hover:opacity-80 transition-opacity"></div>
                <div style={{width: `${(distribution.High / 30) * 100}%`}} className="bg-orange-500 hover:opacity-80 transition-opacity"></div>
                <div style={{width: `${(distribution.Medium / 30) * 100}%`}} className="bg-yellow-500 hover:opacity-80 transition-opacity"></div>
                <div style={{width: `${(distribution.Low / 30) * 100}%`}} className="bg-green-500 hover:opacity-80 transition-opacity"></div>
             </div>
             <div className="flex justify-between text-xs text-muted mt-2 px-1">
               <span>Critical ({distribution.Critical})</span>
               <span>High ({distribution.High})</span>
               <span>Medium ({distribution.Medium})</span>
               <span>Low ({distribution.Low})</span>
             </div>
           </div>
        </div>
      </div>

      {/* High-Risk Watchlist */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden">
        <div className="p-5 border-b border-border bg-surface/50">
          <h2 className="font-medium flex items-center gap-2"><Target className="text-blue-500" size={18}/> High-Risk Watchlist</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {topRisks.map((entity, i) => (
            <div key={i} className="bg-surface border border-border p-5 rounded-lg flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{entity.name}</h3>
                  <p className="text-xs text-muted mt-1">ID: {entity.id}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border flex flex-col items-center ${getScoreColor(entity.score)}`}>
                  <span className="text-2xl font-bold">{entity.score}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">{entity.category}</span>
                </div>
              </div>
              
              <div className="bg-background/50 p-3 rounded-lg border border-border">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Explainable Factors</p>
                <div className="space-y-2">
                  {entity.factors.map((f, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-muted truncate flex-1">{f.factor}</span>
                      <span className="font-medium text-blue-400">+{f.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/criminals')}
                className="mt-auto w-full py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-medium text-sm rounded-lg transition-colors flex justify-center items-center gap-1"
              >
                View Digital Twin <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Risk;
