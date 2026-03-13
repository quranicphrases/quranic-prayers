import { memo } from "react";
import "./NoResults.css";

interface NoResultsProps {
  onClearFilters: () => void;
  noResultsText?: string;
  clearFiltersText?: string;
}

const NoResults = memo(
  ({ onClearFilters, noResultsText, clearFiltersText }: NoResultsProps) => {
    return (
      <div className="no-results">
        <p>{noResultsText ?? "No prayers match the selected filters."}</p>
        <button className="clear-filters-btn" onClick={onClearFilters}>
          {clearFiltersText ?? "Clear Filters"}
        </button>
      </div>
    );
  },
);

NoResults.displayName = "NoResults";

export default NoResults;
