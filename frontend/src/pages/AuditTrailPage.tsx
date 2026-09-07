import React from 'react';
import { History, Sliders, User, Calendar } from 'lucide-react';
import { Override } from '../types';

interface AuditTrailPageProps {
  overrides: Override[];
}

export const AuditTrailPage: React.FC<AuditTrailPageProps> = ({ overrides }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <History className="w-6 h-6 text-cyan-400" />
          Immutable Audit History & Override Log
        </h2>
        <p className="text-xs text-slate-400">Complete compliance audit trail tracking all human approvals, rejections, and parameter overrides.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-slate-200">
          Logged Overrides & Human Actions ({overrides.length} Audit Entries)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Reviewer</th>
                <th className="p-3.5">Target Decision / Task</th>
                <th className="p-3.5">Field Changed</th>
                <th className="p-3.5">Original Value</th>
                <th className="p-3.5">New Value</th>
                <th className="p-3.5">Audit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {overrides.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 text-slate-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-bold text-cyan-300">
                    {item.reviewer}
                  </td>
                  <td className="p-3.5 font-bold text-amber-300">
                    {item.decision_id || item.task_id}
                  </td>
                  <td className="p-3.5 uppercase font-bold text-slate-200">
                    {item.field_changed}
                  </td>
                  <td className="p-3.5 text-red-400 line-through">
                    {item.original_value || 'None'}
                  </td>
                  <td className="p-3.5 text-emerald-400 font-bold">
                    {item.new_value}
                  </td>
                  <td className="p-3.5 font-sans text-slate-300 italic max-w-xs">
                    &quot;{item.reason}&quot;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
