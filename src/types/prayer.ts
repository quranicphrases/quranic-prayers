/** A single word in word-by-word mode */
export interface WordData {
  textIndopak: string;
  translation: string;
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
  isPartOfPrayer: boolean;
  words: WordData[];
  translations: {
    english: TranslationData;
    urdu: TranslationData;
    hindi: TranslationData;
  };
}

/** Supported language keys */
export type Language = "english" | "urdu" | "hindi";

/** Prayer data shape (enriched from API) */
export interface Prayer {
  id: string;
  title: string;
  tags: string[];
  description: string;
  verses: string; // reference string e.g., "1:2-7" or "2:201"
  partialVerse?: string;
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
}
