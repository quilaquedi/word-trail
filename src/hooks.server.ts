import { db } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { text_ } from '$lib/server/db_schema';

async function loadTutorialIdFromDb(_db) {
	const result = await _db
		.select({
			id: text_.id
		})
		.from(text_)
		.where(eq(text_.title, 'Tutorial'));
	return result['0'].id;
}

async function loadTutorialSlug(_db) {
	const tutorialId = await loadTutorialIdFromDb(_db);
	const tutorialSlug = tutorialId + '-' + 'tutorial';
	return tutorialSlug;
}

export const handle = (async ({ event, resolve }) => {
	const tutorialSlug = await loadTutorialSlug(db);
	event.locals.db = db;
	event.locals.tutorialRoute = 'texts/' + tutorialSlug;

	const response = await resolve(event);

	return response;
}) satisfies Handle;
