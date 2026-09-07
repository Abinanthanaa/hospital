import React from 'react';
import { BarChart3, CheckCircle2, AlertCircle, TrendingUp, Cpu } from 'lucide-react';
import { EvaluationReport } from '../types';

interface EvaluationPageProps {
  report: EvaluationReport | null;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({ report }) => {
  if (!report) {
    return <div className="p-8 text-center text-slate-400">Loading evaluation benchmarks...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          Evaluation Benchmark: Baseline vs Target vs Measured Results
        </h2>
        <p className="text-xs text-slate-400">Quantitative benchmark evaluated dynamically against 52 synthetic hospital meeting datasets</p>
      </div>

      {/* Target vs Baseline Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-200">System Accuracy Benchmark Metrics</span>
          <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
            Evaluated on {report.total_decisions_evaluated} Decisions / {report.total_tasks_evaluated} Tasks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Operational Metric</th>
                <th className="p-3.5">Manual Baseline</th>
                <th className="p-3.5">Pre-Defined Target</th>
                <th className="p-3.5">Actual Measured Result</th>
                <th className="p-3.5">Status Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {report.metrics.map((m, idx) => {
                const isPassed = m.measured >= m.target;
                return (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-sans font-semibold text-slate-200">{m.metric}</td>
                    <td className="p-3.5 text-slate-400">{m.baseline}{m.unit}</td>
                    <td className="p-3.5 text-amber-300">≥ {m.target}{m.unit}</td>
                    <td className="p-3.5 font-extrabold text-cyan-400 text-sm">{m.measured}{m.unit}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isPassed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {isPassed ? '✓ PASSED TARGET' : 'BELOW TARGET'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categorized Error Analysis Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-3 p-5">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Categorized Error Analysis & Taxonomy Report
        </h3>
        <p className="text-xs text-slate-400">Detailed error classification identifying edge-case failure modes and corrective actions</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Error ID & Category</th>
                <th className="p-3">Input Text / Context</th>
                <th className="p-3">System Output</th>
                <th className="p-3">Expected Ground Truth</th>
                <th className="p-3">Possible System Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {report.error_analysis.map((err) => (
                <tr key={err.id} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                      {err.id}
                    </span>
                    <p className="text-xs font-bold text-amber-300 mt-1">{err.error_category}</p>
                  </td>
                  <td className="p-3 font-serif italic text-slate-300 max-w-xs">{err.input_text}</td>
                  <td className="p-3 font-mono text-red-300 text-[11px]">{err.system_output}</td>
                  <td className="p-3 font-mono text-emerald-300 text-[11px]">{err.expected_output}</td>
                  <td className="p-3 text-slate-400 text-xs">{err.possible_improvement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
