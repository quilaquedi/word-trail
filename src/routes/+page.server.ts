import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Redirect visitors to base URL to base texts page
export const load: LayoutServerLoad = () => {
	throw redirect(302, '/texts');
};
