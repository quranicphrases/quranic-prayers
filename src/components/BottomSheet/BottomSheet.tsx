import { useEffect, useRef, useCallback, type ReactNode } from "react";
import TabGroup from "../TabGroup";
import "./BottomSheet.css";

/** Tab type for filters/reading options */
export type BottomSheetTab = "filters" | "reading";

/** Default tabs configuration */
const DEFAULT_TABS = [
  { id: "filters", label: "Filters" },
  { id: "reading", label: "Reading Options" },
];

interface BottomSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Callback when the sheet should close */
  onClose: () => void;
  /** Title displayed in the header */
  title?: string;
  /** Content to render inside the sheet */
  children: ReactNode;
  /** Currently active tab ID */
  activeTab?: BottomSheetTab;
  /** Callback when tab changes */
  onTabChange?: (tab: BottomSheetTab) => void;
  /** Whether to show tab navigation */
  showTabs?: boolean;
  /** Custom tabs configuration */
  tabs?: Array<{ id: string; label: string }>;
}

/**
 * Bottom Sheet component - slides up from bottom of screen
 * Used for compact mobile layout to show filters and reading options
 */
export default function BottomSheet({
  isOpen,
  onClose,
  title = "Settings",
  children,
  activeTab = "filters",
  onTabChange,
  showTabs = true,
  tabs = DEFAULT_TABS,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose],
  );

  // Trap focus within the bottom sheet
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus the close button when opened
      setTimeout(() => firstFocusableRef.current?.focus(), 100);
      // Prevent body scroll when sheet is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`bottom-sheet-backdrop ${isOpen ? "open" : ""}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`bottom-sheet ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Settings panel"}
      >
        {/* Drag handle */}
        <div className="bottom-sheet-drag-handle" aria-hidden="true">
          <div className="drag-handle-bar" />
        </div>

        {/* Header with close button */}
        <div className="bottom-sheet-header">
          <h2 className="bottom-sheet-title">{title}</h2>
          <button
            ref={firstFocusableRef}
            className="bottom-sheet-close"
            onClick={onClose}
            aria-label="Close settings panel"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        {showTabs && onTabChange && (
          <TabGroup
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange as (tab: string) => void}
            className="bottom-sheet-tabs"
          />
        )}

        {/* Content */}
        <div className="bottom-sheet-content" role="tabpanel">
          {children}
        </div>
      </div>
    </>
  );
}
