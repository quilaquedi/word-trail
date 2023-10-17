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
	const tutorial_name = "tutorial-en"
	await page.goto('/');
	await expect(page).toHaveURL('/texts/'  + tutorial_name);
	
	await page.goto('/texts');
	await expect(page).toHaveURL('/texts/'  + tutorial_name);
});

// Wireframe Tests

//
// test('text page displays required components', async ({ page }) => {
// 	await page.goto('/texts/der-sandmann');
// 	// Menu button is visible
// 	await expect(page.getByRole("button", { name: "Menu"})).toBeVisible();
// 	// Text pane is visible
// 	await expect(page.getByRole("grid", { name: "Text"})).toBeVisible();
// 	// Text title is visible
// 	await expect(page.getByRole("heading", { name: "Der Sandmann"})).toBeVisible();
// 	// Bookmark button is visible
// 	await expect(page.getByRole("button", { name: "Bookmark"})).toBeVisible();
// });