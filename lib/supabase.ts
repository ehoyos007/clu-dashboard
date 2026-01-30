import { createClient } from '@supabase/supabase-js';
import type { Task, Activity, Message, TaskStatus } from '@/types';

// Client for browser (uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================================
// TASKS
// ============================================================================

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  return updateTask(id, { status });
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================================
// ACTIVITIES
// ============================================================================

export async function getActivities(limit = 50): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function createActivity(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// MESSAGES
// ============================================================================

export async function getMessages(limit = 100): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function createMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

export function subscribeToTasks(callback: (tasks: Task[]) => void) {
  return supabase
    .channel('tasks-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks' },
      async () => {
        const tasks = await getTasks();
        callback(tasks);
      }
    )
    .subscribe();
}

export function subscribeToActivities(callback: (activities: Activity[]) => void) {
  return supabase
    .channel('activities-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'activities' },
      async () => {
        const activities = await getActivities();
        callback(activities);
      }
    )
    .subscribe();
}

export function subscribeToMessages(callback: (messages: Message[]) => void) {
  return supabase
    .channel('messages-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      async () => {
        const messages = await getMessages();
        callback(messages);
      }
    )
    .subscribe();
}
