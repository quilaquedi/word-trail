import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	// const dbTexts =
	const existingTexts = ['x-tutorial-en', '1-immensee'];
	return existingTexts.includes(param);
};
