"""Per-user tuning layer on top of the population base model.

Why not train a model per user from scratch: a user has a handful of days of
data. You cannot honestly fit a model on 7 points. Instead we keep the strong
population base and learn one cheap per-user correction: the mean residual
(systematic offset) between what the base predicted and what actually happened
for this user, shrunk toward zero when the user has few observations.

This is the honest real-world approach and is documented in the README.
"""
from __future__ import annotations

import numpy as np


def fit_user_offset(base_preds: np.ndarray, actuals: np.ndarray, shrink: float = 3.0) -> float:
    """Shrunk mean residual. With n observations, the offset is the mean
    residual scaled by n / (n + shrink), so a user with 2 days barely moves the
    base, a user with 30 days moves it almost fully."""
    base_preds = np.asarray(base_preds, dtype=float)
    actuals = np.asarray(actuals, dtype=float)
    n = len(actuals)
    if n == 0:
        return 0.0
    resid = float((actuals - base_preds).mean())
    return resid * (n / (n + shrink))


def tune(base_pred: float, user_offset: float) -> float:
    return base_pred + user_offset
