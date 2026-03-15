import type { UILanguage } from "../types/prayer";

/**
 * Maps English tag keys to display strings for each UI language.
 * English tags are canonical keys used internally for filtering.
 */
const TAG_DISPLAY: Record<string, Record<UILanguage, string>> = {
  Angels: { english: "Angels", urdu: "فرشتے", hindi: "फ़रिश्ते" },
  "Ayyub AS": { english: "Ayyub AS", urdu: "ایوب علیہ السلام", hindi: "अय्यूब (अ)" },
  Brother: { english: "Brother", urdu: "بھائی", hindi: "भाई" },
  Brotherhood: { english: "Brotherhood", urdu: "بھائی چارہ", hindi: "भाईचारा" },
  Child: { english: "Child", urdu: "اولاد", hindi: "औलाद" },
  City: { english: "City", urdu: "شہر", hindi: "शहर" },
  Curse: { english: "Curse", urdu: "بددعا", hindi: "बद-दुआ" },
  "Dawood AS": { english: "Dawood AS", urdu: "داؤد علیہ السلام", hindi: "दाऊद (अ)" },
  Descendants: { english: "Descendants", urdu: "نسل", hindi: "वंशज" },
  "Die As Muslims": { english: "Die As Muslims", urdu: "ایمان کی حالت میں مرنا", hindi: "ईमान की हालत में मरना" },
  "Easier Life": { english: "Easier Life", urdu: "آسان زندگی", hindi: "आसान ज़िन्दगी" },
  Father: { english: "Father", urdu: "والد", hindi: "पिता" },
  Food: { english: "Food", urdu: "رزق", hindi: "रिज़्क़" },
  Forgiveness: { english: "Forgiveness", urdu: "مغفرت", hindi: "माफ़ी" },
  Gratitude: { english: "Gratitude", urdu: "شکرگزاری", hindi: "शुक्रगुज़ारी" },
  Guidance: { english: "Guidance", urdu: "ہدایت", hindi: "हिदायत" },
  Hardship: { english: "Hardship", urdu: "مشکل", hindi: "मुश्किल" },
  Heaven: { english: "Heaven", urdu: "جنت", hindi: "जन्नत" },
  Help: { english: "Help", urdu: "مدد", hindi: "मदद" },
  "Hud AS": { english: "Hud AS", urdu: "ہود علیہ السلام", hindi: "हूद (अ)" },
  "Ibrahim AS": { english: "Ibrahim AS", urdu: "ابراہیم علیہ السلام", hindi: "इब्राहीम (अ)" },
  Intercession: { english: "Intercession", urdu: "شفاعت", hindi: "सिफ़ारिश" },
  "Ismail AS": { english: "Ismail AS", urdu: "اسماعیل علیہ السلام", hindi: "इस्माईल (अ)" },
  Kingdom: { english: "Kingdom", urdu: "سلطنت", hindi: "सल्तनत" },
  Knowledge: { english: "Knowledge", urdu: "علم", hindi: "इल्म" },
  "Lut AS": { english: "Lut AS", urdu: "لوط علیہ السلام", hindi: "लूत (अ)" },
  Mercy: { english: "Mercy", urdu: "رحمت", hindi: "रहमत" },
  "Mohammad SAW": { english: "Mohammad SAW", urdu: "محمد ﷺ", hindi: "मुहम्मद (ﷺ)" },
  "Musa AS": { english: "Musa AS", urdu: "موسیٰ علیہ السلام", hindi: "मूसा (अ)" },
  "Night Prayer": { english: "Night Prayer", urdu: "تہجد", hindi: "तहज्जुद" },
  "Nuh AS": { english: "Nuh AS", urdu: "نوح علیہ السلام", hindi: "नूह (अ)" },
  Parents: { english: "Mom Dad", urdu: "ماں باپ", hindi: "माता-पिता" },
  Patience: { english: "Patience", urdu: "صبر", hindi: "सब्र" },
  Peace: { english: "Peace", urdu: "سکون", hindi: "सुकून" },
  "Praising Allah": { english: "Praising Allah", urdu: "اللہ کی حمد", hindi: "अल्लाह की हम्द" },
  Protection: { english: "Protection", urdu: "حفاظت", hindi: "हिफ़ाज़त" },
  "Protection from Hell": { english: "Protection from Hell", urdu: "جہنم سے حفاظت", hindi: "जहन्नम से हिफ़ाज़त" },
  Refuge: { english: "Refuge", urdu: "پناہ", hindi: "पनाह" },
  "Shu'ayb AS": { english: "Shu'ayb AS", urdu: "شعیب علیہ السلام", hindi: "शुऐब (अ)" },
  Special: { english: "Special", urdu: "خاص", hindi: "ख़ास" },
  Spouse: { english: "Husband Wife", urdu: "شوہر بیوی", hindi: "शौहर बीवी" },
  "Sulaiman AS": { english: "Sulaiman AS", urdu: "سلیمان علیہ السلام", hindi: "सुलेमान (अ)" },
  Victory: { english: "Victory", urdu: "فتح", hindi: "फ़तह" },
  "Wife of Pharaoh": { english: "Wife of Pharaoh", urdu: "فرعون کی بیوی", hindi: "फ़िरऔन की बीवी" },
  "Yunus AS": { english: "Yunus AS", urdu: "یونس علیہ السلام", hindi: "यूनुस (अ)" },
  "Yusuf AS": { english: "Yusuf AS", urdu: "یوسف علیہ السلام", hindi: "यूसुफ़ (अ)" },
  "Zecharia AS": { english: "Zecharia AS", urdu: "زکریا علیہ السلام", hindi: "ज़करिया (अ)" },
};

/** Get the display string for a tag in the given UI language. Falls back to the English key. */
export function getTagDisplay(tagKey: string, lang: UILanguage): string {
  return TAG_DISPLAY[tagKey]?.[lang] ?? tagKey;
}
