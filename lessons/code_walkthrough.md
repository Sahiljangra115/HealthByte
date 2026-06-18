# Y2 Code Walkthrough Questions

Per-line, grounded in your actual `src/` code. These are the "explain this line"
questions that catch whether you understand your own pipeline, not just that it
runs. Recurring character: **Dev**, a portfolio user who logs food photos and
uploads a biometrics CSV.

Format: answer in your own words, leave Verdict/Explanation for grading.

---

## Section A: config and the single source of truth

### A1: Why a frozen dataclass
* Question: `src/config.py` defines `CFG = Config()` where `Config` is `@dataclass(frozen=True)`. Why frozen instead of a plain module with module-level variables you can reassign? What bug class does `frozen=True` prevent across a long-running API process?
* Answer:
* Verdict:
* Explanation:

### A2: The default_factory on gfit_scopes
* Question: Most fields in `Config` are plain defaults (`seed: int = 42`), but `gfit_scopes` uses `field(default_factory=lambda: (...))`. Why can a tuple-of-strings not just be written as a normal default the way `seed` is? (Hint: it is actually a tuple here, but what rule are you respecting, and when would it bite you?)
* Answer:
* Verdict:
* Explanation:

### A3: Why no torch import in config
* Question: The module docstring says "Kept light on imports (no torch/timm) so a Lambda cold start stays cheap." Walk through what happens on a cold start if `config.py` imported torch at the top. Which endpoints would pay that cost even though they never touch a model?
* Answer:
* Verdict:
* Explanation:

---

## Section B: the calorie estimator (the range, never a point)

### B1: Why spread = std * portion_factor
* Question: In `calorie_estimator.estimate()`, `spread = entry["kcal_std"] * CFG.portion_factor` where `portion_factor` is 2.0. The table already has a `kcal_std`. Why multiply it by 2 instead of using the std directly? What real-world unknown is that factor standing in for?
* Answer:
* Verdict:
* Explanation:

### B2: The low-confidence widen
* Question: When `class_conf < CFG.low_conf_threshold`, the code does `spread *= CFG.low_conf_widen`. Explain in plain words why a less-confident dish guess should produce a *wider* calorie band, not a narrower or unchanged one.
* Answer:
* Verdict:
* Explanation:

### B3: The `if high - low < 1.0` guard
* Question: After computing low and high, there is `if high - low < 1.0: high = low + 1.0`. What edge case in the nutrition table would make `high == low` without this guard, and which test would fail if you deleted this line?
* Answer:
* Verdict:
* Explanation:

### B4: Why floor low at zero
* Question: `low = max(0.0, base - spread)`. Give a concrete dish/std combination where `base - spread` goes negative, and explain why returning a negative calorie floor would be both wrong and embarrassing in the UI.
* Answer:
* Verdict:
* Explanation:

---

## Section C: the consent gate and the store

### C1: Where the gate actually lives
* Question: In `store/timeseries.py`, `insert_biometrics` starts with `if not has_consent(user_id, path): raise PermissionError(...)`. Why is the gate inside the store function and not only in the API handler? What attack or bug does putting it at the store layer prevent that an API-only check would not?
* Answer:
* Verdict:
* Explanation:

### C2: The opaque id
* Question: The `users` table is `id TEXT PRIMARY KEY, consent BOOLEAN`. There is no name, no email. The README calls Dev "keyed by an opaque id". What is the privacy reason this table holds no PII, and what breaks downstream if you later need to email Dev a report?
* Answer:
* Verdict:
* Explanation:

### C3: IF NOT EXISTS in schema.sql
* Question: `schema.sql` uses `CREATE TABLE IF NOT EXISTS`. The conftest fixture calls `init_db()` and several tests run in the same session. Walk through what would happen on the second test if the tables were created without `IF NOT EXISTS`.
* Answer:
* Verdict:
* Explanation:

### C4: The 24h window read
* Question: `read_window` filters with `timestamp >= datetime('now', ?)` passing `f"-{hours} hours"`. Why build the offset string in Python and pass it as a bound parameter instead of doing string concatenation directly into the SQL? What does the `?` protect against?
* Answer:
* Verdict:
* Explanation:

