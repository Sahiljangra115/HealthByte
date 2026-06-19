"""FastAPI service. Models load lazily. Every nutrition output is a range and
every insight carries the not-medical-advice disclaimer.

Run locally:  uvicorn src.api.main:app --reload
"""
from __future__ import annotations

import base64
import io

import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile

from src.api.schemas import (
    ConsentRequest,
    FoodResponse,
    InsightResponse,
    UploadResponse,
    WindowResponse,
)
from src.config import DISCLAIMER

app = FastAPI(title="Y2 Personalized Health & Nutrition Engine")


@app.get("/health")
def health():
    return {"status": "ok", "disclaimer": DISCLAIMER}


@app.post("/consent")
def set_consent(req: ConsentRequest):
    from src.store import timeseries

    timeseries.set_consent(req.user_id, req.consent)
    return {"user_id": req.user_id, "consent": req.consent}


@app.post("/predict/food", response_model=FoodResponse)
def predict_food(image_base64: str = Form("")):
    from src.models.calorie_estimator import estimate
    from src.models.food_classifier import predict

    if not image_base64.strip():
        raise HTTPException(status_code=400, detail="image_base64 required")
    try:
        from PIL import Image

        img = Image.open(io.BytesIO(base64.b64decode(image_base64))).convert("RGB")
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"bad image: {exc}") from exc

    pred = predict(img)
    est = estimate(pred["dish"], pred["class_conf"])
    return FoodResponse(top5=pred["top5"], **est)


@app.post("/biometrics/upload", response_model=UploadResponse)
async def upload_biometrics(user_id: str = Form(...), file: UploadFile = File(...)):
    from src.data.biometrics_schema import validate_rows
    from src.store import timeseries

    if not timeseries.has_consent(user_id):
        raise HTTPException(status_code=403, detail="no consent on file; call /consent first")

    df = pd.read_csv(io.BytesIO(await file.read()))
    accepted, rejected = validate_rows(df)
    n = timeseries.insert_biometrics(user_id, accepted) if accepted else 0
    return UploadResponse(n_rows=n, rejected=rejected)


@app.get("/biometrics/{user}", response_model=WindowResponse)
def get_biometrics(user: str, window_hours: int = 24):
    from src.store import timeseries

    rows = timeseries.read_window(user, hours=window_hours)
    return WindowResponse(user=user, window_hours=window_hours, rows=rows)


@app.get("/insights/{user}", response_model=InsightResponse)
def insights(user: str):
    from src.insights.correlation_engine import correlate
    from src.insights.recommender import recommend
    from src.store import timeseries

    rows = timeseries.read_window(user, hours=24 * 30)
    if len(rows) < 3:
        return InsightResponse(correlations=[], recommendation=recommend([]))

    df = pd.DataFrame(rows)
    nutrition_cols = [c for c in ("steps",) if c in df]
    outcome_cols = [c for c in ("hr", "sleep_hours") if c in df]
    corrs = correlate(df, nutrition_cols, outcome_cols) if nutrition_cols and outcome_cols else []
    return InsightResponse(correlations=corrs, recommendation=recommend(corrs))
