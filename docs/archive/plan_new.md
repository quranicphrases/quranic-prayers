# Quranic Prayers — Next Phase Implementation Plan

This plan covers the remaining TODOs from `App.tsx` across five areas: filter interactivity, font consistency with quran.com, responsive design, multilingual SEO, and accessibility.

---

## 1. Filter Interactivity Enhancements

### Current State

- **Tag badges in PrayerCard** (`<span className="tag-badge">`) are display-only; clicking them does nothing.
- **"Clear All Filters" button** exists in `FilterSection` but not in the sticky `control-panel` toolbar.
- The `toggleTag` function exists in `usePrayerFilters` hook but is not passed to or used by `PrayerCard`.

### Changes Required

#### 1a. Make Tag Badges Clickable in Prayer Cards

**Files:** `PrayerCard.tsx`, `App.tsx`

1. **Add `onToggleTag` prop to `PrayerCard`:**

   ```tsx
   interface PrayerCardProps {
     // ...existing props
     onToggleTag: (tag: string) => void;
   }
   ```

2. **Replace `<span>` with `<button>` in PrayerCard:**

   ```tsx
   <button
     key={tag}
     className="tag-badge tag-badge-interactive"
     onClick={() => onToggleTag(tag)}
     aria-label={`Filter by ${tag}`}
   >
     {tag}
   </button>
   ```

3. **Pass `toggleTag` from App.tsx:**

   ```tsx
   <PrayerCard
     // ...existing props
     onToggleTag={toggleTag}
   />
   ```

4. **Update memo comparator** in PrayerCard to include `onToggleTag` (stable via `useCallback`, so reference equality works).

5. **Add CSS for interactive tag badges:**
   - Add `cursor: pointer` to `.tag-badge-interactive`
   - Add hover state: slight scale + darker shadow
   - Add active/pressed state for when that tag is in `selectedTags`
   - Consider passing `selectedTags` to PrayerCard to highlight active tags

#### 1b. Add "Clear Filters" Button to Sticky Control Panel

**Files:** `App.tsx`, `App.css`

1. **Conditionally render a clear button in the control panel:**

   ```tsx
   {
     selectedTags.size > 0 && (
       <button className="control-clear-btn" onClick={clearAllFilters}>
         ✕ Clear Filters ({selectedTags.size})
       </button>
     );
   }
   ```

2. **Style it** with a subtle red/warning color consistent with the existing `clear-filters-btn` in FilterSection, but sized to fit the toolbar row.

---

## 2. Font Consistency with Quran.com

### Current State

- **Arabic text** uses: `"KFGQPC Uthmanic Script HAFS", "Amiri Quran", "Scheherazade New", "Traditional Arabic", "Noto Naskh Arabic", serif` — these are Uthmani/Naskh-style fonts.
- **Our data uses `textIndopak`** (IndoPak Nastaleeq script from Quran.com API), but we render it with Naskh-style fonts. This is a mismatch — Nastaleeq text should be rendered in a Nastaleeq font.
- **Urdu translation** uses `"Noto Nastaliq Urdu"` via Google Fonts.
- **Quran.com uses:**
  - **IndoPak Arabic**: Custom `"IndoPak"` font (`indopak-nastaleeq-waqf-lazim-v4.2.1.woff2`) — a Nastaleeq-style font with waqf/lazim marks and full harakat support, self-hosted from `/fonts/quran/hafs/nastaleeq/indopak/`.
  - **Uthmani Hafs Arabic**: `"UthmanicHafs"` font (KFGQPC HAFS Uthmanic Script) for standard Uthmani text.
  - **Urdu translations**: `"MehrNastaliq"` / `"Mehr Nastaliq Web"` — applied via `:lang(ur), :lang(urdu), .ur, .urdu` selectors.
  - **Arabic UI text**: `"Noto Nastaliq Arabic"` / `"NotoNastaliq"`.
  - **Base body**: `"Figtree"` (Latin text).

### Changes Required

#### 2a. Arabic Font — Switch to IndoPak Nastaleeq

**Decision needed:** Since our data is `textIndopak` (Nastaleeq script), we should use a Nastaleeq font. Two options:

**Option A — Self-host quran.com's IndoPak font (Recommended):**

