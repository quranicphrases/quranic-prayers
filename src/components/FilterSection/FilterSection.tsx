import { memo } from "react";
import type { UILanguage } from "../../types/prayer";
import { getTagDisplay } from "../../constants/tagTranslations";
import { t } from "../../constants/uiStrings";
import "./FilterSection.css";

interface FilterSectionProps {
  allTags: string[];
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
  onClearAll: () => void;
  visibleCount: number;
  totalCount: number;
  uiLanguage: UILanguage;
}

/**
 * Memoized FilterSection component - prevents unnecessary re-renders
 */
const FilterSection = memo(
  ({
    allTags,
    selectedTags,
    onToggleTag,
    onClearAll,
    visibleCount,
    totalCount,
    uiLanguage,
  }: FilterSectionProps) => {
    const hasActiveFilters = selectedTags.size > 0;

    return (
      <nav aria-label="Prayer filters">
        <section className="filter-section">
          <div className="filter-header">
            <h2>{t("filterByCategory", uiLanguage)}</h2>
          </div>

          <div className="filter-chips">
            {allTags.map((tagKey) => (
              <button
                key={tagKey}
                className={`filter-chip ${selectedTags.has(tagKey) ? "active" : ""}`}
                onClick={() => onToggleTag(tagKey)}
                aria-pressed={selectedTags.has(tagKey)}
              >
                {getTagDisplay(tagKey, uiLanguage)}
              </button>
            ))}
            <button
              className={`filter-chip clear-filters-chip ${!hasActiveFilters ? "clear-filters-chip-disabled" : ""}`}
              onClick={hasActiveFilters ? onClearAll : undefined}
              aria-label={t("clearAll", uiLanguage)}
              aria-disabled={!hasActiveFilters}
            >
              ✕ {t("clearAll", uiLanguage)}
              {hasActiveFilters ? ` (${selectedTags.size})` : ""}
            </button>
          </div>

          <div className="filter-results">
            {t("showingOf", uiLanguage, {
              visible: visibleCount,
              total: totalCount,
            })}
          </div>
        </section>
      </nav>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.selectedTags === nextProps.selectedTags &&
      prevProps.visibleCount === nextProps.visibleCount &&
      prevProps.allTags.length === nextProps.allTags.length &&
      prevProps.uiLanguage === nextProps.uiLanguage
    );
  },
);

FilterSection.displayName = "FilterSection";

export default FilterSection;
