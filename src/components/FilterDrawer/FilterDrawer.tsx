import { useEffect, useRef } from "react";
import FilterSection from "../FilterSection";
import TabGroup from "../TabGroup";
import ReadingControls from "../ReadingControls";
import type { Language } from "../../types/prayer";
import "./FilterDrawer.css";

/** Default tabs configuration */
const DEFAULT_TABS = [
  { id: "filters", label: "Filters" },
  { id: "reading", label: "Reading Options" },
];

/** Tab type for filters/reading options */
export type FilterDrawerTab = "filters" | "reading";

interface FilterDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback when the drawer should close */
  onClose: () => void;
  /** All available filter tags */
  allTags: string[];
  /** Currently selected tags */
  selectedTags: Set<string>;
  /** Callback when a tag is toggled */
  onToggleTag: (tag: string) => void;
  /** Callback to clear all filters */
  onClearAll: () => void;
  /** Number of visible prayers */
  visibleCount: number;
  /** Total number of prayers */
  totalCount: number;
  /** Currently active tab ID */
  activeTab: FilterDrawerTab;
  /** Callback when tab changes */
  onTabChange: (tab: FilterDrawerTab) => void;
  /** Whether word-by-word mode is enabled */
  wordByWord: boolean;
  /** Callback when word-by-word mode changes */
  onWordByWordChange: (value: boolean) => void;
  /** Set of currently visible languages */
  visibleLanguages: Set<Language>;
  /** Callback when a language is toggled */
  onToggleLanguage: (lang: Language) => void;
  /** Title displayed in the header */
  title?: string;
}

/**
 * FilterDrawer - Right-side overlay drawer for settings (desktop)
 * Contains tabs for Filters and Reading Options
 * Slides in from the right with backdrop overlay
 */
export default function FilterDrawer({
  isOpen,
  onClose,
  allTags,
  selectedTags,
  onToggleTag,
  onClearAll,
  visibleCount,
  totalCount,
  activeTab = "filters",
  onTabChange,
  wordByWord,
  onWordByWordChange,
  visibleLanguages,
  onToggleLanguage,
  title = "Settings",
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trap and body scroll lock
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`filter-drawer-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`filter-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        {/* Header */}
        <div className="filter-drawer-header">
          <h2 className="filter-drawer-title">{title}</h2>
          <button
            ref={closeButtonRef}
            className="filter-drawer-close"
            onClick={onClose}
            aria-label="Close settings drawer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <TabGroup
          tabs={DEFAULT_TABS}
          activeTab={activeTab}
          onTabChange={onTabChange as (tab: string) => void}
          className="filter-drawer-tabs"
        />

        {/* Content */}
        <div className="filter-drawer-content" role="tabpanel">
          {activeTab === "filters" ? (
            <FilterSection
              allTags={allTags}
              selectedTags={selectedTags}
              onToggleTag={onToggleTag}
              onClearAll={onClearAll}
              visibleCount={visibleCount}
              totalCount={totalCount}
            />
          ) : (
            <ReadingControls
              wordByWord={wordByWord}
              onWordByWordChange={onWordByWordChange}
              visibleLanguages={visibleLanguages}
              onToggleLanguage={onToggleLanguage}
            />
          )}
        </div>
      </div>
    </>
  );
}
