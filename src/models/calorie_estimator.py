"""Turn a predicted dish and the classifier confidence into a calorie and macro
RANGE, never a point estimate.

Method (documented, and a test enforces it):
- base kcal = table mean for the dish.
- spread = table kcal_std * portion_factor. Portion size from a 2D photo is
  unknown, so the band is wide by design.
- if the classifier is unsure of the dish (class_conf below threshold), widen
  the band further, because a wrong dish guess should not look precise.
- low is floored at 0. We always return low < high.
"""
from __future__ import annotations

from src.config import CFG
from src.data.nutrition_table import lookup


def _macro_range(macros: dict, frac: float) -> dict:
    return {k: [round(v * (1 - frac), 1), round(v * (1 + frac), 1)] for k, v in macros.items()}


def estimate(dish: str, class_conf: float) -> dict:
    entry = lookup(dish)
    if entry is None:
        return {
            "dish": dish,
            "kcal_range": [0, 0],
            "macro_range": {},
            "confidence_label": "unknown",
            "limitations_note": "dish not in nutrition table; cannot estimate",
        }

    base = entry["kcal_mean"]
    spread = entry["kcal_std"] * CFG.portion_factor
    macro_frac = 0.25

    low_conf = class_conf < CFG.low_conf_threshold
    if low_conf:
        spread *= CFG.low_conf_widen
        macro_frac *= CFG.low_conf_widen

    low = max(0.0, base - spread)
    high = base + spread
    if high - low < 1.0:
        high = low + 1.0

    return {
        "dish": dish,
        "kcal_range": [round(low), round(high)],
        "macro_range": _macro_range(entry["macros"], macro_frac),
        "confidence_label": "low" if low_conf else "high",
        "limitations_note": "Range, not a point. Portion from a 2D photo is unknown.",
    }
