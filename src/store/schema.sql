-- Opaque user id only. No names or emails: PII stays out of the ML store.
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    consent BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS biometrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    timestamp DATETIME,
    hr REAL,
    sleep_hours REAL,
    steps INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_bio_user_ts ON biometrics(user_id, timestamp);

CREATE TABLE IF NOT EXISTS food_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    timestamp DATETIME,
    dish TEXT,
    kcal_low REAL,
    kcal_high REAL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_food_user_ts ON food_logs(user_id, timestamp);
