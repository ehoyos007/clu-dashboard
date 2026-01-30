-- Clu Dashboard Initial Schema
-- Created: 2026-01-30

-- ============================================================================
-- TASKS (Kanban Board)
-- ============================================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' 
    CHECK (status IN ('not_started', 'in_progress', 'awaiting_approval', 'complete')),
  priority INTEGER NOT NULL DEFAULT 2 
    CHECK (priority IN (1, 2, 3)), -- 1=high, 2=medium, 3=low
  project TEXT, -- optional project association
  metadata JSONB DEFAULT '{}', -- flexible storage for additional data
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index for filtering by status
CREATE INDEX idx_tasks_status ON tasks(status);

-- Index for filtering by project
CREATE INDEX idx_tasks_project ON tasks(project);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-set completed_at when status changes to 'complete'
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'complete' AND OLD.status != 'complete' THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status != 'complete' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_completed_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_completed_at();

-- ============================================================================
-- ACTIVITIES (Activity Log)
-- ============================================================================

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL 
    CHECK (type IN (
      'task_created', 'task_updated', 'task_completed',
      'pr_opened', 'pr_merged', 'pr_closed',
      'file_modified', 'message_sent',
      'error', 'warning', 'system'
    )),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}', -- flexible storage for type-specific data
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for filtering by type
CREATE INDEX idx_activities_type ON activities(type);

-- Index for chronological queries
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);

-- ============================================================================
-- MESSAGES (Chat History)
-- ============================================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- for tool calls, attachments, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for chronological queries
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- ============================================================================
-- ENABLE REALTIME
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================================================
-- ROW LEVEL SECURITY (Optional - enable if needed)
-- ============================================================================

-- For now, we'll leave RLS disabled since this is a single-user dashboard
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
