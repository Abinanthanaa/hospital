import React, { useState } from 'react';
import { CheckSquare, X, Eye } from 'lucide-react';
import { TaskTable } from '../components/TaskTable';
import { Task } from '../types';

interface TaskTrackerPageProps {
  tasks: Task[];
  onStatusUpdate: (taskId: string, newStatus: string) => void;
}

export const TaskTrackerPage: React.FC<TaskTrackerPageProps> = ({ tasks, onStatusUpdate }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-cyan-400" />
          Hospital Action & Task Tracker
        </h2>
        <p className="text-xs text-slate-400">Track task progression from approval to completion with evidence traceability</p>
      </div>

      <TaskTable
        tasks={tasks}
        onStatusUpdate={onStatusUpdate}
        onSelectTask={(task) => setSelectedTask(task)}
      />

      {/* Task Evidence Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-cyan-400 font-bold">
              <Eye className="w-5 h-5" />
              <h3 className="text-sm uppercase tracking-wide">Task Traceability & Evidence Inspector</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Task ID & Directive</span>
                <p className="font-bold text-slate-100 mt-0.5">{selectedTask.id}: {selectedTask.action}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Owner</span>
                  <p className="font-medium text-cyan-300 mt-0.5">{selectedTask.owner}</p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Target Deadline</span>
                  <p className="font-medium text-slate-200 mt-0.5">{selectedTask.deadline}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-cyan-400">Meeting Source Transcript Quote</span>
                <blockquote className="italic text-slate-300 font-serif mt-1 border-l-2 border-cyan-500/50 pl-2">
                  {selectedTask.source_evidence}
                </blockquote>
              </div>

              {selectedTask.completion_evidence && (
                <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/40 text-emerald-300">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Completion Evidence (Chat/Event)</span>
                  <p className="mt-1 font-mono text-[11px]">{selectedTask.completion_evidence}</p>
                </div>
              )}
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
