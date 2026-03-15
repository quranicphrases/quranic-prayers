import type { UILanguage } from "../types/prayer";

/**
 * All user-facing app chrome text, keyed by a stable English key.
 * Each key maps to translations in all supported UI languages.
 */
const UI: Record<string, Record<UILanguage, string>> = {
  // Header
  appTitle: {
    english: "Quranic Prayerz",
    urdu: "قرآنی دعائیں",
    hindi: "क़ुरआनी दुआएँ",
  },
  appSubtitle: {
    english: "Supplications from the Holy Quran",
    urdu: "قرآنِ پاک سے دعائیں",
    hindi: "पवित्र क़ुरआन से दुआएँ",
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
    urdu: "سیٹنگز",
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
    urdu: "پڑھنے کا طریقہ",
    hindi: "पढ़ने का तरीक़ा",
  },

  // FilterSection
  filterByCategory: {
    english: "Filter Prayers By Category",
    urdu: "زمرہ کے حساب سے دعا پڑھیں",
    hindi: "श्रेणी के अनुसार दुआ पढ़ें",
  },
  clearAll: {
    english: "Clear Filters",
    urdu: "فلٹر ہٹائیں",
    hindi: "फ़िल्टर हटाएँ",
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
    urdu: "زبان:",
    hindi: "भाषा:",
  },

  // FloatingControls
  clear: {
    english: "Clear Filters",
    urdu: "فلٹر ہٹائیں",
    hindi: "फ़िल्टर हटाएँ",
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
    urdu: "فلٹر ہٹائیں",
    hindi: "फ़िल्टर हटाएँ",
  },

  // QuranVerse footer
  openOnQuranCom: {
    english: "Explore on Quran.com ↗",
    urdu: "\u2067Quran.com\u2069 پر مزید دیکھیں ↗",
    hindi: "Quran.com पर और देखें ↗",
  },

  // Skip nav
  skipToPrayers: {
    english: "Skip to prayers",
    urdu: "دعاؤں پر جائیں",
    hindi: "दुआओं पर जाएँ",
  },

  // Aria labels
  ariaScrollToTop: {
    english: "Scroll to top",
    urdu: "اوپر جائیں",
    hindi: "ऊपर जाएँ",
  },
  ariaOpenSettings: {
    english: "Open settings and filters",
    urdu: "ترتیبات اور فلٹرز کھولیں",
    hindi: "सेटिंग्स और फ़िल्टर खोलें",
  },
  ariaCloseSettings: {
    english: "Close settings panel",
    urdu: "ترتیبات بند کریں",
    hindi: "सेटिंग्स बंद करें",
  },
  ariaSettingsPanel: {
    english: "Settings panel",
    urdu: "ترتیبات پینل",
    hindi: "सेटिंग्स पैनल",
  },
  ariaPrayerList: {
    english: "Prayer list",
    urdu: "دعاؤں کی فہرست",
    hindi: "दुआओं की सूची",
  },
  ariaFilterByTag: {
    english: "Filter by {tag}",
    urdu: "{tag} سے فلٹر کریں",
    hindi: "{tag} से फ़िल्टर करें",
  },
  ariaSettingsTabs: {
    english: "Settings tabs",
    urdu: "ترتیبات ٹیبز",
    hindi: "सेटिंग्स टैब",
  },
  ariaQuranText: {
    english: "Quranic Arabic text",
    urdu: "قرآنی عربی متن",
    hindi: "क़ुरआनी अरबी पाठ",
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
