import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, FileText, User, Calendar, Award } from 'lucide-react';
import { Decision } from '../types';

interface EvidencePageProps {
  decisions: Decision[];
}

export const EvidencePage: React.FC<EvidencePageProps> = ({ decisions }) => {
  const [selectedDecision, setSelectedDecision] = useState<Decision>(decisions[0] || null);

  if (!selectedDecision && decisions.length > 0) {
    setSelectedDecision(decisions[0]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Search className="w-6 h-6 text-cyan-400" />
          Evidence-Based Explainability Inspector
        </h2>
        <p className="text-xs text-slate-400">Zero unbacked conclusions. Every AI extraction highlights the exact verbatim quote and rules applied.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {decisions.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedDecision(d)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedDecision?.id === d.id
                  ? 'bg-cyan-950 border-cyan-500/50 text-white'
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-cyan-400 font-bold">{d.id}</span>
                <span className="text-emerald-400">{d.confidence_score}% Confidence</span>
              </div>
              <p className="text-xs font-bold line-clamp-1">{d.decision_title}</p>
              <p className="text-[10px] text-slate-400 mt-1">Action: {d.extracted_action}</p>
            </div>
          ))}
        </div>

        {/* Deep Dive Evidence Display */}
        {selectedDecision && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {selectedDecision.id}
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">{selectedDecision.decision_title}</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-cyan-400">{selectedDecision.confidence_score}%</span>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Extraction Confidence</p>
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" /> AI RECOMMENDATION SUMMARY
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Extracted Decision</span>
                  <p className="font-semibold text-slate-100">{selectedDecision.decision_title}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Concrete Action</span>
                  <p className="font-semibold text-slate-100">{selectedDecision.extracted_action}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Responsible Owner</span>
                  <p className="font-semibold text-slate-100">{selectedDecision.extracted_owner}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Target Deadline</span>
                  <p className="font-semibold text-slate-100">{selectedDecision.extracted_deadline}</p>
                </div>
              </div>
            </div>

            {/* Verbatim Quotes Evidence */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Source Evidence Quotes</h4>
              
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Full Transcript Quote</span>
                <blockquote className="text-xs text-slate-200 font-serif italic border-l-2 border-cyan-500 pl-3">
                  {selectedDecision.evidence_quote}
                </blockquote>
              </div>
            </div>

            {/* Decision Rules Applied */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Rule-Based Extraction Rationale</h4>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 space-y-1.5 whitespace-pre-line leading-relaxed">
                {selectedDecision.rules_reason}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
