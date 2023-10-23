import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const text_ = sqliteTable('Text', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	contents: text('contents').notNull(),
	language: text('language').notNull()
});

export const word = sqliteTable('Word', {
	id: integer('id').primaryKey(),
	rawForm: text('raw_form').notNull(),
	normalForm: text('normal_form').notNull(),
	textId: integer('text_id').references(() => text_.id),
	textPos: integer('text_pos').notNull(),
	textStartLoc: integer('text_start_loc').notNull()
});

export const wordComparison = sqliteTable('WordComparison', {
	baseId: integer('base_id').references(() => word.id),
	compId: integer('comp_id').references(() => word.id),
	isMatch: integer('is_match', { mode: 'boolean' })
});
