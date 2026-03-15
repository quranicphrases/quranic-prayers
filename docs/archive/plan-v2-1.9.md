## Updated Code Quality Cleanup Plan

### CRITICAL Priority

**1. Fix CSS syntax error** — Delete orphaned declarations at FloatingControls.css (lines outside any selector causing build warnings).

**2. Fix missing PWA icons** — `pwa-192x192.png` and `pwa-512x512.png` referenced in vite.config.ts don't exist in public.

**3. Remove unused exports** — `capitalizeLanguage` in languages.ts and `isMobileViewport` in breakpoints.ts are never imported.

### HIGH Priority — Performance (NEW from Lighthouse)

**4. Switch from `display:none` to conditional rendering** — Currently all 77 prayers render to DOM and are hidden with `style={{ display: isVisible ? "block" : "none" }}` in PrayerCard.tsx. This is the primary cause of **1,100ms INP presentation delay** and **4,572ms Style & Layout**. Switching to `{isVisible && <PrayerCard />}` in App.tsx would avoid rendering hidden cards entirely.

**5. Add `content-visibility: auto` to prayer cards** — Quick CSS-only win. Lets the browser skip rendering for off-screen cards. Add to `.prayer-card` in PrayerCard.css. This alone can dramatically reduce Style & Layout time.

**6. Debounce resize handler / use `matchMedia`** — The undebounced `window.innerWidth` read in App.tsx triggers forced reflow on every resize frame. Replace with `window.matchMedia` listener (zero forced reflows, fires only on breakpoint crossing).

**7. Replace `document.body.style.overflow` with class toggle** — Both BottomSheet.tsx and FilterDrawer.tsx mutate `body.style.overflow` in `useEffect`, invalidating layout for the entire document tree. Toggle a CSS class on `<body>` instead (e.g., `body.no-scroll { overflow: hidden }`).

**8. Async-load Google Fonts** — The `<link rel="stylesheet">` in index.html for 4 font families (8 weights) is parser-blocking. Switch to `media="print" onload="this.media='all'"` pattern or use `@font-face` in CSS with `font-display: swap`.

### MEDIUM Priority

**9. Memoize handlers with `useCallback`** — Several App.tsx handlers recreated every render.

**10. Add focus trapping** — Incomplete in BottomSheet.tsx and FilterDrawer.tsx (set initial focus but no Tab cycling).

**11. Extract shared SettingsPanel** — ~80% code duplication between BottomSheet and FilterDrawer.

**12. Remove duplicate `* { box-sizing }` rule** — Present in both App.css and index.css.

### LOW Priority

**13. Chunk splitting** — Consider dynamic import for `data.json` (696KB) or manual chunks.

**14. Source maps** — Add `build: { sourcemap: true }` to vite.config.ts for production debugging.

---

**Recommended implementation order:** 1 → 3 → 5 → 4 → 6 → 7 → 8 → 12 → 2 → 9 → 10 → 11 → 13 → 14

Items 5 (content-visibility) and 12 (duplicate box-sizing) are one-line CSS changes. Item 4 (conditional rendering) is the highest-impact performance fix. Items 6-8 address the forced reflow and main-thread work findings directly.

Want me to start implementing?
