import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { ChatMessage, Task } from '../types';

interface ChatFeedPageProps {
  messages: ChatMessage[];
  tasks: Task[];
  onSendMessage: (sender: string, content: string, taskId?: string) => void;
}

export const ChatFeedPage: React.FC<ChatFeedPageProps> = ({
  messages,
  tasks,
  onSendMessage
}) => {
  const [sender, setSender] = useState('Nurse Priya');
  const [content, setContent] = useState('');
  const [selectedTask, setSelectedTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    onSendMessage(sender, content, selectedTask || undefined);
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          Shift Communication & Completion Detection Chat
        </h2>
        <p className="text-xs text-slate-400">Post operational chat updates. NLP engine automatically parses messages to complete linked tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Feed */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((msg) => {
              const isCompletion = msg.msg_type === 'completion_update';
              const isConflict = msg.msg_type === 'conflict';
              const isDecision = msg.msg_type === 'decision_update';

              return (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompletion ? 'bg-emerald-950/40 border-emerald-500/40' :
                    isConflict ? 'bg-red-950/40 border-red-500/40' :
                    isDecision ? 'bg-cyan-950/40 border-cyan-500/40' :
                    'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span className="font-bold text-slate-200 flex items-center gap-1">
                      <User className="w-3 h-3 text-cyan-400" /> {msg.sender}
                    </span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-snug">{msg.content}</p>

                  {/* Automatic NLP Badges */}
                  {isCompletion && (
                    <div className="mt-2 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>AUTOMATIC COMPLETION DETECTED → Linked Task Updated to Completed</span>
                    </div>
                  )}

                  {isConflict && (
                    <div className="mt-2 text-[10px] text-red-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                      <span>⚠ CONFLICT DETECTED → Owner Discrepancy Flagged for Human Review</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
            <select
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Nurse Priya">Nurse Priya</option>
              <option value="Dr. Ravi">Dr. Ravi</option>
              <option value="Dr. Kumar">Dr. Kumar</option>
              <option value="Pharmacy Lead Mark">Pharmacy Lead Mark</option>
              <option value="Nurse James">Nurse James</option>
            </select>

            <input
              type="text"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type update (e.g. 'Night shift infection training has been completed')..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Linked Active Tasks Sidepanel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Tasks Open for Completion</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {tasks.filter(t => t.status !== 'Completed').map(t => (
              <div
                key={t.id}
                onClick={() => setContent(`Update for ${t.id}: ${t.action} has been completed.`)}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-cyan-400 font-bold">{t.id}</span>
                  <span className="text-amber-400 font-semibold">{t.status}</span>
                </div>
                <p className="text-xs font-medium text-slate-200 line-clamp-1">{t.action}</p>
                <p className="text-[10px] text-slate-400 mt-1">Owner: {t.owner}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
