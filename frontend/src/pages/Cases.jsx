import { useEffect, useState } from 'react';
import { fetchCases } from '../services/api';
import { Briefcase, AlertCircle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases().then(setCases).catch(console.error);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold">Cases Directory</h1>
          <p className="text-muted mt-1">Manage and explore FIRs and incident reports.</p>
        </div>
        <div className="text-sm text-muted bg-surface px-3 py-1 rounded-full border border-border">
          {cases.length} Total Records
        </div>
      </div>
      
      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface/50 text-sm text-muted">
              <th className="p-4 font-medium">FIR Number</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Crime Type</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Priority</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} className="border-b border-border hover:bg-surface/50 cursor-pointer transition-colors text-sm">
                <td className="p-4 font-medium text-blue-400">{c.fir_number}</td>
                <td className="p-4">{c.title}</td>
                <td className="p-4">
                  <span className="bg-surface px-2 py-1 rounded border border-border text-xs">{c.crime_type}</span>
                </td>
                <td className="p-4 flex items-center gap-2 text-muted">
                  <MapPin size={14}/> {c.police_station}, {c.district}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${c.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-surface border border-border text-muted'}`}>
                    {c.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cases;
