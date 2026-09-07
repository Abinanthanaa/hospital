import React, { useState } from 'react';
import { ShieldCheck, Filter, AlertTriangle } from 'lucide-react';
import { DecisionCard } from '../components/DecisionCard';
import { OverrideModal } from '../components/OverrideModal';
import { Decision } from '../types';

interface DecisionsPageProps {
  decisions: Decision[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOverride: (id: string, payload: { field_changed: string; new_value: string; reason: string }) => void;
}

export const DecisionsPage: React.FC<DecisionsPageProps> = ({
  decisions,
  onApprove,
  onReject,
  onOverride
}) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [overrideDecision, setOverrideDecision] = useState<Decision | null>(null);

  const filteredDecisions = decisions.filter(d => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Pending') return d.status === 'Pending Review';
    if (filterStatus === 'High Impact') return d.is_high_impact;
    return d.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            Decision Review & Human Approval Queue
          </h2>
          <p className="text-xs text-slate-400">Gated workflow enforcing human verification on all extracted decisions</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Queue:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Decisions</option>
              <option value="Pending">Pending Review</option>
              <option value="High Impact">⚠ High Impact Only</option>
              <option value="Approved">Approved</option>
              <option value="Overridden">Overridden</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Decision Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDecisions.map((d) => (
          <DecisionCard
            key={d.id}
            decision={d}
            onApprove={onApprove}
            onReject={onReject}
            onOverride={(dec) => setOverrideDecision(dec)}
          />
        ))}
      </div>

      {/* Override Modal */}
      <OverrideModal
        decision={overrideDecision}
        onClose={() => setOverrideDecision(null)}
        onSubmit={(field, newValue, reason) => {
          if (overrideDecision) {
            onOverride(overrideDecision.id, { field_changed: field, new_value: newValue, reason });
          }
        }}
      />
    </div>
  );
};
