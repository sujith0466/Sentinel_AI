import { useEffect, useState } from 'react';
import { fetchVictims } from '../services/api';
import { UserCheck, Shield } from 'lucide-react';

const Victims = () => {
  const [victims, setVictims] = useState([]);

  useEffect(() => {
    fetchVictims().then(setVictims).catch(console.error);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold">Victim Manifest</h1>
          <p className="text-muted mt-1">Database of affected individuals for correlation.</p>
        </div>
      </div>
      
      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface/50 text-sm text-muted">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Demographics</th>
              <th className="p-4 font-medium">Vulnerability Score</th>
            </tr>
          </thead>
          <tbody>
            {victims.map((v) => (
              <tr key={v.id} className="border-b border-border hover:bg-surface/50 cursor-pointer transition-colors text-sm">
                <td className="p-4 font-medium flex items-center gap-3">
                  <UserCheck size={16} className="text-muted" /> {v.name}
                </td>
                <td className="p-4 text-muted">{v.contact_info || 'Unknown'}</td>
                <td className="p-4">
                  <span className="bg-surface px-2 py-1 rounded border border-border text-xs">Age: {v.demographics?.age || 'N/A'}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-surface rounded-full h-1.5 border border-border overflow-hidden">
                      <div className={`h-full ${v.vulnerability_score > 70 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${v.vulnerability_score}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-muted w-8 text-right">{v.vulnerability_score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Victims;
