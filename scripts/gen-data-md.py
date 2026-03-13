"""Generate docs/data.md from src/data.json."""
import json, os

root = os.path.join(os.path.dirname(__file__), "..")
data_path = os.path.join(root, "src", "data.json")
out_path = os.path.join(root, "docs", "data.md")

with open(data_path) as f:
    prayers = json.load(f)

lines = [
    "# Quranic Prayers Data",
    "",
    "Reference table for all prayers in `src/data.json`. Edit this table and use it as the source of truth for AI-assisted updates via `scripts/update-data.py`.",
    "",
    f"**Total: {len(prayers)} prayers**",
    "",
    "| # | Verses | Title | Description | Tags | Partial |",
    "|---|--------|-------|-------------|------|---------|",
]

for i, p in enumerate(prayers, 1):
    title = p["title"].replace("|", "\\|")
    desc = p["description"].replace("|", "\\|")
    tags = ", ".join(p["tags"])
    partial = "Yes" if p.get("partialVerse") else ""
    lines.append(f"| {i} | {p['verses']} | {title} | {desc} | {tags} | {partial} |")

with open(out_path, "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"Written {len(prayers)} rows to {out_path}")
