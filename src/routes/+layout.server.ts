import { text_ } from '$lib/server/db_schema';
import languages from '$lib/server/data/languages.json';

import type { PageServerLoad } from './$types';
import type { TextInfo } from '$lib/types';

async function loadTextListFromDb(db) {
	const result = await db
		.select({ id: text_.id, title: text_.title, langCode: text_.language })
		.from(text_)
		.where();
	return result;
}

async function loadTextInfos(db) {
	const textList = await loadTextListFromDb(db);
	const languageCodes = [...new Set(textList.map((x) => x.langCode))];
	const languageNames = new Map(
		languages.filter((l) => languageCodes.includes(l.Code)).map((l) => [l.Code, l.NativeName])
	);
	const textInfos: TextInfo[] = textList.map((t) => {
		return {
			id: t.id,
			title: t.title,
			language: languageNames.get(t.langCode),
			slug: t.id + '-' + t.title.toLowerCase()
		};
	});
	return textInfos;
}

export const load = (({ locals }) => {
	// Load list of available texts, for menu
	return { textInfos: loadTextInfos(locals.db) };
}) satisfies PageServerLoad;
