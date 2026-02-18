# SEO Documentation

This document explains the SEO implementation in the Quranic Prayers app and provides guidance on how to modify SEO-related configuration.

## Overview

The app implements several SEO best practices:

- Meta tags for search engines
- Open Graph tags for social sharing
- Twitter Card tags
- JSON-LD structured data
- Sitemap and robots.txt
- Semantic HTML and accessibility

## File Locations

| File                 | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `index.html`         | Main SEO meta tags, Open Graph, Twitter Cards, JSON-LD |
| `public/sitemap.xml` | XML sitemap for search engines                         |
| `public/robots.txt`  | Search engine crawl directives                         |
| `vite.config.ts`     | PWA manifest with app metadata                         |

---

## index.html - SEO Tags Explained

### Basic Meta Tags

```html
<!-- Line 7: Page Title -->
<title>Quranic Prayers - Supplications from the Holy Quran</title>
```

**Purpose**: The title appears in browser tabs and search results. Keep it under 60 characters.

**To modify**: Update the text between `<title>` tags.

---

```html
<!-- Lines 10-13: Meta Description -->
<meta
  name="description"
  content="Collection of Quranic prayers (duas) with Arabic text, word-by-word translation, and translations in English, Urdu, and Hindi."
/>
```

**Purpose**: Search engines display this in results (up to ~160 characters). Should summarize the page content.

**To modify**: Update the `content` attribute.

---

```html
<!-- Lines 14-17: Meta Keywords -->
<meta
  name="keywords"
  content="Quran, prayers, dua, supplication, Arabic, English, Urdu, Hindi, word by word"
/>
```

**Purpose**: Keywords related to the content. Less important for modern SEO but still useful.

**To modify**: Add/remove keywords in the comma-separated `content` attribute.

---

```html
<!-- Line 18: Author -->
<meta name="author" content="Quranic Prayers" />
```

**Purpose**: Identifies the content author/organization.

**To modify**: Update the `content` attribute.

---

### Open Graph Tags (Social Sharing)

Open Graph tags control how the page appears when shared on Facebook, LinkedIn, WhatsApp, etc.

```html
<!-- Line 21: Content Type -->
<meta property="og:type" content="website" />
```

**Purpose**: Tells social platforms this is a website (not article, video, etc.).

**Values**: `website`, `article`, `book`, `profile`

---

```html
<!-- Lines 22-25: OG Title -->
<meta
  property="og:title"
  content="Quranic Prayers — Supplications from the Holy Quran"
/>
```

**Purpose**: Title displayed in social shares. Can differ from `<title>`.

**To modify**: Update the `content` attribute.

---

```html
<!-- Lines 26-29: OG Description -->
<meta
  property="og:description"
  content="68 Quranic prayers with Arabic text, word-by-word breakdowns, and translations in English, Urdu and Hindi."
/>
```

**Purpose**: Description in social shares. Keep under 200 characters.

**To modify**: Update the `content` attribute. Also update if prayer count changes.

---

```html
<!-- Line 30: OG URL -->
<meta
  property="og:url"
  content="https://quranicphrases.github.io/quranic-prayers/"
/>
```

**Purpose**: Canonical URL for the shared content.

**To modify**: Update with your actual deployment URL.

---

```html
<!-- Line 31: OG Image -->
<meta
  property="og:image"
  content="https://quranicphrases.github.io/quranic-prayers/og-image.png"
/>
```

**Purpose**: Image displayed when shared. Should be 1200×630px for best results.

**To modify**:

1. Create an image at `public/og-image.png` (1200×630px)
2. Update the URL if your domain changes

**⚠️ NOTE**: This image does not currently exist and needs to be created.

---

```html
<!-- Lines 32-34: OG Locales -->
<meta property="og:locale" content="en_US" />
<meta property="og:locale:alternate" content="ur_PK" />
<meta property="og:locale:alternate" content="hi_IN" />
```

**Purpose**: Indicates available languages for the content.

**To modify**: Add/remove locales as needed (format: `language_REGION`).

---

### Twitter Card Tags

Twitter Card tags control how the page appears when shared on Twitter/X.

```html
<!-- Line 37: Card Type -->
<meta name="twitter:card" content="summary_large_image" />
```

