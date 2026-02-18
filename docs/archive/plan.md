# Plan: Custom Component Quranic Prayers App

**TL;DR**: Replace the iframe-based rendering with a custom `QuranVerse` component powered by a static JSON file containing all prayer content (Arabic text, word-by-word, 3 translations). A one-time Node.js script fetches data from the Quran.com API v4 and builds the enriched JSON. The app ships as a fully static site on GitHub Pages with offline support. Filtering changes to OR logic, and a sticky floating toolbar provides global toggles for word-by-word mode and language visibility. ~68 prayers render as plain DOM — no iframes, no runtime API calls, instant filtering and toggling.

## Steps

### 1. Create a data-fetching build script

Create `scripts/fetch-prayer-data.ts` — a one-time Node.js script that:

- Reads the current `src/data.json` (68 prayers with `id`, `title`, `tags`, `description`, `verses`)
- For each prayer, calls Quran.com API v4 endpoints:
  - `GET /api/v4/verses/by_key/{verseKey}?language=en&words=true&word_fields=text_indopak,translation,transliteration&fields=text_indopak` (for Arabic text + word-by-word)
  - `GET /api/v4/quran/translations/{translationId}?verse_key={verseKey}` for translation IDs 20 (English), 158 (Urdu), 122 (Hindi)
  - For verse ranges like `1:2-7`, fetch each verse individually and combine
- Outputs enriched `src/data.json` with the new structure (see step 2)
- Includes rate-limiting (100ms delay between calls) to avoid API throttling
- Idempotent — can be re-run when adding new prayers (only fetches prayers missing content)
- Add `"fetch-data": "npx tsx scripts/fetch-prayer-data.ts"` to `package.json` scripts

### 2. Enrich the data structure

Update `src/types/prayer.ts` and `src/data.json` to this shape:

```typescript
Prayer {
  id, title, tags[], description, verses (reference string),
  surahName, surahNumber,
  content: [
    {
      verseKey: "1:2",
      verseNumber: 2,
      textIndopak: "...",
      isPartOfPrayer: true | false,   // for partial verse highlighting
      words: [
        { textIndopak, translation, transliteration }
      ],
      translations: {
        english: { text, translator },
        urdu: { text, translator },
        hindi: { text, translator }
      }
    }
  ]
}
```

- `isPartOfPrayer` defaults to `true` for all current prayers (none use partial verses yet). When a prayer covers only part of a verse, the full verse is included but `isPartOfPrayer: false` dims that portion.
- The `partialVerse` field on `Prayer` serves as developer documentation for which portion is the actual dua.
- Estimated JSON size: ~68 prayers × ~1-3 verses × ~500 bytes ≈ **100-200 KB** uncompressed, ~30-50 KB gzipped. Trivial for static hosting.

### 3. Enhance the `QuranVerse` component

Rewrite `src/components/QuranVerse.tsx` and `src/components/QuranVerse.css`:

- **Arabic section**: Render `textIndopak` in right-to-left, using Uthmanic/IndoPak web fonts (KFGQPC Uthmanic Script HAFS, Noto Naskh Arabic as fallback). Append verse number as `toArabicNumeral()` (already exists). When `isPartOfPrayer` is `false`, render that verse text with reduced opacity (~0.5) to visually distinguish it from the actual prayer.
- **Word-by-word mode**: CSS grid with each word as a cell — Arabic on top, English translation below, optional transliteration. Toggle visibility via a CSS class (`wbw-active`) controlled by the global state. Partial-verse words get the same dimmed treatment.
- **Translations section**: Three collapsible blocks (English, Urdu, Hindi). Visibility controlled by a global `Set<Language>` state. Urdu text uses `direction: rtl` and Nastaliq fonts. Hindi uses Devanagari fonts. Each block shows translator name.
- **Footer**: "Open on Quran.com" link → `https://quran.com/{surahNumber}:{verseRange}` for audio, tafsir, etc.
- Fonts loaded via Google Fonts or self-hosted in `src/assets/` for offline support. Prefer Google Fonts with `font-display: swap` for simplicity; self-host if offline font rendering is critical.

### 4. Rewrite `PrayerCard`

Simplify `src/components/PrayerCard.tsx`:

- Remove all iframe logic, `useIframeRetry`, `useProgressiveLoadWithRef`, skeleton loaders, error states, dual-iframe rendering
- Render: prayer title, description, tag badges, then `<QuranVerse>` with the prayer's `content` array
- Keep `React.memo` with a simple comparator on `prayer.id`, `isVisible`, `showWordByWord`, `visibleLanguages`
- Visibility via `display: none` when filtered out (instant, no layout shifts)
- No progressive loading needed — text-only DOM is lightweight; 68 prayer cards ≈ a few hundred KB of DOM, well within browser capacity

