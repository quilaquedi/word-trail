import subprocess

from pathlib import Path
from ..models import db, Text
from ..dbconfig import init_db, PsycopgDBConfig

TEST_DIR = Path(__file__).parent


def test_delete_text(setup_test_db):
    dbconfig: PsycopgDBConfig = setup_test_db
    # Add texts to database
    post_1_args = [
        "python",
        TEST_DIR.parent / "post-text.py",
        "--filepath",
        TEST_DIR / "data" / "source_texts" / "sample.txt",
        "--language",
        "EN",
        "--database",
        dbconfig["dbname"],
    ]
    subprocess.run(post_1_args, check=True)

    post_2_args = [
        "python",
        TEST_DIR.parent / "post-text.py",
        "--filepath",
        TEST_DIR / "data" / "source_texts" / "Text 1.txt",
        "--language",
        "EN",
        "--database",
        dbconfig["dbname"],
    ]
    subprocess.run(post_2_args, check=True)

    # Run command
    DELETED_TITLE = "sample"
    args = [
        "python",
        TEST_DIR.parent / "delete-text.py",
        "--title",
        DELETED_TITLE,
        "--database",
        dbconfig["dbname"],
    ]
    subprocess.run(args, check=True)

    init_db(db, dbconfig)
    db.connect()

    # Check correct entries deleted
    assert Text.select().where(Text.title == DELETED_TITLE).count() == 0
    assert Text.select().count() == 1

    db.close()
