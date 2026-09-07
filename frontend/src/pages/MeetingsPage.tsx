import React, { useState } from 'react';
import { FileText, Calendar, User, Search, Sparkles } from 'lucide-react';
import { Meeting } from '../types';

interface MeetingsPageProps {
  meetings: Meeting[];
  onSelectMeeting: (m: Meeting) => void;
}

export const MeetingsPage: React.FC<MeetingsPageProps> = ({ meetings, onSelectMeeting }) => {
  const [search, setSearch] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(meetings[0] || null);

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase()) ||
    m.chair.toLowerCase().includes(search.toLowerCase())
  );

  const activeMeeting = selectedMeeting || filteredMeetings[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Hospital Meeting Transcripts</h2>
          <p className="text-xs text-slate-400">Synthetic meeting logs across 7 operational departments</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transcripts by topic or chair..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meetings Sidebar List */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {filteredMeetings.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMeeting(m)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeMeeting?.id === m.id
                  ? 'bg-cyan-950/60 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                <span>{m.id}</span>
                <span className="text-cyan-400 font-semibold">{m.date}</span>
              </div>
              <h4 className="font-bold text-xs text-slate-200 line-clamp-1">{m.title}</h4>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                  {m.department}
                </span>
                <span>Chair: {m.chair}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Transcript Details */}
        {activeMeeting && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {activeMeeting.id}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-2">{activeMeeting.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {activeMeeting.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-cyan-400" /> Chair: {activeMeeting.chair}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{activeMeeting.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  NLP Extracted
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Meeting Summary</h4>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                {activeMeeting.summary}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Verbatim Transcript</h4>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto">
                {activeMeeting.transcript}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
