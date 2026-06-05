import { useEffect, useState } from 'react';
import { fetchGovernanceDashboard } from '../services/api';
import { ShieldCheck, ShieldAlert, Lock, UserCheck, Activity, Users, FileText } from 'lucide-react';

const Governance = () => {
  const [data, setData] = useState({ health_score: 0, total_audit_events: 0, audit_logs: [], role_matrix: {}, demo_session: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGovernanceDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-center text-muted">Auditing system governance logs...</div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 overflow-hidden">
      
      {/* Top row: Summary & Metrics */}
      <div className="flex gap-6 h-1/4">
         
         {/* Demo Session Info */}
         <div className="w-1/4 glass-panel p-5 flex flex-col justify-center relative overflow-hidden border-blue-500/30">
            <div className="absolute -right-6 -top-6 text-blue-500/10"><UserCheck size={120}/></div>
            <h2 className="font-semibold text-blue-400 mb-1 flex items-center gap-2"><Lock size={16}/> Active Demo Session</h2>
            <div className="text-xl font-bold text-white mt-2">{data.demo_session?.username}</div>
            <div className="text-xs uppercase tracking-widest text-muted mt-1">Role: <span className="text-blue-400">{data.demo_session?.role}</span></div>
            <div className="text-xs text-green-400 mt-2 flex items-center gap-1"><ShieldCheck size={12}/> RBAC Enforcement Active</div>
         </div>

         {/* Security Metrics */}
         <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="glass-panel p-5 flex flex-col justify-center">
               <Activity size={20} className="text-purple-500 mb-2"/>
               <div className="text-3xl font-black">{data.health_score}</div>
               <div className="text-[10px] uppercase tracking-wider text-muted font-bold mt-1">Governance Health Score</div>
            </div>
            <div className="glass-panel p-5 flex flex-col justify-center">
               <FileText size={20} className="text-orange-500 mb-2"/>
               <div className="text-3xl font-black">{data.total_audit_events}</div>
               <div className="text-[10px] uppercase tracking-wider text-muted font-bold mt-1">Audit Events Logged</div>
            </div>
            <div className="glass-panel p-5 flex flex-col justify-center">
               <Users size={20} className="text-green-500 mb-2"/>
               <div className="text-3xl font-black">{data.active_investigators + data.active_analysts}</div>
               <div className="text-[10px] uppercase tracking-wider text-muted font-bold mt-1">Active Personnel</div>
            </div>
         </div>
      </div>

      {/* Bottom row: Timeline & Matrix */}
      <div className="flex gap-6 h-3/4">
         
         {/* Audit Timeline */}
         <div className="w-2/3 glass-panel flex flex-col overflow-hidden">
           <div className="p-5 border-b border-border bg-surface/50">
             <h2 className="font-semibold flex items-center gap-2"><ShieldAlert size={18} className="text-red-400"/> System Audit Trail</h2>
           </div>
           <div className="flex-1 overflow-y-auto p-5">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase text-muted tracking-wider bg-surface/50">
                   <tr>
                     <th className="px-4 py-3 rounded-tl-lg">Timestamp</th>
                     <th className="px-4 py-3">User ID</th>
                     <th className="px-4 py-3">Role</th>
                     <th className="px-4 py-3">Module</th>
                     <th className="px-4 py-3 rounded-tr-lg">Action</th>
                   </tr>
                </thead>
                <tbody>
                   {data.audit_logs.map((log, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                        <td className="px-4 py-3 text-xs text-muted">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium text-blue-400">{log.user_id}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${log.role === 'Administrator' ? 'bg-red-500/10 text-red-500' : log.role === 'Supervisor' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {log.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted font-bold uppercase">{log.module}</td>
                        <td className="px-4 py-3 text-white">{log.action}</td>
                      </tr>
                   ))}
                </tbody>
              </table>
           </div>
         </div>

         {/* Role Permission Matrix */}
         <div className="flex-1 glass-panel flex flex-col overflow-hidden">
           <div className="p-5 border-b border-border bg-surface/50">
             <h2 className="font-semibold flex items-center gap-2"><Lock size={18} className="text-green-500"/> RBAC Permission Matrix</h2>
           </div>
           <div className="flex-1 overflow-y-auto p-5 space-y-4">
             {Object.entries(data.role_matrix).map(([role, perms]) => (
                <div key={role} className="bg-surface border border-border p-4 rounded-lg">
                   <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${role === 'Administrator' ? 'text-red-500' : role === 'Supervisor' ? 'text-orange-500' : 'text-blue-500'}`}>{role}</h3>
                   <div className="flex flex-wrap gap-2">
                     {perms.map(p => (
                        <span key={p} className="px-2 py-1 bg-background border border-border rounded text-xs text-muted font-medium font-mono">{p}</span>
                     ))}
                   </div>
                </div>
             ))}
           </div>
         </div>

      </div>
    </div>
  );
};

export default Governance;
