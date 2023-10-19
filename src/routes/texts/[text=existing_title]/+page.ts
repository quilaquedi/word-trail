import type { PageServerLoad } from './$types';

// Redirect visitors to base URL to Tutorial page
export const load = (({ url }) => {
	if (url.searchParams.get('context') === null) {
		return {
			widerContext: null
		};
	} else {
		return {
			widerContext: 'Here we have a wider context for the This is a clickable context button.'
		};
	}
}) satisfies PageServerLoad;
