import type { PageServerLoad } from './$types';

let isContexts = [
	{ wordId: 'A', text: 'This is the whole context.', wordPosition: [5, 7] },
	{ wordId: 'B', text: 'it is. And yes, another one right here.', wordPosition: [3, 6] }
];

let contexts = { same: [], spelling: [], meaning: [] };

// Load contexts for selected word
export const load = (({ url }) => {
	let wordId = url.searchParams.get('word');

	if (wordId === 'B') {
		contexts = { same: isContexts, spelling: [], meaning: [] };
	} else {
		contexts = { same: [], spelling: [], meaning: [] };
	}
	return {
		contexts: contexts
	};
}) satisfies PageServerLoad;
