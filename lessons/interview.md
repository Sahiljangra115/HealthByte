# Y2 Interview Questions

Broader than the per-line walkthrough. These cover what a one-hour ML/backend
interview (L3 to L4 target) asks beyond your specific code: design tradeoffs,
honesty under uncertainty, and the "why did you build it this way" defense.
Grounded in your code where possible so you defend real decisions.

Recurring scenario: **Dev** uploads a food photo and a biometrics CSV; later the
same engine is licensed to a clinic with thousands of patients.

Format: answer in your own words, leave Verdict/Explanation for grading.

---

## Section A: The Calorie Range (uncertainty as a feature)

### A1: Why a range, not a number
* Question: Your estimator structurally returns `[low, high]`, never a point. A naive competitor app shows "642 kcal". Make the honest argument for why your range is more correct, and the cynical argument for why the competitor's number sells better. Where does portion estimation from a 2D photo actually fail?
* Answer:
* Verdict:
* Explanation:

### A2: How misclassification feeds the range
* Question: Two failure sources stack: the dish might be wrong, and the portion is unknown. Explain how your code routes *dish* uncertainty (low `class_conf`) into a wider band. Should a wrong dish at high confidence and a right dish at low confidence produce the same band? Defend your answer.
* Answer:
* Verdict:
* Explanation:

### A3: Where the table numbers came from
* Question: `nutrition_table.py` hard-codes ~35 dishes with `kcal_mean` and `kcal_std`. An interviewer asks "are these real?" Give the honest provenance answer and explain what a production version would do (USDA FoodData Central, per-region serving distributions) and why the `kcal_std` is the load-bearing field.
* Answer:
* Verdict:
* Explanation:

---

## Section B: Personalization (the L4 lever)

### B1: Population base + per-user offset
* Question: Defend the choice of a population HistGradientBoosting model plus a shrunk per-user offset over training one model per user. Why is "7 data points cannot train a model honestly" the correct framing, and what is the failure mode of the per-user-from-scratch approach you avoided?
* Answer:
* Verdict:
* Explanation:

### B2: Leakage in personalization
* Question: The PLAN warns "no using future data to predict the past." In a per-user time series, describe a concrete way you could accidentally leak the future into the offset fit, and how you would split data to prevent it.
* Answer:
* Verdict:
* Explanation:

### B3: When the offset is harmful
* Question: A user has 3 noisy days where they happened to sleep badly for unrelated reasons. Your offset shifts their baseline down. Is that a bug or expected? How does the shrinkage term limit the damage, and what would you monitor to catch an offset that has gone wrong?
* Answer:
* Verdict:
* Explanation:

---

## Section C: Correlation, not causation

### C1: Why multiple-comparison correction
* Question: Your engine tests every (nutrition, outcome) pair and applies Benjamini-Hochberg. Explain to a non-statistician why testing 12 pairs at p<0.05 is almost guaranteed to flag at least one false "discovery", and what BH actually controls (FDR) versus what Bonferroni controls (FWER).
* Answer:
* Verdict:
* Explanation:

### C2: Spearman vs Pearson
* Question: Your code defaults to Spearman. When does Spearman beat Pearson for "higher-sugar days correlate with worse sleep", and what assumption about the relationship are you relaxing by using rank correlation?
* Answer:
* Verdict:
* Explanation:

### C3: The recommendation that is not advice
* Question: `recommender.py` turns the strongest correlation into a suggestion and attaches the disclaimer. An interviewer pushes: "isn't a health suggestion just medical advice with a disclaimer?" Defend the line you are walking and name two phrasings the `eval_recommender` BANNED list forbids, and why.
* Answer:
* Verdict:
* Explanation:

### C4: A spurious-but-significant correlation
* Question: With 60 days of data, BH flags "more steps correlate with higher heart rate" as significant. It is statistically real but causally meaningless (exercise raises HR). How does your product avoid implying Dev should walk less? What is the gap between "statistically honest" and "useful"?
* Answer:
* Verdict:
* Explanation:

