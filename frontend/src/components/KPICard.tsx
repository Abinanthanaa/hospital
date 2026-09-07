import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'emerald' | 'amber' | 'red' | 'purple' | 'blue';
  trend?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
  trend
}) => {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    emerald: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    red: 'from-red-500/20 to-rose-500/10 border-red-500/30 text-red-400',
    purple: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    blue: 'from-blue-500/20 to-sky-500/10 border-blue-500/30 text-blue-400'
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[color]} border backdrop-blur-md relative overflow-hidden transition-all hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">{title}</span>
        <div className={`p-2 rounded-lg bg-slate-900/60 border border-slate-700/50`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {trend && (
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-900/80 text-emerald-400 border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[11px] text-slate-400 mt-1 leading-snug">{subtitle}</p>}
    </div>
  );
};
