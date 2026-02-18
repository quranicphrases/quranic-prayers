import { memo } from "react";
import type { Prayer, Language } from "../../types/prayer";
import QuranVerse from "../QuranVerse";
import "./PrayerCard.css";

interface PrayerCardProps {
  prayer: Prayer;
  isVisible: boolean;
  serialNumber: number;
  showWordByWord: boolean;
  visibleLanguages: Set<Language>;
  onToggleTag: (tag: string) => void;
  selectedTags: Set<string>;
}

/**
 * Simplified PrayerCard — renders prayer info + QuranVerse (no iframes).
 * Visibility controlled via display: none for instant filtering.
 */
const PrayerCard = memo(
  ({
    prayer,
    isVisible,
    serialNumber,
    showWordByWord,
    visibleLanguages,
    onToggleTag,
    selectedTags,
  }: PrayerCardProps) => {
    return (
      <article
        className="prayer-card"
        style={{
          display: isVisible ? "block" : "none",
        }}
        data-prayer-id={prayer.id}
      >
        <div className="prayer-header">
          <h2>
            <span className="prayer-serial">{serialNumber}.</span>{" "}
            {prayer.title}
          </h2>
          <div className="tags-container">
            {prayer.tags.map((tag) => (
              <button
                key={tag}
                className={`tag-badge tag-badge-interactive${selectedTags.has(tag) ? " tag-badge-active" : ""}`}
                onClick={() => onToggleTag(tag)}
                aria-label={`Filter by ${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <p className="prayer-description">{prayer.description}</p>

        {prayer.partialVerse && (
          <p className="partial-note">
            <strong>Note:</strong> {prayer.partialVerse}
          </p>
        )}

        {prayer.content && prayer.content.length > 0 && (
          <div className="verse-container">
            <QuranVerse
              content={prayer.content}
              surahName={prayer.surahName}
              surahNumber={prayer.surahNumber}
              verseRange={prayer.verses}
              showWordByWord={showWordByWord}
              visibleLanguages={visibleLanguages}
            />
          </div>
        )}
      </article>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.prayer.id === nextProps.prayer.id &&
      prevProps.isVisible === nextProps.isVisible &&
      prevProps.serialNumber === nextProps.serialNumber &&
      prevProps.showWordByWord === nextProps.showWordByWord &&
      prevProps.visibleLanguages === nextProps.visibleLanguages &&
      prevProps.onToggleTag === nextProps.onToggleTag &&
      prevProps.selectedTags === nextProps.selectedTags
    );
  },
);

PrayerCard.displayName = "PrayerCard";

export default PrayerCard;
