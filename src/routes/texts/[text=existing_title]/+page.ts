import type { PageServerLoad } from './$types';

function loadContexts(wordId: string) {
	let context;
	let contexts = { same: [], spelling: [], meaning: [] };
	switch (wordId) {
		case 'B':
			context = { wordId: 'D3', text: 'sea is blue. Click on the second word.', wordPosition: [4, 6] };
			contexts = { same: [context], spelling: [], meaning: [] };
			break;
		case 'D3':
			context = { wordId: 'B', text: 'This is a text. That sea is blue. Click on the second word.', wordPosition: [5, 7] };
			contexts = { same: [context], spelling: [], meaning: [] };
			break;
		default:
			contexts = { same: [], spelling: [], meaning: [] };
	}
	return contexts;
}

function loadTextTitle(textId: string) {
	let title: string;
	switch (textId) {
		case 'x':
			title="Tutorial";
			break;
		case 'y':
			title="Der Sandmann";
			break;
		default:
			title="";
	}
	return title;
}

// Load text
// Load contexts for selected word
export const load = (({ url }) => {
	const wordId = url.searchParams.get('word');
	const textId = url.pathname.split("/").at(-1).split("-")[0];
	const textTitle = loadTextTitle(textId);
	const contexts = loadContexts(wordId);
	return {
		contexts: contexts,
		textTitle: textTitle
	};
}) satisfies PageServerLoad;