### 5. Update `App.tsx` — state and controls

Modify `src/App.tsx`:

- **Remove**: Quran.com embed script loading, `prayerEmbedUrls` memoization, `getPrayerUrls`, `normalUrl`/`wbwUrl` props
- **Add state**: `visibleLanguages: Set<'english' | 'urdu' | 'hindi'>` (default: all 3)
- **Sticky floating toolbar** (existing `.control-panel` position):
  - Word-by-word toggle (global, sticky — visible while scrolling as requested)
  - Language visibility checkboxes (English ✓, Urdu ✓, Hindi ✓) — toggling is instant, just hides/shows DOM
- **Pass down**: `showWordByWord`, `visibleLanguages` to each `PrayerCard`
- **Import enriched data** directly: `import prayers from "./data.json"` (same as now, just richer data)

### 6. Change filter logic from AND to OR

Update `src/hooks/usePrayerFilters.ts`:

- Change `isPrayerVisible` from `.every()` (AND) to `.some()` (OR): a prayer is visible if it has **any** of the selected tags
- Keep everything else (memoized tag list, toggle/clear callbacks, visible count)

### 7. Delete iframe-related code

Remove these files/exports that become unused:

- `src/hooks/useIframeRetry.ts` — delete entirely
- `src/hooks/useProgressiveLoad.ts` — delete entirely
- `src/utils/embedUrl.ts` — delete entirely
- `src/response_doc.txt` and `src/Sheet1.html` — delete (development artifacts)
- Remove embed script loading from `App.tsx`
- Clean up iframe-related CSS from `src/App.css` (`.embed-container`, `.skeleton-*`, `.error-*` styles)

### 8. Add offline support (PWA)

- Install `vite-plugin-pwa` as a dev dependency
- Configure in `vite.config.ts` with `generateSW` strategy — caches all static assets including the data JSON and fonts
- Add a minimal `manifest.json` in `public/` with app name, icons, theme color
- The static JSON is bundled into the app — once loaded, the entire app works offline on GitHub Pages
- Add a `base: '/quranic-prayers/'` to Vite config for GitHub Pages subdirectory deployment

### 9. CSS refinements

Update `src/App.css`:

- Remove all iframe/embed/skeleton/error CSS
- Add styles for the language toggle checkboxes in the control panel
- Ensure the sticky toolbar has enough controls without feeling crowded (use a compact chip/toggle design)
- Add `scroll-behavior: smooth` to the container
- Keep existing responsive breakpoints, card styling, filter chips, gold tag badges

### 10. Update documentation

Update `ARCHITECTURE.md` and `README.md`:

- Document the custom component approach
- Document the data fetching script usage
- Remove references to iframe strategy
- Add instructions for adding new prayers (add entry to data.json, run fetch script)

## Verification

1. **Dev server**: Run `npm run dev`, verify all 68 prayers render with Arabic text, translations, word-by-word mode
2. **Filter test**: Select multiple tags → verify OR logic (prayers matching any tag appear). Clear filters → all visible
3. **Toggle test**: Toggle word-by-word on/off → layout switches instantly, no flicker. Toggle languages → translations appear/disappear instantly
4. **Scroll test**: Scroll rapidly up and down — no hanging, no empty cards, no network calls in DevTools Network tab
5. **Offline test**: Build with `npm run build`, serve with `npx serve dist`, load app, go offline (DevTools → Network → Offline), reload — app still works
6. **Lighthouse**: Run Lighthouse audit — target 90+ performance score on mobile
7. **Build size**: Check `dist/` — data JSON should be under 200KB, total bundle under 500KB

## Decisions

- **Custom component over iframes**: Eliminates all performance issues (136 iframes → 0). Enables offline, partial verse highlighting, instant toggles. Trade-off: one-time effort to build the component and maintain the JSON data. Mitigated by the fetch script (re-runnable).
- **OR filter logic over AND**: More intuitive for users — "show me prayers about Forgiveness or Patience" is more common than "show me prayers tagged both Forgiveness AND Patience" (which may yield zero results).
- **All prayers rendered in DOM (no virtualization)**: 68 text-only cards are trivial for the browser (~few hundred KB DOM). Virtualization adds complexity with no benefit at this scale.
- **Static JSON over runtime API calls**: All data shipped with the app. Zero runtime dependency on Quran.com API. Offline-capable. Trade-off: data updates require re-running the fetch script and redeploying. Acceptable since Quran text doesn't change.
- **Link to Quran.com for audio over built-in player**: Keeps the app simple. Users who want audio, tafsir, or comments get the full Quran.com experience via one click.
