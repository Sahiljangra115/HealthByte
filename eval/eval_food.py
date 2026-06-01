"""Food classifier eval: top-1 and top-5 accuracy on the held-out test split.

    python -m eval.eval_food
"""
from __future__ import annotations

import pandas as pd
from PIL import Image

from src.config import CFG
from src.models.food_classifier import predict


def evaluate() -> dict:
    df = pd.read_parquet(CFG.food_manifest)
    df = df[df["split"] == "test"]

    top1 = top5 = 0
    for _, row in df.iterrows():
        out = predict(Image.open(row["path"]), top_k=5)
        names = [d["dish"] for d in out["top5"]]
        if names and names[0] == row["dish"]:
            top1 += 1
        if row["dish"] in names:
            top5 += 1
    n = len(df)
    return {"n": n, "top1": top1 / n, "top5": top5 / n}


if __name__ == "__main__":
    print(evaluate())
