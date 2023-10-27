import { expect, test } from '@playwright/test';

// Test Routes

test('tutorial page exists', async ({ page }) => {
	const response = await page.request.get('/texts/2-tutorial');
	await expect(response).toBeOK();
});

test('cannot navigate to a non-existing title', async ({ page }) => {
	const response = await page.request.get('/texts/i-do-not-exist');
	await expect(response).not.toBeOK();
});

test('if text not specified, rerouted to tutorial page', async ({ page }) => {
	const tutorial_name = '2-tutorial';
	await page.goto('/');
	await expect(page).toHaveURL('/texts/' + tutorial_name);

	await page.goto('/texts');
	await expect(page).toHaveURL('/texts/' + tutorial_name);
});
