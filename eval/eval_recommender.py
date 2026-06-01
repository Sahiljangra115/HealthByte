"""Recommender sanity checks: no absurd or unsafe advice, the disclaimer is
always present, and the calorie estimator never returns a point.

    python -m eval.eval_recommender
"""
from __future__ import annotations

from src.config import DISCLAIMER
from src.insights.recommender import recommend
from src.models.calorie_estimator import estimate

# Words that would signal prescriptive medical advice we must never give.
BANNED = ("cure", "diagnose", "prescribe", "guaranteed", "must stop", "medication")


def check() -> dict:
    problems: list[str] = []

    # Estimator never returns a point.
    est = estimate("pizza", class_conf=0.9)
    low, high = est["kcal_range"]
    if not low < high:
        problems.append("calorie estimate is a point, not a range")

    # Recommendation always carries the disclaimer and avoids banned phrasing.
    for corr in ([], [{"feature": "sugar_g", "outcome": "sleep_hours", "r": -0.7, "significant": True, "label": "n=20"}]):
        rec = recommend(corr)
        if rec["disclaimer"] != DISCLAIMER:
            problems.append("missing disclaimer")
        if any(b in rec["suggestion"].lower() for b in BANNED):
            problems.append(f"unsafe phrasing: {rec['suggestion']}")

    return {"ok": not problems, "problems": problems}


if __name__ == "__main__":
    out = check()
    print(out)
    assert out["ok"], out["problems"]
