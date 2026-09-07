import React from 'react';
import { 
  LayoutDashboard, FileText, ShieldCheck, CheckSquare, 
  MessageSquare, Search, Activity, History, BarChart3, 
  AlertTriangle, Lock, HelpCircle, PlayCircle, Stethoscope 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenDemo }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meetings', label: 'Meetings', icon: FileText },
    { id: 'decisions', label: 'Decision Review', icon: ShieldCheck, badge: 'High Impact' },
    { id: 'tasks', label: 'Task Tracker', icon: CheckSquare },
    { id: 'chat', label: 'Chat Updates', icon: MessageSquare },
    { id: 'evidence', label: 'Evidence Inspector', icon: Search },
    { id: 'events', label: 'Event Monitor', icon: Activity },
    { id: 'audit', label: 'Audit History', icon: History },
    { id: 'evaluation', label: 'Evaluation', icon: BarChart3 },
    { id: 'risks', label: 'Risk Register', icon: AlertTriangle },
    { id: 'privacy', label: 'Privacy & Safety', icon: Lock },
    { id: 'docs', label: 'Architecture & Guide', icon: HelpCircle }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-sm tracking-tight leading-tight">MedOps Intelligence</h1>
          <p className="text-xs text-cyan-400 font-medium">Decision-to-Action OS</p>
        </div>
      </div>

      {/* Quick Demo Trigger */}
      <div className="p-3">
        <button
          onClick={onOpenDemo}
          className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 font-medium text-xs flex items-center justify-between transition-all group shadow-sm"
        >
          <span className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            Interactive Demo Mode
          </span>
          <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded font-mono">LIVE</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Banner */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Synthetic Data Secured</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 leading-tight">
          No real patient or hospital records stored.
        </p>
      </div>
    </aside>
  );
};
