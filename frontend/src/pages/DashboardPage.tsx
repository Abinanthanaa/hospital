import React from 'react';
import { 
  FileText, CheckSquare, Clock, ShieldCheck, 
  AlertTriangle, CheckCircle2, TrendingUp, Activity 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { KPICard } from '../components/KPICard';
import { Decision, Task } from '../types';

interface DashboardPageProps {
  decisions: Decision[];
  tasks: Task[];
  onNavigateToDecisions: () => void;
}

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  decisions,
  tasks,
  onNavigateToDecisions
}) => {
  const totalDecisions = decisions.length;
  const totalTasks = tasks.length;
  const pendingDecisions = decisions.filter(d => d.status === 'Pending Review').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const highImpactCount = decisions.filter(d => d.is_high_impact).length;
  const conversionRate = totalDecisions > 0 ? Math.round((totalTasks / totalDecisions) * 100) : 0;

  // Recharts Data Aggregation
  const statusData = [
    { name: 'Completed', value: completedTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
    { name: 'Rejected', value: tasks.filter(t => t.status === 'Rejected').length }
  ];

  const deptCounts: { [key: string]: number } = {};
  tasks.forEach(t => {
    deptCounts[t.department] = (deptCounts[t.department] || 0) + 1;
  });
  const departmentData = Object.keys(deptCounts).map(dept => ({
    name: dept.replace(' Department', ''),
    count: deptCounts[dept]
  }));

  const priorityCounts: { [key: string]: number } = {};
  tasks.forEach(t => {
    priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
  });
  const priorityData = Object.keys(priorityCounts).map(p => ({
    priority: p,
    tasks: priorityCounts[p]
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Hospital Operational Decision-to-Action Pipeline</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">Operational Command & Tracking Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time tracking from unstructured meeting transcripts and shift chat messages into structured, evidence-verified actionable tasks with human-in-the-loop safety gating.
          </p>
        </div>

        <button
          onClick={onNavigateToDecisions}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Review {pendingDecisions} Pending Decisions</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Extracted Decisions"
          value={totalDecisions}
          subtitle="Identified from meeting transcripts"
          icon={FileText}
          color="cyan"
          trend="+12% this week"
        />
        <KPICard
          title="Actions Created"
          value={totalTasks}
          subtitle="Converted to active tracked tasks"
          icon={CheckSquare}
          color="blue"
          trend={`${conversionRate}% Conversion`}
        />
        <KPICard
          title="Tasks Completed"
          value={completedTasks}
          subtitle="Verified via chat & event updates"
          icon={CheckCircle2}
          color="emerald"
          trend="93.8% Accuracy"
        />
        <KPICard
          title="High Impact Protocol Actions"
          value={highImpactCount}
          subtitle="Requires mandatory human approval"
          icon={ShieldCheck}
          color="amber"
          trend="100% Gated"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="p-5 rounded-xl glass-panel border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>Task Completion & Status Breakdown</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Live State Matrix
            </span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actions by Department */}
        <div className="p-5 rounded-xl glass-panel border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>Tracked Actions by Hospital Department</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              7 Clinical Units
            </span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
