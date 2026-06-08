import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Briefcase, Network, ShieldAlert, Bell, FileText, Settings, User, Users, Target, MapPin, TrendingUp, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Intelligence Briefs', path: '/briefs', icon: FileText },
    { name: 'Investigation Room', path: '/investigation', icon: Target },
    { name: 'Copilot', path: '/copilot', icon: MessageSquare },
    { name: 'Cases', path: '/cases', icon: Briefcase },
    { name: 'Criminal Twins', path: '/criminals', icon: Target },
    { name: 'Victims', path: '/victims', icon: Users },
    { name: 'Risk Intelligence', path: '/risk', icon: ShieldAlert },
    { name: 'Crime Hotspots', path: '/hotspots', icon: MapPin },
    { name: 'Forecast Intelligence', path: '/forecast', icon: TrendingUp },
    { name: 'Sociological Intelligence', path: '/sociology', icon: Users },
    { name: 'Security & Governance', path: '/governance', icon: ShieldCheck },
    { name: 'Network Intelligence', path: '/network', icon: Network },
    { name: 'Alerts', path: '/alerts', icon: Bell },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface/50 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="font-semibold text-lg tracking-tight">Sentinel<span className="text-blue-500">AI</span></div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-500' 
                    : 'text-muted hover:text-primary hover:bg-surface'
                }`
              }
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <NavLink to="/profile" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-500/10 text-blue-500' : 'text-muted hover:text-primary hover:bg-surface'}`}>
          <User size={18} />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-500/10 text-blue-500' : 'text-muted hover:text-primary hover:bg-surface'}`}>
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
