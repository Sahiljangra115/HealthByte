import io

from fastapi.testclient import TestClient

from src.api.main import app

client = TestClient(app)


def test_health():
    body = client.get("/health").json()
    assert body["status"] == "ok"
    assert "Not medical advice" in body["disclaimer"]


def test_consent_upload_window_flow(tmpdb):
    # tmpdb patches src.store.timeseries.CFG to a throwaway db; the endpoints
    # import that same module, so they share the patched store.
    assert client.post("/consent", json={"user_id": "u1", "consent": True}).status_code == 200

    csv = "timestamp,hr,sleep_hours,steps\n2026-06-18T08:00:00,60,7,4000\n2026-06-18T09:00:00,72,7,5000\n"
    r = client.post(
        "/biometrics/upload",
        data={"user_id": "u1"},
        files={"file": ("b.csv", io.BytesIO(csv.encode()), "text/csv")},
    )
    assert r.status_code == 200
    assert r.json()["n_rows"] == 2

    w = client.get("/biometrics/u1", params={"window_hours": 87600}).json()
    assert w["user"] == "u1"
    assert len(w["rows"]) == 2


def test_upload_without_consent_blocked(tmpdb):
    csv = "timestamp,hr,sleep_hours,steps\n2026-06-18T08:00:00,60,7,4000\n"
    r = client.post(
        "/biometrics/upload",
        data={"user_id": "no_consent_user"},
        files={"file": ("b.csv", io.BytesIO(csv.encode()), "text/csv")},
    )
    assert r.status_code == 403


def test_predict_food_contract(monkeypatch):
    monkeypatch.setattr(
        "src.models.food_classifier.predict",
        lambda img: {"dish": "pizza", "class_conf": 0.9, "top5": [{"dish": "pizza", "prob": 0.9}]},
    )
    import base64

    one_px = base64.b64encode(
        bytes.fromhex("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082")
    ).decode()
    r = client.post("/predict/food", data={"image_base64": one_px})
    assert r.status_code == 200
    low, high = r.json()["kcal_range"]
    assert low < high
