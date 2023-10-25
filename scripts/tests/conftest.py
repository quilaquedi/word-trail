import pytest
import subprocess
import psycopg2

from pathlib import Path
from ..dbconfig import read_local_config

TEST_DIR = Path(__file__).parent


@pytest.fixture(scope="module")
def setup_test_db():
    # Create test database
    dbname = "testdb"
    config = read_local_config()
    conn = psycopg2.connect(**config)
    conn.autocommit = True
    cur = conn.cursor()
    try:
        cur.execute(f"CREATE DATABASE {dbname}")
    except psycopg2.errors.DuplicateDatabase:
        # If test database already exists, delete it and create a new one.
        cur.execute(f"DROP DATABASE {dbname}")
        cur.execute(f"CREATE DATABASE {dbname}")
    finally:
        conn.close()

    # Create tables in test database
    args = ["python", TEST_DIR.parent / "init-stores.py", "--database", dbname]
    subprocess.run(args, check=True)

    dbconfig = {**config}
    dbconfig["dbname"] = dbname
    yield dbconfig

    # Teardown test db
    conn = psycopg2.connect(**config)
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(f"DROP DATABASE {dbname}")
    conn.close()
