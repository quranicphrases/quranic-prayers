## Plan: Fix 6 Remaining i18n Polish Issues

### Issue 1 — Footer surah reference order for Urdu

**Problem**: Footer renders `{surahName} [{verseRange}]` in source order. For Urdu, the surah name is RTL but the `[10:20]` range comes after it in DOM order, so it visually renders as `[10:20] سورہ البقرہ` instead of `سورہ البقرہ [10:20]`.

**Fix** in QuranVerse.tsx:  
Swap the render order when `uiLanguage === "urdu"` — render range first, then surah name. Since the surah name is RTL text, the browser will place it visually on the right, and the LTR `[10:20]` on the left, making it read as `البقرہ [10:20]` visually from right to left.

Actually simpler: just add `dir="rtl"` to the `.qv-ref` span when Urdu, so the entire ref block flows RTL. The surah name naturally comes first in RTL flow, with `[10:20]` after it.

### Issue 2 — "Quran.com khole par" link text order for Urdu

**Problem**: The Urdu `openOnQuranCom` string is `"\u2067Quran.com\u2069 پر کھولیں ↗"`. The bidi isolation was added but the link itself sits in an LTR-context container (`.qv-footer` has no `dir`), so "Quran.com" still appears at the wrong end.

**Fix** in QuranVerse.tsx:  
Add `dir="rtl"` on the `<a>` element when `uiLanguage === "urdu"`. This makes the link text flow RTL, placing "Quran.com" at the natural end of the Urdu sentence.

### Issue 3 — "Open on" → "Open in" + add purpose context

**Problem**: English says "Open on Quran.com" but user wants "Open in Quran.com for audio, hadith and tafsir". Same for Hindi and Urdu.

**Fix** in uiStrings.ts:  
Update all three translations:

- English: `"Open in Quran.com ↗"`
- Urdu: `"\u2067Quran.com\u2069 میں کھولیں ↗"` ("میں" = "in" instead of "پر" = "on")
- Hindi: `"Quran.com में खोलें ↗"` ("में" = "in" instead of "पर" = "on")

### Issue 4 — Urdu font missing in prayer card footer & settings sheet

**Problem**: The `[data-ui-lang="urdu"]` CSS rules only target `.prayer-header h2`, `.prayer-description`, `.partial-note`, `.tag-badge` (in PrayerCard.css) and `.app-header h1`, `.subtitle`, `.prayer-count-banner`, `.app-footer p` (in App.css). The QuranVerse footer (`.qv-footer`), settings sheet title (`.bottom-sheet-title`, `.filter-drawer-title`), tab labels (`.tab-group-tab`), and reading control labels (`.reading-control-label`, `.lang-toggle span`, `.mode-btn`) are not covered.

**Fix** — Add Urdu font rules in multiple CSS files:

In QuranVerse.css after the footer section:

```css
[data-ui-lang="urdu"] .qv-surah,
[data-ui-lang="urdu"] .qv-quran-link {
  font-family: var(--font-family-urdu);
  font-size: 1.15rem;
  line-height: 2.8;
}
```

In ReadingControls.css:

```css
[data-ui-lang="urdu"] .reading-control-label,
[data-ui-lang="urdu"] .lang-toggle span,
[data-ui-lang="urdu"] .mode-btn {
  font-family: var(--font-family-urdu);
  font-size: 1.15rem;
  line-height: 2.8;
}
```

In BottomSheet.css:

```css
[data-ui-lang="urdu"] .bottom-sheet-title {
  font-family: var(--font-family-urdu);
  font-size: 1.15rem;
  line-height: 2.8;
}
```

In FilterDrawer.css:

```css
[data-ui-lang="urdu"] .filter-drawer-title {
  font-family: var(--font-family-urdu);
  font-size: 1.15rem;
  line-height: 2.8;
}
```

In TabGroup.css:

```css
[data-ui-lang="urdu"] .tab-group-tab {
  font-family: var(--font-family-urdu);
  font-size: 1.15rem;
  line-height: 2.8;
}
```

In FilterSection.css:

```css
[data-ui-lang="urdu"] .filter-header h2,
[data-ui-lang="urdu"] .filter-chip,
[data-ui-lang="urdu"] .filter-results {
  font-family: var(--font-family-urdu);
  font-size: 1.15rem;
  line-height: 2.8;
}
```

### Issue 5 — Language names should be in their own script

**Problem**: `LANGUAGE_DISPLAY_NAMES` in languages.ts has `english: "English", urdu: "Urdu", hindi: "Hindi"` — all English text. These are used in both the App Language radio buttons and the Translations checkboxes.

**Fix** in languages.ts:  
Change display names to native script:

```ts
export const LANGUAGE_DISPLAY_NAMES: Record<Language, string> = {
  english: "English",
  urdu: "اردو",
  hindi: "हिन्दी",
};
```

### Issue 6 — Translator name should be in same language as translation

**Problem**: The `translator` field in `data.json` is always English (e.g., "Dr. Israr Ahmad" for Urdu, "Maulana Azizul Haque al-Umari" for Hindi). The `LanguageTranslationGroup` renders `— {translator}` directly.

**Fix**: This is a data-level issue. Rather than re-fetching all data, create a constant mapping in code.

In QuranVerse.tsx (or a new small constants file), add a localized translator name lookup:

```ts
const LOCALIZED_TRANSLATOR: Record<string, string> = {
  "Sahih International": "Sahih International", // English stays English
  "Dr. Israr Ahmad": "ڈاکٹر اسرار احمد", // Urdu in Urdu script
  "Maulana Azizul Haque al-Umari": "मौलाना अज़ीज़ुल हक़ अल-उमरी", // Hindi in Devanagari
};
```

In `LanguageTranslationGroup`, replace `{translator}` with `LOCALIZED_TRANSLATOR[translator] ?? translator`.

---

### Files to change:

1. QuranVerse.tsx — Footer `dir` for Urdu ref + link (Issues 1, 2), localized translator lookup (Issue 6)
2. uiStrings.ts — "Open in" text (Issue 3)
3. QuranVerse.css — Urdu font for footer elements (Issue 4)
4. ReadingControls.css — Urdu font for labels/buttons (Issue 4)
5. BottomSheet.css — Urdu font for title (Issue 4)
6. FilterDrawer.css — Urdu font for title (Issue 4)
7. TabGroup.css — Urdu font for tabs (Issue 4)
8. FilterSection.css — Urdu font for filter labels/chips (Issue 4)
9. languages.ts — Native script language names (Issue 5)

### Verification:

1. In Urdu mode, prayer card footer shows `البقرہ [2:201]` (surah name first, range after)
2. Urdu link reads `کھولیں Quran.com↗` naturally in RTL
3. All three languages say "Open in" / "میں کھولیں" / "में खोलें"
4. All Urdu text throughout (footer, settings title, tabs, labels, buttons) uses Nastaliq font at 1.15rem
5. Language selector shows "English", "اردو", "हिन्दी"
6. Translator attribution shows "ڈاکٹر اسرار احمد" under Urdu translation, "मौलाना अज़ीज़ुल हक़ अल-उमरी" under Hindi
