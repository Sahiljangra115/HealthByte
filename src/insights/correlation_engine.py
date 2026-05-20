"""Correlate nutrition features against biometric outcomes for one user.

Two honesty levers, both required:
- Multiple-comparison correction: testing many feature/outcome pairs inflates
  false positives. We apply Benjamini-Hochberg so the "significant" flag means
  something. (Answer in README: why correct.)
- Every result is labeled "correlation, not causation; n=<sample size>". The
  caller must never present these as causal.
"""
from __future__ import annotations

from itertools import product

import pandas as pd


def correlate(
    user_df: pd.DataFrame,
    nutrition_cols: list[str],
    outcome_cols: list[str],
    alpha: float = 0.05,
    method: str = "spearman",
) -> list[dict]:
    from scipy import stats
    from statsmodels.stats.multitest import multipletests

    pairs = list(product(nutrition_cols, outcome_cols))
    rows: list[dict] = []
    pvals: list[float] = []
    n = len(user_df)

    corr_fn = stats.spearmanr if method == "spearman" else stats.pearsonr
    for feat, out in pairs:
        x = user_df[feat].to_numpy()
        y = user_df[out].to_numpy()
        if n < 3:
            r, p = float("nan"), 1.0
        else:
            r, p = corr_fn(x, y)
        rows.append({"feature": feat, "outcome": out, "r": float(r), "p_raw": float(p)})
        pvals.append(float(p))

    if pvals:
        reject, p_adj, _, _ = multipletests(pvals, alpha=alpha, method="fdr_bh")
        for row, rej, padj in zip(rows, reject, p_adj, strict=False):
            row["p_adjusted"] = float(padj)
            row["significant"] = bool(rej)
            row["label"] = f"correlation, not causation; n={n}"

    # Strongest first among the significant ones.
    rows.sort(key=lambda d: (not d["significant"], -abs(d["r"]) if d["r"] == d["r"] else 0))
    return rows
