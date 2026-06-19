"""Download Food-101 and build a seeded train/val/test manifest.

Food-101 ships an official train/test split. We keep the official test split
untouched (touch it once at the end) and carve a seeded validation slice out of
train. Leakage avoidance: the split is on image id, so the same image never
appears in two splits.

    python -m src.data.prepare_food101
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from src.config import CFG


def build_manifest(val_frac: float = 0.1, out=None) -> pd.DataFrame:
    import torchvision

    out = out or CFG.food_manifest
    CFG.food_manifest.parent.mkdir(parents=True, exist_ok=True)

    rows: list[dict] = []
    for split in ("train", "test"):
        ds = torchvision.datasets.Food101(root=str(CFG.food_manifest.parent), split=split, download=True)
        classes = ds.classes
        for path, label in zip(ds._image_files, ds._labels, strict=False):
            rows.append({"path": str(path), "label": int(label), "dish": classes[label], "orig": split})

    df = pd.DataFrame(rows)
    rng = np.random.default_rng(CFG.seed)
    is_train = df["orig"] == "train"
    u = rng.random(len(df))
    df["split"] = np.where(
        df["orig"] == "test", "test", np.where(is_train & (u < val_frac), "val", "train")
    )
    df = df.drop(columns=["orig"])
    df.to_parquet(out, index=False)
    return df


if __name__ == "__main__":
    print(build_manifest()["split"].value_counts().to_dict())
