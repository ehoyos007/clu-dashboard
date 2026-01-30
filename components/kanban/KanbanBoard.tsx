'use client';

import { useState, useEffect } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { getTasks, updateTaskStatus, subscribeToTasks } from '@/lib/supabase';
import type { Task, TaskStatus } from '@/types';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'not_started', title: 'Not Started' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'awaiting_approval', title: 'Awaiting Approval' },
  { id: 'complete', title: 'Complete' },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
    loadTasks();

    // Subscribe to realtime updates
    const subscription = subscribeToTasks(setTasks);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getTasksForColumn = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
          : task
      )
    );

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      // Revert on error
      const data = await getTasks();
      setTasks(data);
      console.error('Failed to update task:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

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
