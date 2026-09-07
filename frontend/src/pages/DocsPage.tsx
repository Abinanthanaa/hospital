import React, { useEffect, useState } from 'react';
import { HelpCircle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { GuideStep } from '../types';

export const DocsPage: React.FC = () => {
  const [steps, setSteps] = useState<GuideStep[]>([]);

  useEffect(() => {
    api.getUserGuide().then(data => setSteps(data.steps));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          Architecture Diagram & Step-by-Step User Guide
        </h2>
        <p className="text-xs text-slate-400">Complete walkthrough for evaluating the Decision-to-Action tracking application</p>
      </div>

      {/* Architecture Diagram Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-sm text-cyan-300 uppercase tracking-wider">System Flow Diagram</h3>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
          Meeting Transcript / Chat Stream → AI/NLP Decision Extractor → Evidence Quote & Confidence Score → Human Approval Gateway → Task Database → Idempotent Event Processor → Operational Dashboard
        </div>
      </div>

      {/* Step by Step User Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-200">10-Step Evaluation Walkthrough</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((item) => (
            <div key={item.step} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-200">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
