import type { UILanguage } from "../types/prayer";

/**
 * Localized surah names for the surahs used in data.json.
 * Keyed by surah number.
 */
const SURAH_NAMES: Record<number, Record<UILanguage, string>> = {
  1:   { english: "Al-Fatiha",       urdu: "الفاتحہ",        hindi: "अल-फ़ातिहा" },
  2:   { english: "Al-Baqarah",      urdu: "البقرہ",         hindi: "अल-बक़रा" },
  3:   { english: "Ali 'Imran",      urdu: "آل عمران",       hindi: "आले-इमरान" },
  4:   { english: "An-Nisa",         urdu: "النساء",          hindi: "अन-निसा" },
  6:   { english: "Al-An'am",        urdu: "الانعام",         hindi: "अल-अनआम" },
  7:   { english: "Al-A'raf",        urdu: "الاعراف",         hindi: "अल-अअराफ़" },
  10:  { english: "Yunus",           urdu: "یونس",           hindi: "यूनुस" },
  11:  { english: "Hud",             urdu: "ہود",             hindi: "हूद" },
  12:  { english: "Yusuf",           urdu: "یوسف",           hindi: "यूसुफ़" },
  14:  { english: "Ibrahim",         urdu: "ابراہیم",         hindi: "इबराहीम" },
  17:  { english: "Al-Isra",         urdu: "الاسراء",         hindi: "अल-इसरा" },
  18:  { english: "Al-Kahf",         urdu: "الکہف",           hindi: "अल-कह्फ़" },
  20:  { english: "Ta-Ha",           urdu: "طٰہٰ",            hindi: "ता-हा" },
  21:  { english: "Al-Anbiya",       urdu: "الانبیاء",        hindi: "अल-अंबिया" },
  23:  { english: "Al-Mu'minun",     urdu: "المؤمنون",        hindi: "अल-मोमिनून" },
  25:  { english: "Al-Furqan",       urdu: "الفرقان",         hindi: "अल-फ़ुरक़ान" },
  26:  { english: "Ash-Shu'ara",     urdu: "الشعراء",         hindi: "अश-शुअरा" },
  27:  { english: "An-Naml",         urdu: "النمل",           hindi: "अन-नम्ल" },
  28:  { english: "Al-Qasas",        urdu: "القصص",          hindi: "अल-क़सस" },
  29:  { english: "Al-Ankabut",      urdu: "العنکبوت",        hindi: "अल-अनकबूत" },
  37:  { english: "As-Saffat",       urdu: "الصافات",         hindi: "अस-साफ़्फ़ात" },
  38:  { english: "Sad",             urdu: "ص",              hindi: "साद" },
  40:  { english: "Ghafir",          urdu: "غافر",            hindi: "ग़ाफ़िर" },
  46:  { english: "Al-Ahqaf",        urdu: "الاحقاف",         hindi: "अल-अहक़ाफ़" },
  54:  { english: "Al-Qamar",        urdu: "القمر",           hindi: "अल-क़मर" },
  59:  { english: "Al-Hashr",        urdu: "الحشر",           hindi: "अल-हश्र" },
  60:  { english: "Al-Mumtahanah",   urdu: "الممتحنہ",        hindi: "अल-मुम्तहिना" },
  66:  { english: "At-Tahrim",       urdu: "التحریم",         hindi: "अत-तहरीम" },
  71:  { english: "Nuh",             urdu: "نوح",             hindi: "नूह" },
  112: { english: "Al-Ikhlas",       urdu: "الاخلاص",         hindi: "अल-इख़्लास" },
  113: { english: "Al-Falaq",        urdu: "الفلق",           hindi: "अल-फ़लक़" },
  114: { english: "An-Nas",          urdu: "الناس",           hindi: "अन-नास" },
};

export function getLocalizedSurahName(
  surahNumber: number | undefined,
  lang: UILanguage,
  fallback?: string,
): string {
  if (!surahNumber) return fallback ?? "";
  return SURAH_NAMES[surahNumber]?.[lang] ?? fallback ?? "";
}