### C5: The join/aggregate read
* Question: `daily_calorie_totals` does `SUM((kcal_low + kcal_high) / 2.0) ... GROUP BY date(timestamp)`. Why take the midpoint of the range here instead of summing the lows or the highs? What honesty caveat from the estimator are you quietly throwing away by collapsing the range to a midpoint?
* Answer:
* Verdict:
* Explanation:

---

## Section D: the correlation engine

### D1: Why product() over the pairs
* Question: `correlation_engine.correlate` builds `pairs = list(product(nutrition_cols, outcome_cols))` and tests each. If Dev has 4 nutrition features and 3 outcomes, how many hypothesis tests run? Why does that count matter for the next line?
* Answer:
* Verdict:
* Explanation:

### D2: The multipletests call
* Question: After collecting raw p-values, the code calls `multipletests(pvals, alpha=alpha, method="fdr_bh")`. In one sentence each: what does `fdr_bh` do to the p-values, and why is the raw `p < 0.05` flag dishonest when you ran 12 tests?
* Answer:
* Verdict:
* Explanation:

### D3: The n<3 guard
* Question: There is `if n < 3: r, p = float("nan"), 1.0`. Why set p to 1.0 (not 0.0, not nan) when there are too few samples? What would a p of 0.0 wrongly do at the BH step?
* Answer:
* Verdict:
* Explanation:

### D4: The sort key
* Question: The final `rows.sort(key=lambda d: (not d["significant"], -abs(d["r"]) ...))`. Decode this sort: what gets listed first, and why sort by `abs(r)` rather than `r` itself?
* Answer:
* Verdict:
* Explanation:

---

## Section E: the API layer

### E1: Lazy imports inside handlers
* Question: Every endpoint in `api/main.py` imports its model *inside* the function (`from src.models.food_classifier import predict`) rather than at the top of the file. Connect this to A3. What is the cold-start payoff, and what is the small per-request cost you accept in return?
* Answer:
* Verdict:
* Explanation:

### E2: The 403 vs 400 split
* Question: `/biometrics/upload` returns 403 when consent is missing but 400 when the image is unparseable in `/predict/food`. Why are these different status codes, and what is each one telling the client to do differently?
* Answer:
* Verdict:
* Explanation:

### E3: accepted/rejected from the validator
* Question: `upload_biometrics` calls `validate_rows(df)` which returns `(accepted, rejected)` and the response includes the rejected rows with reasons. Why surface the rejected rows to Dev instead of silently dropping bad lines or rejecting the whole file?
* Answer:
* Verdict:
* Explanation:

### E4: The Mangum handler
* Question: `api/handler.py` is just `handler = Mangum(app)`. What does Mangum actually do, and why is it needed for Lambda but not when you run `uvicorn src.api.main:app` locally?
* Answer:
* Verdict:
* Explanation:

---

## Section F: the food model inference path

### F1: The cached ONNX session
* Question: `food_classifier._load()` uses a module global `_SESSION` that is `None` until first call, then reused. Why cache the `onnxruntime.InferenceSession` rather than constructing it per `predict()`? What is the cost of building a session?
* Answer:
* Verdict:
* Explanation:

### F2: The manual softmax
* Question: `predict()` does `e = np.exp(logits - logits.max()); probs = e / e.sum()`. Why subtract `logits.max()` before the exp? What numerical failure does that one subtraction prevent?
* Answer:
* Verdict:
* Explanation:

### F3: Why ONNX at all
* Question: You train in PyTorch (`timm`) but serve through `onnxruntime`. Why export to ONNX for serving instead of just loading the torch model in the API? Tie this back to the Lambda image size and the `serve` extras in `pyproject.toml`.
* Answer:
* Verdict:
* Explanation:

---

## Section G: personalization

### G1: The shrinkage formula
* Question: `personalization.fit_user_offset` returns `resid * (n / (n + shrink))`. Plug in n=2 and n=30 with shrink=3. What does the multiplier do in each case, and why is shrinking toward zero the honest move when Dev has only logged 2 days?
* Answer:
* Verdict:
* Explanation:

