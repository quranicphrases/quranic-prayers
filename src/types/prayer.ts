/** A single word in word-by-word mode */
export interface WordData {
  textIndopak: string;
  translation: string;
  translation_ur?: string;
  translation_hi?: string;
  transliteration: string;
}

/** Translation for a single language */
export interface TranslationData {
  text: string;
  translator: string;
}

/** A single verse with all its text content */
export interface VerseContent {
  verseKey: string; // e.g., "1:2"
  verseNumber: number;
  textIndopak: string;
  words: WordData[];
  translations: {
    english: TranslationData;
    urdu: TranslationData;
    hindi: TranslationData;
  };
}

/** Supported language keys */
export type Language = "english" | "urdu" | "hindi";

/** UI language key — same set, used for app chrome / prayer metadata */
export type UILanguage = Language;

/** Prayer data shape (enriched from API) */
export interface Prayer {
  id: string;
  title_en: string;
  title_ur: string;
  title_hi: string;
  tags_en: string[];
  description_en: string;
  description_ur: string;
  description_hi: string;
  verses: string; // reference string e.g., "1:2-7" or "2:201"
  surahName?: string;
  surahNumber?: number;
  content?: VerseContent[];
}

/** Props for the QuranVerse component */
export interface QuranVerseProps {
  content: VerseContent[];
  surahName?: string;
  surahNumber?: number;
  verseRange?: string;
  showWordByWord: boolean;
  visibleLanguages: Set<Language>;
  uiLanguage: UILanguage;
}
