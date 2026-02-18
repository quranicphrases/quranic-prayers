import { memo } from "react";
import "./NoResults.css";

interface NoResultsProps {
  onClearFilters: () => void;
}

/**
 * Component displayed when no prayers match the selected filters
 */
const NoResults = memo(({ onClearFilters }: NoResultsProps) => {
  return (
    <div className="no-results">
      <p>No prayers match the selected filters.</p>
      <button className="clear-filters-btn" onClick={onClearFilters}>
        Clear Filters
      </button>
    </div>
  );
});

NoResults.displayName = "NoResults";

export default NoResults;
