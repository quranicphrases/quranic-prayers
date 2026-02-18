import "./TabGroup.css";

export interface Tab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
}

export interface TabGroupProps {
  /** Array of tabs to display */
  tabs: Tab[];
  /** ID of the currently active tab */
  activeTab: string;
  /** Callback when a tab is clicked */
  onTabChange: (tabId: string) => void;
  /** Optional CSS class for styling variants */
  className?: string;
  /** Optional aria-label for the tab group */
  ariaLabel?: string;
}

/**
 * TabGroup - Reusable accessible tab navigation component.
 * Used in BottomSheet and FilterDrawer for switching between Filters and Reading Options.
 *
 * @example
 * <TabGroup
 *   tabs={[{ id: 'filters', label: 'Filters' }, { id: 'reading', label: 'Reading Options' }]}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 * />
 */
export default function TabGroup({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  ariaLabel = "Settings tabs",
}: TabGroupProps) {
  return (
    <div
      className={`tab-group ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          className={`tab-group-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
          aria-selected={activeTab === tab.id}
          tabIndex={activeTab === tab.id ? 0 : -1}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
