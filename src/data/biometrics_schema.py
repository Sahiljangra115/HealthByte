"""Strict biometrics schema and a row validator.

Units (documented, non-negotiable):
- timestamp: ISO-8601 datetime, must be monotonically non-decreasing per upload
- hr: beats per minute, 30 to 220
- sleep_hours: hours in the last day, 0 to 24
- steps: count, >= 0

The validator returns accepted rows and rejected rows with a reason each, so the
API can report exactly what it dropped instead of silently swallowing bad data.
"""
from __future__ import annotations

from datetime import datetime

import pandas as pd
from pydantic import BaseModel, Field, ValidationError


class BiometricRow(BaseModel):
    timestamp: datetime
    hr: float = Field(ge=30, le=220)
    sleep_hours: float = Field(ge=0, le=24)
    steps: int = Field(ge=0)


def validate_rows(df: pd.DataFrame) -> tuple[list[dict], list[dict]]:
    accepted: list[dict] = []
    rejected: list[dict] = []
    last_ts: datetime | None = None

    for i, raw in enumerate(df.to_dict(orient="records")):
        try:
            row = BiometricRow(**raw)
        except ValidationError as exc:
            rejected.append({"index": i, "row": raw, "reason": exc.errors()[0]["msg"]})
            continue
        if last_ts is not None and row.timestamp < last_ts:
            rejected.append({"index": i, "row": raw, "reason": "timestamp not monotonic"})
            continue
        last_ts = row.timestamp
        accepted.append(row.model_dump())

    return accepted, rejected
