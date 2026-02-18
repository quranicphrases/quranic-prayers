/**
 * Data-fetching build script for Quranic Prayers
 *
 * Reads src/data.json, fetches Arabic text, word-by-word, and translations
 * from Quran.com API v4, and writes enriched data back to src/data.json.
 *
 * Usage: npx tsx scripts/fetch-prayer-data.ts
 *
 * Idempotent — only fetches prayers missing `content` array.
 * Rate-limited at 100ms between API calls.
 */

import fs from "node:fs";
import path from "node:path";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RawPrayer {
  id: string;
  title: string;
  tags: string[];
  description: string;
  verses: string;
  partialVerse?: string;
  // If already enriched:
  surahName?: string;
  surahNumber?: number;
  content?: EnrichedVerse[];
}

interface EnrichedVerse {
  verseKey: string;
  verseNumber: number;
  textIndopak: string;
  isPartOfPrayer: boolean;
  words: { textIndopak: string; translation: string; transliteration: string }[];
  translations: {
    english: { text: string; translator: string };
    urdu: { text: string; translator: string };
    hindi: { text: string; translator: string };
  };
}

interface QuranApiVerseResponse {
  verse: {
    id: number;
    verse_number: number;
    verse_key: string;
    text_indopak: string;
    words: {
      id: number;
      position: number;
      text_indopak: string;
      translation: { text: string; language_name: string };
      transliteration: { text: string; language_name: string };
      char_type_name: string;
    }[];
  };
}

interface QuranApiTranslationResponse {
  translations: {
    resource_id: number;
    text: string;
    verse_id?: number;
    resource_name?: string;
  }[];
  meta?: {
    translation_name?: string;
    author_name?: string;
  };
}

// ─── Config ──────────────────────────────────────────────────────────────────

const API_BASE = "https://api.quran.com/api/v4";
const TRANSLATION_IDS = {
  english: 20,    // Sahih International
  urdu: 158,      // Dr. Israr Ahmad
  hindi: 122,     // Maulana Azizul Haque al-Umari
} as const;

const TRANSLATOR_NAMES = {
  english: "Sahih International",
  urdu: "Dr. Israr Ahmad",
  hindi: "Maulana Azizul Haque al-Umari",
} as const;

const RATE_LIMIT_MS = 150; // ms between API calls