---

## Section D: Privacy and Consent

### D1: The consent gate as a hard requirement
* Question: Consent is checked at the store layer before any biometric write. Walk through the data lifecycle for Dev: consent stored, data ingested, Dev revokes consent. What must happen on revoke, and does your current code support deletion or only stop new writes?
* Answer:
* Verdict:
* Explanation:

### D2: PII minimization tradeoff
* Question: You key users by an opaque id with no PII in the ML store. What capability does this cost you (account recovery, support, GDPR data-subject requests), and how would you add those back without putting PII next to the biometrics?
* Answer:
* Verdict:
* Explanation:

### D3: Google Fit tokens at rest
* Question: `gfit_client.py` writes the OAuth token to disk as JSON keyed by user id. The docstring says "store tokens encrypted." Today they are plaintext on disk. What is the real risk, and what is the minimal honest fix (KMS, Secrets Manager, encryption at rest) for a Lambda deployment?
* Answer:
* Verdict:
* Explanation:

---

## Section E: The Food Model

### E1: Why EfficientNet-B0
* Question: Defend EfficientNet-B0 on Food-101 over a larger model or a from-scratch CNN. Tie the choice to the deploy constraint (free Lambda, ONNX serving). When would you reach for MobileViT-S or a bigger backbone instead?
* Answer:
* Verdict:
* Explanation:

### E2: The seeded split and touch-once test
* Question: `prepare_food101.py` carves val out of the official train split and never touches test until the end. Explain why mixing test into model selection inflates your reported top-1, and why a leakage note in the code matters for a reviewer who trusts your numbers.
* Answer:
* Verdict:
* Explanation:

### E3: Top-1 vs top-5 for this product
* Question: You log both top-1 and top-5. For the calorie use case specifically, which metric matters more and why? How does a top-5-correct-but-top-1-wrong prediction interact with the calorie band width?
* Answer:
* Verdict:
* Explanation:

---

## Section F: System Design

### F1: Why FastAPI + Lambda + ONNX
* Question: Walk the full request path for `/predict/food` from base64 image to JSON range, naming every component (Mangum, lazy import, ONNX session, estimator). Where is the latency, and which piece would you optimize first if a demo felt slow?
* Answer:
* Verdict:
* Explanation:

### F2: SQLite now, Postgres later
* Question: The MVP ships SQLite-in-image. Name two things this buys you for a portfolio demo and two things that break the moment it is real (persistence across cold starts, concurrent writers). What is the exact migration trigger?
* Answer:
* Verdict:
* Explanation:

### F3: The CSV path and the Google Fit path
* Question: Both ingestion paths normalize into the same biometrics schema. Why is "make downstream code source-agnostic" worth the extra normalization layer in `gfit_client`? What would a leaky abstraction here cost you when you add a third source (Apple Health)?
* Answer:
* Verdict:
* Explanation:

---

## Section G: The "Why" Questions (architecture defense)

### G1: Why not a single end-to-end model
* Question: Why split into classifier, table lookup, estimator, store, correlation, recommender instead of one model that eats a photo and outputs advice? Give the honest engineering reasons (debuggability, calibration, honesty per stage) an interviewer wants to hear.
* Answer:
* Verdict:
* Explanation:

### G2: Why honesty over accuracy theater
* Question: This whole project is built around ranges, disclaimers, and correlation labels. An interviewer says "users want confident answers, your humility makes the product feel weak." Defend the design as the L4 lever it is meant to be.
* Answer:
* Verdict:
* Explanation:

### G3: What you would cut under a deadline
* Question: You have one week, not ten. Which phase do you ship first and which do you defer, and why is the food-photo-to-range slice the right tracer bullet over personalization or Google Fit?
* Answer:
* Verdict:
* Explanation:

---

# Reliability and Scalability (appended)

Production-grade questions: failure modes, load, and what an SRE would ask.

