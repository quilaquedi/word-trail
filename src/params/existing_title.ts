import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
    const existingTexts = ["tutorial-en", "der-sandmann"];
	return existingTexts.includes(param);
};