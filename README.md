# Quranic Prayers

A collection of ~68 supplications (duas) from the Holy Quran, rendered with Arabic text (IndoPak script), word-by-word translation, and English/Urdu/Hindi translations.

**Fully static, offline-capable PWA — no runtime API calls.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

## Features

- **Arabic Text**: IndoPak script with verse numbering in Arabic numerals
- **Word-by-Word**: Toggle to see each word's translation and transliteration
- **3 Translations**: English (Sahih International), Urdu (Dr. Israr Ahmad), Hindi (Maulana Azizul Haque)
- **Tag Filtering**: Filter prayers by category (OR logic — any matching tag)
- **Language Toggle**: Show/hide individual translations
- **Offline Support**: PWA with service worker — works without internet
- **Link to Quran.com**: Each prayer links to Quran.com for audio, tafsir, etc.
- **Responsive Design**: Works on all devices from Galaxy Z Fold to ultrawide monitors

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Scripts

| Script               | Description                                 |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Start development server (Vite)             |
| `npm run build`      | Type-check + production build → `dist/`     |
| `npm run preview`    | Preview production build locally            |
| `npm run fetch-data` | Fetch/enrich prayer data from Quran.com API |
| `npm run lint`       | Run ESLint for code quality checks          |

## Project Structure

```
quranic-prayers/
├── docs/
│   └── archive/              # Archived planning documents
├── public/
│   ├── fonts/
│   │   └── indopak-nastaleeq.woff2  # Self-hosted Arabic font
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── fetch-prayer-data.ts  # Data enrichment script
├── src/
│   ├── components/           # React components
│   │   ├── BottomSheet/      # Mobile settings panel
│   │   ├── FilterDrawer/     # Desktop settings drawer
│   │   ├── FilterSection/    # Tag filter chips
│   │   ├── FloatingControls/ # FAB for opening settings
│   │   ├── NoResults/        # Empty state
│   │   ├── PrayerCard/       # Individual prayer display
│   │   ├── QuranVerse/       # Arabic + translations renderer
│   │   ├── ReadingControls/  # WBW and language toggles
│   │   └── TabGroup/         # Reusable tab navigation
│   ├── constants/            # Shared constants
│   │   ├── breakpoints.ts    # Responsive breakpoints
│   │   ├── languages.ts      # Language definitions
│   │   └── index.ts          # Barrel export
│   ├── hooks/
│   │   └── usePrayerFilters.ts  # Filter logic hook
│   ├── styles/
│   │   └── variables.css     # CSS custom properties
│   ├── types/
│   │   └── prayer.ts         # TypeScript interfaces
│   ├── utils/
│   │   ├── quranHelpers.ts   # Quran text utilities
│   │   └── index.ts          # Barrel export
│   ├── App.tsx               # Main application component
│   ├── App.css               # Global styles
│   ├── data.json             # Enriched prayer data (~400KB)
│   ├── index.css             # CSS reset
│   └── main.tsx              # Application entry point
├── index.html                # HTML template with SEO meta tags
├── vite.config.ts            # Vite configuration (PWA, etc.)
├── package.json
├── SEO.md                    # SEO documentation
├── FETCH-SCRIPT.md           # Data fetching documentation
└── FONTS.md                  # Font configuration documentation
```

## Components

### Component Overview

| Component          | Location                           | Description                                 |
| ------------------ | ---------------------------------- | ------------------------------------------- |
| `App`              | `src/App.tsx`                      | Main app container, state management        |
| `PrayerCard`       | `src/components/PrayerCard/`       | Prayer display with title, tags, QuranVerse |
| `QuranVerse`       | `src/components/QuranVerse/`       | Arabic text + translations renderer         |
| `FilterSection`    | `src/components/FilterSection/`    | Tag filter chips                            |
| `FilterDrawer`     | `src/components/FilterDrawer/`     | Desktop settings sidebar                    |
| `BottomSheet`      | `src/components/BottomSheet/`      | Mobile settings bottom sheet                |
| `FloatingControls` | `src/components/FloatingControls/` | Floating action button                      |
| `ReadingControls`  | `src/components/ReadingControls/`  | WBW toggle + language checkboxes            |
| `TabGroup`         | `src/components/TabGroup/`         | Reusable tab navigation                     |
| `NoResults`        | `src/components/NoResults/`        | Empty state when no filters match           |

