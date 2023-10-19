import { expect, test } from '@playwright/test';

// Test Routes

test('tutorial page exists', async ({ page }) => {
	const response = await page.request.get('/texts/tutorial-en');
	await expect(response).toBeOK();
});

test('cannot navigate to a non-existing title', async ({ page }) => {
	const response = await page.request.get('/texts/i-do-not-exist');
	await expect(response).not.toBeOK();
});

test('if text not specified, rerouted to tutorial page', async ({ page }) => {
	const tutorial_name = 'tutorial-en';
	await page.goto('/');
	await expect(page).toHaveURL('/texts/' + tutorial_name);

	await page.goto('/texts');
	await expect(page).toHaveURL('/texts/' + tutorial_name);
});

// Test Components are visible

test('text page displays required components', async ({ page }) => {
	await page.goto('/texts/der-sandmann');
	// Page has correct title
	await expect(page).toHaveTitle('Der Sandmann | WordTrail');
	// Menu button is visible
	await expect(page.getByLabel('open menu')).toBeVisible(); //Tests as hidden

	// Text pane is visible
	await expect(page.getByLabel('Text Pane')).toBeVisible();
	// Text title is visible
	await expect(page.getByLabel('Text Title')).toBeVisible();
	// Bookmark button is visible
	await expect(page.getByRole('button', { name: 'Bookmark' })).toBeVisible();

	// Context panes are visible
	await expect(page.getByLabel('Same Word Pane')).toBeVisible();
	await expect(page.getByLabel('Similar Spellings Pane')).toBeVisible();
	await expect(page.getByLabel('Similar Meanings Pane')).toBeVisible();
	// Lookup button is visible
	await expect(page.getByRole('button', { name: 'Lookup' })).toBeVisible();
});

test('menu displays required components', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('open menu').click();

	// Menu shows app name
	await expect(page.getByLabel('App Name')).toBeVisible();
	// Menu shows languages
	await expect(page.getByText('Deutsch', { exact: true })).toBeVisible();
	await expect(page.getByText('English', { exact: true })).toBeVisible();
	// Menu shows texts
	await expect(page.getByRole('link', { name: 'Der Sandmann' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Tutorial' })).toBeVisible();
});

test('wider context displays required components', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'context' }).first().click();

	// Wider Context shows wider context text
	await expect(page.getByText('wider context')).toBeVisible();
	// Wider Context shows name of referenced text
	await expect(page.getByLabel('Wider Context Title')).toBeVisible();
});
