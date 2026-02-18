import "./FloatingControls.css";

interface FloatingControlsProps {
  activeFilters: number;
  onOpenSettings: () => void;
  onClearFilters: () => void;
}

/**
 * FloatingControls component - Floating buttons for all screen sizes
 * Contains Back to Top, Clear Filters, and Settings FAB
 * Positioned: top-right on desktop (≥600px), bottom-right on mobile (<600px)
 */
export default function FloatingControls({
  activeFilters,
  onOpenSettings,
  onClearFilters,
}: FloatingControlsProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="floating-controls">
      {/* Clear filters button - visible when filters active */}
      {activeFilters > 0 && (
        <button
          className="floating-btn clear-filters-btn"
          onClick={onClearFilters}
          aria-label={`Clear ${activeFilters} filter${activeFilters > 1 ? "s" : ""}`}
        >
          Clear ({activeFilters})
        </button>
      )}

      {/* Back to Top button - always visible */}
      <button
        className="floating-btn back-to-top"
        onClick={handleScrollToTop}
        aria-label="Scroll to top"
      >
        ↑ <span className="floating-btn-text">Top</span>
      </button>

      {/* FAB - Settings button */}
      <button
        className="fab"
        onClick={onOpenSettings}
        aria-label="Open settings and filters"
      >
        <svg
          className="fab-icon"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.23 0 .43-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      </button>
    </div>
  );
}
