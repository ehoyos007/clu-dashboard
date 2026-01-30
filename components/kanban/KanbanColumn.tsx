'use client';

import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@/types';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const COLUMN_COLORS: Record<TaskStatus, string> = {
  not_started: 'border-t-slate-400',
  in_progress: 'border-t-blue-500',
  awaiting_approval: 'border-t-orange-500',
  complete: 'border-t-green-500',
};

export function KanbanColumn({
  id,
  title,
  tasks,
  onStatusChange,
}: KanbanColumnProps) {
  return (
    <div
      className={`flex-shrink-0 w-80 bg-muted/50 rounded-lg border-t-4 ${COLUMN_COLORS[id]}`}
    >
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="p-2 space-y-2 overflow-y-auto max-h-[calc(100%-3.5rem)]">
        {tasks.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
