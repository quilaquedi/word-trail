import csv
from pathlib import Path

STORE_PATH = Path(__file__).parent / "data" / "store"

csv.writer((STORE_PATH / "texts.csv").open("w+")).writerow(
    ["id", "title", "string"]
)
csv.writer((STORE_PATH / "words.csv").open("w+")).writerow(
    ["id", "raw_form", "normal_form", "text_id"]
)
csv.writer((STORE_PATH / "distances.csv").open("w+")).writerow(
    ["base_id", "comp_id", "match"]
)
csv.writer((STORE_PATH / "contexts.csv").open("w+")).writerow(
    ["word_id", "text_id", "position"]
)