// Surah names lookup
const SURAH_NAMES: Record<number, string> = {
  1: "Al-Fatiha", 2: "Al-Baqarah", 3: "Ali 'Imran", 4: "An-Nisa", 5: "Al-Ma'idah",
  6: "Al-An'am", 7: "Al-A'raf", 8: "Al-Anfal", 9: "At-Tawbah", 10: "Yunus",
  11: "Hud", 12: "Yusuf", 13: "Ar-Ra'd", 14: "Ibrahim", 15: "Al-Hijr",
  16: "An-Nahl", 17: "Al-Isra", 18: "Al-Kahf", 19: "Maryam", 20: "Ta-Ha",
  21: "Al-Anbiya", 22: "Al-Hajj", 23: "Al-Mu'minun", 24: "An-Nur", 25: "Al-Furqan",
  26: "Ash-Shu'ara", 27: "An-Naml", 28: "Al-Qasas", 29: "Al-Ankabut", 30: "Ar-Rum",
  31: "Luqman", 32: "As-Sajdah", 33: "Al-Ahzab", 34: "Saba", 35: "Fatir",
  36: "Ya-Sin", 37: "As-Saffat", 38: "Sad", 39: "Az-Zumar", 40: "Ghafir",
  41: "Fussilat", 42: "Ash-Shura", 43: "Az-Zukhruf", 44: "Ad-Dukhan", 45: "Al-Jathiyah",
  46: "Al-Ahqaf", 47: "Muhammad", 48: "Al-Fath", 49: "Al-Hujurat", 50: "Qaf",
  51: "Adh-Dhariyat", 52: "At-Tur", 53: "An-Najm", 54: "Al-Qamar", 55: "Ar-Rahman",
  56: "Al-Waqi'ah", 57: "Al-Hadid", 58: "Al-Mujadilah", 59: "Al-Hashr", 60: "Al-Mumtahanah",
  61: "As-Saff", 62: "Al-Jumu'ah", 63: "Al-Munafiqun", 64: "At-Taghabun", 65: "At-Talaq",
  66: "At-Tahrim", 67: "Al-Mulk", 68: "Al-Qalam", 69: "Al-Haqqah", 70: "Al-Ma'arij",
  71: "Nuh", 72: "Al-Jinn", 73: "Al-Muzzammil", 74: "Al-Muddaththir", 75: "Al-Qiyamah",
  76: "Al-Insan", 77: "Al-Mursalat", 78: "An-Naba", 79: "An-Nazi'at", 80: "Abasa",
  81: "At-Takwir", 82: "Al-Infitar", 83: "Al-Mutaffifin", 84: "Al-Inshiqaq", 85: "Al-Buruj",
  86: "At-Tariq", 87: "Al-A'la", 88: "Al-Ghashiyah", 89: "Al-Fajr", 90: "Al-Balad",
  91: "Ash-Shams", 92: "Al-Layl", 93: "Ad-Duha", 94: "Ash-Sharh", 95: "At-Tin",
  96: "Al-Alaq", 97: "Al-Qadr", 98: "Al-Bayyinah", 99: "Az-Zalzalah", 100: "Al-Adiyat",
  101: "Al-Qari'ah", 102: "At-Takathur", 103: "Al-Asr", 104: "Al-Humazah", 105: "Al-Fil",
  106: "Quraysh", 107: "Al-Ma'un", 108: "Al-Kawthar", 109: "Al-Kafirun", 110: "An-Nasr",
  111: "Al-Masad", 112: "Al-Ikhlas", 113: "Al-Falaq", 114: "An-Nas",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse a verse reference like "1:2-7" or "2:201" into individual verse keys.
 */
function parseVerseRef(ref: string): { surahNumber: number; verseKeys: string[] } {
  // Match patterns like "1:2-7", "2:201", "3:191-194"
  const match = ref.match(/^(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) throw new Error(`Invalid verse reference: ${ref}`);

  const surahNumber = parseInt(match[1]);
  const startVerse = parseInt(match[2]);
  const endVerse = match[3] ? parseInt(match[3]) : startVerse;

  const verseKeys: string[] = [];
  for (let v = startVerse; v <= endVerse; v++) {
    verseKeys.push(`${surahNumber}:${v}`);
  }
  return { surahNumber, verseKeys };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetch a single verse with word-by-word data.
 */
async function fetchVerse(verseKey: string): Promise<QuranApiVerseResponse> {
  const url = `${API_BASE}/verses/by_key/${verseKey}?language=en&words=true&word_fields=text_indopak,translation,transliteration&fields=text_indopak`;
  return fetchJson<QuranApiVerseResponse>(url);
}

/**
 * Fetch translation for a single verse.
 */
async function fetchTranslation(
  translationId: number,
  verseKey: string
): Promise<string> {
  const url = `${API_BASE}/quran/translations/${translationId}?verse_key=${verseKey}`;
  const data = await fetchJson<QuranApiTranslationResponse>(url);
  if (!data.translations || data.translations.length === 0) {
    console.warn(`  ⚠ No translation found for ${verseKey} (ID ${translationId})`);
    return "";
  }
  // Strip HTML tags from translation text
  return data.translations[0].text.replace(/<[^>]*>/g, "").trim();
}

/**
 * Fetch all data for a single verse key.
 */
async function fetchVerseData(verseKey: string): Promise<EnrichedVerse> {
  // Fetch verse + words
  const verseData = await fetchVerse(verseKey);
  await sleep(RATE_LIMIT_MS);

  const verse = verseData.verse;

  // Extract words (skip "end" type which is the verse-end marker)
  const words = verse.words
    .filter((w) => w.char_type_name !== "end")
    .map((w) => ({
      textIndopak: w.text_indopak || "",
      translation: w.translation?.text || "",
      transliteration: w.transliteration?.text || "",
    }));

  // Fetch translations
  const englishText = await fetchTranslation(TRANSLATION_IDS.english, verseKey);
  await sleep(RATE_LIMIT_MS);

  const urduText = await fetchTranslation(TRANSLATION_IDS.urdu, verseKey);
  await sleep(RATE_LIMIT_MS);

  const hindiText = await fetchTranslation(TRANSLATION_IDS.hindi, verseKey);
  await sleep(RATE_LIMIT_MS);

  return {
    verseKey: verse.verse_key,
    verseNumber: verse.verse_number,
    textIndopak: verse.text_indopak,
    isPartOfPrayer: true,
    words,
    translations: {
      english: { text: englishText, translator: TRANSLATOR_NAMES.english },
      urdu: { text: urduText, translator: TRANSLATOR_NAMES.urdu },
      hindi: { text: hindiText, translator: TRANSLATOR_NAMES.hindi },
    },
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const dataPath = path.resolve(import.meta.dirname!, "../src/data.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const prayers: RawPrayer[] = JSON.parse(raw);

  console.log(`📖 Found ${prayers.length} prayers in data.json`);

  let fetchedCount = 0;
  let skippedCount = 0;

  for (const prayer of prayers) {
    // Idempotent: skip if already enriched
    if (prayer.content && prayer.content.length > 0) {
      skippedCount++;
      continue;
    }

    console.log(`\n🔄 Fetching: ${prayer.title} (${prayer.verses})`);

    try {
      const { surahNumber, verseKeys } = parseVerseRef(prayer.verses);

      prayer.surahName = SURAH_NAMES[surahNumber] || `Surah ${surahNumber}`;
      prayer.surahNumber = surahNumber;
      prayer.content = [];

      for (const vk of verseKeys) {
        console.log(`  📥 Verse ${vk}...`);
        const verseContent = await fetchVerseData(vk);
        prayer.content.push(verseContent);
      }

      fetchedCount++;
      console.log(`  ✅ Done (${prayer.content.length} verse(s))`);
    } catch (err) {
      console.error(`  ❌ Error fetching ${prayer.title}:`, err);
      // Don't remove partial data - allow re-run
    }
  }

  // Write enriched data back
  fs.writeFileSync(dataPath, JSON.stringify(prayers, null, 2), "utf-8");

  console.log(`\n════════════════════════════════════════`);
  console.log(`✅ Fetched: ${fetchedCount} prayers`);
  console.log(`⏭️  Skipped: ${skippedCount} (already enriched)`);
  console.log(`📁 Written to: ${dataPath}`);
  console.log(`📏 File size: ${(fs.statSync(dataPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
