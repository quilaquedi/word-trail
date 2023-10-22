import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	// const dbTexts = 
	const existingTexts = ['x-tutorial-en', 'y-der-sandmann'];
	return existingTexts.includes(param);
};
