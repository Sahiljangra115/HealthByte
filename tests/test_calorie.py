from src.models.calorie_estimator import estimate


def test_range_not_point():
    out = estimate("pizza", class_conf=0.95)
    low, high = out["kcal_range"]
    assert low < high


def test_low_confidence_widens_range():
    wide = estimate("pizza", class_conf=0.2)["kcal_range"]
    narrow = estimate("pizza", class_conf=0.95)["kcal_range"]
    assert (wide[1] - wide[0]) > (narrow[1] - narrow[0])


def test_unknown_dish_is_flagged():
    out = estimate("not_a_real_dish", class_conf=0.9)
    assert out["confidence_label"] == "unknown"


def test_low_never_below_zero():
    out = estimate("guacamole", class_conf=0.1)
    assert out["kcal_range"][0] >= 0
