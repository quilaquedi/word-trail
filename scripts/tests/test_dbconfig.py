from ..dbconfig import read_local_config, read_vercel_config
from pathlib import Path

TEST_DIR = Path(__file__).parent


def test_read_local_config():
    expected_config = {
        "user": "wt_script",
        "password": "tsrpprst",
        "host": "localhost",
        "dbname": "wordtraildb",
    }
    actual_config = read_local_config(TEST_DIR.parent / ".db.config.example")
    assert actual_config == expected_config


def test_read_vercel_config():
    read_vercel_config()
    assert True
