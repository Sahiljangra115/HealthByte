"""Dish to nutrition mapping. Each entry is per typical serving:
kcal_mean, kcal_std (serving-to-serving variance, the source of the range),
and macros in grams {p, c, f}.

Provenance: values are rounded typical-serving figures compiled from public
nutrition references (USDA FoodData Central style). They are approximate by
nature, which is exactly why the estimator outputs a range, never a point.
The kcal_std encodes how much a single serving realistically varies.
"""
from __future__ import annotations

# A real subset of Food-101 class names mapped to nutrition. Extend as needed.
NUTRITION_DB: dict[str, dict] = {
    "pizza": {"kcal_mean": 285, "kcal_std": 70, "macros": {"p": 12, "c": 36, "f": 10}},
    "hamburger": {"kcal_mean": 540, "kcal_std": 120, "macros": {"p": 25, "c": 40, "f": 27}},
    "hot_dog": {"kcal_mean": 290, "kcal_std": 60, "macros": {"p": 11, "c": 23, "f": 17}},
    "french_fries": {"kcal_mean": 365, "kcal_std": 90, "macros": {"p": 4, "c": 48, "f": 17}},
    "caesar_salad": {"kcal_mean": 190, "kcal_std": 60, "macros": {"p": 6, "c": 9, "f": 14}},
    "greek_salad": {"kcal_mean": 150, "kcal_std": 45, "macros": {"p": 5, "c": 11, "f": 10}},
    "sushi": {"kcal_mean": 250, "kcal_std": 55, "macros": {"p": 9, "c": 38, "f": 6}},
    "sashimi": {"kcal_mean": 160, "kcal_std": 40, "macros": {"p": 26, "c": 1, "f": 5}},
    "ramen": {"kcal_mean": 440, "kcal_std": 100, "macros": {"p": 18, "c": 55, "f": 16}},
    "pho": {"kcal_mean": 350, "kcal_std": 80, "macros": {"p": 22, "c": 45, "f": 6}},
    "pad_thai": {"kcal_mean": 480, "kcal_std": 110, "macros": {"p": 16, "c": 60, "f": 18}},
    "fried_rice": {"kcal_mean": 420, "kcal_std": 95, "macros": {"p": 11, "c": 58, "f": 14}},
    "spaghetti_bolognese": {"kcal_mean": 460, "kcal_std": 100, "macros": {"p": 20, "c": 60, "f": 14}},
    "lasagna": {"kcal_mean": 410, "kcal_std": 95, "macros": {"p": 22, "c": 32, "f": 21}},
    "macaroni_and_cheese": {"kcal_mean": 390, "kcal_std": 85, "macros": {"p": 14, "c": 44, "f": 17}},
    "risotto": {"kcal_mean": 350, "kcal_std": 80, "macros": {"p": 9, "c": 50, "f": 11}},
    "steak": {"kcal_mean": 480, "kcal_std": 130, "macros": {"p": 46, "c": 0, "f": 32}},
    "fried_chicken": {"kcal_mean": 410, "kcal_std": 100, "macros": {"p": 30, "c": 16, "f": 25}},
    "grilled_salmon": {"kcal_mean": 330, "kcal_std": 70, "macros": {"p": 34, "c": 0, "f": 21}},
    "tacos": {"kcal_mean": 230, "kcal_std": 60, "macros": {"p": 11, "c": 20, "f": 12}},
    "burrito": {"kcal_mean": 580, "kcal_std": 140, "macros": {"p": 22, "c": 70, "f": 22}},
    "guacamole": {"kcal_mean": 160, "kcal_std": 40, "macros": {"p": 2, "c": 9, "f": 15}},
    "dumplings": {"kcal_mean": 280, "kcal_std": 65, "macros": {"p": 12, "c": 33, "f": 11}},
    "spring_rolls": {"kcal_mean": 180, "kcal_std": 50, "macros": {"p": 5, "c": 24, "f": 7}},
    "pancakes": {"kcal_mean": 350, "kcal_std": 90, "macros": {"p": 8, "c": 52, "f": 12}},
    "waffles": {"kcal_mean": 310, "kcal_std": 80, "macros": {"p": 7, "c": 41, "f": 13}},
    "omelette": {"kcal_mean": 250, "kcal_std": 60, "macros": {"p": 17, "c": 3, "f": 19}},
    "french_toast": {"kcal_mean": 330, "kcal_std": 80, "macros": {"p": 11, "c": 38, "f": 15}},
    "donuts": {"kcal_mean": 280, "kcal_std": 70, "macros": {"p": 4, "c": 34, "f": 15}},
    "ice_cream": {"kcal_mean": 270, "kcal_std": 70, "macros": {"p": 5, "c": 31, "f": 14}},
    "cheesecake": {"kcal_mean": 400, "kcal_std": 95, "macros": {"p": 7, "c": 38, "f": 25}},
    "chocolate_cake": {"kcal_mean": 370, "kcal_std": 90, "macros": {"p": 5, "c": 50, "f": 17}},
    "apple_pie": {"kcal_mean": 320, "kcal_std": 80, "macros": {"p": 3, "c": 45, "f": 14}},
    "tiramisu": {"kcal_mean": 360, "kcal_std": 85, "macros": {"p": 6, "c": 38, "f": 21}},
}


def lookup(dish: str) -> dict | None:
    return NUTRITION_DB.get(dish)
