import type { PageServerLoad } from './$types';

import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { text_, word, wordComparison } from '$lib/server/db_schema';
import type { Context, Contexts, Text } from '$lib/types';

const LEADING_CHAR_COUNT = 10;
const TRAILING_CHAR_COUNT = 100;

const sqlite = new Database('data/wordtrail.db');
const db: BetterSQLite3Database = drizzle(sqlite);

function loadTextTitleFromDb(textId: number) {
	const result = db.select({ title: text_.title }).from(text_).where(eq(text_.id, textId)).all();
	return result['0'].title;
}

function loadTextWordsFromDb(textId: number) {
	const result = db
		.select({
			id: word.id,
			rawForm: word.rawForm,
			textPos: word.textPos
		})
		.from(word)
		.where(eq(word.textId, textId))
		.orderBy(word.textPos)
		.all();
	return result;
}

function loadSimilarWordsFromDb(wordId: number) {
	const asBaseSq = db
		.select({
			id: wordComparison.compId
		})
		.from(wordComparison)
		.where(eq(wordComparison.baseId, wordId))
		.as('asBaseSq');
	const asCompSq = db
		.select({
			id: wordComparison.baseId
		})
		.from(wordComparison)
		.where(eq(wordComparison.compId, wordId))
		.as('asCompSq');
	const asBaseResult = db
		.select({
			id: asBaseSq.id,
			locStart: word.textPos,
			rawForm: word.rawForm,
			textId: word.textId
		})
		.from(asBaseSq)
		.innerJoin(word, eq(asBaseSq.id, word.id))
		.orderBy(word.id)
		.all();
	const asCompResult = db
		.select({
			id: asCompSq.id,
			locStart: word.textPos,
			rawForm: word.rawForm,
			textId: word.textId
		})
		.from(asCompSq)
		.innerJoin(word, eq(asCompSq.id, word.id))
		.orderBy(word.id)
		.all();
	return [...asBaseResult, ...asCompResult];
}

function loadTextFromDb(textId: number) {
	const result = db
		.select({ contents: text_.contents })
		.from(text_)
		.where(eq(text_.id, textId))
		.all();
	return result['0'].contents;
}

function loadContextsFromDb(wordId: number) {
	const similarWords = loadSimilarWordsFromDb(wordId);
	const relevantTextIds = new Set(similarWords.map((x) => x.textId));
	const contexts: Context[] = [];
	relevantTextIds.forEach((textId) => {
		const fullText = loadTextFromDb(textId);
		const words = similarWords.filter((word) => word.textId == textId);
		const newContexts = words.map((word) => {
			return {
				wordId: word.id,
				text: fullText.substring(
					word.locStart - LEADING_CHAR_COUNT,
					word.locStart + TRAILING_CHAR_COUNT
				),
				wordLoc: [LEADING_CHAR_COUNT, LEADING_CHAR_COUNT + word.rawForm.length]
			};
		});
		contexts.push(...newContexts);
	});
	return contexts;
}

function loadTextTitle(textId: string) {
	let title: string;
	switch (textId) {
		case 'x':
			title = 'Tutorial';
			break;
		default:
			title = loadTextTitleFromDb(Number(textId));
	}
	return title;
}

function loadText(textId: string) {
	const dummyText = [
		{ id: 'A', rawForm: 'This', textPos: 0 },
		{ id: 'B', rawForm: 'is', textPos: 1 },
		{ id: 'C', rawForm: 'a', textPos: 2 },
		{ id: 'D', rawForm: 'text.', textPos: 3 },
		{ id: 'D1', rawForm: 'That', textPos: 4 },
		{ id: 'D2', rawForm: 'sea', textPos: 5 },
		{ id: 'D3', rawForm: 'is', textPos: 6 },
		{ id: 'D4', rawForm: 'blue.', textPos: 7 },
		{ id: 'E', rawForm: 'Click', textPos: 8 },
		{ id: 'F', rawForm: 'on', textPos: 9 },
		{ id: 'G', rawForm: 'the', textPos: 10 },
		{ id: 'H', rawForm: 'second', textPos: 11 },
		{ id: 'I', rawForm: 'word.', textPos: 12 }
	];
	let text: Text;
	switch (textId) {
		case 'x':
			text = dummyText;
			break;
		case 'y':
			text = dummyText;
			break;
		default:
			text = loadTextWordsFromDb(Number(textId));
	}
	return text;
}

function loadContexts(wordId: string | null) {
	let context: Context;
	let contexts: Contexts;
	switch (wordId) {
		case null:
			contexts = { same: [], spelling: [], meaning: [] };
			break;
		case 'B':
			context = { wordId: 'D3', text: 'sea is blue. Click on the second word.', wordLoc: [4, 6] };
			contexts = { same: [context], spelling: [], meaning: [] };
			break;
		case 'D3':
			context = {
				wordId: 'B',
				text: 'This is a text. That sea is blue. Click on the second word.',
				wordLoc: [5, 7]
			};
			contexts = { same: [context], spelling: [], meaning: [] };
			break;
		default:
			contexts = { same: loadContextsFromDb(Number(wordId)), spelling: [], meaning: [] };
	}
	return contexts;
}

export const load = (({ url, params }) => {
	// Load text
	const textId = params.text.split('-')[0];
	const textTitle = loadTextTitle(textId);
	const text = loadText(textId);

	// Load contexts for queried word
	const wordId = url.searchParams.get('word');
	const contexts = loadContexts(wordId);
	return {
		contexts: contexts,
		textTitle: textTitle,
		text: text
	};
}) satisfies PageServerLoad;
