import React from 'react';

type Props = {
  onSelectThread?: (id: string) => void;
};

const Sidebar: React.FC<Props> = ({ onSelectThread }) => {
  return (
    <aside
      className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 gap-4 overflow-y-auto"
      aria-label="Sidebar"
    >
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Conversations</h2>
      <ul className="space-y-2 text-sm">
        <li>
          <button
            className="w-full text-left px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            onClick={() => onSelectThread?.('sample')}
          >
            Sample Thread
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
