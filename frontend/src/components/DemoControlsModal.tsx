import React, { useState } from 'react';
import { X, Play, Copy, Clock, Shuffle, UserX, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface DemoControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const DemoControlsModal: React.FC<DemoControlsModalProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [outputLog, setOutputLog] = useState<any>(null);

  const handleRunFlow = async () => {
    setLoading(true);
    try {
      const res = await api.runDemoWorkflow();
      setOutputLog(res);
      onRefreshData();
    } catch (err: any) {
      setOutputLog({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInjectDuplicate = async () => {
    setLoading(true);
    try {
      const res = await api.simulateDuplicate();
      setOutputLog(res);
      onRefreshData();
    } catch (err: any) {
      setOutputLog({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInjectOutOfOrder = async () => {
    setLoading(true);
    try {
      const res = await api.simulateOutOfOrder();
      setOutputLog(res);
      onRefreshData();
    } catch (err: any) {
      setOutputLog({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInjectAmbiguous = async () => {
    setLoading(true);
    try {
      const res = await api.injectAmbiguous();
      setOutputLog(res);
      onRefreshData();
    } catch (err: any) {
      setOutputLog({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInjectConflict = async () => {
    setLoading(true);
    try {
      const res = await api.injectConflict();
      setOutputLog(res);
      onRefreshData();
    } catch (err: any) {
      setOutputLog({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-base">Interactive Demo & Edge-Case Injector</h2>
            <p className="text-xs text-slate-400">Demonstrate end-to-end hospital workflow & idempotent state recovery</p>
          </div>
        </div>

        {/* Core Demo Workflow Button */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/40 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-cyan-300">Run End-to-End Workflow Scenario</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Meeting → Extracted Decision → High-Impact Warning → Human Approval → Task Created → Chat Completion Update → Completed Status
              </p>
            </div>
            <button
              onClick={handleRunFlow}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-all shrink-0 active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>RUN FULL FLOW</span>
            </button>
          </div>
        </div>

        {/* Edge Case Injectors */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Inject Edge Cases into Live System</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleInjectDuplicate}
            disabled={loading}
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Copy className="w-4 h-4" />
              <span>EDGE CASE 1: Duplicate Event</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Sends TaskCompleted twice to verify single completion state without duplicate tasks.</p>
          </button>

          <button
            onClick={handleInjectOutOfOrder}
            disabled={loading}
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Shuffle className="w-4 h-4" />
              <span>EDGE CASE 2: Out-of-Order Event</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Sends Completed BEFORE Created and Assigned to test state sequence recovery.</p>
          </button>

          <button
            onClick={handleInjectAmbiguous}
            disabled={loading}
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <UserX className="w-4 h-4" />
              <span>EDGE CASE 3: Ambiguous Owner</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Injects &quot;someone from night shift&quot; statement requiring human assignment.</p>
          </button>

          <button
            onClick={handleInjectConflict}
            disabled={loading}
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>EDGE CASE 5: Conflicting Owner</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Injects chat conflict between Dr. Ravi and Dr. Kumar to flag human review.</p>
          </button>
        </div>

        {/* Live Output Inspector */}
        {outputLog && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-cyan-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> System Execution Payload Log
              </span>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">200 OK</span>
            </div>
            <pre className="font-mono text-[11px] text-emerald-300 overflow-x-auto p-2 bg-slate-900/80 rounded max-h-48">
              {JSON.stringify(outputLog, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
