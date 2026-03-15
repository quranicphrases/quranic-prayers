import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  use,
  lazy,
  Suspense,
} from "react";
import "./App.css";
import type { Prayer, Language } from "./types/prayer";

const prayersPromise = import("./data.json").then((m) => m.default as Prayer[]);
import PrayerCard from "./components/PrayerCard";
import NoResults from "./components/NoResults";
import SettingsContent from "./components/SettingsContent";
import { usePrayerFilters } from "./hooks/usePrayerFilters";
const BottomSheet = lazy(() => import("./components/BottomSheet"));
import FloatingControls from "./components/FloatingControls";
const FilterDrawer = lazy(() => import("./components/FilterDrawer"));
import { ALL_LANGUAGES, MOBILE_BREAKPOINT } from "./constants";
import { t } from "./constants/uiStrings";
import { useUILanguage } from "./contexts/LanguageContext";

/**
 * Main App Component
 * Custom component approach — no iframes, no runtime API calls.
 * All prayer data is bundled in data.json.
 */
function App() {
  const prayers = use(prayersPromise);
  const { uiLanguage, setUILanguage } = useUILanguage();
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
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
      : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
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

  const toggleLanguage = useCallback((lang: Language) => {
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
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  return (
    <div className="app-layout" data-ui-lang={uiLanguage}>
      <a href="#prayers-list" className="skip-nav-link">
        {t("skipToPrayers", uiLanguage)}
      </a>

      <div className="main-content">
        <header className="app-header">
          <h1>{t("appTitle", uiLanguage)}</h1>
          <p className="subtitle">{t("appSubtitle", uiLanguage)}</p>
        </header>

        {/* Screen reader announcement for filter changes */}
        <div aria-live="polite" className="sr-only">
          {selectedTags.size > 0
            ? t("showingOf", uiLanguage, {
                visible: visibleCount,
                total: prayers.length,
              })
            : t("showingOf", uiLanguage, {
                visible: prayers.length,
                total: prayers.length,
              })}
        </div>

        {/* Prayer count banner */}
        <div className="prayer-count-banner">
          {t("showingOf", uiLanguage, {
            visible: visibleCount,
            total: prayers.length,
          })}
          {selectedTags.size > 0 &&
            ` ${t("filtersApplied", uiLanguage, { count: selectedTags.size, s: selectedTags.size > 1 ? "s" : "" })}`}
        </div>

        {/* Main Prayer List - grid on wide, single column otherwise */}
        <main
          id="prayers-list"
          className="prayers-grid"
          aria-label={t("ariaPrayerList", uiLanguage)}
        >
          {visibleCount === 0 && selectedTags.size > 0 && (
            <NoResults
              onClearFilters={clearAllFilters}
              noResultsText={t("noResults", uiLanguage)}
              clearFiltersText={t("clearFilters", uiLanguage)}
            />
          )}

          {(() => {
            let serial = 0;
            return prayers.map((prayer) => {
              const visible = isPrayerVisible(prayer as Prayer);
              if (!visible) return null;
              serial++;
              return (
                <PrayerCard
                  key={prayer.id}
                  prayer={prayer as Prayer}
                  serialNumber={serial}
                  showWordByWord={wordByWord}
                  visibleLanguages={stableVisibleLanguages}
                  onToggleTag={toggleTag}
                  selectedTags={selectedTags}
                  uiLanguage={uiLanguage}
                />
              );
            });
          })()}
        </main>

        <footer className="app-footer">
          <p>
            {t("contentSourced", uiLanguage)}{" "}
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
        onOpenSettings={openSettings}
        onClearFilters={clearAllFilters}
        uiLanguage={uiLanguage}
      />

      {/* Mobile (<600px): Bottom sheet */}
      {isSettingsOpen && isMobile && (
        <Suspense fallback={null}>
          <BottomSheet
            isOpen
            onClose={closeSettings}
            title={t("settings", uiLanguage)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showTabs
            uiLanguage={uiLanguage}
          >
            <SettingsContent
              activeTab={activeTab}
              allTags={allTags}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              onClearAll={clearAllFilters}
              visibleCount={visibleCount}
              totalCount={prayers.length}
              wordByWord={wordByWord}
              onWordByWordChange={setWordByWord}
              visibleLanguages={visibleLanguages}
              onToggleLanguage={toggleLanguage}
              uiLanguage={uiLanguage}
              onUILanguageChange={setUILanguage}
              id="mobile"
            />
          </BottomSheet>
        </Suspense>
      )}

      {/* Desktop (≥600px): Filter drawer overlay */}
      {isSettingsOpen && !isMobile && (
        <Suspense fallback={null}>
          <FilterDrawer
            isOpen
            onClose={closeSettings}
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
            uiLanguage={uiLanguage}
            onUILanguageChange={setUILanguage}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
