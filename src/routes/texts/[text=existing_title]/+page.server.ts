import { eq } from 'drizzle-orm';
import { text_, word, wordComparison } from '$lib/server/db_schema';
import dummySameContexts from '$lib/server/data/dummySameContexts.json';
import dummyTexts from '$lib/server/data/dummyTexts.json';
import dummyTitles from '$lib/server/data/dummyTitles.json';

import type { PageServerLoad } from './$types';
import type { Context, Contexts } from '$lib/types';

const LEADING_CHAR_COUNT = 10;
const TRAILING_CHAR_COUNT = 100;

async function loadTextTitleFromDb(textId: number, db) {
	const result = await db.select({ title: text_.title }).from(text_).where(eq(text_.id, textId));
	return result['0'].title;
}

async function loadTextWordsFromDb(textId: number, db) {
	const result = await db
		.select({ id: word.id, rawForm: word.rawForm, textPos: word.textPos })
		.from(word)
		.where(eq(word.textId, textId))
		.orderBy(word.textPos);
	return result;
}

async function loadSimilarWordsFromDb(wordId: number, db) {
	const asBaseSq = db
		.select({ id: wordComparison.compId })
		.from(wordComparison)
		.where(eq(wordComparison.baseId, wordId))
		.as('asBaseSq');
	const asCompSq = db
		.select({ id: wordComparison.baseId })
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
				context: fullText.substring(
					word.StartLoc - LEADING_CHAR_COUNT,
					word.StartLoc + TRAILING_CHAR_COUNT
				),
				matchStart: offset,
				matchEnd: offset + word.rawForm.length
			};
		});
		contexts.push(...newContexts);
	}
	return contexts;
}

async function loadContexts(wordId: string | null, db) {
	let contexts: Contexts | undefined;
	let sameContexts: Context[];
	switch (wordId) {
		case null:
			contexts = undefined;
			break;
		default:
			sameContexts = dummySameContexts[wordId] ?? (await loadContextsFromDb(Number(wordId), db));
			contexts = { same: sameContexts, spelling: [], meaning: [] };
	}
	return contexts;
}

export const load: PageServerLoad = async ({ url, params, locals }) => {
	const db = locals.db;
	// Load text
	const textId = params.text.split('-')[0];
	const textTitle = dummyTitles[textId] ?? (await loadTextTitleFromDb(Number(textId), db));
	const text = dummyTexts[textId] ?? (await loadTextWordsFromDb(Number(textId), db));

	// Load contexts for queried word
	const wordId = url.searchParams.get('word');
	const contexts = loadContexts(wordId, db);
	return {
		contexts: await contexts,
		textTitle: await textTitle,
		text: await text
	};
};
