import numpy as np
import pandas as pd

from src.insights.correlation_engine import correlate


def test_flags_planted_correlation_and_not_noise():
    rng = np.random.default_rng(0)
    n = 60
    steps = rng.normal(8000, 1500, n)
    # sleep_hours strongly (negatively) tied to steps; hr is pure noise.
    sleep = 9 - 0.0004 * steps + rng.normal(0, 0.2, n)
    hr = rng.normal(70, 5, n)
    df = pd.DataFrame({"steps": steps, "sleep_hours": sleep, "hr": hr})

    rows = correlate(df, ["steps"], ["sleep_hours", "hr"])
    by_pair = {(r["feature"], r["outcome"]): r for r in rows}

    assert by_pair[("steps", "sleep_hours")]["significant"] is True
    assert by_pair[("steps", "hr")]["significant"] is False
    # Honesty label present.
    assert "not causation" in by_pair[("steps", "sleep_hours")]["label"]
