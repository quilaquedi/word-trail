from loguru import logger

from models import db, Text, Word, Distance, Context, DB_PATH

with db:
    db.create_tables([Text, Word, Distance, Context])
    logger.info(f"Tables created at {DB_PATH}.")