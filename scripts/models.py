from pathlib import Path

from peewee import SqliteDatabase, Model, AutoField, CharField, ForeignKeyField, IntegerField, BooleanField

DB_PATH = Path(__file__).parent / "data" / "wordtrail.db"

db = SqliteDatabase(DB_PATH)

class Text(Model):
    id = AutoField(primary_key=True)
    title = CharField()
    string = CharField()

    class Meta:
        database = db
class Word(Model):
    id = AutoField(primary_key=True)
    raw_form = CharField()
    normal_form = CharField()
    text_id = ForeignKeyField(Text, backref="words")
    text_pos = IntegerField()

    class Meta:
        database = db

class Distance(Model):
    base_id = ForeignKeyField(Word, backref="from_distances")
    comp_id = ForeignKeyField(Word, backref="to_distances")
    matching_value = BooleanField()

    class Meta:
        database = db

class Context(Model):
    word_id = ForeignKeyField(Word, backref="contexts", primary_key=True)
    start_pos = IntegerField()
    end_pos = IntegerField
    
    class Meta:
        database = db