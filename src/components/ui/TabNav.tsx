"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function TabNav({ tabs, activeTab, onChange }: TabNavProps) {
  return (
    <div className="flex border-b border-border">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "text-neon-cyan"
                : "text-dim hover:text-muted"
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-neon-cyan rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
