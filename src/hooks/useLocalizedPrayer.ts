import type { Prayer, UILanguage } from "../types/prayer";

export interface LocalizedPrayer {
  title: string;
  description: string;
}

const LANG_SUFFIX: Record<UILanguage, "_en" | "_ur" | "_hi"> = {
  english: "_en",
  urdu: "_ur",
  hindi: "_hi",
};

/** Resolve the localized fields of a prayer for a given UI language. */
export function getLocalizedPrayer(prayer: Prayer, lang: UILanguage): LocalizedPrayer {
  const s = LANG_SUFFIX[lang];
  return {
    title: prayer[`title${s}`],
    description: prayer[`description${s}`],
  };
}
