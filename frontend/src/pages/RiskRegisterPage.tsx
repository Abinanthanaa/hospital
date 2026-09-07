import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { RiskItem } from '../types';

export const RiskRegisterPage: React.FC = () => {
  const [risks, setRisks] = useState<RiskItem[]>([]);

  useEffect(() => {
    api.getRiskRegister().then(data => setRisks(data.risks));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Hospital Operational Risk Register
        </h2>
        <p className="text-xs text-slate-400">Identified operational risks, impact levels, and active software safety controls</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Risk ID</th>
                <th className="p-3.5">Identified Operational Risk</th>
                <th className="p-3.5">Impact Level</th>
                <th className="p-3.5">Likelihood</th>
                <th className="p-3.5">Active System Mitigation & Safety Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {risks.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-cyan-400">{r.id}</td>
                  <td className="p-3.5 font-sans font-bold text-slate-200">{r.risk}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      r.impact === 'Critical' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                      r.impact === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {r.impact}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{r.likelihood}</td>
                  <td className="p-3.5 font-sans text-slate-300 leading-snug">{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
