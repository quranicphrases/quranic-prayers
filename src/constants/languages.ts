import type { Language } from "../types/prayer";

/**
 * All supported translation languages.
 * Used throughout the app for language toggles and filtering.
 */
export const ALL_LANGUAGES: Language[] = ["english", "urdu", "hindi"];

/**
 * Display names for each language (for UI).
 */
export const LANGUAGE_DISPLAY_NAMES: Record<Language, string> = {
  english: "English",
  urdu: "Urdu",
  hindi: "Hindi",
};

/**
 * Capitalize the first letter of a language key.
 * @param lang - Language key
 * @returns Capitalized language name
 */
export function capitalizeLanguage(lang: Language): string {
  return lang.charAt(0).toUpperCase() + lang.slice(1);
}
