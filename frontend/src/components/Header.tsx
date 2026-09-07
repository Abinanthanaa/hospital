import React from 'react';
import { Hospital, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  onRunDemo: () => void;
}

const DEPARTMENTS = [
  'All Departments',
  'Emergency Department',
  'ICU',
  'Infection Control',
  'Nursing',
  'Pharmacy',
  'Laboratory',
  'Administration'
];

export const Header: React.FC<HeaderProps> = ({
  selectedDepartment,
  setSelectedDepartment,
  onRunDemo
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Hospital className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">Department Scope:</span>
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">Idempotent Event Engine: ONLINE</span>
        </div>

        <button
          onClick={onRunDemo}
          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Run Demo Workflow</span>
        </button>
      </div>
    </header>
  );
};
