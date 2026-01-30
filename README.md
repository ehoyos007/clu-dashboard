# Clu Dashboard

Web-based dashboard for managing tasks and chatting with Clu (OpenClaw AI assistant).

## Features

- **Kanban Board** — Track tasks across Not Started, In Progress, Awaiting Approval, Complete
- **Activity Log** — See everything Clu does in real-time
- **Chat Interface** — Have conversations with Clu directly

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **AI Integration:** OpenClaw API

## Getting Started

```bash
# Clone the repo
git clone https://github.com/ehoyos007/clu-dashboard
cd clu-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and OpenClaw credentials

# Run development server
npm run dev
```

## Project Structure

```
app/                    # Next.js App Router pages
├── (dashboard)/        # Dashboard with sidebar
│   ├── page.tsx        # Kanban board
│   ├── activity/       # Activity log
│   └── chat/           # Chat interface
components/             # React components
├── kanban/             # Kanban board
├── activity/           # Activity log
├── chat/               # Chat interface
└── ui/                 # shadcn/ui
lib/                    # Utilities and clients
supabase/               # Database migrations
```

## License

MIT
