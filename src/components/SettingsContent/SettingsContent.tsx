import FilterSection from "../FilterSection";
import ReadingControls from "../ReadingControls";
import type { Language, UILanguage } from "../../types/prayer";

interface SettingsContentProps {
  activeTab: "filters" | "reading";
  allTags: string[];
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
  onClearAll: () => void;
  visibleCount: number;
  totalCount: number;
  wordByWord: boolean;
  onWordByWordChange: (value: boolean) => void;
  visibleLanguages: Set<Language>;
  onToggleLanguage: (lang: Language) => void;
  uiLanguage: UILanguage;
  onUILanguageChange: (lang: UILanguage) => void;
  id: string;
}

/**
 * Shared settings content for BottomSheet and FilterDrawer.
 * Renders either FilterSection or ReadingControls based on active tab.
 */
export default function SettingsContent({
  activeTab,
  allTags,
  selectedTags,
  onToggleTag,
  onClearAll,
  visibleCount,
  totalCount,
  wordByWord,
  onWordByWordChange,
  visibleLanguages,
  onToggleLanguage,
  uiLanguage,
  onUILanguageChange,
  id,
}: SettingsContentProps) {
  if (activeTab === "filters") {
    return (
      <FilterSection
        allTags={allTags}
        selectedTags={selectedTags}
        onToggleTag={onToggleTag}
        onClearAll={onClearAll}
        visibleCount={visibleCount}
        totalCount={totalCount}
        uiLanguage={uiLanguage}
      />
    );
  }

  return (
    <ReadingControls
      wordByWord={wordByWord}
      onWordByWordChange={onWordByWordChange}
      visibleLanguages={visibleLanguages}
      onToggleLanguage={onToggleLanguage}
      uiLanguage={uiLanguage}
      onUILanguageChange={onUILanguageChange}
      id={id}
    />
  );
}
