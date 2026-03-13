## Plan: Final Polish — Sorting, SEO, Favicon, Partial Note Removal

---

### 1. Data sorting — NO CHANGE NEEDED

Data in data.json is already sorted ascending by surah number (1 → 2 → 3 → ... → 46). The app renders in array order without any sort. No action required.

---

### 2. SEO improvements

Prayer count is outdated (says "68" everywhere, should be "77"). Will also add multilingual keywords and update dates.

**Steps**

1. index.html — Update all "68" → "77" in meta description, OG description, Twitter description, and JSON-LD. Add Urdu/Hindi keywords to `<meta name="keywords">` (e.g. "قرآنی دعائیں, दुआएँ, quranic dua, masnoon dua"). Add `<link rel="alternate" hreflang="...">` tags for en/ur/hi.
2. vite.config.ts — Update PWA manifest description from "68" to "77".
3. sitemap.xml — Update `<lastmod>` date.

---

### 3. Replace vite.svg favicon with custom SVG

Create a hand-coded SVG icon (open book with crescent/star motif — relevant to Quranic prayers).

**Steps**

1. Create public/favicon.svg — new hand-coded SVG icon
2. index.html — Change favicon href from `vite.svg` to `favicon.svg`
3. Delete vite.svg

---

### 4. Remove partial phrase note + dimming

The partial-note text ("The prayer is the relevant portion of this verse") and the dimming opacity code will both be removed. All verses currently have `isPartOfPrayer: true` anyway.

**Steps**

1. PrayerCard.tsx — Remove the partial-note JSX block
2. PrayerCard.css — Remove `.partial-note` styles and its Urdu rule
3. QuranVerse.tsx — Remove conditional `qv-dimmed` / `qv-dimmed-inline` class names (always render at full opacity)
4. QuranVerse.css — Remove `.qv-dimmed` and `.qv-dimmed-inline` styles
5. prayer.ts — Remove `partialVerse_en/ur/hi` from `Prayer` type, remove `isPartOfPrayer` from `VerseContent`
6. uiStrings.ts — Remove the `note` key
7. Localized prayer hook — Remove `partialVerse` mapping

---

### Verification

1. `npm run build` — no errors
2. Manual: favicon shows the new icon (not Vite logo)
3. Manual: no partial notes or dimmed verses appear
4. Manual: view page source — prayer count is "77" in all meta tags

---

**Decisions**

- Sorting: skipped (already sorted)
- Favicon: hand-coded SVG (open book + crescent motif)
- Dimming + partial note: both removed per user confirmation
- SEO keywords: English + Urdu + Hindi keywords added for multilingual discoverability
