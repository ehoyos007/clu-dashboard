'use client';

import { useState } from 'react';
import { ActivityItem } from './ActivityItem';
import type { Activity } from '@/types';

// Placeholder activities - will be replaced with Supabase data
const PLACEHOLDER_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'pr_opened',
    title: 'Opened PR #1: Compliance Scoring Timeout Fix',
    description: 'Added dynamic timeout based on transcript length',
    metadata: { repo: 'sales-coaching-ai-v2', pr_number: 1 },
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    type: 'task_created',
    title: 'Created task: Optimize Sales Coaching AI Token Consumption',
    description: 'Added to Todoist inbox with full context',
    metadata: { task_id: '9969307768' },
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '3',
    type: 'system',
    title: 'Connected to n8n',
    description: '47 workflows found (24 active)',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    type: 'error',
    title: 'Detected Sentry issues in sales-coaching-ai-v2',
    description: '2,424 objection_detection failures, 46 compliance_scoring timeouts',
    metadata: { project: 'sales-coaching-ai-v2' },
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
];

export function ActivityList() {
  const [activities] = useState<Activity[]>(PLACEHOLDER_ACTIVITIES);

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
