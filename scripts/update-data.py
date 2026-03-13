"""
Batch update script for data.json prayer metadata.

Reads src/data.json, applies bulk changes (removals, metadata updates,
new entries, re-sorting, re-numbering), and writes back.

Usage: python3 scripts/update-data.py

Workflow:
  1. Edit the REMOVE_IDS, UPDATES, and NEW_PRAYERS sections below
  2. Run the script
  3. Run `NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/fetch-prayer-data.ts`
     to enrich any prayers that had content deleted or were newly added
  4. Run `npm run build` to verify

Notes:
  - Set delete_content=True in an update when the verse range changes,
    so the fetch script will re-fetch the correct verses.
  - Prayers are re-sorted by surah:verse and re-numbered sequentially.
  - The script is idempotent per run but not reversible — back up data.json first.
"""
import json
import sys
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data.json")

# ──────────────────────────────────────────────────────────
# CONFIGURE THESE SECTIONS FOR EACH UPDATE
# ──────────────────────────────────────────────────────────

# 1. IDs to remove
REMOVE_IDS: set[str] = set()
# Example: {"p12", "p16", "p23"}

# 2. Metadata updates for existing prayers
#    Keys: title, description, tags (required)
#    Optional: verses (changes verse ref), delete_content (bool),
#              partialVerse (str or None to remove)
UPDATES: dict[str, dict] = {}
# Example:
# UPDATES = {
#     "p1": {
#         "title": "Al-Fatiha — The Opening",
#         "description": "The opening chapter...",
#         "tags": ["Guidance", "Praising Allah"],
#         "verses": "1:1-7",        # only if changing verse range
#         "delete_content": True,    # set when verse range changes
#     },
# }

# 3. New prayers to add (metadata only — fetch script adds content)
NEW_PRAYERS: list[dict] = []
# Example:
# NEW_PRAYERS = [
#     {
#         "id": "p_new",  # temporary; gets renumbered
#         "title": "Prayer Title",
#         "tags": ["Tag1", "Tag2"],
#         "description": "Description text.",
#         "verses": "2:286",
#         "partialVerse": "The prayer is the relevant portion of this verse.",  # optional
#     },
# ]


# ──────────────────────────────────────────────────────────
# SCRIPT LOGIC — usually no need to edit below
# ──────────────────────────────────────────────────────────

def sort_key(p: dict) -> tuple[int, int]:
    """Sort by surah number, then starting ayah."""
    v = p.get("verses", "999:999")
    parts = v.split(":")
    surah = int(parts[0])
    ayah_str = parts[1].split("-")[0] if len(parts) > 1 else "0"
    ayah = int(ayah_str)
    return (surah, ayah)


def main():
    with open(DATA_PATH) as f:
        prayers = json.load(f)

    original_count = len(prayers)

    # Remove
    if REMOVE_IDS:
        prayers = [p for p in prayers if p["id"] not in REMOVE_IDS]
        print(f"Removed: {', '.join(sorted(REMOVE_IDS))}")

    # Update metadata
    for p in prayers:
        pid = p["id"]
        if pid in UPDATES:
            u = UPDATES[pid]
            p["title"] = u["title"]
            p["description"] = u["description"]
            p["tags"] = u["tags"]
            if "verses" in u:
                p["verses"] = u["verses"]
            if "partialVerse" in u:
                if u["partialVerse"] is None:
                    p.pop("partialVerse", None)
                else:
                    p["partialVerse"] = u["partialVerse"]
            if u.get("delete_content"):
                p.pop("content", None)
                p.pop("surahName", None)
                p.pop("surahNumber", None)
    if UPDATES:
        print(f"Updated: {len(UPDATES)} prayers")

    # Add new
    prayers.extend(NEW_PRAYERS)
    if NEW_PRAYERS:
        print(f"Added:   {len(NEW_PRAYERS)} new prayers")

    # Sort and renumber
    prayers.sort(key=sort_key)
    for i, p in enumerate(prayers, 1):
        p["id"] = f"p{i}"

    # Write
    with open(DATA_PATH, "w") as f:
        json.dump(prayers, f, indent=2, ensure_ascii=False)

    # Summary
    has_content = sum(1 for p in prayers if p.get("content"))
    no_content = sum(1 for p in prayers if not p.get("content"))

    print(f"\n✅ {original_count} → {len(prayers)} prayers written to {DATA_PATH}")
    print(f"   With content: {has_content}")
    print(f"   Needs fetch:  {no_content}")

    if no_content:
        print("\nPrayers needing content fetch:")
        for p in prayers:
            if not p.get("content"):
                print(f"  {p['id']:>4}  {p['verses']:>12}  {p['title']}")


if __name__ == "__main__":
    main()
