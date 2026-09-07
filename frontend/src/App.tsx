import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DemoControlsModal } from './components/DemoControlsModal';
import { DashboardPage } from './pages/DashboardPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { DecisionsPage } from './pages/DecisionsPage';
import { TaskTrackerPage } from './pages/TaskTrackerPage';
import { ChatFeedPage } from './pages/ChatFeedPage';
import { EvidencePage } from './pages/EvidencePage';
import { EventMonitorPage } from './pages/EventMonitorPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { RiskRegisterPage } from './pages/RiskRegisterPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DocsPage } from './pages/DocsPage';

import { api } from './services/api';
import { Meeting, Decision, Task, ChatMessage, EventItem, Override, EvaluationReport } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // App Data State
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationReport | null>(null);

  const refreshAllData = async () => {
    try {
      const deptFilter = selectedDepartment === 'All Departments' ? undefined : selectedDepartment;
      const [mRes, dRes, tRes, cRes, eRes, oRes, evRes] = await Promise.all([
        api.getMeetings(),
        api.getDecisions(deptFilter),
        api.getTasks({ department: deptFilter }),
        api.getChatMessages(),
        api.getEvents(),
        api.getAuditTrail(),
        api.getEvaluationMetrics()
      ]);
      setMeetings(mRes);
      setDecisions(dRes);
      setTasks(tRes);
      setMessages(cRes);
      setEvents(eRes);
      setOverrides(oRes);
      setEvaluation(evRes);
    } catch (err) {
      console.error("Failed to load backend data:", err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [selectedDepartment]);

  // Actions
  const handleApproveDecision = async (id: string) => {
    await api.approveDecision(id);
    refreshAllData();
  };

  const handleRejectDecision = async (id: string) => {
    await api.rejectDecision(id, "Rejected during human review");
    refreshAllData();
  };

  const handleOverrideDecision = async (id: string, payload: { field_changed: string; new_value: string; reason: string }) => {
    await api.overrideDecision(id, payload);
    refreshAllData();
  };

  const handleStatusUpdateTask = async (id: string, status: string) => {
    await api.updateTask(id, { status });
    refreshAllData();
  };

  const handleSendMessage = async (sender: string, content: string, taskId?: string) => {
    await api.postChatMessage(sender, content, taskId);
    refreshAllData();
  };

  const handleRunQuickDemo = async () => {
    await api.runDemoWorkflow();
    refreshAllData();
    setActiveTab('decisions');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDemo={() => setIsDemoModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          onRunDemo={handleRunQuickDemo}
        />

        <main className="p-6 flex-1">
          {activeTab === 'dashboard' && (
            <DashboardPage
              decisions={decisions}
              tasks={tasks}
              onNavigateToDecisions={() => setActiveTab('decisions')}
            />
          )}

          {activeTab === 'meetings' && (
            <MeetingsPage
              meetings={meetings}
              onSelectMeeting={() => {}}
            />
          )}

          {activeTab === 'decisions' && (
            <DecisionsPage
              decisions={decisions}
              onApprove={handleApproveDecision}
              onReject={handleRejectDecision}
              onOverride={handleOverrideDecision}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskTrackerPage
              tasks={tasks}
              onStatusUpdate={handleStatusUpdateTask}
            />
          )}

          {activeTab === 'chat' && (
            <ChatFeedPage
              messages={messages}
              tasks={tasks}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeTab === 'evidence' && (
            <EvidencePage decisions={decisions} />
          )}

          {activeTab === 'events' && (
            <EventMonitorPage
              events={events}
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === 'audit' && (
            <AuditTrailPage overrides={overrides} />
          )}

          {activeTab === 'evaluation' && (
            <EvaluationPage report={evaluation} />
          )}

          {activeTab === 'risks' && <RiskRegisterPage />}
          {activeTab === 'privacy' && <PrivacyPage />}
          {activeTab === 'docs' && <DocsPage />}
        </main>
      </div>

      {/* Demo Controls Modal */}
      <DemoControlsModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onRefreshData={refreshAllData}
      />
    </div>
  );
}

export default App;
