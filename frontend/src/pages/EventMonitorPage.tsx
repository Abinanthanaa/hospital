import React, { useState } from 'react';
import { Activity, Copy, Shuffle, CheckCircle2, Play, ArrowRight, ShieldCheck } from 'lucide-react';
import { EventItem } from '../types';
import { api } from '../services/api';

interface EventMonitorPageProps {
  events: EventItem[];
  onRefresh: () => void;
}

export const EventMonitorPage: React.FC<EventMonitorPageProps> = ({ events, onRefresh }) => {
  const [simulationLog, setSimulationLog] = useState<any>(null);

  const handleSimulateDuplicate = async () => {
    const res = await api.simulateDuplicate();
    setSimulationLog(res);
    onRefresh();
  };

  const handleSimulateOutOfOrder = async () => {
    const res = await api.simulateOutOfOrder();
    setSimulationLog(res);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Idempotent Event Monitor & State Recovery Pipeline
          </h2>
          <p className="text-xs text-slate-400">Verifies duplicate suppression and out-of-order event sequence reconciliation</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateDuplicate}
            className="px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Test Duplicate Event</span>
          </button>

          <button
            onClick={handleSimulateOutOfOrder}
            className="px-3.5 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Test Out-of-Order Recovery</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-2">
            <span>INPUT EVENT ORDER</span>
            <span className="text-[10px] font-mono text-slate-500">Step 1</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="p-2 rounded bg-slate-950 text-purple-300 border border-purple-900/60">
              1. TaskCompleted (10:00 AM)
            </div>
            <div className="p-2 rounded bg-slate-950 text-cyan-300 border border-cyan-900/60">
              2. TaskCreated (10:05 AM)
            </div>
            <div className="p-2 rounded bg-slate-950 text-emerald-300 border border-emerald-900/60">
              3. TaskAssigned (10:10 AM)
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-2">
            <span>PROCESSED RECONCILIATION</span>
            <span className="text-[10px] font-mono text-slate-500">Step 2</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <p className="p-2 bg-slate-950 rounded border border-slate-800">
              • Completed event creates stub task, sets state Completed.
            </p>
            <p className="p-2 bg-slate-950 rounded border border-slate-800">
              • Late Created event attaches metadata without state regression.
            </p>
            <p className="p-2 bg-slate-950 rounded border border-slate-800">
              • Late Assigned event assigns owner without status regression.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-emerald-500/40 bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-2">
            <span>FINAL STATE VERDICT</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-center py-3">
            <span className="text-xl font-extrabold text-white font-mono">COMPLETED</span>
            <p className="text-[11px] text-emerald-300 font-bold mt-1">✓ State recovered correctly</p>
            <p className="text-[10px] text-slate-400 mt-1">0% state corruption / 0 duplicate tasks created</p>
          </div>
        </div>
      </div>

      {/* Simulation Result Log */}
      {simulationLog && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Event Processing Proof Log
          </h4>
          <pre className="font-mono text-[11px] text-emerald-300 overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800 max-h-40">
            {JSON.stringify(simulationLog, null, 2)}
          </pre>
        </div>
      )}

      {/* Recent Events Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-slate-200">
          Live Event Ingestion Feed ({events.length} Events Logged)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Sequence</th>
                <th className="p-3">Event Hash ID</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Source</th>
                <th className="p-3">Task / Decision ID</th>
                <th className="p-3">Payload Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {events.slice(0, 20).map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40">
                  <td className="p-3 text-cyan-400">#{e.sequence_num}</td>
                  <td className="p-3 font-bold text-slate-200">{e.event_id}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-semibold">
                      {e.event_type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{e.source}</td>
                  <td className="p-3 text-amber-300">{e.task_id || e.decision_id || 'N/A'}</td>
                  <td className="p-3 text-slate-400 truncate max-w-xs">{e.payload}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
