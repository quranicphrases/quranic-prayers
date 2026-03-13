import type { Language, UILanguage } from "../../types/prayer";
import {
  ALL_LANGUAGES,
  LANGUAGE_DISPLAY_NAMES,
} from "../../constants/languages";
import { t } from "../../constants/uiStrings";
import "./ReadingControls.css";

export interface ReadingControlsProps {
  wordByWord: boolean;
  onWordByWordChange: (value: boolean) => void;
  visibleLanguages: Set<Language>;
  onToggleLanguage: (lang: Language) => void;
  uiLanguage: UILanguage;
  onUILanguageChange: (lang: UILanguage) => void;
  id?: string;
}

export default function ReadingControls({
  wordByWord,
  onWordByWordChange,
  visibleLanguages,
  onToggleLanguage,
  uiLanguage,
  onUILanguageChange,
  id,
}: ReadingControlsProps) {
  return (
    <div className="reading-controls">
      {/* App Language selector */}
      <div className="reading-control-group">
        <span className="reading-control-label">
          {t("appLanguage", uiLanguage)}
        </span>
        <div className="reading-control-options">
          {ALL_LANGUAGES.map((lang) => (
            <label key={lang} className="lang-toggle">
              <input
                type="radio"
                name={`ui-language-${id ?? "default"}`}
                checked={uiLanguage === lang}
                onChange={() => onUILanguageChange(lang)}
              />
              <span>{LANGUAGE_DISPLAY_NAMES[lang]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reading mode */}
      <div className="reading-control-group">
        <span className="reading-control-label">
          {t("readingMode", uiLanguage)}
        </span>
        <div className="reading-control-options">
          <button
            className={`mode-btn ${!wordByWord ? "active" : ""}`}
            onClick={() => onWordByWordChange(false)}
            aria-pressed={!wordByWord}
          >
            {t("normalMode", uiLanguage)}
          </button>
          <button
            className={`mode-btn ${wordByWord ? "active" : ""}`}
            onClick={() => onWordByWordChange(true)}
            aria-pressed={wordByWord}
          >
            {t("wordByWord", uiLanguage)}
          </button>
        </div>
      </div>

      {/* Translations */}
      <div className="reading-control-group">
        <span className="reading-control-label">
          {t("translations", uiLanguage)}
        </span>
        <div className="reading-control-options">
          {ALL_LANGUAGES.map((lang) => (
            <label key={lang} className="lang-toggle">
              <input
                type="checkbox"
                checked={visibleLanguages.has(lang)}
                onChange={() => onToggleLanguage(lang)}
              />
              <span>{LANGUAGE_DISPLAY_NAMES[lang]}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
