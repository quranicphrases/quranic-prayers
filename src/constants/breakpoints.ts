/**
 * Responsive breakpoints for the application.
 * Keep in sync with CSS media queries.
 */

/** Breakpoint for mobile devices (< 600px) */
export const MOBILE_BREAKPOINT = 600;

/**
 * Check if the viewport is mobile-sized.
 * @returns true if viewport width is less than MOBILE_BREAKPOINT
 */
export function isMobileViewport(): boolean {
  return typeof window !== "undefined"
    ? window.innerWidth < MOBILE_BREAKPOINT
    : false;
}