## Section H: Reliability

### H1: Graceful degradation when a model is missing
* Question: On a fresh deploy with no trained ONNX file, `/predict/food` blows up but `/biometrics/upload` still works. Is partial availability the right behavior, and how would you make the API advertise which capabilities are live (a `/health` that reports model presence) instead of failing at request time?
* Answer:
* Verdict:
* Explanation:

### H2: Idempotency of uploads
* Question: Dev's phone retries a failed `/biometrics/upload` and the same CSV lands twice. Today you get duplicate rows. How do you make ingestion idempotent (dedup key on user_id+timestamp, an upsert), and why does the 24h window read make duplicates especially misleading?
* Answer:
* Verdict:
* Explanation:

### H3: Bounding external dependencies
* Question: The Google Fit sync depends on Google being up and fast. Describe the timeout, retry-with-backoff, and circuit-breaker policy you would put around `pull_last_24h` so one slow upstream cannot pile up Lambda concurrency and run your bill up.
* Answer:
* Verdict:
* Explanation:

### H4: Observability
* Question: A user reports "my insight looks wrong." With no logging or metrics today, you are blind. Name the three things you would instrument first (request latency per endpoint, rejected-row rate on upload, correlation significance distribution) and what each would tell you.
* Answer:
* Verdict:
* Explanation:

### H5: Calibration as a reliability property
* Question: Reframe the calorie band as a reliability SLO: "the true value lands in the band 80% of the time." How would you measure this against held-out labeled meals, and what do you change in the estimator if the band is systematically too narrow or too wide?
* Answer:
* Verdict:
* Explanation:

### H6: Failing safe on bad biometrics
* Question: A malformed CSV with a 500 bpm heart rate is rejected by the validator. But what about a *plausible but wrong* value (a real 210 bpm typo)? Your range check accepts it. How do downstream correlations get poisoned, and what is the defense (outlier flagging, per-user z-score) without rejecting genuine extremes?
* Answer:
* Verdict:
* Explanation:

## Section I: Scalability

### I1: From one user to a clinic of 50k
* Question: The engine is licensed to a clinic. Walk every layer that changes: the store (SQLite to Postgres with connection pooling), the food model (Lambda cold start to provisioned/ECS), the insights endpoint (on-demand to nightly batch), and the population model (one global to per-cohort). Which is the first bottleneck?
* Answer:
* Verdict:
* Explanation:

### I2: Read vs write load asymmetry
* Question: Biometrics are written hourly per user but insights are read on dashboard open. Characterize the read/write ratio and how it shapes your storage choice (time-series-optimized store, materialized daily rollups). Why is `daily_calorie_totals` a hint at the rollup you actually want?
* Answer:
* Verdict:
* Explanation:

### I3: Caching the population model
* Question: The base model is a single artifact loaded from disk/S3. Under load, every cold container reloads it. How do you keep it warm and shared, and what is the invalidation story when you retrain a better population model without restarting every container at once?
* Answer:
* Verdict:
* Explanation:

### I4: Batch personalization at scale
* Question: Recomputing per-user offsets for 50k patients nightly. Why is the offset model embarrassingly parallel (each user independent), how would you shard the job, and what is the cost ceiling versus retraining a per-user model (which the PLAN forbids anyway)?
* Answer:
* Verdict:
* Explanation:

### I5: The cost curve
* Question: Retrieval/storage is cheap, the food model inference and any future hosted LLM narration is expensive. If the clinic runs 1M predictions a month, name two levers to cut per-prediction cost (smaller quantized ONNX model, caching identical photos, batching) without a meaningful accuracy hit.
* Answer:
* Verdict:
* Explanation:

### I6: Multi-region and data residency
* Question: The clinic is in the EU, your Lambda is us-east-1. What breaks legally and latency-wise, and what is the minimal change (region-pinned deploy, EU Postgres, no cross-region biometric transfer) to make the data residency story honest?
* Answer:
* Verdict:
* Explanation:
