"""SQLite time-series store. stdlib sqlite3 is plenty for three tables.

Rules enforced here:
- consent gate: no biometric or food ingestion without a stored consent flag.
- PII: users are keyed by an opaque id only. No names or emails live here.
"""
from __future__ import annotations

import sqlite3
from pathlib import Path

from src.config import CFG


def get_db(path: Path | None = None) -> sqlite3.Connection:
    conn = sqlite3.connect(str(path or CFG.db_path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db(path: Path | None = None) -> None:
    sql = CFG.schema_path.read_text()
    with get_db(path) as db:
        db.executescript(sql)


def set_consent(user_id: str, consent: bool, path: Path | None = None) -> None:
    with get_db(path) as db:
        db.execute(
            "INSERT INTO users(id, consent) VALUES(?, ?) "
            "ON CONFLICT(id) DO UPDATE SET consent=excluded.consent",
            (user_id, 1 if consent else 0),
        )


def has_consent(user_id: str, path: Path | None = None) -> bool:
    with get_db(path) as db:
        row = db.execute("SELECT consent FROM users WHERE id=?", (user_id,)).fetchone()
    return bool(row and row["consent"])


def insert_biometrics(user_id: str, rows: list[dict], path: Path | None = None) -> int:
    if not has_consent(user_id, path):
        raise PermissionError("no consent on file for this user")
    with get_db(path) as db:
        db.executemany(
            "INSERT INTO biometrics(user_id, timestamp, hr, sleep_hours, steps) VALUES(?,?,?,?,?)",
            [(user_id, r["timestamp"], r["hr"], r["sleep_hours"], r["steps"]) for r in rows],
        )
    return len(rows)


def insert_food_log(user_id: str, dish: str, kcal_low: float, kcal_high: float, path: Path | None = None) -> None:
    if not has_consent(user_id, path):
        raise PermissionError("no consent on file for this user")
    with get_db(path) as db:
        db.execute(
            "INSERT INTO food_logs(user_id, timestamp, dish, kcal_low, kcal_high) "
            "VALUES(?, datetime('now'), ?, ?, ?)",
            (user_id, dish, kcal_low, kcal_high),
        )


def read_window(user_id: str, hours: int = 24, path: Path | None = None) -> list[dict]:
    with get_db(path) as db:
        rows = db.execute(
            "SELECT timestamp, hr, sleep_hours, steps FROM biometrics "
            "WHERE user_id=? AND timestamp >= datetime('now', ?) ORDER BY timestamp",
            (user_id, f"-{hours} hours"),
        ).fetchall()
    return [dict(r) for r in rows]


def daily_calorie_totals(user_id: str, path: Path | None = None) -> list[dict]:
    """A join + window-style aggregate: total kcal midpoint per day for a user."""
    with get_db(path) as db:
        rows = db.execute(
            "SELECT date(timestamp) AS day, "
            "       COUNT(*) AS meals, "
            "       SUM((kcal_low + kcal_high) / 2.0) AS kcal_mid "
            "FROM food_logs WHERE user_id=? GROUP BY date(timestamp) ORDER BY day",
            (user_id,),
        ).fetchall()
    return [dict(r) for r in rows]
