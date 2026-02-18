import { memo } from "react";
import "./FilterSection.css";

interface FilterSectionProps {
  allTags: string[];
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
  onClearAll: () => void;
  visibleCount: number;
  totalCount: number;
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
  }: FilterSectionProps) => {
    const hasActiveFilters = selectedTags.size > 0;

    return (
      <nav aria-label="Prayer filters">
        <section className="filter-section">
          <div className="filter-header">
            <h2>Filter by Category</h2>
          </div>

          <div className="filter-chips">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`filter-chip ${selectedTags.has(tag) ? "active" : ""}`}
                onClick={() => onToggleTag(tag)}
                aria-pressed={selectedTags.has(tag)}
              >
                {tag}
              </button>
            ))}
            <button
              className={`filter-chip clear-filters-chip ${!hasActiveFilters ? "clear-filters-chip-disabled" : ""}`}
              onClick={hasActiveFilters ? onClearAll : undefined}
              aria-label="Clear all filters"
              aria-disabled={!hasActiveFilters}
            >
              ✕ Clear All{hasActiveFilters ? ` (${selectedTags.size})` : ""}
            </button>
          </div>

          <div className="filter-results">
            Showing {visibleCount} of {totalCount} prayers
          </div>
        </section>
      </nav>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if these change
    return (
      prevProps.selectedTags === nextProps.selectedTags &&
      prevProps.visibleCount === nextProps.visibleCount &&
      prevProps.allTags.length === nextProps.allTags.length
    );
  },
);

FilterSection.displayName = "FilterSection";

export default FilterSection;
