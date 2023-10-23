import type { PageServerLoad } from './$types';

import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { text_, word } from '$lib/server/db_schema';
import type { Context, Comparisons, Text } from '$lib/types';

const sqlite = new Database('data/wordtrail.db');
const db: BetterSQLite3Database = drizzle(sqlite);

function loadTextTitleFromDb(textId: number) {
	const result = db.select({ title: text_.title }).from(text_).where(eq(text_.id, textId)).all();
	return result['0'].title;
}

function loadTextFromDb(textId: number) {
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

// function loadContextsFromDb(wordId: number){

// }

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
			text = loadTextFromDb(Number(textId));
	}
	return text;
}

function loadContexts(wordId: string | null) {
	let context: Context;
	let contexts: Comparisons;
	switch (wordId) {
		case null:
			contexts = { same: [], spelling: [], meaning: [] };
			break;
		case 'B':
			context = { compId: 'D3', text: 'sea is blue. Click on the second word.', wordLoc: [4, 6] };
			contexts = { same: [context], spelling: [], meaning: [] };
			break;
		case 'D3':
			context = {
				compId: 'B',
				text: 'This is a text. That sea is blue. Click on the second word.',
				wordLoc: [5, 7]
			};
			contexts = { same: [context], spelling: [], meaning: [] };
			break;
		default:
			contexts = { same: [], spelling: [], meaning: [] };
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
