'use client';

import { formatDistanceToNow } from 'date-fns';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border'
        }`}
      >
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span>🟠</span>
            <span className="text-sm font-medium">Clu</span>
          </div>
        )}

        {/* Content */}
        <div className="whitespace-pre-wrap">{message.content}</div>

        {/* Timestamp */}
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}
