Plan: Color Palette Refresh — quran.com Alignment
TL;DR — Replace the current green/gold/cream palette with a clean white/dark/teal scheme inspired by quran.com. This fixes all 4 Lighthouse contrast failures (prayer-serial, qv-inline-verse-ref, qv-translator-name, qv-range) while modernizing the entire UI to match quran.com's white background + dark text aesthetic. The change touches 3 CSS files and the HTML preconnect/theme-color.

Steps

Update CSS custom properties in App.css:1-12

--primary-color: #2c5f2d → #008f7a (quran.com-inspired teal, 4.56:1 on white ✅)
--primary-light: #4a8c4d → #2ca4ab (lighter teal for hover/gradient)
--accent-gold: #d4af37 → #946b00 (darkened gold for WCAG AA — 4.85:1 on white ✅). Alternatively use quran.com's #bb8700 if close enough (4.5:1 boundary).
--bg-cream: #faf9f6 → #ffffff (pure white)
--text-primary: #2c3e50 → #272727 (quran.com body text)
--text-secondary: #5d6d7e → #4a4a4a (darker secondary — 7.94:1 ✅)
--border-color: #e0e0e0 → #ebeef0 (quran.com border)
Update global body styles in index.css:9-10

color: #2c3e50 → #272727
background-color: #faf9f6 → #ffffff
Update a color on index.css:44 to new --primary-color value
Update a:hover on index.css:48 to new --primary-light
Update button bg on index.css:65, hover on index.css:69, focus outlines on index.css:72-73, and global focus-visible outlines on index.css:81-82 to match new primary color
Fix body background gradient in App.css:55 — change linear-gradient(135deg, var(--bg-cream) 0%, #f0ede5 100%) to solid #ffffff or a very subtle linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)

Fix Lighthouse-failing element: .prayer-serial in App.css:333

Change color: var(--accent-gold) to the new darkened --accent-gold (#946b00). This alone fixes it since the variable is updated in step 1.
Fix Lighthouse-failing element: .qv-inline-verse-ref in QuranVerse.css:50-57

Remove opacity: 0.7 (the main culprit — it reduces effective contrast)
Change color to #495057 (quran.com gray — 8.59:1 on #f8f9fa ✅)
Fix Lighthouse-failing element: .qv-translator-name in QuranVerse.css:195-199

Change color: #9ca3af → #666666 (quran.com faded text — 5.74:1 on #f8f9fa ✅)
Fix Lighthouse-failing element: .qv-range in QuranVerse.css:217

Change color: #718096 → #495057 (quran.com gray — 7.16:1 on #f1f5f0 ✅)
Update QuranVerse.css supporting colors for consistency:

QuranVerse.css:30-31: #fafaf8 → #ffffff (or keep subtle gradient with #fafafa)
QuranVerse.css:66: #1a1a2e → #272727
QuranVerse.css:103: #1a1a2e → #272727
QuranVerse.css:107: update to new primary color
QuranVerse.css:116: #6b7280 → #4a4a4a
QuranVerse.css:149: #f8f9fa — keep as-is (matches quran.com)
QuranVerse.css:150: update to new primary color via variable
QuranVerse.css:159: #2c3e50 → #272727
QuranVerse.css:203: #f1f5f0 → #f8f9fa (neutral gray instead of green-tinted)
QuranVerse.css:212: #4a5568 → #495057
QuranVerse.css:216: update via variable
QuranVerse.css:220-223: update to new primary
Update App.css secondary colors for palette coherence:

App.css:66-71: uses --primary-color / --primary-light — will auto-update to teal
App.css:199-203: uses variables — auto-updates
App.css:210-211: change #e8f5e9 / #c8e6c9 (green tint) to #e0f7f5 / #b2dfdb (teal tint)
App.css:349-350: uses --accent-gold — update secondary stop from #c4991f to #7a5700
App.css:391: uses --accent-gold — auto-updates
App.css:389: #fff9e6 — keep as-is (warm accent is fine)
All rgba(44, 95, 45, ...) references (green shadow/hover): change to match new teal, e.g., rgba(0, 143, 122, ...)
Update HTML theme-color in index.html — change <meta name="theme-color" content="..."> to new primary color value

Verification

Run Lighthouse accessibility audit on the deployed page — all 4 failing elements should now pass WCAG AA (4.5:1 for normal text, 3:1 for large text)
Visually compare side-by-side with quran.com to confirm alignment
Check all interactive elements (filter chips, tag badges, mode buttons) in active/hover states for sufficient contrast
Test on mobile viewports (480px, 360px) to ensure no contrast regressions in responsive breakpoints
Verify the teal header gradient looks good with white text (contrast: white on #008f7a = 4.56:1 for large text ✅)
Decisions

Primary color → teal instead of keeping green: aligns with quran.com; green could remain but would need a different shade for sufficient contrast
Gold darkened to #946b00: minimal visual change but achieves 4.5:1 on white; quran.com's gold #cb955b only achieves ~3.2:1 so we can't use it directly
Removed opacity trick on verse refs: opacity-based dimming destroys contrast; replaced with solid accessible color
Footer bg neutralized: changed from green-tinted #f1f5f0 to neutral #f8f9fa to match quran.com's clean look