### Component Props

#### PrayerCard

| Prop               | Type                    | Default  | Description                             |
| ------------------ | ----------------------- | -------- | --------------------------------------- |
| `prayer`           | `Prayer`                | required | Prayer data object                      |
| `isVisible`        | `boolean`               | required | Whether card is visible (for filtering) |
| `serialNumber`     | `number`                | required | Display number in list                  |
| `showWordByWord`   | `boolean`               | `false`  | Enable word-by-word mode                |
| `visibleLanguages` | `Set<Language>`         | all      | Languages to display                    |
| `onToggleTag`      | `(tag: string) => void` | required | Tag click handler                       |
| `selectedTags`     | `Set<string>`           | required | Currently selected tags                 |

#### QuranVerse

| Prop               | Type             | Default  | Description                     |
| ------------------ | ---------------- | -------- | ------------------------------- |
| `content`          | `VerseContent[]` | required | Array of verse data             |
| `surahName`        | `string`         | -        | Surah name for display          |
| `surahNumber`      | `number`         | -        | Surah number for Quran.com link |
| `verseRange`       | `string`         | -        | Verse range (e.g., "1:2-7")     |
| `showWordByWord`   | `boolean`        | `false`  | Enable word-by-word mode        |
| `visibleLanguages` | `Set<Language>`  | all      | Languages to display            |

#### ReadingControls

| Prop                 | Type                       | Default           | Description                 |
| -------------------- | -------------------------- | ----------------- | --------------------------- |
| `wordByWord`         | `boolean`                  | required          | Current WBW state           |
| `onWordByWordChange` | `(value: boolean) => void` | required          | WBW toggle handler          |
| `visibleLanguages`   | `Set<Language>`            | required          | Currently visible languages |
| `onToggleLanguage`   | `(lang: Language) => void` | required          | Language toggle handler     |
| `readingModeLabel`   | `string`                   | `"Reading Mode:"` | Label text                  |
| `translationsLabel`  | `string`                   | `"Translations:"` | Label text                  |

#### TabGroup

| Prop          | Type                      | Default           | Description              |
| ------------- | ------------------------- | ----------------- | ------------------------ |
| `tabs`        | `Tab[]`                   | required          | Array of `{ id, label }` |
| `activeTab`   | `string`                  | required          | Currently active tab ID  |
| `onTabChange` | `(tabId: string) => void` | required          | Tab change handler       |
| `className`   | `string`                  | `""`              | Additional CSS class     |
| `ariaLabel`   | `string`                  | `"Settings tabs"` | Accessibility label      |

#### BottomSheet

| Prop          | Type                    | Default         | Description           |
| ------------- | ----------------------- | --------------- | --------------------- |
| `isOpen`      | `boolean`               | required        | Whether sheet is open |
| `onClose`     | `() => void`            | required        | Close handler         |
| `title`       | `string`                | `"Settings"`    | Header title          |
| `children`    | `ReactNode`             | required        | Content to render     |
| `activeTab`   | `string`                | `"filters"`     | Current tab ID        |
| `onTabChange` | `(tab: string) => void` | -               | Tab change handler    |
| `showTabs`    | `boolean`               | `true`          | Whether to show tabs  |
| `tabs`        | `Tab[]`                 | filters/reading | Tab configuration     |

#### FilterDrawer