1. Download `indopak-nastaleeq-waqf-lazim-v4.2.1.woff2` from quran.com's CDN (`https://static.qurancdn.com/fonts/quran/hafs/nastaleeq/indopak/`).
2. Place in `public/fonts/indopak-nastaleeq-waqf-lazim-v4.2.1.woff2`.
3. Add `@font-face` declaration in `QuranVerse.css`:

   ```css
   @font-face {
     font-family: "IndoPak";
     src: url("/fonts/indopak-nastaleeq-waqf-lazim-v4.2.1.woff2")
       format("woff2");
     font-display: swap;
   }
   ```

4. Update `.qv-arabic-text` and `.qv-wbw-arabic` font-family:

   ```css
   font-family: "IndoPak", "Noto Nastaliq Urdu", "Noto Naskh Arabic", serif;
   ```

**Option B — Use Google Fonts Noto Nastaliq Urdu for Arabic too:**

- Simpler but less authentic; Noto Nastaliq Urdu is primarily for Urdu, not Quranic Arabic.

**Estimated font file size:** ~1.4 MB (woff2). Consider lazy-loading or preloading via `<link rel="preload">` in `index.html`.

#### 2b. Urdu Translation Font — Match Quran.com

**Files:** `QuranVerse.css`, `index.html`

Quran.com uses **MehrNastaliq** for Urdu. Options:

