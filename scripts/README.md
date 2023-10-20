# README

This directory contains scripts to generate data for the WordTrail app. As the scripts are for local use, input validation (e.g. for language codes) is not thorough.

Source texts are available in the `data` directory.

## Installation

Developed with Python 3.8 on Ubuntu 20.04.

Create and activate a virtual environment: `python -m venv .env && source .env/bin/activate`

Upgrade pip and install requirements: `pip install --upgrade pip && pip install -r requirements.txt`

## Usage

All stores are currently tables in a SQLite database, but may connect to Vercel Postgres DBs in the future.

### init-stores

```[bash]
python init-stores.py
```

This script will create `texts`, `words`, `distances`, and `contexts` stores as tables in the SQLite database `data/wordtrail.db`.

### post-text

```[bash]
python scripts/post-text.py --filepath FILEPATH --language LANGUAGE-CODE
```

LANGUAGE-CODE should be an ISO 639-1 code. Enclose TITLE and/or FILEPATH in quotes as needed (if it includes spaces or special characters).

This script will:
- Add the text to the `texts` store, with the name of the file as the title.
- Add all words in the text to the `words` store.
- Add surrounding context for all words in the text to the `contexts` store.
- Compute distances between all new word pairs in the words store and add them to the `distances` store.
