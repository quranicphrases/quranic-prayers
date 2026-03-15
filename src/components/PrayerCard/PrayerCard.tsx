import { memo } from "react";
import type { Prayer, Language, UILanguage } from "../../types/prayer";
import { getLocalizedPrayer } from "../../hooks/useLocalizedPrayer";
import { getTagDisplay } from "../../constants/tagTranslations";
import { t } from "../../constants/uiStrings";
import QuranVerse from "../QuranVerse";
import "./PrayerCard.css";

interface PrayerCardProps {
  prayer: Prayer;
  serialNumber: number;
  showWordByWord: boolean;
  visibleLanguages: Set<Language>;
  onToggleTag: (tag: string) => void;
  selectedTags: Set<string>;
  uiLanguage: UILanguage;
}

/**
 * Simplified PrayerCard — renders prayer info + QuranVerse (no iframes).
 * Visibility controlled via display: none for instant filtering.
 */
const PrayerCard = memo(
  ({
    prayer,
    serialNumber,
    showWordByWord,
    visibleLanguages,
    onToggleTag,
    selectedTags,
    uiLanguage,
  }: PrayerCardProps) => {
    const localized = getLocalizedPrayer(prayer, uiLanguage);
    const isRtl = uiLanguage === "urdu";

    return (
      <article className="prayer-card" data-prayer-id={prayer.id}>
        <div className="prayer-header">
          <h2>
            <span className="prayer-serial">{serialNumber}.</span>{" "}
            {localized.title}
          </h2>
          <div className="tags-container">
            {prayer.tags_en.map((tagKey) => (
              <button
                key={tagKey}
                className={`tag-badge tag-badge-interactive${selectedTags.has(tagKey) ? " tag-badge-active" : ""}`}
                onClick={() => onToggleTag(tagKey)}
                aria-label={t("ariaFilterByTag", uiLanguage, {
                  tag: getTagDisplay(tagKey, uiLanguage),
                })}
              >
                {getTagDisplay(tagKey, uiLanguage)}
              </button>
            ))}
          </div>
        </div>

        <p className="prayer-description" dir={isRtl ? "rtl" : "ltr"}>
          {localized.description}
        </p>

        {prayer.content && prayer.content.length > 0 && (
          <div className="verse-container">
            <QuranVerse
              content={prayer.content}
              surahName={prayer.surahName}
              surahNumber={prayer.surahNumber}
              verseRange={prayer.verses}
              showWordByWord={showWordByWord}
              visibleLanguages={visibleLanguages}
              uiLanguage={uiLanguage}
            />
          </div>
        )}
      </article>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.prayer.id === nextProps.prayer.id &&
      prevProps.serialNumber === nextProps.serialNumber &&
      prevProps.showWordByWord === nextProps.showWordByWord &&
      prevProps.visibleLanguages === nextProps.visibleLanguages &&
      prevProps.onToggleTag === nextProps.onToggleTag &&
      prevProps.selectedTags === nextProps.selectedTags &&
      prevProps.uiLanguage === nextProps.uiLanguage
    );
  },
);

PrayerCard.displayName = "PrayerCard";

export default PrayerCard;
