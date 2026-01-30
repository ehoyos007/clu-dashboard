import { ActivityList } from '@/components/activity/ActivityList';

export default function ActivityPage() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Activity</h1>
        <p className="text-muted-foreground">Everything Clu has been doing</p>
      </div>
      <ActivityList />
    </div>
  );
}
