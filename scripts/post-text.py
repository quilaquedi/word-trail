from argparse import ArgumentParser
from pathlib import Path
import json
import re

from models import db, Text, Word, WordComparison
from loguru import logger
from tqdm import tqdm

DB_PATH = Path(__file__).parent / "data" / "wordtrail.db"
LANGUAGE_CODES_PATH = Path(__file__).parent / "data" / "languages.json"
INSERT_BATCH_SIZE = 60_000


def clean_word(word: str):
    if re.fullmatch(pattern=r"\W+", string=word):
        return word
    else:
        return re.sub(pattern=r"^\W*(.*\w)\W*$", repl=r"\1", string=word.lower())


def compare_words(word_pair) -> WordComparison:
    base_word, comp_word = word_pair
    match_comparison = base_word["normal_form"] == comp_word["normal_form"]
    return WordComparison(
        base_id=base_word["id"],
        comp_id=comp_word["id"],
        is_match=match_comparison,
    )


parser = ArgumentParser(description="Adds a text to the corpus.")
parser.add_argument("--title", type=str, required=False)
parser.add_argument("--filepath", type=Path, required=True)
parser.add_argument("--language", type=str, required=True)
parser.add_argument("--database", type=Path, default=DB_PATH)
args = parser.parse_args()

# Check language is a valid ISO 639-1 code
language = args.language.lower()

valid_codes = []
with open(LANGUAGE_CODES_PATH) as f:
    valid_codes = [json.loads(line)["Code"] for line in f]

if language not in valid_codes:
    raise ValueError("Language must be a valid ISO 639-I code.")

# Read the text and title
with open(args.filepath) as f:
    text_contents = f.read()
if args.title:
    text_title = args.title
else:
    text_title = args.filepath.stem
text = Text(title=text_title, contents=text_contents, language=language)

# Parse words in text
cleaned_newlines = re.sub(pattern=r"\s*\n\s*", repl=" \n ", string=text_contents)
raw_words_with_newlines = re.split(pattern=" +", string=cleaned_newlines)
words = [
    Word(raw_form=word, normal_form=clean_word(word), text_id=None, text_pos=i)
    for i, word in enumerate(raw_words_with_newlines)
    if word not in ["\n", ""]
]

# Connect to the database
db.init(args.database)
db.connect()

# Add text to the database
text.save()
logger.info(f"Text record for {text_title} created.")

# Add words to the database
word_count = 0
for word in words:
    word.text_id = text.id
    word_count += 1
with db.atomic():
    Word.bulk_create(words, batch_size=INSERT_BATCH_SIZE)
logger.info(f"{word_count} word records created for {text_title}.")

# Make word comparisons

# SQLite objects can't be used in another thread, so load words as dicts
all_words = [x for x in Word.select().dicts()]
new_words = [x for x in text.words.dicts()]  # Load inserted words to get their ids.

within_text_pairs = (
    (base_word, comp_word)
    for base_word in new_words
    for comp_word in new_words
    if base_word["text_pos"] < comp_word["text_pos"]
)
across_text_pairs = (
    (base_word, comp_word)
    for base_word in all_words
    for comp_word in new_words
    if base_word["text_id"] != comp_word["text_id"]
)

# Add word comparisons to the database
within_text_comparisons = tqdm(map(compare_words, within_text_pairs))
across_text_comparisons = tqdm(map(compare_words, across_text_pairs))
with db.atomic():
    WordComparison.bulk_create(within_text_comparisons, batch_size=INSERT_BATCH_SIZE)
    WordComparison.bulk_create(across_text_comparisons, batch_size=INSERT_BATCH_SIZE)
logger.info(f"Word comparison records created for {text_title}.")


# Close database connection
db.close()
