from loguru import logger

from argparse import ArgumentParser
from dbconfig import (
    load_config_from_args,
    init_db,
    PsycopgDBConfig,
)
from models import Text, Word, WordComparison, db


def create_tables(dbconfig: PsycopgDBConfig) -> None:
    init_db(db, dbconfig)
    with db:
        db.create_tables([Text, Word, WordComparison])
        logger.info(f"Tables created or previously existed at {dbconfig['dbname']}.")


parser = ArgumentParser(description="Create DB tables.")
parser.add_argument(
    "--database", type=str, help="(Ignored if --vercel or --neon option is set)"
)
remote_group = parser.add_mutually_exclusive_group()
remote_group.add_argument(
    "--vercel", action="store_true", help="Use Vercel database credentials"
)
remote_group.add_argument(
    "--neon", action="store_true", help="Use Neon database credentials"
)
args, _ = parser.parse_known_args()

dbconfig = load_config_from_args(args)


create_tables(dbconfig)
