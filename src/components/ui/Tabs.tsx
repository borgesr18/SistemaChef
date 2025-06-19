'use client';
import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, className = '' }) => {
  const [active, setActive] = useState(tabs[0]?.id);
  const activeTab = tabs.find(t => t.id === active) || tabs[0];

  return (
    <div className={className}>
      <div className="border-b flex space-x-2">
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 ${isActive ? 'border-[var(--cor-acao)] text-[var(--cor-acao)]' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {activeTab.content}
      </div>
    </div>
  );
};

export default Tabs;
