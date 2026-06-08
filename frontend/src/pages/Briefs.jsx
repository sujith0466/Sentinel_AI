import { useEffect, useState } from 'react';
import { fetchBriefs, getBriefDownloadUrl } from '../services/api';
import { FileText, Download, CheckCircle, XCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Briefs = () => {
  const [briefs, setBriefs] = useState([]);
  const [selectedBrief, setSelectedBrief] = useState(null);

  useEffect(() => {
    fetchBriefs().then(data => {
      setBriefs(data);
      if (data.length > 0) setSelectedBrief(data[0]);
    }).catch(console.error);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Brief History Sidebar */}
      <div className="w-1/3 glass-panel flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border bg-surface/50">
          <h2 className="font-semibold flex items-center gap-2"><FileText size={18} className="text-blue-500"/> Brief History</h2>
          <p className="text-xs text-muted mt-1">Archive of all generated intelligence.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {briefs.map(brief => (
            <div 
              key={brief.id} 
              onClick={() => setSelectedBrief(brief)}
              className={`p-4 border-b border-border cursor-pointer transition-colors ${selectedBrief?.id === brief.id ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : 'hover:bg-surface border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm line-clamp-1 pr-2">{brief.title}</h4>
                <ChevronRight size={16} className="text-muted shrink-0" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${brief.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-400'}`}>
                  {brief.severity}
                </span>
                <span className="text-xs text-muted">{new Date(brief.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {briefs.length === 0 && (
            <div className="p-8 text-center text-sm text-muted">No briefs generated yet. Go to the Investigation Room to deploy agents.</div>
          )}
        </div>
      </div>

      {/* Brief Viewer */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden">
        {selectedBrief ? (
          <>
            <div className="p-6 border-b border-border bg-surface/30 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{selectedBrief.title}</h1>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-muted">
                    {selectedBrief.status === 'completed' ? <><CheckCircle size={14} className="text-green-500"/> Completed</> : <><XCircle size={14} className="text-red-500"/> Failed</>}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted"><AlertTriangle size={14} className="text-blue-500"/> Conf: {(selectedBrief.confidence_score * 100).toFixed(0)}%</span>
                  <span className="text-xs text-muted">ID: {selectedBrief.id.substring(0,8)}</span>
                </div>
              </div>
              <a 
                href={getBriefDownloadUrl(selectedBrief.id)} 
                target="_blank" 
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
              >
                <Download size={16} /> Export PDF
              </a>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-[#0B1120]">
              <div className="max-w-3xl mx-auto prose prose-invert prose-blue prose-headings:font-bold prose-a:text-blue-400 prose-pre:bg-surface prose-pre:border prose-pre:border-border">
                <ReactMarkdown>{selectedBrief.content_markdown || "No intelligence content generated for this brief."}</ReactMarkdown>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted opacity-50">
            <FileText size={48} className="mb-4" />
            <p>Select an Intelligence Brief to view.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Briefs;
