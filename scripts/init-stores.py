from loguru import logger
from pathlib import Path

from argparse import ArgumentParser
from constants import DB_PATH
from models import Text, Word, WordComparison, db


def create_db(filepath: Path):
    db.init(filepath)
    with db:
        db.create_tables([Text, Word, WordComparison])
        logger.info(f"Tables created at {filepath}.")


parser = ArgumentParser(description="Create DB tables.")
parser.add_argument("--db_path", type=Path, default=DB_PATH)
args = parser.parse_args()

create_db(args.db_path)
