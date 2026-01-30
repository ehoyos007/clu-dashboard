'use client';

import { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import type { Task, TaskStatus } from '@/types';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'not_started', title: 'Not Started' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'awaiting_approval', title: 'Awaiting Approval' },
  { id: 'complete', title: 'Complete' },
];

// Placeholder tasks - will be replaced with Supabase data
const PLACEHOLDER_TASKS: Task[] = [
  {
    id: '1',
    title: 'Stop Retry Storm',
    description: 'Add quota errors to non-retryable list in claude.ts',
    status: 'not_started',
    priority: 1,
    project: 'sales-coaching-ai-v2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Cache Rubric Text',
    description: 'Cache rubric formatting to avoid re-fetching every call',
    status: 'not_started',
    priority: 2,
    project: 'sales-coaching-ai-v2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Compliance Scoring Timeout Fix',
    description: 'Dynamic timeout based on transcript length',
    status: 'awaiting_approval',
    priority: 1,
    project: 'sales-coaching-ai-v2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(PLACEHOLDER_TASKS);

  const getTasksForColumn = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
          : task
      )
    );
  };

  return (
    <div className="flex gap-4 h-[calc(100%-2rem)] overflow-x-auto pb-4">
      {COLUMNS.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          tasks={getTasksForColumn(column.id)}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}
