import { KanbanBoard } from '@/components/kanban/KanbanBoard';

export default function TasksPage() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Track work across your projects</p>
      </div>
      <KanbanBoard />
    </div>
  );
}
