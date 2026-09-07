import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, AlertOctagon } from 'lucide-react';
import { api } from '../services/api';
import { PrivacyDoc } from '../types';

export const PrivacyPage: React.FC = () => {
  const [doc, setDoc] = useState<PrivacyDoc | null>(null);

  useEffect(() => {
    api.getPrivacyInfo().then(setDoc);
  }, []);

  if (!doc) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Lock className="w-6 h-6 text-emerald-400" />
          Data Privacy & Synthetic Data Disclosure
        </h2>
        <p className="text-xs text-slate-400">Explicit privacy policy and synthetic data safeguards compliance statement</p>
      </div>

      {/* Main Callout Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          SYNTHETIC DATA GUARANTEE & PRIVACY POLICY
        </div>
        <ul className="space-y-2 text-xs text-slate-200">
          {doc.guarantees.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Production Deployment Roadmap Box */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-cyan-400" />
          Production Healthcare Compliance Roadmap
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Transitioning this decision tracking system into a clinical hospital production environment mandates:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-cyan-300">1. OAuth2 / SAML SSO Authentication</span>
            <p className="text-slate-400 text-[11px] mt-0.5">Enforce multi-factor auth for shift supervisors and hospital administrators.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-cyan-300">2. Role-Based Access Control (RBAC)</span>
            <p className="text-slate-400 text-[11px] mt-0.5">Limit decision overrides to authorized department heads and ops leads.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-cyan-300">3. Encryption & HIPAA BAA</span>
            <p className="text-slate-400 text-[11px] mt-0.5">AES-256 at rest, TLS 1.3 in transit, and executed Business Associate Agreements.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-cyan-300">4. Immutable Audit Logs</span>
            <p className="text-slate-400 text-[11px] mt-0.5">Cryptographically signed event ledgers for all protocol overrides and task completions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
