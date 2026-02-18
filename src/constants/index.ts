/**
 * Constants barrel file - re-exports all constants for clean imports.
 * Usage: import { ALL_LANGUAGES, MOBILE_BREAKPOINT } from '@/constants';
 */

export {
  ALL_LANGUAGES,
  LANGUAGE_DISPLAY_NAMES,
  capitalizeLanguage,
} from "./languages";

export { MOBILE_BREAKPOINT, isMobileViewport } from "./breakpoints";
