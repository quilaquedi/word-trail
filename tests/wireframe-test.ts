import { expect, test } from '@playwright/test';

// Test Components are visible

test('text page displays required components', async ({ page }) => {
	await page.goto('/texts/der-sandmann');
	// Page has correct title
	await expect(page).toHaveTitle('Der Sandmann | WordTrail');
	// Menu button is visible
	await expect(page.getByLabel('open menu')).toBeVisible();

	// Text pane is visible
	await expect(page.getByLabel('Text Pane')).toBeVisible();
	// Text title is visible
	await expect(page.getByLabel('Text Title')).toBeVisible();

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

// Test Components are aligned

test('text page displays correct layout', async ({ page }) => {
	await page.goto('/');
	const menu_button_box = await page.getByLabel('open menu').boundingBox();
	const text_pane_box = await page.getByLabel('Text Pane').boundingBox();

	// Menu button is to left of text pane
	expect(menu_button_box.x + menu_button_box.width).toBeLessThan(text_pane_box.x);
});
