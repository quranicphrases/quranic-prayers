#!/usr/bin/env python3
"""
extract_failed_audits.py

Reads a Lighthouse JSON report (LHR) and writes out only the failed, actionable audits
— audits with scoreDisplayMode == "numeric" and score == 0 — excluding audits with
scoreDisplayMode in {"notApplicable", "informative", "manual", "error"}.

Usage:
  python extract_failed_audits.py <relative_input_json_path> <relative_output_json_path>

Example:
  python extract_failed_audits.py ./report.json ./failed_audits.json
"""

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List

ACTIONABLE_SCORE_MODES = {"numeric"}
NON_ACTIONABLE_SCORE_MODES = {"notApplicable", "informative", "manual", "error"}


def build_auditid_to_category(lhr: Dict[str, Any]) -> Dict[str, str]:
    mapping: Dict[str, str] = {}
    categories = lhr.get("categories") or {}
    for cat_key, cat_val in categories.items():
        for ref in cat_val.get("auditRefs", []) or []:
            audit_id = ref.get("id")
            if audit_id:
                mapping[audit_id] = cat_key
    return mapping


def is_failed_actionable_audit(audit: Dict[str, Any]) -> bool:
    """Return True for numeric audits that have a failing score (== 0)."""
    mode = audit.get("scoreDisplayMode", "numeric") or "numeric"
    if mode in NON_ACTIONABLE_SCORE_MODES:
        return False
    if mode not in ACTIONABLE_SCORE_MODES:
        return False
    score = audit.get("score", 1)
    # Some audits can have null score; treat as not failed unless explicitly 0
    return (score or 0) < 1


def extract_failed_audits(lhr: Dict[str, Any]) -> List[Dict[str, Any]]:
    audits = lhr.get("audits") or {}
    audit_to_category = build_auditid_to_category(lhr)

    failed = []
    for aid, a in audits.items():
        if is_failed_actionable_audit(a):
            item: Dict[str, Any] = {
                "id": aid,
                "title": a.get("title"),
                "score": a.get("score"),
                "displayValue": a.get("displayValue"),
                "explanation": a.get("explanation"),
                "description": a.get("description"),
                "category": audit_to_category.get(aid),
            }
            # Include helpful details if present (e.g., items/opportunities/nodes)
            details = a.get("details")
            if isinstance(details, dict):
                # Avoid dumping huge blobs; pick meaningful keys if available
                subset = {}
                for key in ("type", "items", "overallSavingsMs", "overallSavingsBytes", "headings", "nodes"):
                    if key in details:
                        subset[key] = details[key]
                if subset:
                    item["details"] = subset
            failed.append(item)

    # Sort for stability
    failed.sort(key=lambda x: (x.get("category") or "zz_other", x.get("title") or ""))
    return failed


def main() -> None:
    parser = argparse.ArgumentParser(description=(
        "Extract only failed, actionable Lighthouse audits (numeric score == 0). "
        "Input and output paths may be relative."
    ))
    parser.add_argument("input_json", help="Relative path to Lighthouse JSON report")
    parser.add_argument("output_json", help="Relative path to write failed audits JSON")
    args = parser.parse_args()

    in_path = Path(args.input_json)
    out_path = Path(args.output_json)

    if not in_path.exists():
        raise SystemExit(f"Input file not found: {in_path}")

    with in_path.open("r", encoding="utf-8") as f:
        lhr = json.load(f)

    failed = extract_failed_audits(lhr)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(failed, f, ensure_ascii=False, indent=2)

    # Print the relative path that was requested
    print(str(out_path))


if __name__ == "__main__":
    main()