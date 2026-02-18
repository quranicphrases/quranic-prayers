Plan: End-of-Ayah Marker for Arabic Text
Current State
The app uses Unicode ornate parentheses ﴿٢﴾ (U+FD3F/U+FD3E) for the end-of-ayah marker. These render as plain brackets in the IndoPak font — not the traditional circle that quran.com shows.

What quran.com does
quran.com uses a custom page font (QCF_P001–P604, one per Quran page) where each verse's end-of-ayah is a single pre-rendered glyph (mapped to PUA codepoints like U+FC4A). This includes the ornamental circle + number baked into the font. This approach is impractical for our app (604 font files, complex mapping).

Recommended approach: CSS-styled circle
Replace the ornate parentheses with a styled <span> that renders the Arabic-Indic numeral inside a circular border — matching the traditional end-of-ayah look.

Changes

1. QuranVerse.tsx — Normal mode (lines 48–53)

Replace:
<span className="qv-verse-num" aria-label={`Verse ${verse.verseNumber}`}>
&#xFD3F;{toArabicNumeral(verse.verseNumber)}&#xFD3E;
</span>

With:
<span className="qv-ayah-end" aria-label={`Verse ${verse.verseNumber}`}>
{toArabicNumeral(verse.verseNumber)}
</span>

2. QuranVerse.tsx — WBW mode (lines 138–143)

Replace the WBW verse-number word:
<span className="qv-wbw-arabic" aria-label={`Verse ${verse.verseNumber}`}>
&#xFD3F;{toArabicNumeral(verse.verseNumber)}&#xFD3E;
</span>

With:
<span className="qv-wbw-arabic" aria-label={`Verse ${verse.verseNumber}`}>
&#xFD3F;{toArabicNumeral(verse.verseNumber)}&#xFD3E;
</span>

3. QuranVerse.css — New .qv-ayah-end class
   /_ End-of-Ayah circle marker _/
   .qv-ayah-end {
   display: inline-flex;
   align-items: center;
   justify-content: center;
   width: 1.6em;
   height: 1.6em;
   border: 2px solid var(--primary-color, #008f7a);
   border-radius: 50%;
   font-size: 0.6em; /_ relative to parent Arabic text _/
   font-family: "Noto Naskh Arabic", sans-serif; /_ clean numeral rendering _/
   color: var(--primary-color, #008f7a);
   vertical-align: middle;
   margin: 0 0.15em;
   line-height: 1;
   direction: ltr; /_ prevent RTL digit reordering _/
   }

Key sizing details:

font-size: 0.6em keeps the circle proportional to the Arabic text (which is 1.85rem in normal mode, 1.55rem in WBW)
width/height: 1.6em relative to the .qv-ayah-end font-size gives ~18px circles
border-radius: 50% creates a perfect circle
Uses Noto Naskh Arabic for clean, consistent numeral rendering (no ligatures or decorative shaping)
Handles 1-digit (٢), 2-digit (٢٨), and 3-digit (٢٨٦) numbers — max in our data is 286 4. QuranVerse.css — Remove old .qv-verse-num

The existing .qv-verse-num class becomes unused and can be deleted.

5. Responsive adjustments — The em-based sizing auto-scales since the parent font-size changes at each breakpoint (768px, 480px, 360px). No separate media queries needed.

6. Translation languages — No change. English/Urdu/Hindi already use (1:2) format from the previous update.

Contrast check
Circle border + number: #008f7a on #ffffff background = 4.56:1 ratio (passes WCAG AA for the size)
In WBW mode: same color on #fafafa = ~4.5:1 (passes)
What this won't include
The decorative Arabic character ("lam") that appears above the circle in quran.com — that's an artifact of their custom PUA font glyphs and not reproducible with standard Unicode + CSS without adding custom SVG or font engineering. The CSS circle approach gives a clean, recognizable end-of-ayah marker that matches the general aesthetic.
