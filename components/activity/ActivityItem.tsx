'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle2,
  GitPullRequest,
  FileEdit,
  MessageCircle,
  AlertCircle,
  Settings,
  Plus,
  RefreshCw,
} from 'lucide-react';
import type { Activity, ActivityType } from '@/types';

const ACTIVITY_ICONS: Record<ActivityType, typeof CheckCircle2> = {
  task_created: Plus,
  task_updated: RefreshCw,
  task_completed: CheckCircle2,
  pr_opened: GitPullRequest,
  pr_merged: GitPullRequest,
  file_modified: FileEdit,
  message_sent: MessageCircle,
  error: AlertCircle,
  system: Settings,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  task_created: 'bg-blue-100 text-blue-600',
  task_updated: 'bg-yellow-100 text-yellow-600',
  task_completed: 'bg-green-100 text-green-600',
  pr_opened: 'bg-purple-100 text-purple-600',
  pr_merged: 'bg-purple-100 text-purple-600',
  file_modified: 'bg-slate-100 text-slate-600',
  message_sent: 'bg-blue-100 text-blue-600',
  error: 'bg-red-100 text-red-600',
  system: 'bg-slate-100 text-slate-600',
};

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = ACTIVITY_ICONS[activity.type] || Settings;
  const colorClass = ACTIVITY_COLORS[activity.type] || 'bg-slate-100 text-slate-600';

  return (
    <div className="flex gap-4 p-4 bg-card rounded-lg border">
      {/* Icon */}
      <div className={`p-2 rounded-lg h-fit ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium">{activity.title}</h4>
        {activity.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {activity.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
