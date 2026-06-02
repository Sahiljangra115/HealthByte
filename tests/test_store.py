import pytest


def _row(ts):
    return {"timestamp": ts, "hr": 65, "sleep_hours": 7, "steps": 3000}


def test_consent_gate_blocks_ingest(tmpdb):
    with pytest.raises(PermissionError):
        tmpdb.insert_biometrics("u1", [_row("2026-06-18T08:00:00")])


def test_ingest_after_consent(tmpdb):
    tmpdb.set_consent("u1", True)
    n = tmpdb.insert_biometrics("u1", [_row("2026-06-18T08:00:00"), _row("2026-06-18T09:00:00")])
    assert n == 2
    rows = tmpdb.read_window("u1", hours=24 * 3650)
    assert len(rows) == 2
