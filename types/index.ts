export type TaskStatus =
  | 'not_started'
  | 'in_progress'
  | 'awaiting_approval'
  | 'complete';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: number; // 1=high, 2=medium, 3=low
  project?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export type ActivityType =
  | 'task_created'
  | 'task_updated'
  | 'task_completed'
  | 'pr_opened'
  | 'pr_merged'
  | 'file_modified'
  | 'message_sent'
  | 'error'
  | 'system';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
