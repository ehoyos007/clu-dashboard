# Clu Dashboard

## Project Overview

A web-based dashboard for interacting with Clu (OpenClaw AI assistant). Provides task management, activity logging, and conversational interface.

**Tech Stack:** Next.js 15 + React 19 + Supabase + Tailwind CSS + shadcn/ui
**Target:** Web (responsive, works on desktop + mobile)

---

## Core Features

### 1. Kanban Board
- **Columns:** Not Started, In Progress, Awaiting Approval, Complete
- **Task Cards:** Title, description, priority, created date, updated date
- **Drag & Drop:** Move tasks between columns
- **Filters:** By priority, date range, search
- **Quick Actions:** Edit, delete, change status

### 2. Activity Log
- **Chronological list** of all Clu activities
- **Entry types:** Task created, task updated, PR opened, file modified, message sent
- **Filtering:** By type, date range, search
- **Details expansion:** Click to see full context
- **Real-time updates:** New activities appear automatically

### 3. Chat Interface
- **Conversational UI** to interact with Clu
- **Message history** persisted in Supabase
- **Real-time responses** via OpenClaw API
- **Rich content:** Support for code blocks, links, markdown
- **Quick actions:** Buttons for common commands

---

## Database Schema (Supabase)

### Tables

```sql
-- Tasks for Kanban board
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, awaiting_approval, complete
  priority INTEGER DEFAULT 2, -- 1=high, 2=medium, 3=low
  project TEXT, -- optional project association
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Activity log
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- task_created, task_updated, pr_opened, file_modified, message_sent, etc.
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB, -- flexible storage for type-specific data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  metadata JSONB, -- for tool calls, attachments, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Project Structure

```
clu-dashboard/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard routes (with sidebar)
│   │   ├── page.tsx        # Kanban board (default)
│   │   ├── activity/       # Activity log
│   │   │   └── page.tsx
│   │   ├── chat/           # Chat interface
│   │   │   └── page.tsx
│   │   └── layout.tsx      # Dashboard layout with sidebar
│   ├── api/                # API routes
│   │   ├── tasks/          # Task CRUD
│   │   ├── activities/     # Activity log
│   │   ├── chat/           # Chat with OpenClaw
│   │   └── webhook/        # Incoming webhooks from OpenClaw
│   ├── globals.css
│   └── layout.tsx          # Root layout
├── components/
│   ├── kanban/             # Kanban board components
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── TaskCard.tsx
│   ├── activity/           # Activity log components
│   │   ├── ActivityList.tsx
│   │   └── ActivityItem.tsx
│   ├── chat/               # Chat components
│   │   ├── ChatContainer.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ChatInput.tsx
│   ├── ui/                 # shadcn/ui components
│   └── shared/             # Shared components
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── openclaw.ts         # OpenClaw API client
│   └── utils.ts            # Utilities
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
├── supabase/
│   └── migrations/         # Database migrations
├── CLAUDE.md               # This file
├── README.md
├── TASKS.md
└── package.json
```

---

## OpenClaw Integration

### Chat API
The chat interface connects to OpenClaw to send messages to Clu:

```typescript
// lib/openclaw.ts
export async function sendMessage(message: string): Promise<string> {
  // OpenClaw API endpoint (configured via env)
  const response = await fetch(process.env.OPENCLAW_API_URL + '/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENCLAW_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  return response.json();
}
```

### Webhook for Activity Logging
OpenClaw can POST activities to `/api/webhook/activity`:

```typescript
// Webhook payload
{
  type: 'task_created' | 'pr_opened' | 'file_modified' | ...,
  title: string,
  description?: string,
  metadata?: Record<string, any>
}
```

---

## Design Reference

### Kanban Board
- Inspired by ClaudeCodeManager's KanbanBoardView
- 4 columns: Not Started, In Progress, Awaiting Approval, Complete
- Cards show: title, priority badge, timestamps
- Drag & drop between columns (use @dnd-kit/core)

### Chat Interface
- Inspired by Claude-Voice-Commander conversation UI
- Message bubbles (user right, assistant left)
- Markdown rendering for assistant messages
- Code block syntax highlighting
- Quick action buttons below input

### Activity Log
- Timeline-style list
- Icons per activity type
- Expandable details
- Infinite scroll with date grouping

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenClaw
OPENCLAW_API_URL=
OPENCLAW_API_KEY=
OPENCLAW_WEBHOOK_SECRET=
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run Supabase migrations
npx supabase db push
```
