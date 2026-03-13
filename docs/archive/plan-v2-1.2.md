## Plan: Multi-Language Support (English, Hindi, Urdu)

Add in-house English/Hindi/Urdu support for **all** user-facing text — prayer titles, descriptions, tags, and app UI chrome. For other languages, the browser's built-in translate handles everything except Arabic Quranic text (which is protected).

---

### Phase 1: Data Layer

**1.1 — Extend the Prayer type** (prayer.ts)

- Rename `title` → `title_en`, add `title_ur`, `title_hi`
- Same for `description`, `tags`, `partialVerse`
- Filtering always uses `tags_en` as canonical keys internally

**1.2 — Translate all 77 prayers** (script: `scripts/add-translations.py` NEW)

- I'll translate titles, descriptions, tags, and partialVerse into Hindi and Urdu directly (I'm fluent in both)
- Script renames existing English fields and adds `_ur`/`_hi` variants to data.json

**1.3 — Create UI strings file** (`src/constants/uiStrings.ts` NEW)

- All app chrome text in 3 languages: header ("Quranic Prayers" / "قرآنی دعائیں" / "क़ुरआनी दुआएँ"), subtitle, button labels ("Normal", "Word-by-Word"), settings labels, footer, filter section text, etc.
- Structure: `Record<Language, Record<string, string>>`

**1.4 — Create tag translation map** (`src/constants/tagTranslations.ts` NEW)

- Maps English tag keys → display strings per language
- e.g., `"Forgiveness"` → `{ ur: "مغفرت", hi: "क्षमा" }`

---

### Phase 2: App State & Context

**2.1 — Add LanguageContext** (`src/contexts/LanguageContext.tsx` NEW)

- `uiLanguage: Language` state — controls which title/desc/tags/chrome to render
- **Auto-detect** on first visit: `navigator.language` → `"ur"` maps to urdu, `"hi"` to hindi, else english
- **Persist** to `localStorage` key `"qp-ui-language"`
- Context provider wraps the app

**2.2 — Create localized prayer helper** (`src/hooks/useLocalizedPrayer.ts` NEW)

- Resolves `prayer.title_en` / `prayer.title_ur` / `prayer.title_hi` based on context
- Used by PrayerCard and anywhere prayer metadata is displayed

---

### Phase 3: Component Updates

| Component        | Changes                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| App.tsx          | Wrap with LanguageContext. Header, subtitle, banner, footer use `uiStrings[lang]`.                                         |
| PrayerCard       | Render localized title/description/tags. Add `dir="rtl"` and `lang="ur"` when Urdu. Tags still emit English keys on click. |
| FilterSection    | Display tags in selected language via tagTranslations map. Filter logic unchanged.                                         |
| ReadingControls  | Add **"App Language"** selector section (3 radio buttons: English / اردو / हिन्दी). Localize existing labels.              |
| QuranVerse       | Add `translate="no"` to Arabic text container. No other changes.                                                           |
| BottomSheet      | Localize "Settings" title.                                                                                                 |
| FilterDrawer     | Localize header/labels.                                                                                                    |
| FloatingControls | Localize aria-labels.                                                                                                      |

---

### Phase 4: Browser Translation Protection

**4.1** — Add `translate="no"` to Arabic text containers in QuranVerse.tsx — prevents Chrome/Edge/Safari from translating Quranic Arabic when users activate browser translate for other languages.

**4.2** — Do NOT add global `<meta name="google" content="notranslate">` — we _want_ browser translate to work for non-Arabic UI text for languages we don't support.

---

### Phase 5: Scripts & Data Files

| File                 | Change                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------- |
| data.json            | Rename `title`→`title_en`, add `title_ur`/`title_hi`, same for description/tags/partialVerse |
| fetch-prayer-data.ts | Update `RawPrayer` interface for new field names                                             |
| update-data.py       | Update template for `_en`/`_ur`/`_hi` fields                                                 |
| data.md              | Regenerate (English-only table, or separate sections)                                        |

---

### Verification

1. `npm run build` passes
2. Open with browser language "ur" → defaults to Urdu UI
3. Select language → refresh → preference persists
4. All 77 prayer titles/descriptions/tags show correctly in each language
5. Urdu text renders RTL, Hindi LTR
6. Tag filters work when switching languages mid-session
7. Chrome translate: Arabic Quranic text NOT translated, rest translates fine
8. Settings sheet shows language selector with each option in its own script

### Further Considerations

1. **Data size impact**: ~50-80KB added to data.json (currently ~450KB). Acceptable since it's bundled.
2. **Tag persistence across language switch**: Filters keep working because filtering uses English keys internally — only the display label changes.
3. **Dependency order**: Phase 1 (data) → Phase 2 (context) → Phase 3 (components). Phase 4 is independent and can be done in parallel with Phase 3.
