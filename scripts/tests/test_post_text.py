import pytest
import subprocess

from pathlib import Path
from ..models import db, Text

TEST_DIR = Path(__file__).parent

@pytest.fixture(scope="module")
def test_db():
    # Create test sqlite db
    db_path = TEST_DIR/"data"/"wordtrail.db"
    args = [
        "python",
        TEST_DIR.parent / "init-stores.py",
        "--db_path",
        db_path
    ]
    subprocess.run(args, check=True)
    # Initialize test db
    db.init(db_path)

    yield db_path

    # Teardown test db
    subprocess.run(["rm", db_path], check=True)

def test_post_text(test_db):
    # Run command
    args = [
        "python",
        TEST_DIR.parent / "post-text.py",
        "--filepath",
        TEST_DIR/"data"/"source_texts"/"sample.txt",
        "--language",
        "EN",
        "--database",
        test_db
    ]
    subprocess.run(args, check=True)

    db.init(test_db)
    db.connect()

    # Check correct text entry created
    expected_stored_contents = 'This is a "sample" text.\n\n With newlines!'
    text_entries = Text.select()
    assert len([_ for _ in text_entries]) == 1
    assert Text.select().where(Text.title == "sample").get().contents == expected_stored_contents

    # Check correct words created

    db.close()
