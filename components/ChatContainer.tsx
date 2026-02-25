import React, { useState, useCallback, Suspense } from 'react';
import { MessageList } from './MessageList';
import ChatInput from './ChatInput';
import { ChatMessage } from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';
const LazySidebar = React.lazy(() => import('./Sidebar'));

type SidebarState = 'open' | 'closed';

export const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome', role: 'assistant', content: 'Hi! Ask me anything to get started.'
  }]);
  const [typing, setTyping] = useState(false);
  const [sidebar, setSidebar] = useState<SidebarState>('open');

  const sendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = { id: Date.now() + '-user', role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    // Simulated assistant reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + '-assistant', role: 'assistant', content: 'Echo: ' + text }]);
      setTyping(false);
    }, 900);
  }, []);

  const toggleSidebar = () => setSidebar(s => s === 'open' ? 'closed' : 'open');

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar (collapsible + lazy) */}
      <AnimatePresence initial={false}>
        {sidebar === 'open' && (
          <motion.div
            key="sidebar"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="contents"
          >
            <Suspense fallback={<div className="hidden md:flex w-64 p-4 text-sm text-gray-500">Loading...</div>}>
              <LazySidebar />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={sidebar === 'open' ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">Toggle menu</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="font-semibold text-sm sm:text-base">Chat Demo</h1>
          </div>
        </header>
        {/* Messages */}
        <MessageList messages={messages} isTyping={typing} />
        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={typing} />
      </div>
    </div>
  );
};

export default ChatContainer;