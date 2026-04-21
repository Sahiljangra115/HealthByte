"""Single source of truth for paths, model names, thresholds, and seed.

Every other module imports CFG from here so there is exactly one place to change
a setting. Mirrors the sibling y1-provenance/src/config.py pattern: a frozen
dataclass instance named CFG plus module-level path constants. Kept light on
imports (no torch/timm) so a Lambda cold start stays cheap.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

# Repo root is two levels up from this file (src/config.py -> repo root).
ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
ARTIFACT_DIR = ROOT / "artifacts"
MLRUNS_DIR = ROOT / "mlruns"


@dataclass(frozen=True)
class Config:
    # Reproducibility.
    seed: int = 42

    # Food classifier.
    food_model_name: str = "efficientnet_b0"
    food_num_classes: int = 101
    image_size: int = 224
    food_epochs: int = 5
    food_lr: float = 1e-4
    food_batch_size: int = 32
    val_frac: float = 0.1  # carved out of the official train split

    # Calorie estimator. portion_factor multiplies the dish kcal_std to model
    # the fact that portion size from a 2D photo is unknown. low_conf_widen
    # widens the band further when the classifier is unsure of the dish.
    portion_factor: float = 2.0
    low_conf_threshold: float = 0.6
    low_conf_widen: float = 1.5

    # Correlation engine.
    alpha: float = 0.05  # significance level before BH correction
    min_samples: int = 5  # below this a correlation is not reported

    # Storage.
    db_path: Path = ROOT / "timeseries.db"
    db_url: str = "sqlite:///./timeseries.db"
    schema_path: Path = ROOT / "src" / "store" / "schema.sql"

    # MLflow.
    mlflow_experiment: str = "y2-health-nutrition"

    # Google Fit OAuth (Phase 2b). Scopes are read-only.
    gfit_scopes: tuple[str, ...] = field(
        default_factory=lambda: (
            "https://www.googleapis.com/auth/fitness.heart_rate.read",
            "https://www.googleapis.com/auth/fitness.activity.read",
            "https://www.googleapis.com/auth/fitness.sleep.read",
        )
    )
    gfit_client_secret_path: Path = ARTIFACT_DIR / "gfit_client_secret.json"
    gfit_token_dir: Path = ARTIFACT_DIR / "gfit_tokens"

    # Artifacts.
    food_onnx_path: Path = ARTIFACT_DIR / "food_classifier.onnx"
    food_labels_path: Path = ARTIFACT_DIR / "food_labels.json"
    population_model_path: Path = ARTIFACT_DIR / "population_model.joblib"

    # Data manifests.
    food_manifest: Path = DATA_DIR / "food101_manifest.parquet"


CFG = Config()

DISCLAIMER = (
    "Not medical advice. Estimates are uncertainty ranges and any patterns "
    "shown are correlational, not causal."
)
