'use client';

import { useState, useEffect } from 'react';
import { ActivityItem } from './ActivityItem';
import { getActivities, subscribeToActivities } from '@/lib/supabase';
import type { Activity } from '@/types';

export function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    }
    loadActivities();

    // Subscribe to realtime updates
    const subscription = subscribeToActivities(setActivities);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading activities...</div>
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

  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No activities yet</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
