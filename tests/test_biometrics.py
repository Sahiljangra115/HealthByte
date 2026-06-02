import pandas as pd

from src.data.biometrics_schema import validate_rows


def test_accepts_good_rows():
    df = pd.DataFrame(
        [
            {"timestamp": "2026-06-18T08:00:00", "hr": 60, "sleep_hours": 7, "steps": 4000},
            {"timestamp": "2026-06-18T09:00:00", "hr": 72, "sleep_hours": 7, "steps": 5000},
        ]
    )
    accepted, rejected = validate_rows(df)
    assert len(accepted) == 2
    assert rejected == []


def test_rejects_out_of_range_hr():
    df = pd.DataFrame([{"timestamp": "2026-06-18T08:00:00", "hr": 500, "sleep_hours": 7, "steps": 100}])
    accepted, rejected = validate_rows(df)
    assert accepted == []
    assert len(rejected) == 1


def test_rejects_non_monotonic_timestamp():
    df = pd.DataFrame(
        [
            {"timestamp": "2026-06-18T09:00:00", "hr": 60, "sleep_hours": 7, "steps": 100},
            {"timestamp": "2026-06-18T08:00:00", "hr": 60, "sleep_hours": 7, "steps": 100},
        ]
    )
    accepted, rejected = validate_rows(df)
    assert len(accepted) == 1
    assert rejected[0]["reason"] == "timestamp not monotonic"
