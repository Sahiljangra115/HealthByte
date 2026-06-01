from __future__ import annotations

from pydantic import BaseModel, Field


class FoodResponse(BaseModel):
    dish: str | None
    top5: list[dict] = []
    kcal_range: list[float]
    macro_range: dict = {}
    confidence_label: str
    limitations_note: str


class ConsentRequest(BaseModel):
    user_id: str = Field(min_length=1)
    consent: bool


class UploadResponse(BaseModel):
    n_rows: int
    rejected: list[dict] = []


class WindowResponse(BaseModel):
    user: str
    window_hours: int
    rows: list[dict]


class InsightResponse(BaseModel):
    correlations: list[dict]
    recommendation: dict
