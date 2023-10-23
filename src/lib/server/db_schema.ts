import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const text_ = sqliteTable('Text', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	contents: text('contents'),
	language: text('language')
});

export const word = sqliteTable('Word', {
	id: integer('id').primaryKey(),
	rawForm: text('raw_form').notNull(),
	normalForm: text('normal_form'),
	textId: integer('text_id').references(() => text_.id),
	textPos: integer('text_pos').notNull()
});
