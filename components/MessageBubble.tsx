import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION, TIMING, userGradient } from './designTokens';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  avatarUrl?: string;
  createdAt?: string | number | Date;
};

type Props = {
  message: ChatMessage;
};

const MessageBubbleComponent: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <li
      className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} my-1 sm:my-1.5`}
      role="listitem"
      aria-label={isUser ? 'User message' : 'Assistant message'}
    >
      <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {message.avatarUrl && (
          <img
            src={message.avatarUrl}
            alt={isUser ? 'User avatar' : 'Assistant avatar'}
            loading="lazy"
            className="w-8 h-8 rounded-full object-cover select-none"
          />
        )}
        <motion.div
        initial={ANIMATION.messageEnter}
        animate={ANIMATION.messageVisible}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-2xl px-3.5 py-2.5 shadow-soft ${TIMING.transition} ${
          isUser
            ? `bg-gradient-to-br ${userGradient} text-white`
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm sm:text-[0.95rem] leading-relaxed">
          {message.content}
        </p>
        </motion.div>
      </div>
    </li>
  );
};

export const MessageBubble = React.memo(MessageBubbleComponent);
export default MessageBubble;
