# Y2: Personalized Health & Nutrition Engine

> **Not medical advice.** Calorie outputs are uncertainty ranges, and every insight is labeled correlational, not causal.

A full-stack health platform that classifies food from a photo, stores biometric time-series, and surfaces personalized insights backed by uncertainty ranges and proper statistics. The design prioritizes honesty over the illusion of precision: it gives you a calorie band instead of a fake exact number, and it corrects for multiple comparisons before it ever calls a correlation "significant."

[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-ee4c2c.svg)](https://pytorch.org/)
[![EfficientNet](https://img.shields.io/badge/vision-EfficientNet--B0-yellow.svg)](https://github.com/huggingface/pytorch-image-models)
[![ONNX](https://img.shields.io/badge/ONNX-runtime-005CED.svg)](https://onnxruntime.ai/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/db-SQLite-003B57.svg)](https://www.sqlite.org/)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF.svg)](https://github.com/features/actions)

---

## What it does

1. **Classify food from a photo.** EfficientNet-B0 fine-tuned on Food-101 (101 dish classes), exported to ONNX for fast CPU inference, returning top-5 predictions.
2. **Estimate calories as a range, never a point.** A 2D photo cannot tell you portion size, so the output is an honest band that widens when the classifier is unsure. A test literally forbids point estimates.
3. **Store biometrics over time.** Heart rate, sleep, and step counts in an indexed SQLite time-series, behind a consent gate.
4. **Pull from Google Fit.** Real OAuth 2.0, read-only scopes, per-user token persistence.
5. **Find honest correlations.** Spearman rank correlation between nutrition and biometric outcomes, filtered through Benjamini-Hochberg FDR correction so repeated testing does not manufacture false positives.
6. **Suggest gently.** Surfaces the strongest statistically significant correlation as a non-prescriptive "you might experiment with...", always carrying the not-medical-advice disclaimer.

## What makes it portfolio-grade

- **Ranges, not points.** `test_range_not_point()` fails the build if the calorie estimator ever returns a single number. Honesty is enforced by the test suite, not by good intentions.
- **Multiple-comparison correction.** Most hobby health projects run a pile of correlations and report whatever clears `p < 0.05`. This one applies Benjamini-Hochberg FDR control, the right tool, and labels every result "correlation, not causation; n=X".
- **Population base + per-user offset.** A `HistGradientBoostingRegressor` learns from a population cohort, then a shrinkage-tuned per-user correction adjusts it. That is a proper prior, not overfitting on a handful of personal data points.
- **Consent gate that actually gates.** `set_consent(user_id, bool)` must be called before any ingestion. Every write endpoint checks `has_consent()` first.
- **PII-free by construction.** Users are opaque random IDs. The schema has no name, email, or demographic column. A test verifies it.

## Architecture

```
   food photo ─────► EfficientNet-B0 (ONNX, lazy-loaded) ─► dish + confidence
                                                                │
                          ┌─────────────────────────────────────┤
                          ▼                                     ▼
                  nutrition_table.lookup()              calorie_estimator
                  (dish → kcal mean, std)              (confidence → range)
                                                                │
                                                                ▼
                                                      FoodResponse (kcal_low, kcal_high)

   biometrics CSV / Google Fit ─► schema.validate ─► SQLite (indexed user_id + timestamp)
                                                                │
                                                                ▼
                                                      correlation_engine (Spearman)
                                                                │
                                                                ▼
                                              Benjamini-Hochberg FDR filter
                                                                │
                                                                ▼
                                          recommender ─► InsightResponse
                                          (strongest significant correlation)
```

**Schema highlights** (no PII, time-indexed):

```sql
users(id TEXT PRIMARY KEY, consent BOOLEAN)
biometrics(id, user_id, timestamp, hr, sleep_hours, steps, FOREIGN KEY(user_id))
food_logs(id, user_id, timestamp, dish, kcal_low, kcal_high, FOREIGN KEY(user_id))
-- composite index on (user_id, timestamp) for fast window queries
```

## Quickstart

```bash
python scripts/check_env.py            # GPU / environment check

# Data + training
python -m src.data.prepare_food101     # builds seeded Food-101 manifest
python -m src.models.food_classifier   # fine-tune EfficientNet, export ONNX, log to MLflow

# Evaluate
python -m eval.eval_food               # top-1 / top-5 accuracy on official test split
python -m eval.eval_recommender        # verifies FDR correction is applied

# Serve
uvicorn src.api.main:app --reload      # http://localhost:8000/docs

pytest                                 # consent gate, calorie ranges, correlation filtering
```

## API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/health` | liveness check |
| `POST` | `/consent` | set per-user consent (required before any ingestion) |
| `POST` | `/predict/food` | classify a food image, return dish + calorie range |
| `POST` | `/biometrics/upload` | ingest biometric rows (consent-gated) |
| `GET` | `/biometrics/window` | query a time window for a user |
| `GET` | `/insights` | FDR-corrected correlations + a gentle recommendation |

## Datasets

- **Food-101**: 101 categories, ~101k images, official train/test split preserved, validation carved from train with a seeded stratified split. Loaded via `torchvision.datasets.Food101`.
- **Population cohort** (`data/population.parquet`): columns `kcal, sugar_g, protein_g, steps, prev_sleep_hours, next_sleep_hours`, used to train the population base model.

## Evaluation metrics

| Metric | Where | Value |
|--------|-------|-------|
| Food top-1 accuracy | `eval/eval_food.py` | run to fill |
| Food top-5 accuracy | `eval/eval_food.py` | run to fill |
| Population model validation MAE | training log / MLflow | run to fill |
| FDR-correction sanity check | `eval/eval_recommender.py` | pass/fail |

## Privacy and disclaimers

- Opaque user IDs only; the database stores no names, emails, or demographics.
- Consent must be granted before any data is written, and every write endpoint enforces it.
- Google Fit tokens are stored per user, read-only scopes, and the testing-mode OAuth flow needs no app verification for a portfolio demo.
- A persistent, non-dismissable banner reads: "Not medical advice. Calories are ranges, insights are correlational."
- Every API response carries a disclaimer string; every correlation carries "correlation, not causation; n=X".

## Web dashboard

A responsive dark-theme UI (HTML + Tailwind + Chart.js) for food upload, calorie predictions, biometric windows, and live insight updates. Accessibility is built in: ARIA live regions announce status to screen readers, contrast meets accessible thresholds, and the medical disclaimer cannot be dismissed.

## Project layout

```
y2-health-nutrition/
├── src/
│   ├── config.py            # all constants: thresholds, weights, scopes
│   ├── models/              # food_classifier, population_model, recommender, timeseries
│   ├── data/                # prepare_food101, nutrition_table, biometrics_schema
│   ├── api/                 # main (FastAPI), schemas (Pydantic)
│   └── db/                  # schema.sql, store
├── eval/                    # eval_food, eval_recommender
├── tests/                   # calorie, api, correlation, store, biometrics
├── ui/index.html            # dark dashboard
├── infra/                   # deploy_lambda.md
├── .github/workflows/ci.yml # ruff + pytest + docker build
├── Dockerfile
└── pyproject.toml
```

## Honest limitations

- A single 2D photo cannot recover portion size, which is exactly why calories are ranges.
- Correlations are correlations; the engine says so on every result.
- SQLite resets on redeploy; production needs a managed Postgres (Neon, Supabase) swapped in.
- Lambda free tier means cold-start latency on the first request.

---

Statistical rigor in a hobby health app is rare. This one corrects for multiple comparisons, reports ranges instead of false precision, and isolates PII by design. That honesty is the feature.
