import { text, integer, boolean, char, pgTable } from 'drizzle-orm/pg-core';

export const text_ = pgTable('text', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	contents: text('contents').notNull(),
	language: char('language', { length: 2 }).notNull()
});

export const word = pgTable('word', {
	id: integer('id').primaryKey(),
	rawForm: text('raw_form').notNull(),
	normalForm: text('normal_form').notNull(),
	textId: integer('text_id').references(() => text_.id),
	textPos: integer('text_pos').notNull(),
	textStartLoc: integer('text_start_loc').notNull()
});

export const wordComparison = pgTable('wordcomparison', {
	baseId: integer('base_id').references(() => word.id),
	compId: integer('comp_id').references(() => word.id),
	isMatch: boolean('is_match')
});
