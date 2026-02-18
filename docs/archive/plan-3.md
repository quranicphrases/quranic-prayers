Plan: Fix Arabic Small Circle (U+06E1) Rendering
TL;DR: The IndoPak text in data.json uses U+06E1 (ۡ — Arabic Small High Dotless Head Of Khah) as the sukun/jazm mark. Our IndoPak font renders this as a visible hollow circle above letters like لۡ. On quran.com, their custom font renders it invisibly. Fix: replace U+06E1 → U+0652 (standard Arabic Sukun) at render time in QuranVerse.tsx. Data stays unchanged. ~7 lines added, 2 lines modified, 1 file touched.

Steps

Add a normalizeArabicText() helper in QuranVerse.tsx (near the existing toArabicNumeral and buildQuranUrl helpers, ~line 195):

In normal reading mode (QuranVerse.tsx ~line 42), wrap verse.textIndopak with the helper:

Change {verse.textIndopak} → {normalizeArabicText(verse.textIndopak)}
In word-by-word mode (QuranVerse.tsx ~line 131), wrap word.textIndopak with the helper:

Change {word.textIndopak} → {normalizeArabicText(word.textIndopak)}
No other files change — data.json, CSS, fonts, and types remain untouched.

Verification

Visually check that the hollow circle above letters like لۡ in Al-Fatihah (1:2) is gone
Test both normal and word-by-word modes
Run npm run build to confirm no compilation errors
Decisions

Render-time substitution (not data-time) — keeps data.json pristine and reversible
Keep IndoPak font as primary — U+0652 renders naturally in Nastaleeq fonts
Claude Opus 4.6 • 3x
