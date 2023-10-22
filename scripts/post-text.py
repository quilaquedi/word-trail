from argparse import ArgumentParser
from pathlib import Path
import json
import re

from models import db, Text, Word, WordComparison
from loguru import logger

DB_PATH = Path(__file__).parent / "data" / "wordtrail.db"
LANGUAGE_CODES_PATH = Path(__file__).parent / "data" / "languages.json"


def clean_word(word: str):
    if re.fullmatch(pattern=r"\W+", string=word):
        return word
    else:
        return re.sub(pattern=r"^\W*(.*\w)\W*$", repl=r"\1", string=word.lower())


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
for word in words:
    word.text_id = text.id
    word.save()
logger.info(f"{len(words)} word records created for {text_title}.")

# Make word comparisons
all_words = Word.select()
within_text_comparisons = [
    {
        "base_word": base_word,
        "comp_word": comp_word,
        "is_match": (base_word.normal_form == comp_word.normal_form),
    }
    for base_word in words
    for comp_word in words
    if base_word.text_pos < comp_word.text_pos
]
across_text_comparisons = [
    {
        "base_word": base_word,
        "comp_word": comp_word,
        "is_match": (base_word.normal_form == comp_word.normal_form),
    }
    for base_word in all_words
    for comp_word in words
    if base_word.text_id != comp_word.text_id
]
comparisons = within_text_comparisons + across_text_comparisons

# Add word comparisons to the database
for comparison in comparisons:
    WordComparison(
        base_id=comparison["base_word"].id,
        comp_id=comparison["comp_word"].id,
        is_match=comparison["is_match"],
    ).save()
logger.info(f"{len(comparisons)} word comparison records created for {text_title}.")


# Close database connection
db.close()
