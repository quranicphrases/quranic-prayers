import type { UILanguage } from "../types/prayer";

/**
 * All user-facing app chrome text, keyed by a stable English key.
 * Each key maps to translations in all supported UI languages.
 */
const UI: Record<string, Record<UILanguage, string>> = {
  // Header
  appTitle: {
    english: "Quranic Prayers",
    urdu: "قرآنی دعائیں",
    hindi: "क़ुरआनी दुआएँ",
  },
  appSubtitle: {
    english: "دعائیں - Supplications from the Holy Quran",
    urdu: "دعائیں - قرآنِ پاک سے دعائیں",
    hindi: "दुआएँ - पवित्र क़ुरआन से दुआएँ",
  },

  // Prayer count banner
  showingOf: {
    english: "Showing {visible} of {total} prayers",
    urdu: "{total} دعاؤں میں سے {visible} دکھائی جا رہی ہیں",
    hindi: "{total} दुआओं में से {visible} दिखाई जा रही हैं",
  },
  filtersApplied: {
    english: "({count} filter{s} applied)",
    urdu: "({count} فلٹر لگے ہیں)",
    hindi: "({count} फ़िल्टर लगे हैं)",
  },

  // Footer
  contentSourced: {
    english: "Content sourced from",
    urdu: "مواد ماخوذ ہے",
    hindi: "सामग्री ली गई है",
  },

  // Settings
  settings: {
    english: "Settings",
    urdu: "ترتیبات",
    hindi: "सेटिंग्स",
  },

  // Tabs
  tabFilters: {
    english: "Filters",
    urdu: "فلٹرز",
    hindi: "फ़िल्टर",
  },
  tabReading: {
    english: "Reading Options",
    urdu: "پڑھنے کے اختیارات",
    hindi: "पढ़ने के विकल्प",
  },

  // FilterSection
  filterByCategory: {
    english: "Filter by Category",
    urdu: "زمرے سے فلٹر",
    hindi: "श्रेणी से फ़िल्टर",
  },
  clearAll: {
    english: "Clear All",
    urdu: "سب صاف",
    hindi: "सब हटाएँ",
  },

  // ReadingControls
  readingMode: {
    english: "Reading Mode:",
    urdu: "پڑھنے کا طریقہ:",
    hindi: "पढ़ने का तरीक़ा:",
  },
  normalMode: {
    english: "📖 Normal",
    urdu: "📖 عام",
    hindi: "📖 सामान्य",
  },
  wordByWord: {
    english: "🔤 Word-by-Word",
    urdu: "🔤 لفظ بلفظ",
    hindi: "🔤 शब्द-दर-शब्द",
  },
  translations: {
    english: "Translations:",
    urdu: "تراجم:",
    hindi: "अनुवाद:",
  },
  appLanguage: {
    english: "App Language:",
    urdu: "ایپ کی زبان:",
    hindi: "ऐप की भाषा:",
  },

  // FloatingControls
  clear: {
    english: "Clear",
    urdu: "صاف",
    hindi: "हटाएँ",
  },
  top: {
    english: "Top",
    urdu: "اوپر",
    hindi: "ऊपर",
  },

  // NoResults
  noResults: {
    english: "No prayers match the selected filters.",
    urdu: "منتخب فلٹرز سے کوئی دعا نہیں ملی۔",
    hindi: "चुने गए फ़िल्टर से कोई दुआ नहीं मिली।",
  },
  clearFilters: {
    english: "Clear Filters",
    urdu: "فلٹرز صاف کریں",
    hindi: "फ़िल्टर हटाएँ",
  },

  // QuranVerse footer
  openOnQuranCom: {
    english: "Open in Quran.com ↗",
    urdu: "\u2067Quran.com\u2069 میں کھولیں ↗",
    hindi: "Quran.com में खोलें ↗",
  },

  // Skip nav
  skipToPrayers: {
    english: "Skip to prayers",
    urdu: "دعاؤں پر جائیں",
    hindi: "दुआओं पर जाएँ",
  },
};

/** Get a UI string for the given key and language. Supports {placeholder} interpolation. */
export function t(
  key: string,
  lang: UILanguage,
  params?: Record<string, string | number>,
): string {
  let str = UI[key]?.[lang] ?? UI[key]?.english ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
