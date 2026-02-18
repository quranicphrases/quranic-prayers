# Fetch Prayer Data Script

This document explains how to use the `fetch-prayer-data.ts` script to enrich prayer data with Arabic text, word-by-word translations, and multilingual translations from the Quran.com API.

## Overview

The script reads prayer metadata from `src/data.json` and enriches each prayer with:

- Arabic text (IndoPak script)
- Word-by-word data (Arabic word, English translation, transliteration)
- Translations in English, Urdu, and Hindi

**The script is idempotent** — it only fetches data for prayers missing the `content` array.

## Prerequisites

- Node.js 18+ (uses native fetch)
- TypeScript (via tsx for direct execution)

## Usage

```bash
# Run the fetch script
npm run fetch-data

# Or directly with npx
npx tsx scripts/fetch-prayer-data.ts
```

## Input: src/data.json

The script reads prayers from `src/data.json`. Each prayer needs these **required fields**:

```json
{
  "id": "p1",
  "title": "Al-Fatiha - The Opening",
  "tags": ["Guidance"],
  "description": "The opening chapter of the Quran...",
  "verses": "1:2-7"
}
```

### Field Descriptions

| Field          | Type     | Required | Description                          |
| -------------- | -------- | -------- | ------------------------------------ |
| `id`           | string   | Yes      | Unique identifier (e.g., "p1", "p2") |
| `title`        | string   | Yes      | Display title                        |
| `tags`         | string[] | Yes      | Category tags for filtering          |
| `description`  | string   | Yes      | Prayer description/context           |
| `verses`       | string   | Yes      | Quran reference (see format below)   |
| `partialVerse` | string   | No       | Note about partial verses            |

### Verse Reference Format

The `verses` field supports these formats:

| Format       | Example   | Description                 |
| ------------ | --------- | --------------------------- |
| Single verse | `"2:201"` | Surah 2, verse 201          |
| Verse range  | `"1:2-7"` | Surah 1, verses 2 through 7 |

## Output: Enriched Data

After running, each prayer is enriched with additional fields:

```json
{
  "id": "p1",
  "title": "Al-Fatiha - The Opening",
  "tags": ["Guidance"],
  "description": "...",
  "verses": "1:2-7",
  "surahName": "Al-Fatiha",
  "surahNumber": 1,
  "content": [
    {
      "verseKey": "1:2",
      "verseNumber": 2,
      "textIndopak": "اَلۡحَمۡدُ لِلّٰهِ رَبِّ الۡعٰلَمِيۡنَۙ‏",
      "isPartOfPrayer": true,
      "words": [
        {
          "textIndopak": "اَلۡحَمۡدُ",
          "translation": "All praises and thanks",
          "transliteration": "al-ḥamdu"
        }
      ],
      "translations": {
        "english": {
          "text": "[All] praise is [due] to Allāh...",
          "translator": "Sahih International"
        },
        "urdu": {
          "text": "کل شکر اور کل ثنا اللہ کے لیے ہے...",
          "translator": "Dr. Israr Ahmad"
        },
        "hindi": {
          "text": "हर प्रकार की प्रशंसा उस अल्लाह के लिए है...",
          "translator": "Maulana Azizul Haque al-Umari"
        }
      }
    }
  ]
}
```

## Configuration

Configuration options are defined at the top of `scripts/fetch-prayer-data.ts`:

### API Endpoints

```typescript
const API_BASE = "https://api.quran.com/api/v4";
```

The script uses these Quran.com API v4 endpoints:

- `/verses/by_key/{verseKey}` — Arabic text and word-by-word data
- `/quran/translations/{id}` — Translation text

### Translation IDs

```typescript
const TRANSLATION_IDS = {
  english: 20, // Sahih International
  urdu: 158, // Dr. Israr Ahmad
  hindi: 122, // Maulana Azizul Haque al-Umari
} as const;
```

To use different translations:

