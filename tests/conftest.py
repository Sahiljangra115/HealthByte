import sys
import types
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))


@pytest.fixture
def tmpdb(tmp_path, monkeypatch):
    """Point the time-series store at a throwaway SQLite file and init schema."""
    from src.config import CFG
    from src.store import timeseries

    fake_cfg = types.SimpleNamespace(db_path=tmp_path / "t.db", schema_path=CFG.schema_path)
    monkeypatch.setattr(timeseries, "CFG", fake_cfg)
    timeseries.init_db()
    return timeseries
