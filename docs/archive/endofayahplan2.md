Plan: Waqf Mark Above Circle + Verse Number Below
TL;DR — The IndoPak text contains trailing waqf (pause) marks — combining characters like ۙ (U+06D9), ؕ (U+0615), ۚ (U+06DA), ۖ (U+06D6) — that traditionally sit above the end-of-ayah circle in mushaf typography. Currently they're stuck on the last Arabic letter. The fix: strip them from the text, then render a 3-row vertical stack — waqf mark on top, circle in middle, (verseNumber) below.

Research findings
5 waqf marks appear at verse endings in the data:

Char Code Point Name Frequency
ۙ U+06D9 Small High Lam Alef ~49 verses (most common)
ؕ U+0615 Small High Tah ~16 verses
ۚ U+06DA Small High Jeem ~18 verses
ۖ U+06D6 Small High Sad-Lam-Alef Maksura rare, sometimes compound with ۚ
ۘ U+06D8 Small High Meem Initial rare, mid-verse only
Compound marks also exist: ۖ​ۚ (U+06D6 + U+200B + U+06DA) at end of 21:83, 21:87, etc.

Verses like 1:7, 3:38, 25:74 have no trailing waqf mark — nothing goes above the circle.

Steps

New helper extractWaqfMark() in QuranVerse.tsx:202-210

Create a function that takes textIndopak and returns { text: string, waqfMark: string }. It strips trailing U+200F, then checks if the last character(s) are in the waqf set [U+0615, U+06D6, U+06D8, U+06D9, U+06DA] (including compound marks separated by U+200B). Returns the cleaned text and the extracted waqf mark (empty string if none).

New wrapper component AyahEndMarker in QuranVerse.tsx:115

A small inline component that renders a vertical stack:

┌─────────────┐
│ waqf mark │ ← only if mark exists; rendered as Arabic combining char on a dotted circle base (◌) or standalone
│ ⭕ N │ ← existing .qv-ayah-end circle with numeral
│ (N) │ ← verse number in simple brackets
└─────────────┘

Props: verseNumber: number, waqfMark: string

Update normal mode rendering in QuranVerse.tsx:40-47

Call extractWaqfMark() on each verse's textIndopak
Pass the cleaned text to normalizeArabicText()
Pass waqfMark to the new AyahEndMarker component
Update WBW mode rendering in QuranVerse.tsx:136-141

Call extractWaqfMark() on the full verse.textIndopak to get the waqf mark
Replace the current <span className="qv-ayah-end"> + <span className="qv-wbw-translation"> with AyahEndMarker
New CSS classes in QuranVerse.css:68-85

.qv-ayah-marker — the outer wrapper: display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 0.15em; line-height: 1;
.qv-ayah-waqf — the waqf mark above the circle: font-family: "IndoPak", "Noto Naskh Arabic", serif; font-size: 0.7em; color: var(--primary-color); line-height: 1; height: 0.9em; (uses IndoPak so the waqf glyphs match the verse text font)
.qv-ayah-end — keep existing circle styles but remove margin and vertical-align (now handled by parent)
.qv-ayah-num — the (N) below: font-size: 0.45em; color: var(--primary-color); font-family: sans-serif; line-height: 1; direction: ltr;
No changes needed for translations — English/Urdu/Hindi already use (1:2) format.

Verification

Check verses 1:2–1:6 show ۙ or ؕ above the circle
Check 1:7, 3:38, 25:74 show NO mark above the circle
Check 2:250 shows ؕ above the circle
Check that (verseNumber) appears below the circle in all cases
Check WBW mode renders identically
Verify build succeeds and no layout overflow at 360px breakpoint
Decisions

Waqf marks rendered using the IndoPak font (not Noto Naskh Arabic) so they match the verse text style
Vertical stack approach chosen over CSS position: absolute overlay — simpler, no z-index issues, naturally flows inline
The (verseNumber) uses Western digits below the circle (matching quran.com's embed style) rather than Arabic-Indic numerals (those are already inside the circle)
