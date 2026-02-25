import React, { useState, useRef, useEffect } from 'react';

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export const ChatInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sendRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // auto resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onSend(trimmed);
    setValue('');
    textareaRef.current?.focus();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Tab') {
      // Move focus to send button for accessibility cycling
      e.preventDefault();
      sendRef.current?.focus();
    }
  };

  return (
    <div
      className="sticky bottom-0 left-0 w-full border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 px-3 sm:px-5 py-3 space-y-2 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)]"
      role="form"
      aria-label="Chat input"
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Message input"
          placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
          className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-soft"
          rows={1}
          disabled={disabled}
        />
        <button
          ref={sendRef}
          type="button"
          onClick={handleSend}
          aria-label="Send message"
          disabled={disabled || value.trim().length === 0}
          className="h-[2.5rem] px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium shadow-soft disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-900 transition-all duration-300 ease-in-out"
        >
          Send
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">
        Press Shift+Enter for a newline · Tab focuses Send
      </p>
    </div>
  );
};

export default ChatInput;