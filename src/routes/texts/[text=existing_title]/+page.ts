import type { PageServerLoad } from './$types';



// Load contexts for selected word
export const load = (({ url }) => {
	let wordId = url.searchParams.get('word');
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
	return {
		contexts: contexts
	};
}) satisfies PageServerLoad;
