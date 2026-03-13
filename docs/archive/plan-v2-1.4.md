## Plan: Urdu Layout Fix — Same Layout as Hindi

**TL;DR**: The root `dir="rtl"` is flipping the entire app layout (tabs, header, footer, cards). Remove it entirely. Urdu should behave exactly like Hindi — same layout, same card sizes, same element positions. Only specific text content gets RTL direction and the Urdu font.

**Root causes of current problems:**

1. `dir="rtl"` on `.app-layout` — flips ALL flexbox/grid (tabs, header, footer, cards)
2. Global `font-family: var(--font-family-urdu)` + `line-height: 2.2` on root — changes card sizes since Nastaliq needs more vertical space and this cascades everywhere

---

**Step 1 — App.tsx**

Remove `dir={uiLanguage === "urdu" ? "rtl" : "ltr"}` from the `.app-layout` div. Keep `data-ui-lang={uiLanguage}` attribute (used for targeted CSS).

**Step 2 — App.css**

Remove the global font cascade rules:

```css
/* DELETE these */
[data-ui-lang="urdu"] {
  font-family: ...;
  line-height: 2.2;
}
[data-ui-lang="hindi"] {
  font-family: ...;
}
```

Replace with **targeted** rules that apply Urdu font + RTL text direction only to specific text content elements (not layout containers):

```css
[data-ui-lang="urdu"] .app-header h1,
[data-ui-lang="urdu"] .subtitle,
[data-ui-lang="urdu"] .prayer-count-banner,
[data-ui-lang="urdu"] .app-footer p {
  font-family: var(--font-family-urdu);
  direction: rtl;
  text-align: center;
}
```

This approach:

- Layout stays LTR (flexbox/grid direction unchanged)
- Tab order stays Filters | Reading Options
- Card sizes stay the same
- Only the TEXT inside these containers flows RTL
- `text-align: center` keeps centered elements centered (since `direction: rtl` changes default alignment)

**Step 3 — variables.css**

Update `--font-family-urdu` to match the exact QuranVerse Urdu translation font stack:

```
"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Mehr Nastaliq", "Nafees Nastaleeq", serif
```

(Adding `"Nafees Nastaleeq", serif` to match QuranVerse.css)

**No changes needed for:**

- PrayerCard.tsx — already has `dir={isRtl ? "rtl" : "ltr"}` on h2, description, partial-note. These stay as-is.
- Short UI labels (settings title, tab buttons, filter chips, control labels, tag badges) — single Urdu words/phrases render fine without explicit RTL in their contained elements
- uiStrings.ts — Unicode bidi isolation for "Quran.com" already applied

**Verification:**

1. Switch to Urdu → layout identical to English/Hindi (tabs, header, footer, card sizes all same)
2. Header title "قرآنی دعائیں" appears in Nastaliq font, centered
3. Prayer card titles and descriptions flow RTL (existing per-element `dir="rtl"`)
4. Tabs stay in order: Filters (left) | Reading Options (right)
5. `npm run build` passes
