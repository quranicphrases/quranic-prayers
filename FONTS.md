# Font Configuration

This document explains the font setup for the Quranic Prayers app, including which fonts are used for each language, how they're loaded, and how to modify them.

## Overview

The app uses different fonts for different scripts:

| Language         | Script            | Font Stack                                       |
| ---------------- | ----------------- | ------------------------------------------------ |
| Arabic (Quranic) | Arabic            | IndoPak → Noto Nastaliq Urdu → Noto Naskh Arabic |
| English          | Latin             | Georgia → Times New Roman → serif                |
| Urdu             | Arabic (Nastaliq) | Noto Nastaliq Urdu → Jameel Noori Nastaleeq      |
| Hindi            | Devanagari        | Noto Sans Devanagari → Mangal                    |

## Font Sources

### Self-Hosted Fonts

| Font    | Location                               | Format | Size |
| ------- | -------------------------------------- | ------ | ---- |
| IndoPak | `public/fonts/indopak-nastaleeq.woff2` | WOFF2  | ~2MB |

### Google Fonts (CDN)

Loaded from Google Fonts CDN via `index.html`:

| Font                 | Weights  | Used For                     |
| -------------------- | -------- | ---------------------------- |
| Amiri Quran          | Regular  | Arabic (fallback)            |
| Noto Naskh Arabic    | 400, 600 | Arabic (fallback)            |
| Noto Nastaliq Urdu   | 400, 600 | Urdu text, Arabic (fallback) |
| Noto Sans Devanagari | 400, 600 | Hindi text                   |

## File Locations

| File                                       | Purpose                                  |
| ------------------------------------------ | ---------------------------------------- |
| `index.html`                               | Google Fonts link, font preloading       |
| `src/components/QuranVerse/QuranVerse.css` | @font-face for IndoPak, font assignments |
| `src/styles/variables.css`                 | CSS custom properties for font families  |
| `public/fonts/`                            | Self-hosted font files                   |
| `vite.config.ts`                           | PWA caching for Google Fonts             |

## Configuration Details

### Font Preloading (index.html)

```html
<!-- Line 61: Preload the main Arabic font -->
<link
  rel="preload"
  href="/quranic-prayers/fonts/indopak-nastaleeq.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

**Purpose**: Preloading tells the browser to fetch this critical font early, reducing FOUT (Flash of Unstyled Text).

**To modify**: Update the `href` if you rename or move the font file.

---

### Google Fonts Import (index.html)

```html
<!-- Lines 64-70: Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Noto+Naskh+Arabic:wght@400;600&family=Noto+Nastaliq+Urdu:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

**Purpose**: Load web fonts from Google Fonts CDN.

**To modify**: Add/remove font families or weights from the URL.

---

### @font-face Declaration (QuranVerse.css)

```css
/* Lines 8-12 */
@font-face {
  font-family: "IndoPak";
  src:
    local("AlQuran IndoPak by QuranWBW"),
    url("/fonts/indopak-nastaleeq.woff2") format("woff2");
  font-display: swap;
}
```

| Property          | Value                            | Purpose                          |
| ----------------- | -------------------------------- | -------------------------------- |
| `font-family`     | "IndoPak"                        | Name to reference in CSS         |
| `src: local(...)` | "AlQuran IndoPak by QuranWBW"    | Use system font if installed     |
| `src: url(...)`   | "/fonts/indopak-nastaleeq.woff2" | Fall back to hosted file         |
| `font-display`    | swap                             | Show fallback text while loading |

**To modify**: Update paths or add additional `src` entries for other formats.

---

### Font Stacks (QuranVerse.css)

#### Arabic Text

```css
.qv-arabic-text,
.qv-wbw-arabic {
  font-family: "IndoPak", "Noto Nastaliq Urdu", "Noto Naskh Arabic", serif;
}
```

**Fallback order**:

1. **IndoPak** — Self-hosted, optimized for Quranic text
2. **Noto Nastaliq Urdu** — Google Fonts, Nastaliq style
3. **Noto Naskh Arabic** — Google Fonts, Naskh style
4. **serif** — System serif fallback

#### Urdu Translation

```css
.qv-lang-ur {
  font-family:
    "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Mehr Nastaliq", sans-serif;
}
```

#### Hindi Translation

```css
.qv-lang-hi {
  font-family: "Noto Sans Devanagari", "Mangal", sans-serif;
}
```

#### English Translation

```css
.qv-lang-en {
  font-family: "Georgia", "Times New Roman", serif;
}
```

---

### CSS Custom Properties (variables.css)

