import { memo } from "react";
import type { QuranVerseProps, VerseContent } from "../../types/prayer";
import {
  toArabicNumeral,
  normalizeArabicText,
  extractWaqfMark,
  buildQuranUrl,
} from "../../utils/quranHelpers";
import "./QuranVerse.css";

/**
 * Native Quran verse display component — replaces the iframe embed.
 *
 * Renders Arabic text (normal or word-by-word), along with English, Urdu,
 * and Hindi translations controlled by global visibility toggles.
 */
const QuranVerse = memo(
  ({
    content,
    surahName,
    surahNumber,
    verseRange,
    showWordByWord,
    visibleLanguages,
  }: QuranVerseProps) => {
    return (
      <div className="quran-verse">
        {/* ── Arabic Section — continuous flow ── */}
        <div className="qv-arabic-section" aria-label="Quranic Arabic text">
          {showWordByWord ? (
            // Word-by-word: each verse's words flow together with verse-end marker
            <div className="qv-wbw-container" dir="rtl">
              {content.map((verse) => (
                <WbwWordsInline key={verse.verseKey} verse={verse} />
              ))}
            </div>
          ) : (
            // Normal: all verses in a single <p> so they wrap naturally
            <p className="qv-arabic-text" dir="rtl" lang="ar">
              {content.map((verse, i) => (
                <span
                  key={verse.verseKey}
                  className={!verse.isPartOfPrayer ? "qv-dimmed-inline" : ""}
                >
                  {i > 0 && " "}
                  {(() => {
                    const { text, waqfMark } = extractWaqfMark(
                      verse.textIndopak,
                    );
                    return (
                      <>
                        {normalizeArabicText(text)}{" "}
                        <AyahEndMarker
                          verseNumber={verse.verseNumber}
                          waqfMark={waqfMark}
                        />
                      </>
                    );
                  })()}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="qv-divider" />

        {/* ── Translations — grouped by language ── */}
        <div className="qv-translations-section">
          {visibleLanguages.has("english") && (
            <LanguageTranslationGroup
              content={content}
              lang="english"
              dir="ltr"
              langClass="qv-lang-en"
              langCode="en"
            />
          )}

          {visibleLanguages.has("urdu") && (
            <LanguageTranslationGroup
              content={content}
              lang="urdu"
              dir="rtl"
              langClass="qv-lang-ur"
              langCode="ur"
            />
          )}

          {visibleLanguages.has("hindi") && (
            <LanguageTranslationGroup
              content={content}
              lang="hindi"
              dir="ltr"
              langClass="qv-lang-hi"
              langCode="hi"
            />
          )}
        </div>

        {/* ── Footer ── */}
        {(surahName || verseRange) && (
          <div className="qv-footer">
            <span className="qv-ref">
              {surahName && <span className="qv-surah">{surahName}</span>}
              {verseRange && <span className="qv-range"> [{verseRange}]</span>}
            </span>
            {verseRange && surahNumber && (
              <a
                className="qv-quran-link"
                href={buildQuranUrl(surahNumber, verseRange)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open on Quran.com ↗
              </a>
            )}
          </div>
        )}
      </div>
    );
  },
);

QuranVerse.displayName = "QuranVerse";

/* ─────────────────────── Sub-components ─────────────────────── */

/** End-of-ayah marker: optional waqf mark on top, circle with numeral, verse number below */
function AyahEndMarker({
  verseNumber,
  waqfMark,
}: {
  verseNumber: number;
  waqfMark: string;
}) {
  return (
    <span
      className="qv-ayah-marker"
      aria-label={`Verse ${verseNumber}`}
      role="img"
    >
      {waqfMark && (
        <span className="qv-ayah-waqf" aria-hidden="true">
          {waqfMark}
        </span>
      )}
      <span className="qv-ayah-end" aria-hidden="true">
        {toArabicNumeral(verseNumber)}
      </span>
      <span className="qv-ayah-num" aria-hidden="true">
        ({verseNumber})
      </span>
    </span>
  );
}

/** Inline word-by-word words for a single verse (no wrapper div — flows with siblings) */
function WbwWordsInline({ verse }: { verse: VerseContent }) {
  return (
    <>
      {verse.words?.map((word, i) => (
        <div
          key={`${verse.verseKey}-${i}`}
          className={`qv-wbw-word ${!verse.isPartOfPrayer ? "qv-dimmed" : ""}`}
          role="group"
          aria-label={`${word.transliteration}: ${word.translation}`}
        >
          <span className="qv-wbw-arabic" lang="ar">
            {normalizeArabicText(word.textIndopak)}
          </span>
          <span className="qv-wbw-transliteration">{word.transliteration}</span>
          <span className="qv-wbw-translation">{word.translation}</span>
        </div>
      ))}
      <div className="qv-wbw-word qv-wbw-verse-num">
        <AyahEndMarker
          verseNumber={verse.verseNumber}
          waqfMark={extractWaqfMark(verse.textIndopak).waqfMark}
        />
      </div>
    </>
  );
}

/** All translations for one language, across all verses */
function LanguageTranslationGroup({
  content,
  lang,
  dir,
  langClass,
  langCode,
}: {
  content: VerseContent[];
  lang: "english" | "urdu" | "hindi";
  dir: "ltr" | "rtl";
  langClass: string;
  langCode: string;
}) {
  const hasAny = content.some((v) => v.translations[lang]?.text);
  if (!hasAny) return null;

  const translator = content[0]?.translations[lang]?.translator ?? "";

  return (
    <div className={`qv-translation ${langClass}`} dir={dir} lang={langCode}>
      <div className="qv-translation-text">
        {content.map((verse, i) => {
          const t = verse.translations[lang];
          if (!t?.text) return null;
          return (
            <span
              key={verse.verseKey}
              className={!verse.isPartOfPrayer ? "qv-dimmed-inline" : ""}
            >
              <span className="qv-inline-verse-ref" aria-hidden="true">
                ({verse.verseKey}){" "}
              </span>
              {t.text}
              {i < content.length - 1 && " "}
            </span>
          );
        })}
      </div>
      <p className="qv-translator-name">— {translator}</p>
    </div>
  );
}

export default QuranVerse;
