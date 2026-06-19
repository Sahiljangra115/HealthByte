"""Phase 2b: Google Fit ingestion.

A real OAuth client. It needs a Google Cloud project with the Fitness API
enabled and an OAuth client secret (testing mode is enough for a portfolio demo
with whitelisted test users). Tokens are stored on disk keyed by an opaque user
id. The pulled data is normalised into the SAME shape as the CSV path so all
downstream code is source-agnostic.

Honest free-tier note: an app in OAuth "testing" mode works for a small set of
test users without Google verification. That is enough to demo, and is stated in
the README.
"""
from __future__ import annotations

import json
import time
from pathlib import Path

SCOPES = [
    "https://www.googleapis.com/auth/fitness.heart_rate.read",
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.sleep.read",
]
TOKEN_DIR = Path("artifacts/gfit_tokens")
DAY_MS = 24 * 60 * 60 * 1000


def _token_path(user_id: str) -> Path:
    TOKEN_DIR.mkdir(parents=True, exist_ok=True)
    return TOKEN_DIR / f"{user_id}.json"


def authorize(user_id: str, client_secrets_file: str) -> None:
    """Run the OAuth consent flow once and persist the credentials."""
    from google_auth_oauthlib.flow import InstalledAppFlow

    flow = InstalledAppFlow.from_client_secrets_file(client_secrets_file, SCOPES)
    creds = flow.run_local_server(port=0)
    _token_path(user_id).write_text(creds.to_json())


def _load_creds(user_id: str):
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials

    path = _token_path(user_id)
    if not path.exists():
        raise FileNotFoundError(f"no Google Fit token for {user_id}; call authorize() first")
    creds = Credentials.from_authorized_user_info(json.loads(path.read_text()), SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        path.write_text(creds.to_json())
    return creds


def revoke(user_id: str) -> None:
    import requests

    path = _token_path(user_id)
    if path.exists():
        token = json.loads(path.read_text()).get("token")
        if token:
            requests.post(
                "https://oauth2.googleapis.com/revoke",
                params={"token": token},
                headers={"content-type": "application/x-www-form-urlencoded"},
                timeout=10,
            )
        path.unlink()


def _aggregate(service, data_type: str, start_ms: int, end_ms: int) -> float:
    body = {
        "aggregateBy": [{"dataTypeName": data_type}],
        "bucketByTime": {"durationMillis": end_ms - start_ms},
        "startTimeMillis": start_ms,
        "endTimeMillis": end_ms,
    }
    resp = service.users().dataset().aggregate(userId="me", body=body).execute()
    total = 0.0
    for bucket in resp.get("bucket", []):
        for ds in bucket.get("dataset", []):
            for point in ds.get("point", []):
                for val in point.get("value", []):
                    total += val.get("fpVal", val.get("intVal", 0)) or 0
    return total


def pull_last_24h(user_id: str) -> list[dict]:
    """Return rows in the biometrics schema shape: timestamp, hr, sleep_hours, steps."""
    from googleapiclient.discovery import build

    creds = _load_creds(user_id)
    service = build("fitness", "v1", credentials=creds, cache_discovery=False)

    end_ms = int(time.time() * 1000)
    start_ms = end_ms - DAY_MS

    steps = _aggregate(service, "com.google.step_count.delta", start_ms, end_ms)
    hr = _aggregate(service, "com.google.heart_rate.bpm", start_ms, end_ms)
    sleep_ms = _aggregate(service, "com.google.sleep.segment", start_ms, end_ms)

    return [
        {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime(end_ms / 1000)),
            "hr": round(hr, 1) if hr else 0.0,
            "sleep_hours": round(sleep_ms / 3_600_000, 2),
            "steps": int(steps),
        }
    ]
