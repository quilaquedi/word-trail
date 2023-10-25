import { db } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	event.locals = db;

	const response = await resolve(event);

	return response;
}) satisfies Handle;