### G2: Offset, not retrain
* Question: `tune()` is literally `base_pred + user_offset`. Why is adding one scalar offset the right personalization here, instead of training a fresh model on Dev's data? What does the PLAN call the from-scratch approach, and why is it a trap?
* Answer:
* Verdict:
* Explanation:

---

# Reliability and Scalability (appended)

These push past "does it run" into "does it survive production". Same format.

## Section H: Reliability

### H1: The store has no concurrency control
* Question: `timeseries.py` opens a fresh `sqlite3.connect` per call. Two requests upload biometrics for Dev at the same instant. What does SQLite do under concurrent writes, and what is the first symptom Dev sees? What is the smallest fix (WAL mode, a write queue, or move to Postgres) and when is each justified?
* Answer:
* Verdict:
* Explanation:

### H2: Partial failure in upload
* Question: `insert_biometrics` does an `executemany` of accepted rows inside one `with get_db()` block. If row 400 of 500 violates a constraint, what happens to rows 1 to 399? Is the upload atomic? What does the API currently report to Dev, and is that report truthful?
* Answer:
* Verdict:
* Explanation:

### H3: The Ollama-style external call timeout
* Question: y2 itself has no LLM call, but `gfit_client.pull_last_24h` hits Google's API over the network. There is a `timeout=10` on the revoke call but the aggregate calls go through the google client with no explicit timeout. What happens to a `/biometrics/sync/gfit` request if Google hangs? How would you bound it?
* Answer:
* Verdict:
* Explanation:

### H4: Model artifact missing at runtime
* Question: `predict()` calls `ort.InferenceSession(str(CFG.food_onnx_path))`. On a fresh Lambda with no trained model, that file does not exist. What exception surfaces, where, and what should `/predict/food` return to the user instead of a raw 500 stack trace?
* Answer:
* Verdict:
* Explanation:

### H5: Calibration of the calorie band
* Question: The range is `base ± std*factor`. You claim it is a "confidence range" but nothing measures whether the true calories actually land inside it 80% of the time. How would you check if your ranges are honest (calibrated), and what does it mean if the true value falls in-range only 40% of the time?
* Answer:
* Verdict:
* Explanation:

## Section I: Scalability

### I1: SQLite to managed Postgres
* Question: Dev becomes 100k users, each with a year of hourly biometrics. What specifically breaks first in the SQLite-in-image design (write throughput, file size, cold-start reload, single-writer lock)? Walk the migration to Neon/Supabase Postgres and what code changes (`timeseries.py`) versus what stays the same.
* Answer:
* Verdict:
* Explanation:

### I2: The 30-day read in /insights
* Question: `/insights/{user}` calls `read_window(user, hours=24*30)` then builds a pandas DataFrame and correlates. At 100k users hitting this endpoint, what is the cost per call and where does it dominate? What do you cache, and how do you invalidate that cache when Dev uploads new data?
* Answer:
* Verdict:
* Explanation:

### I3: Cold start vs throughput on Lambda
* Question: The food ONNX session loads lazily on first request after a cold start. Under bursty traffic, every cold container pays that load. When does Lambda stop being the right serving choice, and what is the upgrade path (provisioned concurrency, a long-lived container on ECS/Fargate)?
* Answer:
* Verdict:
* Explanation:

### I4: Per-user correlation does not batch
* Question: The correlation engine runs per user, on demand. If you wanted a nightly job to precompute insights for all active users, what changes? Why is the per-user offset model (G1) friendly to this batch pattern while a per-user *trained* model would not be?
* Answer:
* Verdict:
* Explanation:

### I5: Food-101 to a real menu
* Question: The classifier knows 101 dishes and the nutrition table covers ~35 of them. A user logs a dish outside both sets. Trace what `predict()` then `estimate()` return today. How do you scale dish coverage without retraining the whole classifier every time you add a food?
* Answer:
* Verdict:
* Explanation:
