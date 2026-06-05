import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCase, fetchEvidence } from '../services/api';
import { ArrowLeft, FileText, MapPin, AlertTriangle } from 'lucide-react';

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [evidence, setEvidence] = useState([]);

  useEffect(() => {
    fetchCase(id).then(setCaseData).catch(console.error);
    fetchEvidence().then(data => {
      setEvidence(data.filter(e => e.case_id === id));
    }).catch(console.error);
  }, [id]);

  if (!caseData) return <div className="p-8 text-muted">Loading...</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-primary transition-colors self-start">
        <ArrowLeft size={16} /> Back to Cases
      </button>
      
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{caseData.title}</h1>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-xs font-medium">{caseData.status}</span>
          </div>
          <p className="text-muted mt-1">{caseData.fir_number} • {caseData.crime_type}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Description</h2>
            <p className="text-sm leading-relaxed">{caseData.description}</p>
          </div>
          
          <div className="glass-panel p-6">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Evidence Board</h2>
            <div className="grid grid-cols-2 gap-4">
              {evidence.map(e => (
                <div key={e.id} className="p-4 rounded-lg bg-surface border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-blue-400" />
                    <span className="font-medium text-sm">{e.evidence_type}</span>
                  </div>
                  <p className="text-xs text-muted mb-2">{e.description}</p>
                  <div className="text-xs bg-background inline-block px-2 py-1 rounded border border-border text-muted">
                    Confidence: {(e.confidence_score * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
              {evidence.length === 0 && <p className="text-sm text-muted">No evidence linked to this case yet.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Location & Priority</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-muted" />
                <span>{caseData.police_station}, {caseData.district}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <AlertTriangle size={16} className={caseData.priority === 'High' ? 'text-red-500' : 'text-muted'} />
                <span>Priority: {caseData.priority}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
