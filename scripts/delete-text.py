from argparse import ArgumentParser
from pathlib import Path

from models import db, Text
from loguru import logger

DB_PATH = Path(__file__).parent / "data" / "wordtrail.db"

parser = ArgumentParser(description="Removes a text from the corpus.")
parser.add_argument("--title", type=str, required=True)
parser.add_argument("--database", type=Path, default=DB_PATH)
args = parser.parse_args()

# Connect to the database
db.init(args.database)
db.connect()

# Delete text from the database
text = Text.get(Text.title == args.title)
text.delete_instance(recursive=True)
logger.info(f"{args.title} and all words contained deleted from {args.database}.")

# Close database connection
db.close()