**Purpose**: Display style on Twitter.

**Values**: `summary`, `summary_large_image`, `app`, `player`

---

```html
<!-- Lines 38-46: Twitter Title, Description, Image -->
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

**Purpose**: Same as OG equivalents, but specific to Twitter.

**To modify**: Keep in sync with OG tags.

---

### JSON-LD Structured Data

```html
<!-- Lines 49-58: Structured Data -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Quranic Prayers",
    "url": "https://quranicphrases.github.io/quranic-prayers/",
    "description": "Collection of 68 Quranic prayers...",
    "inLanguage": ["en", "ar", "ur", "hi"]
  }
</script>
```

**Purpose**: Helps search engines understand the content structure. Enables rich snippets.

**To modify**:

- Update `name` for site name
- Update `url` for your domain
- Update `description` as needed
- Add/remove languages from `inLanguage` array

**Schema types to consider**:

- `WebSite` (current)
- `ItemList` (for listing prayers)
- `Article` (if you add individual prayer pages)

---

## public/sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://quranicphrases.github.io/quranic-prayers/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Purpose**: Tells search engines what pages exist and when they were updated.

**To modify**:

- `<loc>`: Update URL if domain changes
- `<lastmod>`: Update date when content changes (YYYY-MM-DD format)
- `<changefreq>`: How often content changes (`always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`)
- `<priority>`: Relative importance (0.0 to 1.0)

**To add more pages**: Add another `<url>` block.

---

## public/robots.txt

```
User-agent: *
Allow: /

Sitemap: https://quranicphrases.github.io/quranic-prayers/sitemap.xml
```

**Purpose**: Directives for search engine crawlers.

**To modify**:

- Update `Sitemap:` URL if domain changes
- Add `Disallow: /path/` to block specific paths

---

## vite.config.ts - PWA Manifest

The PWA manifest affects how the app appears when installed:

```ts
manifest: {
  name: "Quranic Prayers",
  short_name: "Prayers",
  description: "Quranic prayers with Arabic text and translations",
  theme_color: "#333333",
  background_color: "#ffffff",
  icons: [...]
}
```

**To modify**:

- `name`: Full app name (shown in install prompts)
- `short_name`: Abbreviated name (shown on home screen)
- `description`: App description
- `theme_color`: Browser toolbar color
- `background_color`: Splash screen background

---

## Missing SEO Elements

### 1. Canonical URL (Recommended)

Add to `index.html` in the `<head>`:

```html
<link
  rel="canonical"
  href="https://quranicphrases.github.io/quranic-prayers/"
/>
```

**Purpose**: Prevents duplicate content issues.

### 2. OG Image (Required)

Create `public/og-image.png`:

- **Dimensions**: 1200×630px
- **Content**: App title, Arabic calligraphy, key visuals
- **Format**: PNG or JPG

### 3. Custom Favicon (Recommended)

Replace `public/vite.svg` with custom favicon:

1. Create favicon at multiple sizes (16×16, 32×32, 180×180)
2. Update `index.html`:
   ```html
   <link
     rel="icon"
     type="image/png"
     sizes="32x32"
     href="/quranic-prayers/favicon-32x32.png"
   />
   <link
     rel="apple-touch-icon"
     sizes="180x180"
     href="/quranic-prayers/apple-touch-icon.png"
   />
   ```

### 4. Prayer Count Sync

The OG description mentions "68 prayers" which should be kept in sync with actual data:

- Update `index.html` lines 27 and 53 when prayer count changes
- Consider automating this in the build process

---

## SEO Checklist

When deploying or updating:

- [ ] Update `<lastmod>` in sitemap.xml
- [ ] Verify all URLs use correct domain
- [ ] Test Open Graph tags with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test Twitter Cards with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Validate structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Check mobile-friendliness with [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools

---

## Changing Domain

If you move to a different domain, update these files:

1. **index.html**:
   - Line 30: `og:url`
   - Line 31: `og:image`
   - Line 46: `twitter:image`
   - Line 55: JSON-LD `url`

2. **public/sitemap.xml**:
   - Line 4: `<loc>`

3. **public/robots.txt**:
   - Line 4: `Sitemap:`

4. **vite.config.ts**:
   - Update `base` if path changes
