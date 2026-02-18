/**
 * Quran-specific helper utilities for text processing and URL generation.
 * Extracted from QuranVerse component for reusability and testing.
 */

/**
 * Eastern-Arabic (Indic) digit mapping for verse numbers.
 */
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Convert a number to Eastern-Arabic (Indic) numerals.
 * @param n - Number to convert
 * @returns String with Arabic numerals (e.g., 123 → "١٢٣")
 *
 * @example
 * toArabicNumeral(7) // "٧"
 * toArabicNumeral(123) // "١٢٣"
 */
export function toArabicNumeral(n: number): string {
  return String(n)
    .split("")
    .map((d) => ARABIC_DIGITS[parseInt(d)])
    .join("");
}

/**
 * Normalize IndoPak Arabic text for consistent rendering.
 * Replaces U+06E1 (Arabic Small High Dotless Head Of Khah — renders as
 * a visible circle in most fonts) with U+0652 (standard Arabic Sukun).
 *
 * @param text - Raw IndoPak Arabic text
 * @returns Normalized text with consistent sukun character
 */
export function normalizeArabicText(text: string): string {
  return text.replace(/\u06E1/g, "\u0652");
}

/**
 * Waqf (pause) marks that appear at the end of IndoPak verse text.
 * In traditional mushaf typography these sit above the end-of-ayah circle.
 */
const WAQF_MARKS = new Set([
  "\u0615", // Arabic Small High Tah
  "\u06D6", // Arabic Small High Ligature Sad with Lam with Alef Maksura
  "\u06D8", // Arabic Small High Meem Initial Form
  "\u06D9", // Arabic Small High Lam Alef
  "\u06DA", // Arabic Small High Jeem
  "\uE01C", // IndoPak PUA waqf glyph
  "\uE022", // IndoPak PUA waqf glyph
]);

/**
 * Extract trailing waqf mark(s) from IndoPak verse text.
 * Returns the cleaned text and the waqf mark string (empty if none).
 *
 * @param text - Raw IndoPak verse text
 * @returns Object with cleaned text and extracted waqf mark
 *
 * @example
 * extractWaqfMark("وَالضُّحَىٰۙ") // { text: "وَالضُّحَىٰ", waqfMark: "ۙ" }
 */
export function extractWaqfMark(text: string): {
  text: string;
  waqfMark: string;
} {
  // Strip trailing formatting chars: RTL mark, zero-width spaces, BOM/ZWNBSP, regular spaces
  let cleaned = text.replace(/[\u200F\u200B\uFEFF\u0020]+$/g, "");

  // Collect trailing waqf marks (may be compound, e.g. U+06D6 + U+06DA)
  let waqf = "";
  while (cleaned.length > 0 && WAQF_MARKS.has(cleaned[cleaned.length - 1])) {
    waqf = cleaned[cleaned.length - 1] + waqf;
    cleaned = cleaned.slice(0, -1);
  }

  return { text: cleaned, waqfMark: waqf };
}

/**
 * Build a Quran.com URL for the given verse range.
 *
 * @param _surahNumber - Surah number (unused but kept for potential future use)
 * @param verseRange - Verse range like "1:2-7" or "2:201"
 * @returns Full Quran.com URL
 *
 * @example
 * buildQuranUrl(1, "1:2-7") // "https://quran.com/1:2-7"
 */
export function buildQuranUrl(
  _surahNumber: number,
  verseRange: string,
): string {
  return `https://quran.com/${verseRange}`;
}
