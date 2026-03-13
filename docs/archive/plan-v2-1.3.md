## Plan: Fix i18n Issues Post-Implementation

Fix 6 actionable issues from the review. Issues #7 (partial verse = prayer is only PART of the full Quranic verse, shown dimmed) and #8 (transliteration stays English) require no code changes.

---

### Phase 1: CSS & Styling Fixes (Issues #1, #4, #5)

**Step 1 — Apply Urdu/Hindi fonts to UI text (Issue #1)**

Currently, Nastaliq font is only applied inside QuranVerse translation sections (`.qv-lang-ur .qv-translation-text`). All other UI text — header, tags, descriptions, settings labels, banner, footer — uses the system font regardless of app language.

- App.tsx — Add `data-ui-lang={uiLanguage}` attribute on the `.app-layout` div
- App.css — Add cascading font rules:
  - `[data-ui-lang="urdu"]` → `font-family: var(--font-family-urdu); line-height: 2.2;`
  - `[data-ui-lang="hindi"]` → `font-family: var(--font-family-hindi);`
  - This cascades to ALL UI chrome without per-component changes

**Step 2 — Fix radio button styling (Issue #4)**

ReadingControls.css styles `.lang-toggle input[type="checkbox"]` with `accent-color` but has **zero** styles for `input[type="radio"]`. The app language radio buttons get browser-default blue.

- ReadingControls.css — Combine both selectors: `.lang-toggle input[type="checkbox"], .lang-toggle input[type="radio"]` with the same `width`, `height`, `cursor`, and `accent-color: var(--btn-border-active)` (#555555 grey)

**Step 3 — Color theme consistency (Issue #5)**

The only non-grey color in the app is the browser-default blue on unstyled radio buttons. Step 2 fixes this. All CSS variables in variables.css are already consistently grey-scale. No additional changes needed — just visual verification after Step 2.

---

### Phase 2: Localized Surah Names (Issue #2)

**Step 4 — Add surah name translations**

`surahName` in data.json is English-only. The footer in QuranVerse.tsx renders `{surahName}` directly.

- **NEW** `src/constants/surahNames.ts` — Create a `SURAH_NAMES: Record<number, Record<UILanguage, string>>` lookup for the ~32 surahs used in data.json. Hardcode Urdu (Arabic-script names like "البقرہ") and Hindi (Devanagari like "अल-बक़रा"). This avoids modifying data.json.
- QuranVerse.tsx — In the footer, replace `{surahName}` with `SURAH_NAMES[surahNumber]?.[uiLanguage] ?? surahName` (fallback to English from props)

---

### Phase 3: RTL/LTR Mixing & Digit Localization (Issue #3)

**Step 5 — Fix bidi text mixing in `openOnQuranCom`**

Urdu string `"Quran.com پر کھولیں ↗"` has an LTR domain embedded in RTL text, causing visual reordering.

- uiStrings.ts — Wrap "Quran.com" in Unicode bidi isolation: `"\u2067Quran.com\u2069 پر کھولیں ↗"` (U+2067 = Right-to-Left Isolate, U+2069 = Pop Directional Isolate). Keeps strings as plain text — no JSX changes needed.

**Step 6 — Localize digits in UI strings**

Numbers in `showingOf` and `filtersApplied` display as Western digits in Urdu/Hindi.

- quranHelpers.ts — Add `localizeNumber(n: number, lang: UILanguage): string`:
  - `english` → Western digits
  - `urdu` → Eastern Arabic (۰-۹, char offset 0x06F0)
  - `hindi` → Devanagari (०-९, char offset 0x0966)
- uiStrings.ts — Modify the `t()` function: when params contain numbers and lang is provided, auto-convert via `localizeNumber()` before interpolating. All `{placeholder}` numbers across all strings get localized automatically — no per-call-site changes.

---

### Phase 4: Multi-Language Word-by-Word Translations (Issue #6)

**Step 7 — Extend WordData type** _(parallel with Step 8)_

- prayer.ts — Add `translation_ur: string` and `translation_hi: string` to `WordData`. Keep `translation` as English (backward-compatible).

**Step 8 — Update fetch script** _(parallel with Step 7)_

- fetch-prayer-data.ts — In `fetchVerseData()`:
  - After the existing English words fetch, make two additional API calls with `?language=ur` and `?language=hi` to get localized word translations
  - Merge by position index into existing words array as `translation_ur` and `translation_hi`
  - Add a `--update-wbw` flag so the script can update existing enriched prayers without clearing their `content` array
  - Respect existing rate limiting

**Step 9 — Update WbwWordsInline to show localized translations** _(depends on Step 7)_

- QuranVerse.tsx — In `WbwWordsInline`:
  - Pass `uiLanguage` down from parent `QuranVerse`
  - Display `word.translation` / `word.translation_ur` / `word.translation_hi` based on `uiLanguage`
  - Font styling already cascades via the Phase 1 `data-ui-lang` attribute

**Step 10 — Re-run fetch script** _(depends on Step 8)_

- Run the updated script with `--update-wbw` to populate `translation_ur` and `translation_hi` for all 77 prayers
- Spot-check 3-5 prayers in data.json to verify new fields

---

### Verification

1. Switch to Urdu → ALL UI text (header, subtitle, banner, tags, settings labels) renders in Nastaliq font
2. Open Settings → Radio buttons show grey (not blue) filled circle when selected
3. No blue/accent colors anywhere across all 3 languages
4. Footer shows Arabic-script surah names in Urdu, Devanagari in Hindi
5. "Quran.com" link text reads naturally in Urdu RTL (domain properly isolated)
6. Prayer count banner shows Eastern Arabic numerals in Urdu (۷۷), Devanagari in Hindi (७७)
7. Word-by-Word mode shows translations matching the app language
8. `npm run build` passes

### Decisions

- **Surah names are a render-time lookup** (new constants file), not data.json changes
- **Number localization happens in `t()`** — automatic for all interpolated numbers
- **WBW fields**: `translation` stays English, new `translation_ur`/`translation_hi` added
- **Bidi fix uses Unicode isolation chars** (U+2067/U+2069) — simpler than JSX `<bdi>` elements
- **Font cascading via `data-ui-lang` on root div** — single point of control, no per-component changes

### Further Considerations

1. **WBW re-fetch strategy**: The current script skips prayers with existing `content`. Adding `--update-wbw` flag that iterates enriched prayers and merges in Urdu/Hindi word translations without re-fetching Arabic text or verse translations is the cleanest approach. Alternative: manually clear `content` for re-fetch (risks data loss).
2. **Surah name source**: The ~32 Urdu/Hindi surah names need to be hardcoded. Quran.com API doesn't have a direct surah-name-by-language endpoint. Only 32 unique surahs across 77 prayers — manageable.
3. **Font loading**: Nastaliq and Devanagari fonts are already loaded for QuranVerse translations. Applying them to UI text adds no extra network requests.

**Updated Phase 3** — simplified per your request:

### Phase 3: RTL Layout & Bidi Fixes — Urdu Only (Issue #3)

**Step 5 — Set `dir="rtl"` on root for Urdu + bidi fix for `openOnQuranCom`**

**No digit localization.** English digits are used everywhere. Hindi is fine as-is. The fix is Urdu-only.

**Root cause**: The `.app-layout` div and containers like `.prayer-count-banner`, `.app-footer` have no `dir` attribute — they default to LTR. When Urdu text like `"{total} دعاؤں میں سے {visible} دکھائی جا رہی ہیں"` is rendered inside an LTR container, the bidi algorithm misorders the English digits relative to the RTL Urdu text. Setting the root to `dir="rtl"` makes the browser's native bidi algorithm handle digit placement correctly — numbers appearing at the logically correct position within the RTL flow.

**Changes**:

- App.tsx — Add `dir={uiLanguage === "urdu" ? "rtl" : "ltr"}` on the `.app-layout` div. This flips the entire document directionality for Urdu, and the bidi algorithm naturally handles embedded English digits.
- App.css — Minor layout adjustments if needed. Flexbox/grid layouts may need `direction`-aware tweaks (e.g., ensuring the prayer count banner, footer, and header still look correct when direction flips). Most modern CSS layout is direction-agnostic, but `text-align`, padding asymmetry, etc. may need spot-fixes.
- uiStrings.ts — Wrap "Quran.com" in Unicode bidi isolation: `"\u2067Quran.com\u2069 پر کھولیں ↗"` to prevent the LTR domain from disrupting the RTL flow.

**Removed from plan**:

- ~~`localizeNumber()` utility~~ — not needed
- ~~`t()` function modification for numeric params~~ — not needed
- ~~Eastern Arabic / Devanagari digit conversion~~ — not needed

Everything else in the plan (Phases 1, 2, 4) remains unchanged. Want me to proceed with any other adjustments?
