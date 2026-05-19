"""Population base model: predict a next-day wellbeing proxy (for example sleep
hours or an energy score) from nutrition and activity features.

This is the base that the per-user layer tunes on top of. Gradient boosting is a
sensible default for tabular data. Trained on the population cohort, not on one
user.

    python -m src.models.population_model    # trains on population.parquet
"""
from __future__ import annotations

import numpy as np

from src.config import CFG

FEATURES = ["kcal", "sugar_g", "protein_g", "steps", "prev_sleep_hours"]
TARGET = "next_sleep_hours"


def build_model():
    from sklearn.ensemble import HistGradientBoostingRegressor

    return HistGradientBoostingRegressor(max_depth=4, learning_rate=0.05, random_state=CFG.seed)


def train(df=None):
    import mlflow
    import pandas as pd
    from sklearn.metrics import mean_absolute_error
    from sklearn.model_selection import train_test_split

    if df is None:
        df = pd.read_parquet(CFG.food_manifest.parent / "population.parquet")

    X = df[FEATURES].to_numpy()
    y = df[TARGET].to_numpy()
    Xtr, Xval, ytr, yval = train_test_split(X, y, test_size=0.2, random_state=CFG.seed)

    model = build_model()
    model.fit(Xtr, ytr)
    mae = mean_absolute_error(yval, model.predict(Xval))

    mlflow.set_tracking_uri("file:mlruns")
    with mlflow.start_run(run_name="population-base"):
        mlflow.log_metric("val_mae", float(mae))
    return model, float(mae)


def predict(model, features: dict) -> float:
    x = np.array([[features[f] for f in FEATURES]], dtype=float)
    return float(model.predict(x)[0])