1. **Self-host MehrNastaliqWeb** font (download from quran.com's CDN at `/fonts/lang/urdu/MehrNastaliqWeb.woff2`). Approx ~1.6 MB.
2. **Keep Noto Nastaliq Urdu** from Google Fonts — it's a decent alternative and already loaded.

**If self-hosting MehrNastaliq:**

```css
@font-face {
  font-family: "MehrNastaliq";
  src: url("/fonts/MehrNastaliqWeb.woff2") format("woff2");
  font-display: swap;
  unicode-range: U+0600-06FF; /* Only for Urdu/Arabic characters */
}
```

Update `.qv-lang-ur .qv-translation-text` to use `"MehrNastaliq"` as the primary font.

#### 2c. English Translation Font

**Files:** `QuranVerse.css`

Currently uses `"Georgia", "Times New Roman", serif`. Quran.com uses `"Figtree"` (sans-serif) for body text. Consider:

- Keep serif for English translations (provides contrast between Arabic and translation).
- Or switch to a clean sans-serif like `"Inter"` or `"Figtree"` to match quran.com's modern look.

#### 2d. Hindi Translation Font

Currently uses `"Noto Sans Devanagari"` from Google Fonts — this is fine and widely supported. No change needed.

#### 2e. Line-Height and Spacing Tuning

After changing fonts, audit line-heights since Nastaleeq fonts have significantly taller ascenders/descenders:

- `.qv-arabic-text` line-height may need to increase from `2.6` to `3.0-3.5` for proper Nastaleeq rendering.
- `.qv-wbw-arabic` line-height may need increase from `1.6` to `2.0-2.4`.
- `.qv-lang-ur .qv-translation-text` line-height may need increase from `2.4` to `2.8-3.0`.

---

## 3. Responsive Design Audit

### Current State

- Two breakpoints exist: `768px` (tablet) and `480px` (phone) in both `App.css` and `QuranVerse.css`.
- Control panel goes `flex-direction: column` at 480px.
- Arabic font sizes scale down at breakpoints.
- No testing has been done on actual mobile devices.

### Changes Required

#### 3a. Control Panel on Small Screens

**Files:** `App.css`

1. At 480px, the control panel stacks vertically but language checkboxes can still overflow.
   - Wrap language toggles in a scrollable row, or stack them as a 2x2 grid.
   - Reduce padding and font sizes further for less than 375px screens (iPhone SE).

2. Consider making the control panel **collapsible** on mobile:

   ```tsx
   const [panelOpen, setPanelOpen] = useState(true);
   ```

   With a toggle chevron that collapses the panel to just a thin bar showing the current mode.

#### 3b. Filter Section on Mobile

**Files:** `App.css`

1. Filter chips currently wrap — verify they don't overflow on narrow screens.
2. Consider a horizontal scroll container at 480px instead of wrapping:

   ```css
   @media (max-width: 480px) {
     .filter-chips {
       flex-wrap: nowrap;
       overflow-x: auto;
       -webkit-overflow-scrolling: touch;
       scrollbar-width: none;
     }
   }
   ```

#### 3c. Arabic Text Readability on Mobile

**Files:** `QuranVerse.css`

1. Current font sizes at 480px: `1.3rem` — verify this is legible for Nastaleeq (which typically needs larger sizes than Naskh due to its more complex letterforms).
2. **Recommended minimum:** `1.5rem` for IndoPak Nastaleeq on mobile.
3. Word-by-word cards (`min-width: 48px` at 480px) — may need to reduce to `40px` for very long verses.

#### 3d. Touch Target Sizes

**Files:** `App.css`, `QuranVerse.css`

1. Ensure all interactive elements meet the **44x44px minimum** touch target (WCAG 2.5.5):
   - Filter chips: Currently `padding: 0.4rem 0.8rem` at 480px — likely too small. Increase to `0.6rem 1rem`.
   - Language toggles: `padding: 0.4rem 0.6rem` at 480px — increase to `0.5rem 0.8rem`.
   - Mode buttons: Adequate at `0.5rem 0.8rem`.

2. Add `min-height: 44px` to buttons and interactive elements at mobile breakpoints.

#### 3e. Prayer Card Layout on Mobile

**Files:** `App.css`

1. Prayer header at 768px switches to column layout — verify tag badges don't overflow.
2. Verse container should have no horizontal overflow — test with long Arabic verses.
3. Translation sections should have adequate padding for readability.

#### 3f. New Breakpoint: Ultra-Small (less than 360px)

Consider adding a `360px` breakpoint for very small screens (older Android phones):

```css
@media (max-width: 360px) {
  .app-header h1 {
    font-size: 1.4rem;
  }
  .qv-arabic-text {
    font-size: 1.2rem;
  }
  .control-panel {
    padding: 0.5rem;
  }
}
```

---

## 4. SEO — Multilingual (English, Hindi, Urdu)

### Current State

- `index.html` has only: `<title>`, `<meta charset>`, `<meta viewport>`.
- No meta description, Open Graph tags, or structured data.
- Single `<html lang="en">` — no multilingual support.
- SPA with no server-side rendering, so search engine crawlability is limited.

### Changes Required

#### 4a. Essential Meta Tags

**File:** `index.html`

```html
<meta
  name="description"
  content="Collection of Quranic prayers (duas) with Arabic text, word-by-word translation, and translations in English, Urdu, and Hindi."
/>
<meta
  name="keywords"
  content="Quran, prayers, dua, supplication, Arabic, English, Urdu, Hindi, word by word"
/>
<meta name="author" content="Quranic Prayers" />
```

#### 4b. Open Graph Tags (Social Sharing)

**File:** `index.html`

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Quranic Prayers — Supplications from the Holy Quran"
/>
<meta
  property="og:description"
  content="68 Quranic prayers with Arabic text, word-by-word breakdowns, and translations in English, Urdu and Hindi."
/>
<meta
  property="og:url"
  content="https://<username>.github.io/quranic-prayers/"
/>
<meta
  property="og:image"
  content="https://<username>.github.io/quranic-prayers/og-image.png"
/>
<meta property="og:locale" content="en_US" />
<meta property="og:locale:alternate" content="ur_PK" />
<meta property="og:locale:alternate" content="hi_IN" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta
  name="twitter:title"
  content="Quranic Prayers — Supplications from the Holy Quran"
/>
<meta
  name="twitter:description"
  content="68 Quranic prayers with Arabic text and translations in English, Urdu and Hindi."
/>
<meta
  name="twitter:image"
  content="https://<username>.github.io/quranic-prayers/og-image.png"
/>
```

**Action:** Create an OG image (`public/og-image.png`) — a 1200x630px graphic with the app title and Arabic calligraphy.

#### 4c. Structured Data (JSON-LD)

**File:** `index.html`

Add a WebSite schema for search engines:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Quranic Prayers",
    "url": "https://<username>.github.io/quranic-prayers/",
    "description": "Collection of 68 Quranic prayers with Arabic text, word-by-word translation, and translations in English, Urdu, and Hindi.",
    "inLanguage": ["en", "ar", "ur", "hi"]
  }
</script>
```

#### 4d. Multilingual HTML lang Attributes

**Files:** `index.html`, `QuranVerse.tsx`, `App.tsx`

1. Keep `<html lang="en">` as the primary language.
2. Add `lang` attributes to language-specific content in `QuranVerse.tsx`:
   - Arabic section already has `lang="ar"` — good.
   - Add `lang="ur"` to Urdu translation wrapper.
   - Add `lang="hi"` to Hindi translation wrapper.
   - Add `lang="en"` to English translation wrapper.
3. Update `LanguageTranslationGroup` to include `lang` attribute:

   ```tsx
   const langCode = { english: "en", urdu: "ur", hindi: "hi" }[lang];
   <div className={...} dir={dir} lang={langCode}>
   ```

#### 4e. PWA Manifest Enhancement

**File:** `vite.config.ts`

The PWA manifest already exists. Enhance with multilingual metadata:

```ts
manifest: {
  name: "Quranic Prayers — Supplications from the Holy Quran",
  short_name: "Quranic Prayers",
  description: "68 Quranic prayers with Arabic text, word-by-word breakdowns, and translations in English, Urdu and Hindi.",
  // ...existing config
}
```

#### 4f. Sitemap and Robots.txt (Optional)

Since this is a single-page app on GitHub Pages, a simple sitemap helps:

**File:** `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://<username>.github.io/quranic-prayers/sitemap.xml
```

**File:** `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://<username>.github.io/quranic-prayers/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
  </url>
</urlset>
```

---

## 5. Accessibility Improvements

### Current State

- Filter chips have `aria-pressed` — good.
- Clear button has `aria-label` — good.
- PrayerCard uses `<article>` — good semantic element.
- **Missing:** skip navigation, ARIA landmarks, focus management, keyboard navigation for all controls, screen reader announcements, reduced motion.

### Changes Required

#### 5a. Skip Navigation Link

**Files:** `App.tsx`, `App.css`

Add a visually-hidden skip link as the first element in the app:

```tsx
<a href="#prayers-list" className="skip-nav-link">
  Skip to prayers
</a>
```

```css
.skip-nav-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  z-index: 1000;
  font-size: 1rem;
}
.skip-nav-link:focus {
  top: 0;
}
```

Add `id="prayers-list"` to the `<main>` element.

#### 5b. ARIA Landmarks and Roles

**Files:** `App.tsx`, `FilterSection.tsx`

1. Wrap filter section in `<nav aria-label="Prayer filters">` or use `role="search"`.
2. Add `aria-label="Reading controls"` to the control panel `<div>`.
3. Add `role="group"` and `aria-label` to control groups:

   ```tsx
   <div className="control-group" role="group" aria-label="Reading mode">
   ```

4. Add `aria-label="Prayer list"` to the `<main>` element.

#### 5c. Heading Hierarchy

**Files:** `App.tsx`, `FilterSection.tsx`, `PrayerCard.tsx`

Current hierarchy:

- `<h1>` Quranic Prayers (header)
- `<h3>` Filter by Category (FilterSection)
- `<h2>` Prayer title (PrayerCard)

Fix: Change FilterSection heading from `<h3>` to `<h2>` for proper document flow:

```
h1 -> App title
  h2 -> Filter by Category
  h2 -> Prayer Title 1
  h2 -> Prayer Title 2
  ...
```

#### 5d. Keyboard Navigation

**Files:** `PrayerCard.tsx`, `QuranVerse.tsx`, `App.css`

1. **Tag badges** (once made interactive): Ensure they are `<button>` elements (already focusable).
2. **Language checkboxes**: Already `<input type="checkbox">` — natively keyboard accessible.
3. **Mode buttons**: Already `<button>` — natively focusable.
4. **"Open on Quran.com" link**: Already `<a>` — natively focusable.
5. **Focus visible styles**: Add consistent focus ring for all interactive elements:

   ```css
   :focus-visible {
     outline: 3px solid var(--primary-color);
     outline-offset: 2px;
   }
   ```

   (Already partially present in `index.css` for `button:focus-visible` — extend to all interactive elements.)

#### 5e. Screen Reader Support for Arabic Text

**Files:** `QuranVerse.tsx`

1. Add `aria-label` to verse number markers (they use special Unicode characters):

   ```tsx
   <span className="qv-verse-num" aria-label={`Verse ${verse.verseNumber}`}>
     {toArabicNumeral(verse.verseNumber)}
   </span>
   ```

2. Add `aria-label` to the Arabic section:

   ```tsx
   <div className="qv-arabic-section" aria-label="Quranic Arabic text">
   ```

3. For word-by-word mode, each word group should be `role="group"`:

   ```tsx
   <div className="qv-wbw-word" role="group" aria-label={`${word.transliteration}: ${word.translation}`}>
   ```

4. Mark decorative verse-ref delimiters as `aria-hidden`:

   ```tsx
   <span className="qv-inline-verse-ref" aria-hidden="true">
     {verse.verseKey}
   </span>
   ```

#### 5f. Live Announcements for Filter Changes

**Files:** `App.tsx`

Add an `aria-live` region that announces filter results:

```tsx
<div aria-live="polite" className="sr-only">
  {selectedTags.size > 0
    ? `Showing ${visibleCount} of ${prayers.length} prayers`
    : `Showing all ${prayers.length} prayers`}
</div>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

#### 5g. Reduced Motion Support

**Files:** `index.css`, `App.css`

Wrap all transitions and animations in a `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

#### 5h. Color Contrast Audit

1. Verify all text colors meet **WCAG AA** minimum contrast ratios:
   - Normal text: 4.5:1 (`--text-secondary: #5d6d7e` on `--card-bg: #ffffff` = 4.97:1 — passes).
   - Large text: 3:1 (Arabic text `#1a1a2e` on `#fafaf8` = ~16:1 — passes).
   - Dimmed text (`opacity: 0.5`): The effective contrast of dimmed text will be reduced — verify it still meets 3:1 for the applicable font sizes.
2. Ensure interactive states (hover, active, focus) maintain sufficient contrast.

---

## Implementation Priority

| Priority | Area                                      | Effort | Impact                         |
| -------- | ----------------------------------------- | ------ | ------------------------------ |
| High     | 2a. Arabic IndoPak font                   | Medium | High — fixes script mismatch   |
| High     | 5a-5c. Skip nav, landmarks, headings      | Low    | High — basic a11y              |
| Medium   | 1a. Clickable tag badges                  | Low    | Medium — UX improvement        |
| Medium   | 1b. Clear filters in toolbar              | Low    | Medium — UX improvement        |
| Medium   | 4a-4d. Meta tags, OG, lang attrs          | Low    | Medium — discoverability       |
| Medium   | 3c-3d. Mobile font sizes, touch targets   | Low    | Medium — mobile usability      |
| Low      | 2b. Urdu font (MehrNastaliq)              | Medium | Low — current font is adequate |
| Low      | 5d-5h. Full a11y audit                    | Medium | Medium — compliance            |
| Low      | 3a-3b. Collapsible panel, scrolling chips | Medium | Low — nice-to-have             |
| Low      | 4e-4f. PWA manifest, sitemap              | Low    | Low — minor SEO                |

---

## File Change Summary

| File                               | Changes                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `index.html`                       | Meta tags, OG tags, JSON-LD, font preload                                                            |
| `src/App.tsx`                      | Skip nav, clear filters in toolbar, pass toggleTag to PrayerCard, aria-live region, landmark roles   |
| `src/App.css`                      | Skip nav styles, clear button styles, responsive fixes, touch targets, reduced motion, sr-only class |
| `src/components/PrayerCard.tsx`    | Add onToggleTag prop, make tag badges interactive buttons                                            |
| `src/components/FilterSection.tsx` | Fix heading level (h3 to h2), add nav landmark                                                       |
| `src/components/QuranVerse.tsx`    | lang attributes on translations, aria-labels on verse numbers, aria-hidden on decorative elements    |
| `src/components/QuranVerse.css`    | @font-face for IndoPak, update font-family stacks, adjust line-heights, mobile font sizes            |
| `src/index.css`                    | Global focus-visible styles, reduced motion media query                                              |
| `public/fonts/`                    | Self-hosted IndoPak font file(s)                                                                     |
| `public/og-image.png`              | Social sharing image (to be created)                                                                 |
| `public/robots.txt`                | Search engine directives                                                                             |
| `public/sitemap.xml`               | Sitemap for GitHub Pages                                                                             |
