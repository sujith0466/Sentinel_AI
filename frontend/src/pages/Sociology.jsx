import { useEffect, useState } from 'react';
import { fetchSociologyDashboard } from '../services/api';
import { Users, Activity, BarChart2, Lightbulb, MapPin, Target, TrendingUp, AlertTriangle } from 'lucide-react';

const Sociology = () => {
  const [data, setData] = useState({ demographics: null, correlations: [], risk_factors: [], insights: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSociologyDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-center text-muted">Aggregating socio-economic correlations...</div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 overflow-hidden">
      
      {/* Top row: Summary & Insights */}
      <div className="flex gap-6 h-1/3">
         {/* Executive Summary */}
         <div className="w-1/3 glass-panel p-5 flex flex-col">
            <h2 className="font-semibold flex items-center gap-2 mb-4"><Target size={18} className="text-purple-500"/> Executive Sociological Summary</h2>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
               {data.risk_factors.map((f, i) => (
                  <div key={i} className="bg-surface border border-border p-3 rounded-lg flex items-center justify-between">
                     <span className="text-sm font-medium">{f.factor}</span>
                     <div className="text-right">
                       <span className="text-xs font-bold text-blue-400">{f.impact_percentage}% Impact</span>
                       <span className={`block text-[10px] uppercase font-bold tracking-wider ${f.severity === 'High' ? 'text-red-500' : 'text-yellow-500'}`}>{f.severity}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* AI Generated Insights */}
         <div className="flex-1 glass-panel p-5 flex flex-col">
            <h2 className="font-semibold flex items-center gap-2 mb-4"><Lightbulb size={18} className="text-yellow-500"/> Sociological Insights</h2>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
               {data.insights.map((ins, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-4 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                     <div className="flex justify-between items-start ml-2">
                       <h3 className="font-bold text-sm text-white">{ins.insight}</h3>
                       <span className="px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] uppercase font-bold rounded">Conf: {(ins.confidence * 100).toFixed(0)}%</span>
                     </div>
                     <div className="ml-2 mt-3 p-3 bg-background/50 rounded text-xs text-muted border border-border flex flex-col gap-2">
                        <div><strong className="text-blue-400">Supporting Data:</strong> {ins.supporting_data}</div>
                        <div><strong className="text-purple-400">Explanation:</strong> {ins.explanation}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Bottom row: Demographics & Correlations */}
      <div className="flex gap-6 h-2/3">
         
         {/* Demographic Dashboard */}
         <div className="w-1/3 glass-panel flex flex-col overflow-hidden">
           <div className="p-5 border-b border-border bg-surface/50">
             <h2 className="font-semibold flex items-center gap-2"><Users size={18} className="text-blue-500"/> Demographic Analysis</h2>
           </div>
           <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              <div>
                <h3 className="text-xs uppercase text-muted font-bold tracking-wider mb-3">Offender Age Distribution</h3>
                <div className="space-y-2">
                  {data.demographics && Object.entries(data.demographics.age_groups).map(([age, count]) => (
                    <div key={age} className="flex items-center gap-3">
                      <div className="w-16 text-xs text-muted">{age}</div>
                      <div className="flex-1 bg-surface rounded h-2 overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{width: `${Math.min(100, count * 15)}%`}}></div>
                      </div>
                      <div className="w-8 text-right text-xs font-bold">{count}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase text-muted font-bold tracking-wider mb-3">Victim Vulnerability Index</h3>
                <div className="space-y-2">
                  {data.demographics && Object.entries(data.demographics.victim_vulnerability).map(([vuln, count]) => (
                    <div key={vuln} className="flex items-center gap-3">
                      <div className="w-16 text-xs text-muted">{vuln}</div>
                      <div className="flex-1 bg-surface rounded h-2 overflow-hidden">
                        <div className={`h-full ${vuln === 'Critical' ? 'bg-red-500' : vuln === 'High' ? 'bg-orange-500' : 'bg-green-500'}`} style={{width: `${Math.min(100, count * 15)}%`}}></div>
                      </div>
                      <div className="w-8 text-right text-xs font-bold">{count}</div>
                    </div>
                  ))}
                </div>
              </div>

           </div>
         </div>

         {/* Correlation Heatmap List */}
         <div className="flex-1 glass-panel flex flex-col overflow-hidden">
           <div className="p-5 border-b border-border bg-surface/50">
             <h2 className="font-semibold flex items-center gap-2"><Activity size={18} className="text-green-500"/> Socio-Economic Correlations</h2>
           </div>
           <div className="flex-1 overflow-y-auto p-5">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted uppercase bg-surface/50">
                   <tr>
                     <th className="px-4 py-3 rounded-tl-lg">Crime Type</th>
                     <th className="px-4 py-3">District</th>
                     <th className="px-4 py-3">Socio-Economic Indicator</th>
                     <th className="px-4 py-3 rounded-tr-lg text-right">Correlation Score</th>
                   </tr>
                </thead>
                <tbody>
                   {data.correlations.map((corr, i) => (
                      <tr key={i} className="border-b border-border hover:bg-surface/30 transition-colors">
                        <td className="px-4 py-4 font-medium text-white">{corr.crime_type}</td>
                        <td className="px-4 py-4 text-muted flex items-center gap-1"><MapPin size={12}/> {corr.district}</td>
                        <td className="px-4 py-4 text-blue-400 font-semibold">{corr.indicator.replace('_', ' ').title()}</td>
                        <td className="px-4 py-4 text-right">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${corr.correlation_score > 70 ? 'bg-red-500/10 text-red-500' : corr.correlation_score > 40 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                             {corr.correlation_score.toFixed(1)} / 100
                           </span>
                        </td>
                      </tr>
                   ))}
                </tbody>
              </table>
           </div>
         </div>

      </div>
    </div>
  );
};

export default Sociology;
