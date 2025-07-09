import React from 'react';

interface TabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange }) => (
  <div className="tabs">
    {tabs.map(t => (
      <button
        key={t}
        className={active === t ? 'tab active' : 'tab'}
        onClick={() => onChange(t)}
      >
        {t}
      </button>
    ))}
  </div>
);

export default Tabs;
