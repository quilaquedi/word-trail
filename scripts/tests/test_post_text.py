import pytest
import subprocess

from pathlib import Path
from ..models import db, Text, Word, WordComparison

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


@pytest.fixture(scope="function")
def test_db(setup_test_db):
    yield setup_test_db

    db.init(setup_test_db)
    db.connect()

    # Delete any data inserted during test execution
    WordComparison.delete().execute()
    Word.delete().execute()
    Text.delete().execute()

    db.close()


def test_post_first_text(test_db):
    # Run command
    args = [
        "python",
        TEST_DIR.parent / "post-text.py",
        "--filepath",
        TEST_DIR / "data" / "source_texts" / "sample.txt",
        "--language",
        "EN",
        "--database",
        test_db,
    ]
    subprocess.run(args, check=True)

    db.init(test_db)
    db.connect()

    # Check correct text entry created
    expected_stored_contents = 'This is a "sample" text.\n\n With newlines  ! A\n'

    stored_texts = Text.select()
    stored_text = stored_texts.where(Text.title == "sample").get()

    assert len(stored_texts) == 1
    assert stored_text.contents == expected_stored_contents

    # Check correct words created
    expected_raw_forms = [
        "This",
        "is",
        "a",
        '"sample"',
        "text.",
        "With",
        "newlines",
        "!",
        "A",
    ]
    expected_normal_forms = [
        "this",
        "is",
        "a",
        "sample",
        "text",
        "with",
        "newlines",
        "!",
        "a",
    ]
    expected_text_poss = [0, 1, 2, 3, 4, 6, 7, 8, 9]
    expected_text_start_locs = [0, 5, 8, 10, 19, 27, 32, 42, 44]

    stored_words = Word.select()
    for i, stored_word in enumerate(stored_words):
        assert stored_word.raw_form == expected_raw_forms[i]
        assert stored_word.normal_form == expected_normal_forms[i]
        assert stored_word.text_id.id == stored_text.id
        assert stored_word.text_pos == expected_text_poss[i]
        assert stored_word.text_start_loc == expected_text_start_locs[i]

    # Check correct word comparisons created
    BaseWord = Word.alias()
    CompWord = Word.alias()
    comparisons = (
        WordComparison.select(WordComparison, BaseWord, CompWord)
        .join(BaseWord, on=(WordComparison.base_id == BaseWord.id), attr="base_word")
        .switch(WordComparison)
        .join(CompWord, on=(WordComparison.comp_id == CompWord.id), attr="comp_word")
    )
    assert len(comparisons) == 1
    for comparison in comparisons:
        assert comparison.base_word.text_pos == 2
        assert comparison.comp_word.text_pos == 9

    db.close()


def test_post_additional_text(test_db):
    # Run commands
    args_1 = [
        "python",
        TEST_DIR.parent / "post-text.py",
        "--filepath",
        TEST_DIR / "data" / "source_texts" / "Text 1.txt",
        "--language",
        "EN",
        "--database",
        test_db,
    ]
    subprocess.run(args_1, check=True)
    args_2 = [
        "python",
        TEST_DIR.parent / "post-text.py",
        "--filepath",
        TEST_DIR / "data" / "source_texts" / "Text 2.txt",
        "--language",
        "EN",
        "--database",
        test_db,
    ]
    subprocess.run(args_2, check=True)

    db.init(test_db)
    db.connect()

    # Check correct word comparisons created
    BaseWord = Word.alias()
    CompWord = Word.alias()
    comparisons = (
        WordComparison.select(WordComparison, BaseWord, CompWord)
        .join(BaseWord, on=(WordComparison.base_id == BaseWord.id), attr="base_word")
        .switch(WordComparison)
        .join(CompWord, on=(WordComparison.comp_id == CompWord.id), attr="comp_word")
    )
    assert len(comparisons) == 1
    for comparison in comparisons:
        assert comparison.base_word.id != comparison.comp_word.id
        assert comparison.base_word.text_pos == 1
        assert comparison.comp_word.text_pos == 1


def test_when_invalid_language_code(test_db):
    # Run command
    args = [
        "python",
        TEST_DIR.parent / "post-text.py",
        "--filepath",
        TEST_DIR / "data" / "source_texts" / "sample.txt",
        "--language",
        "ER",
        "--database",
        test_db,
    ]
    with pytest.raises(subprocess.CalledProcessError):
        subprocess.run(args, check=True)
