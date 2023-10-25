import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Redirect visitors to base texts page to Tutorial page
export const load: LayoutServerLoad = ({ locals }) => {
	throw redirect(302, locals.tutorialRoute);
};
