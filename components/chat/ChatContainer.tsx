'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import type { Message } from '@/types';

// Placeholder messages - will be replaced with Supabase data + OpenClaw API
const PLACEHOLDER_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hey! I'm Clu 🟠 — your AI assistant. I'm connected to your n8n, Sentry, GitHub, Todoist, and Notion. What do you want to work on?",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(PLACEHOLDER_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // TODO: Send to OpenClaw API and get response
    // For now, simulate a response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${content}"\n\nThis is a placeholder response. Once connected to OpenClaw API, I'll provide real responses.`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/30 rounded-lg border overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="animate-pulse">🟠</span>
            <span className="text-sm">Clu is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