1. Find translation IDs at [quran.com](https://quran.com) (inspect network requests)
2. Update the `TRANSLATION_IDS` object
3. Update `TRANSLATOR_NAMES` to match

### Popular Translation IDs

| Language   | ID  | Translator                          |
| ---------- | --- | ----------------------------------- |
| English    | 20  | Sahih International                 |
| English    | 131 | Dr. Mustafa Khattab                 |
| English    | 85  | Abdul Haleem                        |
| Urdu       | 158 | Dr. Israr Ahmad                     |
| Urdu       | 97  | Fateh Muhammad Jalandhari           |
| Hindi      | 122 | Maulana Azizul Haque                |
| Indonesian | 33  | Indonesian Islamic Affairs Ministry |
| Turkish    | 77  | Diyanet İşleri                      |

### Rate Limiting

```typescript
const RATE_LIMIT_MS = 150; // ms between API calls
```

The script waits 150ms between API calls to avoid rate limiting. Increase this if you encounter errors.

### Surah Names

```typescript
const SURAH_NAMES: Record<number, string> = {
  1: "Al-Fatiha",
  2: "Al-Baqarah",
  // ... all 114 surahs
};
```

Surah names are looked up locally — no API call needed.

## Adding New Prayers

### Step 1: Add Prayer Metadata

Add a new entry to `src/data.json`:

```json
{
  "id": "p69",
  "title": "Prayer for Protection",
  "tags": ["Protection", "Safety"],
  "description": "A prayer seeking Allah's protection...",
  "verses": "113:1-5"
}
```

### Step 2: Run Fetch Script

```bash
npm run fetch-data
```

The script will:

1. Detect the new prayer (missing `content` array)
2. Fetch Arabic text and word-by-word from API
3. Fetch all three translations
4. Write enriched data back to `src/data.json`

### Step 3: Verify

Check the enriched data in `src/data.json`.

### Step 4: Rebuild

```bash
npm run build
```

## Handling Partial Verses

Some prayers include only part of a verse. Use `partialVerse` to add a note:

```json
{
  "id": "p50",
  "title": "Prayer for Knowledge",
  "tags": ["Knowledge"],
  "description": "...",
  "verses": "20:25-28",
  "partialVerse": "This prayer is the portion relevant to seeking knowledge from a longer passage."
}
```

The entire verse is still fetched, but you can mark specific content as `isPartOfPrayer: false` manually if needed.

## Troubleshooting

### Rate Limit Errors

If you see HTTP 429 errors:

1. Increase `RATE_LIMIT_MS` to 200 or more
2. Wait a few minutes before retrying

### Missing Translations

The script logs warnings for missing translations:

```
⚠ No translation found for 2:201 (ID 158)
```

This can happen if a translation doesn't cover certain verses. The prayer will still work with available translations.

### Network Errors

If the script fails mid-run:

- It's safe to re-run — already-enriched prayers are skipped
- Progress is saved after each prayer

### Invalid Verse Reference

If you see `Invalid verse reference: ...`:

- Check the `verses` field format
- Must be `surah:verse` or `surah:start-end`
- Example: `"2:201"` or `"1:2-7"`

## API Reference

The script uses the [Quran.com API v4](https://api-docs.quran.com/).

**Verse Endpoint:**

```
GET /verses/by_key/{verseKey}?language=en&words=true&word_fields=text_indopak,translation,transliteration&fields=text_indopak
```

**Translation Endpoint:**

```
GET /quran/translations/{translation_id}?verse_key={verseKey}
```

## Script Output Example

```
📖 Found 68 prayers in data.json

🔄 Fetching: Al-Fatiha - The Opening (1:2-7)
  📥 Verse 1:2...
  📥 Verse 1:3...
  📥 Verse 1:4...
  📥 Verse 1:5...
  📥 Verse 1:6...
  📥 Verse 1:7...
  ✅ Done (6 verse(s))

════════════════════════════════════════
✅ Fetched: 1 prayers
⏭️  Skipped: 67 (already enriched)
📁 Written to: /path/to/src/data.json
📏 File size: 420.5 KB
```

## Acknowledgements

Data sourced from [Quran.com](https://quran.com) API. We are grateful for their service.

**Translations:**

- English: Sahih International
- Urdu: Dr. Israr Ahmad
- Hindi: Maulana Azizul Haque al-Umari