| Prop           | Type                    | Default      | Description               |
| -------------- | ----------------------- | ------------ | ------------------------- |
| `isOpen`       | `boolean`               | required     | Whether drawer is open    |
| `onClose`      | `() => void`            | required     | Close handler             |
| `allTags`      | `string[]`              | required     | All available tags        |
| `selectedTags` | `Set<string>`           | required     | Currently selected tags   |
| `onToggleTag`  | `(tag: string) => void` | required     | Tag toggle handler        |
| `onClearAll`   | `() => void`            | required     | Clear filters handler     |
| `visibleCount` | `number`                | required     | Number of visible prayers |
| `totalCount`   | `number`                | required     | Total number of prayers   |
| `title`        | `string`                | `"Settings"` | Header title              |

## Architecture

### Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ src/data.json   │────▶│ App.tsx (state)  │────▶│ PrayerCard      │
│ (enriched data) │     │ - wordByWord     │     │ └── QuranVerse  │
└─────────────────┘     │ - visibleLangs   │     └─────────────────┘
                        │ - selectedTags   │
                        └──────────────────┘
```

### State Management

- **No external state library** — React `useState` + custom hooks
- **`usePrayerFilters` hook**: Manages tag filtering with OR logic
- **Props drilling**: Settings state passed from App to children

### Performance Optimizations

- **Zero iframes**: All content rendered as plain DOM
- **Zero runtime API calls**: Data bundled in static JSON
- **Instant toggles**: CSS-only, no re-fetch
- **Instant filtering**: `display: none` on cards, no unmount/remount
- **Memoized components**: `React.memo` with custom comparators
- **PWA caching**: Service worker caches all assets

## CSS Configuration

### CSS Variables

All design tokens are defined in `src/styles/variables.css`:

```css
:root {
  /* Colors */
  --primary-color: #333333;
  --text-primary: #272727;
  --text-secondary: #555555;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --border-color: #e0e0e0;

  /* Shadows */
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 4px 16px rgba(0, 0, 0, 0.12);

  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 25px;
}
```

### Responsive Breakpoints

| Breakpoint | Target                             |
| ---------- | ---------------------------------- |
| `≤344px`   | Galaxy Z Fold (folded)             |
| `≤375px`   | Small phones                       |
| `≤480px`   | Regular phones                     |
| `≤599px`   | Mobile (uses BottomSheet)          |
| `≥600px`   | Tablet/Desktop (uses FilterDrawer) |
| `≥1200px`  | Wide screens                       |
| `≥1600px`  | Ultra-wide                         |
| `≥2400px`  | Super ultra-wide                   |
| `≥3400px`  | Multi-column layout                |

## Adding New Prayers

1. Add an entry to `src/data.json`:

   ```json
   {
     "id": "p69",
     "title": "Prayer Title",
     "tags": ["Guidance", "Protection"],
     "description": "Description of the prayer...",
     "verses": "2:201"
   }
   ```

2. Run the fetch script to enrich with Arabic text and translations:

   ```bash
   npm run fetch-data
   ```

3. Rebuild:
   ```bash
   npm run build
   ```

See [FETCH-SCRIPT.md](FETCH-SCRIPT.md) for detailed documentation.

## Deployment

### GitHub Pages

The app is configured for GitHub Pages deployment at `/quranic-prayers/`.

```bash
# Build for production
npm run build

# Deploy using gh-pages (or configure GitHub Actions)
npx gh-pages -d dist
```

### Environment Variables

The base path is configured in `vite.config.ts`:

```ts
base: "/quranic-prayers/";
```

## Related Documentation

- [SEO.md](SEO.md) - SEO configuration and modification guide
- [FETCH-SCRIPT.md](FETCH-SCRIPT.md) - Data fetching script documentation
- [FONTS.md](FONTS.md) - Font configuration and usage

## Acknowledgements

- **[Quran.com](https://quran.com)** - Arabic text, word-by-word data, and translations via their API
- **Translations**:
  - English: Sahih International
  - Urdu: Dr. Israr Ahmad
  - Hindi: Maulana Azizul Haque al-Umari
- **Fonts**: Google Fonts (Noto Naskh Arabic, Noto Nastaliq Urdu, Noto Sans Devanagari)

## License

MIT License - see [LICENSE](LICENSE) for details.
