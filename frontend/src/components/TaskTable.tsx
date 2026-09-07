import React, { useState } from 'react';
import { 
  CheckSquare, Search, Filter, AlertCircle, 
  ChevronRight, Eye, CheckCircle, Clock, User 
} from 'lucide-react';
import { Task } from '../types';

interface TaskTableProps {
  tasks: Task[];
  onStatusUpdate: (taskId: string, newStatus: string) => void;
  onSelectTask: (task: Task) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onStatusUpdate,
  onSelectTask
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = 
      t.action.toLowerCase().includes(search.toLowerCase()) ||
      t.owner.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title, owner, or ID..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3.5">Task ID & Action Directive</th>
              <th className="p-3.5">Assigned Owner</th>
              <th className="p-3.5">Department</th>
              <th className="p-3.5">Deadline</th>
              <th className="p-3.5">Risk & Priority</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTasks.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/40 transition-colors group">
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                      {t.id}
                    </span>
                    <span className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {t.action}
                    </span>
                  </div>
                  {t.completion_evidence && (
                    <p className="text-[10px] text-emerald-400 mt-1 italic flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" /> Evidence: {t.completion_evidence}
                    </p>
                  )}
                </td>

                <td className="p-3.5">
                  <span className={`font-medium flex items-center gap-1.5 ${
                    t.owner === 'Unknown' ? 'text-amber-400 font-bold' : 'text-slate-200'
                  }`}>
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {t.owner}
                  </span>
                </td>

                <td className="p-3.5 text-slate-400 font-medium">
                  {t.department}
                </td>

                <td className="p-3.5 font-medium text-slate-300">
                  {t.deadline}
                </td>

                <td className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      t.priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      t.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-[10px] text-slate-500">Risk: {t.risk_level}</span>
                  </div>
                </td>

                <td className="p-3.5">
                  <select
                    value={t.status}
                    onChange={(e) => onStatusUpdate(t.id, e.target.value)}
                    className={`text-[11px] font-bold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                      t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                      t.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                      t.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>

                <td className="p-3.5 text-right">
                  <button
                    onClick={() => onSelectTask(t)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[11px] inline-flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>Evidence</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
