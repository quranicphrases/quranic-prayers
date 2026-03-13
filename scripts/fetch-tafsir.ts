/**
 * Tafsir research helper for Quranic Prayers
 *
 * Fetches Ibn Kathir (English) tafsir text for each prayer's first verse
 * from Quran.com API v4 and writes output to a text file for review.
 *
 * Usage: NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/fetch-tafsir.ts
 *
 * Options:
 *   --output <file>   Output file path (default: tafsir-output.txt)
 *   --tafsir <id>     Tafsir resource ID (default: 169 = Ibn Kathir English)
 *   --max-chars <n>   Max chars of tafsir per verse (default: 500)
 *   --list-tafsirs    List all available tafsir IDs and exit
 */

import fs from "node:fs";
import path from "node:path";

// ─── Config ──────────────────────────────────────────────────────────────────

const API_BASE = "https://api.quran.com/api/v4";
const RATE_LIMIT_MS = 200;
const DATA_PATH = path.resolve(__dirname, "../src/data.json");

const args = process.argv.slice(2);

function getArg(flag: string, defaultVal: string): string {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
}

const TAFSIR_ID = getArg("--tafsir", "169");
const OUTPUT_FILE = getArg("--output", "tafsir-output.txt");
const MAX_CHARS = parseInt(getArg("--max-chars", "500"), 10);
const LIST_TAFSIRS = args.includes("--list-tafsirs");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getFirstVerseKey(verses: string): string {
  // "2:285-286" → "2:285", "3:191-194" → "3:191", "2:201" → "2:201"
  const [surah, rest] = verses.split(":");
  const start = rest.split("-")[0];
  return `${surah}:${start}`;
}

// ─── List tafsirs mode ──────────────────────────────────────────────────────

async function listTafsirs() {
  const data = await fetchJson(`${API_BASE}/resources/tafsirs`);
  console.log("Available tafsirs:\n");
  for (const t of data.tafsirs) {
    console.log(`  ID: ${t.id}  |  ${t.language_name}  |  ${t.name}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (LIST_TAFSIRS) {
    await listTafsirs();
    return;
  }

  const prayers = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  console.log(`📖 Found ${prayers.length} prayers`);
  console.log(`📝 Tafsir ID: ${TAFSIR_ID}, max chars: ${MAX_CHARS}\n`);

  const lines: string[] = [];

  for (const prayer of prayers) {
    const verseKey = getFirstVerseKey(prayer.verses);
    process.stdout.write(`  ${prayer.id} ${verseKey} ...`);

    try {
      const data = await fetchJson(
        `${API_BASE}/tafsirs/${TAFSIR_ID}/by_ayah/${verseKey}`
      );
      const raw = data?.tafsir?.text ?? "(no tafsir found)";
      const text = stripHtml(raw);
      const truncated =
        text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) + "..." : text;

      lines.push(`=== ${prayer.id} | ${prayer.verses} | ${prayer.title} ===`);
      lines.push(truncated);
      lines.push("");

      console.log(` ✅ (${text.length} chars)`);
    } catch (err: any) {
      lines.push(`=== ${prayer.id} | ${prayer.verses} | ${prayer.title} ===`);
      lines.push(`ERROR: ${err.message}`);
      lines.push("");
      console.log(` ❌ ${err.message}`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");
  console.log(`\n✅ Written to ${OUTPUT_FILE} (${lines.length} lines)`);
}

main().catch(console.error);
