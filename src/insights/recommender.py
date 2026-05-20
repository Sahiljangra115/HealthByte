"""Turn the strongest honestly-labeled correlation into one concrete, gentle,
non-prescriptive suggestion. Always carries the not-medical-advice disclaimer.
"""
from __future__ import annotations

from src.config import DISCLAIMER

# Human-readable phrasing per feature. Kept simple on purpose.
_NICE = {
    "sugar_g": "higher-sugar days",
    "kcal": "higher-calorie days",
    "protein_g": "higher-protein days",
    "steps": "more active days",
}


def recommend(correlations: list[dict]) -> dict:
    significant = [c for c in correlations if c.get("significant")]
    if not significant:
        return {
            "suggestion": "Not enough signal yet to suggest anything specific. Keep logging.",
            "based_on": None,
            "disclaimer": DISCLAIMER,
        }

    top = significant[0]
    feat_phrase = _NICE.get(top["feature"], top["feature"].replace("_", " "))
    direction = "lower" if top["r"] < 0 else "higher"
    suggestion = (
        f"On {feat_phrase}, your {top['outcome'].replace('_', ' ')} tends to be {direction}. "
        f"You might experiment with adjusting this and keep watching the trend."
    )
    return {
        "suggestion": suggestion,
        "based_on": {"feature": top["feature"], "outcome": top["outcome"], "r": top["r"], "label": top["label"]},
        "disclaimer": DISCLAIMER,
    }
