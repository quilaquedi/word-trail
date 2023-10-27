from configparser import ConfigParser
from pathlib import Path
from typing import TypedDict

from peewee import PostgresqlDatabase

_LOCAL_CONFIG_PATH = Path(__file__).parent / ".db.config"
_VERCEL_CONFIG_PATH = Path(__file__).parent.parent / ".env.local"
_NEON_CONFIG_PATH = Path(__file__).parent.parent / ".env.local"


class PsycopgDBConfig(TypedDict):
    user: str
    password: str
    host: str
    dbname: str


def read_local_config(config_path=_LOCAL_CONFIG_PATH) -> PsycopgDBConfig:
    with open(config_path, "r") as f:
        config_string = "[dummy_section]\n" + f.read()
    config = ConfigParser()
    config.read_string(config_string)
    # Remove surrounding quotes from config values
    read_value = lambda name: config["dummy_section"].get(name)[1:-1]
    return {
        "user": read_value("local_postgres_user"),
        "password": read_value("local_postgres_password"),
        "host": read_value("local_postgres_host"),
        "dbname": read_value("local_postgres_database"),
    }


def read_vercel_config(config_path=_VERCEL_CONFIG_PATH) -> PsycopgDBConfig:
    with open(config_path, "r") as f:
        config_string = "[dummy_section]\n" + f.read()
    config = ConfigParser()
    config.read_string(config_string)
    # Remove surrounding quotes from config values
    read_value = lambda name: config["dummy_section"].get(name)[1:-1]
    return {
        "user": read_value("postgres_user"),
        "password": read_value("postgres_password"),
        "host": read_value("postgres_host"),
        "dbname": read_value("postgres_database"),
    }


def read_neon_config(config_path=_NEON_CONFIG_PATH) -> PsycopgDBConfig:
    with open(config_path, "r") as f:
        config_string = "[dummy_section]\n" + f.read()
    config = ConfigParser()
    config.read_string(config_string)
    # Remove surrounding quotes from config values
    read_value = lambda name: config["dummy_section"].get(name)[1:-1]
    return {
        "user": read_value("pguser"),
        "password": read_value("pgpassword"),
        "host": read_value("pghost"),
        "dbname": read_value("pgdatabase"),
    }


def load_config_from_args(args) -> PsycopgDBConfig:
    if args.vercel:
        dbconfig = read_vercel_config()
    elif getattr(args, "neon", None):
        dbconfig = read_neon_config()
    else:
        dbconfig = read_local_config(_LOCAL_CONFIG_PATH)
        if args.database:
            dbconfig["dbname"] = args.database
    return dbconfig


def init_db(
    db: PostgresqlDatabase, dbconfig: PsycopgDBConfig = read_local_config()
) -> None:
    config = {**dbconfig}
    config["database"] = config["dbname"]
    config.pop("dbname")
    db.init(**config)