```css
:root {
  --font-family-base:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  --font-family-arabic:
    "IndoPak", "Noto Nastaliq Urdu", "Noto Naskh Arabic", serif;
  --font-family-urdu:
    "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Mehr Nastaliq", sans-serif;
  --font-family-hindi: "Noto Sans Devanagari", "Mangal", sans-serif;
}
```

---

### PWA Font Caching (vite.config.ts)

```typescript
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'google-fonts-cache', ... }
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'gstatic-fonts-cache', ... }
    }
  ]
}
```

**Purpose**: Cache Google Fonts for offline use via service worker.

---

## Adding a New Font

### Option 1: Self-Hosted Font

1. **Add font file**:

   ```
   public/fonts/my-new-font.woff2
   ```

2. **Add @font-face**:

   ```css
   @font-face {
     font-family: "MyNewFont";
     src: url("/fonts/my-new-font.woff2") format("woff2");
     font-display: swap;
   }
   ```

3. **Preload (optional but recommended)**:

   ```html
   <link
     rel="preload"
     href="/quranic-prayers/fonts/my-new-font.woff2"
     as="font"
     type="font/woff2"
     crossorigin
   />
   ```

4. **Use in CSS**:
   ```css
   .my-element {
     font-family: "MyNewFont", fallback-font, sans-serif;
   }
   ```

### Option 2: Google Fonts

1. **Find font** at [fonts.google.com](https://fonts.google.com)

2. **Update index.html** link:

   ```html
   <link
     href="https://fonts.googleapis.com/css2?family=Existing+Font&family=New+Font:wght@400;700&display=swap"
     rel="stylesheet"
   />
   ```

3. **Use in CSS**:
   ```css
   .my-element {
     font-family: "New Font", fallback-font, sans-serif;
   }
   ```

---

## Replacing the Arabic Font

If you want to use a different font for Arabic text:

1. **Download font** in WOFF2 format (most efficient)

2. **Replace file**:

   ```
   public/fonts/indopak-nastaleeq.woff2 → public/fonts/new-arabic-font.woff2
   ```

3. **Update @font-face** in `QuranVerse.css`:

   ```css
   @font-face {
     font-family: "IndoPak"; /* Keep name or change throughout */
     src: url("/fonts/new-arabic-font.woff2") format("woff2");
     font-display: swap;
   }
   ```

4. **Update preload** in `index.html`:
   ```html
   <link
     rel="preload"
     href="/quranic-prayers/fonts/new-arabic-font.woff2"
     ...
   />
   ```

---

## Font Sizes

Font sizes are set for optimal readability across scripts:

| Element         | Size    | Notes                        |
| --------------- | ------- | ---------------------------- |
| Arabic verses   | 1.8rem  | Normal reading mode          |
| Arabic WBW      | 1.4rem  | Word-by-word mode            |
| Transliteration | 0.85rem | Below Arabic word            |
| English         | 1.15rem | Translation text             |
| Urdu            | 1.2rem  | Slightly larger for Nastaliq |
| Hindi           | 1.15rem | Translation text             |

Adjust in `QuranVerse.css` under the respective class selectors.

---

## Performance Tips

1. **Use WOFF2** — It's the most efficient format (30% smaller than WOFF)

2. **Subset fonts** — If you only use certain characters, subset the font to reduce size

3. **Preload critical fonts** — Only preload fonts used above the fold

4. **Use font-display: swap** — Shows text immediately with fallback font

5. **Cache fonts** — The PWA service worker caches Google Fonts for offline use

---

## Troubleshooting

### Arabic Text Not Displaying

1. Check if `indopak-nastaleeq.woff2` exists in `public/fonts/`
2. Check browser DevTools Network tab for 404 errors
3. Verify the path in @font-face matches the file location

### Wrong Font Style (Naskh instead of Nastaliq)

The font stack falls back from IndoPak → Noto Nastaliq → Noto Naskh. If you see Naskh style:

1. IndoPak font may not be loading — check Network tab
2. Try clearing browser cache

### Urdu/Hindi Text Looks Plain

Google Fonts may be blocked or slow:

1. Check Network tab for Google Fonts requests
2. Try loading the page offline after the fonts have cached

### Font Files Too Large

The IndoPak font is ~2MB. To reduce:

1. Use a font subsetting tool
2. Create a subset with only Quranic characters
3. Consider using only Google Fonts (smaller but different style)

---

## Acknowledgements

- **IndoPak Font**: AlQuran IndoPak by QuranWBW
- **Google Fonts**: Noto font family by Google
- **Font Sources**: [quranwbw.com](https://quranwbw.com), [fonts.google.com](https://fonts.google.com)
