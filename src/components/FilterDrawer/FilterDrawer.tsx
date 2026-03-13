import { useEffect, useRef } from "react";
import FilterSection from "../FilterSection";
import TabGroup from "../TabGroup";
import ReadingControls from "../ReadingControls";
import type { Language, UILanguage } from "../../types/prayer";
import { t } from "../../constants/uiStrings";
import "./FilterDrawer.css";

/** Tab type for filters/reading options */
export type FilterDrawerTab = "filters" | "reading";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allTags: string[];
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
  onClearAll: () => void;
  visibleCount: number;
  totalCount: number;
  activeTab: FilterDrawerTab;
  onTabChange: (tab: FilterDrawerTab) => void;
  wordByWord: boolean;
  onWordByWordChange: (value: boolean) => void;
  visibleLanguages: Set<Language>;
  onToggleLanguage: (lang: Language) => void;
  title?: string;
  uiLanguage: UILanguage;
  onUILanguageChange: (lang: UILanguage) => void;
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
  uiLanguage,
  onUILanguageChange,
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const tabs = [
    { id: "filters", label: t("tabFilters", uiLanguage) },
    { id: "reading", label: t("tabReading", uiLanguage) },
  ];

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
          tabs={tabs}
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
              uiLanguage={uiLanguage}
            />
          ) : (
            <ReadingControls
              wordByWord={wordByWord}
              onWordByWordChange={onWordByWordChange}
              visibleLanguages={visibleLanguages}
              onToggleLanguage={onToggleLanguage}
              uiLanguage={uiLanguage}
              onUILanguageChange={onUILanguageChange}
              id="desktop"
            />
          )}
        </div>
      </div>
    </>
  );
}
