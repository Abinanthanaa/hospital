import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Decision } from '../types';

interface OverrideModalProps {
  decision: Decision | null;
  onClose: () => void;
  onSubmit: (field: string, newValue: string, reason: string) => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({ decision, onClose, onSubmit }) => {
  if (!decision) return null;

  const [field, setField] = useState('owner');
  const [newValue, setNewValue] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue || !reason) return;
    onSubmit(field, newValue, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-amber-400">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-bold text-sm uppercase tracking-wide">Human Override System</h3>
        </div>

        <p className="text-xs text-slate-300 mb-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
          Overriding decision <span className="font-mono text-cyan-400 font-bold">{decision.id}</span>: &quot;{decision.decision_title}&quot;
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Field to Override</label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="owner">Owner (Responsible Staff)</option>
              <option value="deadline">Deadline</option>
              <option value="action">Action Text</option>
              <option value="priority">Priority Level</option>
              <option value="risk_level">Risk Level</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Override Value</label>
            <input
              type="text"
              required
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="e.g. Dr. Kumar / Friday / Critical"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mandatory Override Reason (Audit Log)</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why the AI recommendation is being overridden..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20"
            >
              Submit Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
