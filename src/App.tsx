import { useState, useMemo, useEffect } from "react";
import "./App.css";
import prayers from "./data.json";
import type { Prayer, Language } from "./types/prayer";
import PrayerCard from "./components/PrayerCard";
import FilterSection from "./components/FilterSection";
import NoResults from "./components/NoResults";
import ReadingControls from "./components/ReadingControls";
import { usePrayerFilters } from "./hooks/usePrayerFilters";
import BottomSheet from "./components/BottomSheet";
import FloatingControls from "./components/FloatingControls";
import FilterDrawer from "./components/FilterDrawer";
import { ALL_LANGUAGES, MOBILE_BREAKPOINT } from "./constants";

/**
 * Main App Component
 * Custom component approach — no iframes, no runtime API calls.
 * All prayer data is bundled in data.json.
 */
function App() {
  const [wordByWord, setWordByWord] = useState(false);
  const [visibleLanguages, setVisibleLanguages] = useState<Set<Language>>(
    () => new Set(ALL_LANGUAGES),
  );

  // Settings panel state - shared for both BottomSheet and FilterDrawer
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"filters" | "reading">("filters");

  // Track viewport size to determine which overlay to show
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth < MOBILE_BREAKPOINT
      : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Custom hook for filter management
  const {
    allTags,
    selectedTags,
    toggleTag,
    clearAllFilters,
    isPrayerVisible,
    visibleCount,
  } = usePrayerFilters(prayers as Prayer[]);

  // Stable reference for visibleLanguages to avoid unnecessary re-renders
  const stableVisibleLanguages = useMemo(
    () => visibleLanguages,
    [visibleLanguages],
  );

  const toggleLanguage = (lang: Language) => {
    setVisibleLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) {
        // Don't allow removing all languages
        if (next.size > 1) next.delete(lang);
      } else {
        next.add(lang);
      }
      return next;
    });
  };

  return (
    <div className="app-layout">
      <a href="#prayers-list" className="skip-nav-link">
        Skip to prayers
      </a>

      <div className="main-content">
        <header className="app-header">
          <h1>Quranic Prayers</h1>
          <p className="subtitle">دعائیں - Supplications from the Holy Quran</p>
        </header>

        {/* Screen reader announcement for filter changes */}
        <div aria-live="polite" className="sr-only">
          {selectedTags.size > 0
            ? `Showing ${visibleCount} of ${prayers.length} prayers`
            : `Showing all ${prayers.length} prayers`}
        </div>

        {/* Prayer count banner */}
        <div className="prayer-count-banner">
          Showing {visibleCount} of {prayers.length} prayers
          {selectedTags.size > 0 &&
            ` (${selectedTags.size} filter${selectedTags.size > 1 ? "s" : ""} applied)`}
        </div>

        {/* Main Prayer List - grid on wide, single column otherwise */}
        <main
          id="prayers-list"
          className="prayers-grid"
          aria-label="Prayer list"
        >
          {visibleCount === 0 && selectedTags.size > 0 && (
            <NoResults onClearFilters={clearAllFilters} />
          )}

          {(() => {
            let serial = 0;
            return prayers.map((prayer) => {
              const visible = isPrayerVisible(prayer as Prayer);
              if (visible) serial++;
              return (
                <PrayerCard
                  key={prayer.id}
                  prayer={prayer as Prayer}
                  isVisible={visible}
                  serialNumber={visible ? serial : 0}
                  showWordByWord={wordByWord}
                  visibleLanguages={stableVisibleLanguages}
                  onToggleTag={toggleTag}
                  selectedTags={selectedTags}
                />
              );
            });
          })()}
        </main>

        <footer className="app-footer">
          <p>
            Content sourced from{" "}
            <a
              href="https://quran.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Quran.com
            </a>
          </p>
        </footer>
      </div>

      {/* Floating controls - visible on all screens */}
      <FloatingControls
        activeFilters={selectedTags.size}
        onOpenSettings={() => setSettingsOpen(true)}
        onClearFilters={clearAllFilters}
      />

      {/* Mobile (<600px): Bottom sheet */}
      <BottomSheet
        isOpen={isSettingsOpen && isMobile}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showTabs
      >
        {activeTab === "filters" ? (
          <FilterSection
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            onClearAll={clearAllFilters}
            visibleCount={visibleCount}
            totalCount={prayers.length}
          />
        ) : (
          <ReadingControls
            wordByWord={wordByWord}
            onWordByWordChange={setWordByWord}
            visibleLanguages={visibleLanguages}
            onToggleLanguage={toggleLanguage}
          />
        )}
      </BottomSheet>

      {/* Desktop (≥600px): Filter drawer overlay */}
      <FilterDrawer
        isOpen={isSettingsOpen && !isMobile}
        onClose={() => setSettingsOpen(false)}
        allTags={allTags}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        onClearAll={clearAllFilters}
        visibleCount={visibleCount}
        totalCount={prayers.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        wordByWord={wordByWord}
        onWordByWordChange={setWordByWord}
        visibleLanguages={visibleLanguages}
        onToggleLanguage={toggleLanguage}
      />
    </div>
  );
}

export default App;
