'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { getMessages, createMessage, subscribeToMessages } from '@/lib/supabase';
import type { Message } from '@/types';

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages on mount
  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadMessages();

    // Subscribe to realtime updates
    const subscription = subscribeToMessages(setMessages);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);

    try {
      // Save user message to Supabase
      const userMessage = await createMessage({
        role: 'user',
        content,
      });
      setMessages((prev) => [...prev, userMessage]);

      // TODO: Send to OpenClaw API and get response
      // For now, create a placeholder assistant response
      const assistantMessage = await createMessage({
        role: 'assistant',
        content: `I received your message: "${content}"\n\nThis is a placeholder response. Once connected to OpenClaw API, I'll provide real responses.`,
      });
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-muted/30 rounded-lg border overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <span className="text-4xl">🟠</span>
            <p className="mt-2">Start a conversation with Clu</p>
          </div>
        )}
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
