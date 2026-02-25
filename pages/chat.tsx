import React from 'react';
import dynamic from 'next/dynamic';
const ChatContainer = dynamic(() => import('../components/ChatContainer'), { ssr: false });

export default function ChatPage() {
  return (
    <main className="h-screen flex flex-col">
      {/* Dark mode only; theme toggle removed */}
      <div className="flex-1">
        <ChatContainer />
      </div>
    </main>
  );
}
