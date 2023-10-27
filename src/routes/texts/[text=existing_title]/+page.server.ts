import { eq } from 'drizzle-orm';
import { text_, word, wordComparison } from '$lib/server/db_schema';

import type { PageServerLoad } from './$types';
import type { Context, Contexts, Text } from '$lib/types';

const LEADING_CHAR_COUNT = 10;
const TRAILING_CHAR_COUNT = 100;

async function loadTutorialIdFromDb(textId: number, db) {
	const result = await db
		.select({ id: text_.title })
		.from(text_)
		.where(eq(text_.title, 'Tutorial'));
	return result['0'].id;
}

async function loadTextTitleFromDb(textId: number, db) {
	const result = await db.select({ title: text_.title }).from(text_).where(eq(text_.id, textId));
	return result['0'].title;
}

async function loadTextWordsFromDb(textId: number, db) {
	const result = await db
		.select({
			id: word.id,
			rawForm: word.rawForm,
			textPos: word.textPos
		})
		.from(word)
		.where(eq(word.textId, textId))
		.orderBy(word.textPos);
	return result;
}

async function loadSimilarWordsFromDb(wordId: number, db) {
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
	const asBaseResult = await db
		.select({
			id: asBaseSq.id,
			StartLoc: word.textStartLoc,
			rawForm: word.rawForm,
			textId: word.textId
		})
		.from(asBaseSq)
		.innerJoin(word, eq(asBaseSq.id, word.id))
		.orderBy(word.id);
	const asCompResult = await db
		.select({
			id: asCompSq.id,
			StartLoc: word.textStartLoc,
			rawForm: word.rawForm,
			textId: word.textId
		})
		.from(asCompSq)
		.innerJoin(word, eq(asCompSq.id, word.id))
		.orderBy(word.id);
	return [...asBaseResult, ...asCompResult];
}

async function loadTextFromDb(textId: number, db) {
	const result = await db
		.select({ contents: text_.contents })
		.from(text_)
		.where(eq(text_.id, textId));
	return result['0'].contents;
}

async function loadContextsFromDb(wordId: number, db) {
	const similarWords = await loadSimilarWordsFromDb(wordId, db);
	const relevantTextIds = new Set(similarWords.map((x) => x.textId));
	const contexts: Context[] = [];
	for await (const textId of relevantTextIds) {
		const fullText = await loadTextFromDb(textId, db);
		const words = similarWords.filter((word) => word.textId == textId);
		const newContexts = words.map((word) => {
			const offset = word.StartLoc > LEADING_CHAR_COUNT ? LEADING_CHAR_COUNT : 0;
			return {
				wordId: word.id,
				text: fullText.substring(
					word.StartLoc - LEADING_CHAR_COUNT,
					word.StartLoc + TRAILING_CHAR_COUNT
				),
				wordLoc: [offset, offset + word.rawForm.length]
			};
		});
		contexts.push(...newContexts);
	}
	return contexts;
}

async function loadTextTitle(textId: string, db) {
	let title: string;
	switch (textId) {
		case 'x':
			title = 'Tutorial';
			break;
		default:
			title = await loadTextTitleFromDb(Number(textId), db);
	}
	return title;
}

async function loadText(textId: string, db) {
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
			text = await loadTextWordsFromDb(Number(textId), db);
	}
	return text;
}

async function loadContexts(wordId: string | null, db) {
	let context: Context;
	let contexts: Contexts | undefined;
	let sameContexts: Context[];
	switch (wordId) {
		case null:
			contexts = undefined;
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
			sameContexts = await loadContextsFromDb(Number(wordId), db);
			contexts = { same: sameContexts, spelling: [], meaning: [] };
	}
	return contexts;
}

export const load = (({ url, params, locals }) => {
	const db = locals.db;
	// Load text
	const textId = params.text.split('-')[0];
	const textTitle = loadTextTitle(textId, db);
	const text = loadText(textId, db);

	// Load contexts for queried word
	const wordId = url.searchParams.get('word');
	const contexts = loadContexts(wordId, db);
	return {
		contexts: contexts,
		textTitle: textTitle,
		text: text
	};
}) satisfies PageServerLoad;
