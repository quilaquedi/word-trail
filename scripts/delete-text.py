from argparse import ArgumentParser

from dbconfig import init_db, load_config_from_args
from models import db, Text
from loguru import logger

parser = ArgumentParser(description="Removes a text from the corpus.")
parser.add_argument("--title", type=str, required=True)
parser.add_argument(
    "--vercel", action="store_true", help="Use Vercel database credentials"
)
parser.add_argument(
    "--database", type=str, help="(Ignored if --vercel option is set)"
)
args, _ = parser.parse_known_args()

dbconfig = load_config_from_args(args)

# Connect to the database
init_db(db, dbconfig)
db.connect()

# Delete text from the database
text = Text.get(Text.title == args.title)
text.delete_instance(recursive=True)
logger.info(f"{args.title} and all words contained deleted from {args.database}.")

# Close database connection
db.close()
