import { Search } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-16 border-b border-border bg-surface/50 flex items-center justify-between px-6 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search cases, criminals, or ask Copilot..." 
            className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-sm font-medium text-blue-500">
          JD
        </div>
      </div>
    </header>
  );
};

export default Topbar;
