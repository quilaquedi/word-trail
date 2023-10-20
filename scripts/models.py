from peewee import SqliteDatabase, Model, AutoField, CharField, ForeignKeyField, IntegerField, BooleanField


db = SqliteDatabase(None)

class BaseModel(Model):
    class Meta:
        database = db

class Text(BaseModel):
    id = AutoField(primary_key=True)
    title = CharField()
    contents = CharField()


class Word(BaseModel):
    id = AutoField(primary_key=True)
    raw_form = CharField()
    normal_form = CharField()
    text_id = ForeignKeyField(Text, backref="words")
    text_pos = IntegerField()



class Distance(BaseModel):
    base_id = ForeignKeyField(Word, backref="from_distances")
    comp_id = ForeignKeyField(Word, backref="to_distances")
    matching_value = BooleanField()



class Context(BaseModel):
    word_id = ForeignKeyField(Word, backref="contexts", primary_key=True)
    start_pos = IntegerField()
    end_pos = IntegerField
    
