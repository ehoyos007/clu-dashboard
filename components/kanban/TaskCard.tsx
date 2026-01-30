'use client';

import { formatDistanceToNow } from 'date-fns';
import type { Task, TaskStatus } from '@/types';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const PRIORITY_BADGES: Record<number, { label: string; className: string }> = {
  1: { label: 'High', className: 'bg-red-100 text-red-700' },
  2: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700' },
  3: { label: 'Low', className: 'bg-slate-100 text-slate-700' },
};

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const priority = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES[2];

  return (
    <div className="bg-card p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      {/* Priority & Project */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.className}`}
        >
          {priority.label}
        </span>
        {task.project && (
          <span className="text-xs text-muted-foreground">{task.project}</span>
        )}
      </div>

      {/* Title */}
      <h4 className="font-medium mb-1">{task.title}</h4>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
        </span>

        {/* Quick status change - will be replaced with drag & drop */}
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as TaskStatus)
          }
          className="text-xs bg-muted rounded px-1 py-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="awaiting_approval">Awaiting Approval</option>
          <option value="complete">Complete</option>
        </select>
      </div>
    </div>
  );
}
