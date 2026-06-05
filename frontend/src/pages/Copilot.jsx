import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, AlertTriangle, Lightbulb } from 'lucide-react';
import { askCopilot } from '../services/api';
import ReactMarkdown from 'react-markdown';

const SUGGESTED_QUERIES = [
  "Show cyber fraud cases in Bengaluru.",
  "Show high-risk offenders.",
  "Show vulnerable victims.",
  "Show cases involving bank transactions."
];

const Copilot = () => {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: "Hello, Investigator. I am SentinelAI Copilot. How can I assist you with your case files, offender tracking, or network analysis today?",
    sources: [],
    confidence: null
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText) => {
    if (!queryText.trim()) return;
    
    const newMessages = [...messages, { role: 'user', text: queryText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = newMessages.map(m => ({ role: m.role, content: m.text }));
      const response = await askCopilot(queryText, history);
      
      if (response.error) {
        setMessages(prev => [...prev, { role: 'assistant', text: `**Error:** ${response.error}` }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: response.answer,
          sources: response.sources || [],
          confidence: response.confidence
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "**Error:** Failed to connect to Copilot API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold">Crime Intelligence Copilot</h1>
          <p className="text-muted mt-1">Natural language queries against real-time database records.</p>
        </div>
      </div>
      
      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-surface border border-border text-primary'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-surface border border-border'}`}>
                  {msg.role === 'user' ? (
                     <p className="text-sm">{msg.text}</p>
                  ) : (
                     <div className="text-sm prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background prose-pre:border prose-pre:border-border">
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                     </div>
                  )}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.confidence !== null && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                        <AlertTriangle size={10} /> {(msg.confidence * 100).toFixed(0)}% Confident
                      </span>
                    )}
                    {msg.sources.map((src, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs text-muted bg-background px-2 py-1 rounded border border-border">
                        <FileText size={12} className="text-blue-400" /> {src.type}: {src.id}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                <Bot size={16} className="animate-pulse" />
              </div>
              <div className="px-5 py-3 rounded-2xl bg-surface border border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-muted animate-bounce delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-muted animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
            <p className="text-xs text-muted font-medium uppercase tracking-wider mb-3 flex items-center gap-2"><Lightbulb size={14}/> Suggested Queries</p>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_QUERIES.map(q => (
                <button key={q} onClick={() => handleSend(q)} className="text-left text-sm bg-background/80 hover:bg-surface border border-border p-3 rounded-lg text-muted hover:text-primary transition-colors truncate">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-surface/50 border-t border-border">
          <div className="max-w-4xl mx-auto relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask Copilot to analyze cases, find connections, or draft summaries..." 
              className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copilot;
