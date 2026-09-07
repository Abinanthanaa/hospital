export interface User {
  id: number;
  name: str;
  role: str;
  department: str;
  email?: str;
}

export interface Meeting {
  id: string;
  title: string;
  department: string;
  chair: string;
  date: string;
  transcript: string;
  summary?: string;
  created_at: string;
}

export interface Override {
  id: number;
  decision_id?: string;
  task_id?: string;
  field_changed: string;
  original_value?: string;
  new_value: string;
  reason: string;
  reviewer: string;
  timestamp: string;
}

export interface Decision {
  id: string;
  meeting_id: string;
  raw_statement: string;
  decision_title: string;
  classification: string;
  extracted_action: string;
  extracted_owner: string;
  owner_confidence: number;
  extracted_deadline: string;
  priority: string;
  risk_level: string;
  is_high_impact: boolean;
  confidence_score: number;
  evidence_quote: string;
  rules_reason: string;
  status: string; // Pending Review, Approved, Rejected, Overridden
  created_at: string;
  overrides?: Override[];
}

export interface Task {
  id: string;
  decision_id?: string;
  action: string;
  owner: string;
  department: string;
  deadline: string;
  priority: string;
  risk_level: string;
  status: string; // Pending, In Progress, Completed, Overdue, Rejected
  source_evidence: string;
  completion_evidence?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  meeting_id?: string;
  task_id?: string;
  sender: string;
  content: string;
  timestamp: string;
  msg_type: string; // general, completion_update, decision_update, conflict
}

export interface EventItem {
  id: number;
  event_id: string;
  task_id?: string;
  decision_id?: string;
  event_type: string;
  source: string;
  payload: string;
  timestamp: string;
  sequence_num: number;
}

export interface MetricItem {
  metric: string;
  baseline: number;
  target: number;
  measured: number;
  unit: string;
}

export interface ErrorAnalysisItem {
  id: string;
  input_text: string;
  system_output: string;
  expected_output: string;
  error_category: string;
  possible_improvement: string;
}

export interface EvaluationReport {
  metrics: MetricItem[];
  error_analysis: ErrorAnalysisItem[];
  total_meetings_evaluated: number;
  total_decisions_evaluated: number;
  total_tasks_evaluated: number;
}

export interface PrivacyDoc {
  title: string;
  guarantees: string[];
  assumptions: string[];
}

export interface RiskItem {
  id: string;
  risk: string;
  impact: string;
  likelihood: string;
  mitigation: string;
}

export interface GuideStep {
  step: number;
  title: string;
  desc: string;
}
