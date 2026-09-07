import axios from 'axios';
import { 
  Meeting, Decision, Task, ChatMessage, 
  EventItem, EvaluationReport, Override,
  PrivacyDoc, RiskItem, GuideStep 
} from '../types';

const API_BASE = '/api';

export const api = {
  // Meetings
  getMeetings: async (): Promise<Meeting[]> => {
    const res = await axios.get(`${API_BASE}/meetings`);
    return res.data;
  },
  getMeeting: async (id: string): Promise<Meeting> => {
    const res = await axios.get(`${API_BASE}/meetings/${id}`);
    return res.data;
  },

  // Decisions
  getDecisions: async (department?: string, status?: string): Promise<Decision[]> => {
    const res = await axios.get(`${API_BASE}/decisions`, { params: { department, status } });
    return res.data;
  },
  getDecision: async (id: string): Promise<Decision> => {
    const res = await axios.get(`${API_BASE}/decisions/${id}`);
    return res.data;
  },
  approveDecision: async (id: string, reviewer: string = 'Ops Manager') => {
    const res = await axios.post(`${API_BASE}/decisions/${id}/approve`, { reviewer });
    return res.data;
  },
  rejectDecision: async (id: string, reason: string, reviewer: string = 'Ops Manager') => {
    const res = await axios.post(`${API_BASE}/decisions/${id}/reject`, { reason, reviewer });
    return res.data;
  },
  overrideDecision: async (id: string, payload: { field_changed: string; new_value: string; reason: string; reviewer?: string }) => {
    const res = await axios.post(`${API_BASE}/decisions/${id}/override`, payload);
    return res.data;
  },

  // Tasks
  getTasks: async (filters?: { department?: string; owner?: string; status?: string; priority?: string; risk?: string }): Promise<Task[]> => {
    const res = await axios.get(`${API_BASE}/tasks`, { params: filters });
    return res.data;
  },
  getTask: async (id: string): Promise<Task> => {
    const res = await axios.get(`${API_BASE}/tasks/${id}`);
    return res.data;
  },
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const res = await axios.patch(`${API_BASE}/tasks/${id}`, updates);
    return res.data;
  },

  // Chat
  getChatMessages: async (): Promise<ChatMessage[]> => {
    const res = await axios.get(`${API_BASE}/chat`);
    return res.data;
  },
  postChatMessage: async (sender: string, content: string, taskId?: string): Promise<ChatMessage> => {
    const res = await axios.post(`${API_BASE}/chat`, { sender, content, task_id: taskId });
    return res.data;
  },

  // Events
  getEvents: async (): Promise<EventItem[]> => {
    const res = await axios.get(`${API_BASE}/events`);
    return res.data;
  },
  simulateDuplicate: async (taskId: string = 'TSK-2026-001') => {
    const res = await axios.post(`${API_BASE}/events/simulate-duplicate`, null, { params: { task_id: taskId } });
    return res.data;
  },
  simulateOutOfOrder: async () => {
    const res = await axios.post(`${API_BASE}/events/simulate-out-of-order`);
    return res.data;
  },

  // Audit
  getAuditTrail: async (): Promise<Override[]> => {
    const res = await axios.get(`${API_BASE}/audit`);
    return res.data;
  },

  // Evaluation
  getEvaluationMetrics: async (): Promise<EvaluationReport> => {
    const res = await axios.get(`${API_BASE}/evaluation`);
    return res.data;
  },

  // Demo Controls
  runDemoWorkflow: async () => {
    const res = await axios.post(`${API_BASE}/demo/run-flow`);
    return res.data;
  },
  injectAmbiguous: async () => {
    const res = await axios.post(`${API_BASE}/demo/inject-ambiguous`);
    return res.data;
  },
  injectConflict: async (taskId?: string) => {
    const res = await axios.post(`${API_BASE}/demo/inject-conflict`, null, { params: { task_id: taskId } });
    return res.data;
  },

  // Info Docs
  getPrivacyInfo: async (): Promise<PrivacyDoc> => {
    const res = await axios.get(`${API_BASE}/docs-info/privacy`);
    return res.data;
  },
  getRiskRegister: async (): Promise<{ title: string; risks: RiskItem[] }> => {
    const res = await axios.get(`${API_BASE}/docs-info/risks`);
    return res.data;
  },
  getUserGuide: async (): Promise<{ title: string; steps: GuideStep[] }> => {
    const res = await axios.get(`${API_BASE}/docs-info/user-guide`);
    return res.data;
  },
  getStakeholders: async () => {
    const res = await axios.get(`${API_BASE}/docs-info/stakeholders`);
    return res.data;
  }
};
