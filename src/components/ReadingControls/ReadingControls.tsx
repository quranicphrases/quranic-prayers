import type { Language } from "../../types/prayer";
import { ALL_LANGUAGES, capitalizeLanguage } from "../../constants/languages";
import "./ReadingControls.css";

export interface ReadingControlsProps {
  /** Whether word-by-word mode is enabled */
  wordByWord: boolean;
  /** Callback when word-by-word mode changes */
  onWordByWordChange: (value: boolean) => void;
  /** Set of currently visible languages */
  visibleLanguages: Set<Language>;
  /** Callback when a language toggle changes */
  onToggleLanguage: (lang: Language) => void;
  /** Label for the reading mode section */
  readingModeLabel?: string;
  /** Label for the translations section */
  translationsLabel?: string;
  /** Label for normal reading mode button */
  normalModeLabel?: string;
  /** Label for word-by-word mode button */
  wbwModeLabel?: string;
}

/**
 * ReadingControls - Shared component for reading mode and language toggles.
 * Used in both BottomSheet (mobile) and FilterDrawer (desktop).
 *
 * @example
 * <ReadingControls
 *   wordByWord={wordByWord}
 *   onWordByWordChange={setWordByWord}
 *   visibleLanguages={visibleLanguages}
 *   onToggleLanguage={toggleLanguage}
 * />
 */
export default function ReadingControls({
  wordByWord,
  onWordByWordChange,
  visibleLanguages,
  onToggleLanguage,
  readingModeLabel = "Reading Mode:",
  translationsLabel = "Translations:",
  normalModeLabel = "📖 Normal",
  wbwModeLabel = "🔤 Word-by-Word",
}: ReadingControlsProps) {
  return (
    <div className="reading-controls">
      <div className="reading-control-group">
        <span className="reading-control-label">{readingModeLabel}</span>
        <div className="reading-control-options">
          <button
            className={`mode-btn ${!wordByWord ? "active" : ""}`}
            onClick={() => onWordByWordChange(false)}
            aria-pressed={!wordByWord}
          >
            {normalModeLabel}
          </button>
          <button
            className={`mode-btn ${wordByWord ? "active" : ""}`}
            onClick={() => onWordByWordChange(true)}
            aria-pressed={wordByWord}
          >
            {wbwModeLabel}
          </button>
        </div>
      </div>
      <div className="reading-control-group">
        <span className="reading-control-label">{translationsLabel}</span>
        <div className="reading-control-options">
          {ALL_LANGUAGES.map((lang) => (
            <label key={lang} className="lang-toggle">
              <input
                type="checkbox"
                checked={visibleLanguages.has(lang)}
                onChange={() => onToggleLanguage(lang)}
              />
              <span>{capitalizeLanguage(lang)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
