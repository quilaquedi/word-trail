import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { tutorial_route } from "./titles";

// Redirect visitors to base URL to Tutorial page
export const load: LayoutServerLoad = () => {
	throw redirect(302, tutorial_route);
};