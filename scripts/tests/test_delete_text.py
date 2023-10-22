import pytest
import subprocess

from pathlib import Path
from ..models import db, Text

TEST_DIR = Path(__file__).parent


@pytest.fixture(scope="module")
def setup_test_db():
    # Create test sqlite db
    db_path = TEST_DIR / "data" / "wordtrail.db"
    args = ["python", TEST_DIR.parent / "init-stores.py", "--db_path", db_path]
    subprocess.run(args, check=True)
    # Initialize test db
    db.init(db_path)

    yield db_path

    # Teardown test db
    subprocess.run(["rm", db_path], check=True)


def test_delete_text(setup_test_db):
    test_db = setup_test_db
    # Add texts to database
    post_1_args = [
        "python",
        TEST_DIR.parent / "post-text.py",
        "--filepath",
        TEST_DIR / "data" / "source_texts" / "sample.txt",
        "--language",
        "EN",
        "--database",
        test_db,
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
        test_db,
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
        test_db,
    ]
    subprocess.run(args, check=True)

    db.init(test_db)
    db.connect()

    # Check correct entries deleted
    assert Text.select().where(Text.title == DELETED_TITLE).count() == 0
    assert Text.select().count() == 1

    db.close()
