## Plan: Fix 3 Issues

### Issue 1 — Prayer card header: serial number should be on left for Urdu

**Problem**: The `<h2>` has `dir="rtl"` when `isRtl`, which reverses the entire content flow — placing the serial number on the right and the Urdu title on the left (reading as `عنوان . 1` instead of `1 . عنوان`).

**Fix** in PrayerCard.tsx:  
Remove `dir="rtl"` from the `<h2>`. The serial number + title should always render LTR (number on left, title on right). The Urdu text within the title will still display correctly inside an LTR container — individual Urdu words/characters are inherently RTL via Unicode bidi, they just flow inline after the serial number.

Change:

```jsx
<h2 dir={isRtl ? "rtl" : "ltr"}>
```

To:

```jsx
<h2>
```

### Issue 2 — Urdu font size/style inconsistent with Urdu translation

**Problem**: The Urdu translation in QuranVerse uses a specific font stack at `font-size: 1.15rem` and `line-height: 2.8` ([QuranVerse.css line 258](src/components/QuranVerse/QuranVerse.css#L258)). But the Urdu UI text in `.app-header h1`, `.subtitle`, `.prayer-count-banner`, `.app-footer p` (set via App.css) only gets `font-family` with no `font-size` or `line-height` specified. Similarly, PrayerCard description/title/partial-note have no Urdu-specific font at all — they inherit the base system font.

**Fix** in App.css:  
Add `font-size: 1.15rem` and `line-height: 2.8` to the existing `[data-ui-lang="urdu"]` rule to match the QuranVerse Urdu translation styles exactly.

**Fix** in PrayerCard.css:  
Add a new rule block for Urdu text within prayer cards:

```css
[data-ui-lang="urdu"] .prayer-header h2,
[data-ui-lang="urdu"] .prayer-description,
[data-ui-lang="urdu"] .partial-note,
[data-ui-lang="urdu"] .tag-badge {
  font-family: var(--font-family-urdu);
  font-size: 1.15rem;
  line-height: 2.8;
}
```

This ensures all Urdu text matches the Urdu translation's font-family, size, and line-height.

### Issue 3 — App language radio button not showing selected state on click

**Problem**: Both `BottomSheet` (mobile) and `FilterDrawer` (desktop) render `ReadingControls`, which contains `<input type="radio" name="ui-language" />`. Both are always in the DOM simultaneously (BottomSheet uses CSS `visibility: hidden` when closed, not conditional rendering). Since HTML radio buttons with the same `name` attribute in the same document form a **single radio group**, clicking a radio in one set unchecks the radio in the other set. The state updates correctly (React `checked` prop is right), but the browser's native radio state fights with React's controlled state, causing the visual glitch. It resolves when the component re-renders from another interaction (like switching tabs).

**Fix** in ReadingControls.tsx:  
Accept an optional `id` prop and use it to generate a unique radio group name:

```tsx
interface ReadingControlsProps {
  // ...existing props
  id?: string;
}
```

Change the radio `name` from `"ui-language"` to a dynamic value:

```jsx
name={`ui-language-${id ?? "default"}`}
```

Then pass different ids from each usage site:

- App.tsx: `<ReadingControls ... id="mobile" />` (BottomSheet)
- FilterDrawer.tsx: `<ReadingControls ... id="desktop" />` (FilterDrawer)

This gives each set of radio buttons its own group name so they don't interfere.

---

### Files to change:

1. PrayerCard.tsx — Remove `dir` from h2
2. App.css — Add font-size/line-height to Urdu rule
3. PrayerCard.css — Add Urdu font rules for card text
4. ReadingControls.tsx — Add `id` prop, use unique radio name
5. App.tsx — Pass `id="mobile"` to BottomSheet's ReadingControls
6. FilterDrawer.tsx — Pass `id="desktop"` to ReadingControls
