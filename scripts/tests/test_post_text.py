import pytest
import subprocess

from pathlib import Path
from ..models import db, Text, Word

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
    expected_stored_contents = 'This is a "sample" text.\n\n With newlines  !'

    stored_texts = Text.select()
    stored_text = stored_texts.where(Text.title == "sample").get()

    assert len(stored_texts) == 1
    assert stored_text.contents == expected_stored_contents

    # Check correct words created
    expected_raw_forms = ['This', 'is', 'a', '"sample"', 'text.', 'With', 'newlines','!']
    expected_normal_forms = ["this", "is", "a", "sample", "text", "with", "newlines", "!"]
    expected_text_poss = [0, 1, 2, 3, 4, 6, 7, 8]

    stored_words = Word.select()
    for i, stored_word in enumerate(stored_words):
        assert stored_word.raw_form == expected_raw_forms[i]
        assert stored_word.normal_form == expected_normal_forms[i]
        assert stored_word.text_id.id == stored_text.id
        assert stored_word.text_pos == expected_text_poss[i]




    db.close()