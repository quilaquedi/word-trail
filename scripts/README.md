# README

This directory contains scripts to generate data for the WordTrail app.

Source texts are available in the `../data` directory.

To recreate the dev database, follow steps for installation, and then run:

```[bash]
    bash recreate-db.sh --local
```

(If progress shows 1_000_00 it/s, the job will take ~90s in total.)

## Installation

Developed with Python 3.8 and PostgreSQL 12.16 on Ubuntu 20.04.
To install, set up a local database, then install Python dependencies.

### Set up a local PostgreSQL database

Install PostgreSQL (see [PostgreSQL docs](https://www.postgresql.org/docs/current/admin.html) or [instructions for WSL2](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database#install-postgresql)).

Start your PostgreSQL server on localhost. (On WSL2: `sudo service postgresql start`)

Start a PostgreSQL session. (On WSL2, with PostgreSQL user `postgres`: `sudo -u postgres psql`)

In the PostgreSQL session:

- Create the database role `wt_script` and set a password of choice: `CREATE ROLE wt_script PASSWORD 'tsrpprst' NOSUPERUSER CREATEDB CREATEROLE LOGIN;`.

- Create dev database: `CREATE DATABASE wordtraildb WITH OWNER=wt_script;`

- End the session: `quit`

Create a config file `.db.config` in this directory with the database role and password. See `.db.config.example` for an example.

### Install Python dependencies

Create and activate a virtual environment: `python -m venv .env && source .env/bin/activate`

Upgrade pip and install requirements: `pip install --upgrade pip && pip install -r requirements.txt`

Install pre-commit hooks: `pre-commit install`

## Usage

All stores are currently tables in a local PostgreSQL database.

### init-stores

```[bash]
python init-stores.py
```

This script will create `texts`, `words`, `distances`, and `contexts` stores as tables in the database `wordtraildb`.

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
