import { ChatContainer } from '@/components/chat/ChatContainer';

export default function ChatPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Chat with Clu</h1>
        <p className="text-muted-foreground">Have a conversation</p>
      </div>
      <ChatContainer />
    </div>
  );
}
