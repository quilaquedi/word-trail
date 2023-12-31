from peewee import (
    PostgresqlDatabase,
    Model,
    AutoField,
    CharField,
    ForeignKeyField,
    IntegerField,
    BooleanField,
    TextField,
    FixedCharField,
)


db = PostgresqlDatabase(None)


class BaseModel(Model):
    class Meta:
        database = db


class Text(BaseModel):
    id = AutoField(primary_key=True)
    title = CharField(unique=True)
    contents = TextField()
    language = FixedCharField(max_length=2)


class Word(BaseModel):
    id = AutoField(primary_key=True)
    raw_form = CharField()
    normal_form = CharField()
    text_id = ForeignKeyField(Text, backref="words")
    text_pos = IntegerField()
    text_start_loc = IntegerField()


class WordComparison(BaseModel):
    base_id = ForeignKeyField(Word, backref="from_comparisons")
    comp_id = ForeignKeyField(Word, backref="to_comparisons")
    is_match = BooleanField()

    class Meta:
        indexes = (
            # Specify a unique multi-column index
            (("base_id", "comp_id"), True),
        )
