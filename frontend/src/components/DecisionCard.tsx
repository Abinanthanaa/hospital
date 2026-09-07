import React from 'react';
import { 
  ShieldAlert, CheckCircle2, XCircle, Sliders, 
  User, Calendar, Clock, AlertTriangle, FileText, Check 
} from 'lucide-react';
import { Decision } from '../types';

interface DecisionCardProps {
  decision: Decision;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOverride: (decision: Decision) => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  onApprove,
  onReject,
  onOverride
}) => {
  const isApproved = decision.status === 'Approved';
  const isRejected = decision.status === 'Rejected';
  const isOverridden = decision.status === 'Overridden';

  return (
    <div className={`rounded-xl border p-5 transition-all glass-panel ${
      decision.is_high_impact 
        ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' 
        : 'border-slate-800'
    }`}>
      {/* High-Impact Alert Banner */}
      {decision.is_high_impact && (
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>⚠ HIGH-IMPACT CLINICAL PROTOCOL ACTION</span>
          </div>
          <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded font-mono font-bold uppercase">
            Human Confirmation Required
          </span>
        </div>
      )}

      {/* Decision Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
              {decision.id}
            </span>
            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
              decision.classification === 'Confirmed Decision' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {decision.classification}
            </span>
          </div>
          <h3 className="font-bold text-slate-100 text-sm mt-1.5 leading-snug">
            {decision.decision_title}
          </h3>
        </div>

        {/* Confidence Score Pill */}
        <div className="text-right">
          <div className="text-lg font-extrabold text-cyan-400 font-mono">
            {decision.confidence_score}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Confidence Score</span>
        </div>
      </div>

      {/* Extracted Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <FileText className="w-3 h-3 text-cyan-400" /> Action
          </span>
          <p className="text-xs font-medium text-slate-200 mt-0.5 leading-snug">
            {decision.extracted_action}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <User className="w-3 h-3 text-cyan-400" /> Owner
          </span>
          <p className={`text-xs font-medium mt-0.5 ${
            decision.extracted_owner === 'Unknown' ? 'text-amber-400 font-bold' : 'text-slate-200'
          }`}>
            {decision.extracted_owner}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-400" /> Deadline
          </span>
          <p className="text-xs font-medium text-slate-200 mt-0.5">
            {decision.extracted_deadline}
          </p>
        </div>
      </div>

      {/* Source Evidence Quote */}
      <div className="mb-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
        <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Source Transcript Evidence</span>
        <blockquote className="text-xs text-slate-300 italic mt-1 font-serif border-l-2 border-cyan-500/50 pl-2">
          {decision.evidence_quote}
        </blockquote>
      </div>

      {/* Rules / Rationale Checklist */}
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Extraction Rationale & Rules</span>
        <div className="mt-1 space-y-1 text-xs text-slate-300 whitespace-pre-line font-mono bg-slate-900/40 p-2.5 rounded border border-slate-800">
          {decision.rules_reason}
        </div>
      </div>

      {/* Overrides Audit Alert if applicable */}
      {decision.overrides && decision.overrides.length > 0 && (
        <div className="mb-4 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300">
          <span className="font-bold">Override History:</span> Changed {decision.overrides[0].field_changed} to &quot;{decision.overrides[0].new_value}&quot; — Reason: {decision.overrides[0].reason}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            isRejected ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            isOverridden ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse'
          }`}>
            {decision.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOverride(decision)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1 border border-slate-700 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>OVERRIDE</span>
          </button>

          <button
            onClick={() => onReject(decision.id)}
            disabled={isRejected}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 font-medium text-xs flex items-center gap-1 border border-red-800/80 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>REJECT</span>
          </button>

          <button
            onClick={() => onApprove(decision.id)}
            disabled={isApproved}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>APPROVE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
