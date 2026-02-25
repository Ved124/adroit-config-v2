import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';
import MessageBubble, { ChatMessage } from './MessageBubble';

type Props = {
  messages: ChatMessage[];
  isTyping?: boolean;
  typingText?: string;
  virtuosoThreshold?: number; // if messages length >= threshold use virtualization
};

const TypingIndicator: React.FC<{ side?: 'left' | 'right' }> = ({ side = 'left' }) => (
  <div className={`flex ${side === 'left' ? 'justify-start' : 'justify-end'} w-full my-1`}>
    <div
      className="rounded-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-soft flex items-center gap-1"
      aria-label="Assistant is typing"
      role="status"
    >
      <span className="sr-only">Assistant is typing</span>
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse-slow" />
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse-slow [animation-delay:200ms]" />
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse-slow [animation-delay:400ms]" />
    </div>
  </div>
);

export const MessageList: React.FC<Props> = ({ messages, isTyping, typingText, virtuosoThreshold = 40 }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length, isTyping]);

  const renderList = () => (
    <ul role="list" aria-label="Chat messages" className="w-full">
      <AnimatePresence initial={false}>
        {messages.map(m => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isTyping && (
          <TypingIndicator key="typing" />
        )}
      </AnimatePresence>
    </ul>
  );

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto px-2 sm:px-4 pt-3 pb-2 scrollbar-thin focus:outline-none"
      tabIndex={0}
      aria-label="Chat history"
    >
      {messages.length >= virtuosoThreshold ? (
        <Virtuoso
          style={{ height: '100%' }}
          data={messages}
          itemContent={(_, item) => <MessageBubble message={item} />}
          followOutput={true}
          components={{ Footer: () => (isTyping ? <TypingIndicator /> : <div ref={bottomRef} />) }}
        />
      ) : (
        <>
          {renderList()}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
