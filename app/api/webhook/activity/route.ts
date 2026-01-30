import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Valid activity types
const VALID_TYPES = [
  'task_created', 'task_updated', 'task_completed',
  'pr_opened', 'pr_merged', 'pr_closed',
  'file_modified', 'message_sent',
  'error', 'warning', 'system'
] as const;

type ActivityType = typeof VALID_TYPES[number];

interface ActivityPayload {
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify webhook secret
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = request.headers.get('x-webhook-secret');
      if (authHeader !== webhookSecret) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const body = await request.json() as ActivityPayload;

    // Validate required fields
    if (!body.type || !body.title) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title' },
        { status: 400 }
      );
    }

    // Validate type
    if (!VALID_TYPES.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert activity
    const { data, error } = await supabase
      .from('activities')
      .insert({
        type: body.type,
        title: body.title,
        description: body.description,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, activity: data });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

// GET endpoint to check webhook status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Activity webhook is active',
    validTypes: VALID_TYPES,
  });
}
