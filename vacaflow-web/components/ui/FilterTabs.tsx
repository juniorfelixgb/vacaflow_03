'use client';

interface FilterTab {
  id: string;
  label: string;
  count: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function FilterTabs({ tabs, activeTab, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-3 flex-wrap mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-bold transition
            ${
              activeTab === tab.id
                ? 'bg-white border-2 border-brand-orange text-brand-orange ring-1 ring-brand-orange ring-inset'
                : 'border border-border-warm text-text-muted bg-bg-app hover:text-text-primary'
            }
          `}
        >
          {tab.label} · {tab.count}
        </button>
      ))}
    </div>
  );
}
