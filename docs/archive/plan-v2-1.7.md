## Plan: Fix Urdu UI Element Size Bloat

**Root cause:** All `[data-ui-lang="urdu"]` CSS rules apply `font-size: 1.15rem; line-height: 2.8` everywhere — both content text AND UI chrome elements. `line-height: 2.8` is only needed for multi-line Nastaliq translation text (to prevent tall ascender/descender overlap). On single-line UI elements (buttons, tabs, chips, labels), it inflates height dramatically. Hindi has no such UI chrome rules, which is why Hindi ↔ English shows minimal change.

**Strategy:** Split into two tiers — keep `font-size: 1.15rem; line-height: 2.8` only on content/translation text, and apply only `font-family: var(--font-family-urdu)` (no size overrides) on UI chrome elements.

**Steps**

### Phase 1 — Remove size overrides from UI chrome (8 CSS files)

1. ReadingControls.css — `font-family` only for `.reading-control-label`, `.lang-toggle span`, `.mode-btn`
2. BottomSheet.css — `font-family` only for `.bottom-sheet-title`
3. FilterDrawer.css — `font-family` only for `.filter-drawer-title`
4. TabGroup.css — `font-family` only for `.tab-group-tab`
5. FilterSection.css — `font-family` only for `.filter-header h2`, `.filter-chip`, `.filter-results`, `.clear-filters-btn`
6. PrayerCard.css — Split the rule: `.prayer-header h2` + `.tag-badge` get `font-family` only (UI chrome); `.prayer-description` + `.partial-note` keep full `font-family` + `font-size: 1.15rem` + `line-height: 2.8` (content text)
7. QuranVerse.css — `font-family` only for `.qv-surah`, `.qv-quran-link` (footer)
8. App.css — Split: `.app-header h1` + `.app-footer p` get `font-family` + `direction: rtl` + `text-align: center` only; `.subtitle` + `.prayer-count-banner` get the same but with `line-height: 2` instead of 2.8

### Phase 2 — Verify

9. `npm run build` — confirm no errors
10. Manual test: switch English → Hindi → Urdu, compare button/card/tab heights

**Relevant files**

- 8 CSS files listed above — each has a `[data-ui-lang="urdu"]` rule block to trim

**Verification**

1. Build passes
2. Visually confirm buttons, tabs, chips, card headers remain ~same size across all 3 languages
3. Confirm Urdu translation text still has proper Nastaliq spacing (no line overlap)

**Decisions**

- Nastaliq font renders correctly at any base font-size — only multi-line text needs inflated `line-height`
- UI chrome is single-line → no overlap risk → no `line-height` or `font-size` override needed
- We keep `font-family` on all elements so Urdu text always renders in Nastaliq
- No Hindi-specific rules needed (current natural variation is acceptable)
