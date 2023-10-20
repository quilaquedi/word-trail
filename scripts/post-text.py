from argparse import ArgumentParser
from pathlib import Path
import re

from models import db, Text, Word
from loguru import logger

DB_PATH = Path(__file__).parent / "data" / "wordtrail.db"

def clean_word(word: str):
    if re.fullmatch(pattern=r"\W+", string=word):
        return word
    else:
        return re.sub(pattern=r"^\W*(.*\w)\W*$",repl=r"\1", string=word.lower())

parser = ArgumentParser(description="Adds a text to the corpus.")
parser.add_argument("--title", type=str, required=False)
parser.add_argument("--filepath", type=Path, required=True)
parser.add_argument("--language", type=str, required=True)
parser.add_argument("--database", type=Path, default=DB_PATH)
args = parser.parse_args()

# Read the text and title
with open(args.filepath) as f:
    text_contents = f.read()
if args.title:
    text_title = args.title
else:
    text_title = args.filepath.stem
text = Text(title=text_title, contents=text_contents)

# Parse words in text
cleaned_newlines = re.sub(pattern=f"\s*\n\s*", repl=" \n ", string=text_contents)
raw_words_with_newlines = re.split(pattern = " +", string=cleaned_newlines)
words = [
    Word(raw_form=word, normal_form=clean_word(word), text_id=None, text_pos=i)
    for i, word in enumerate(raw_words_with_newlines)
    if word != "\n"
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


# Close database connection
db.close()