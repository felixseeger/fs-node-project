import { test, expect } from './fixtures.js';

test.describe('Authentication and Dashboard', () => {
  test('User is logged in and dashboard loads', async ({ page }) => {
    // The `page` fixture already logs in and waits for the dashboard
    const newBoardBtn = page.getByTestId('new-project-btn').first();
    await expect(newBoardBtn).toBeVisible({ timeout: 10000 });
  });
  
  test('Can create a new board and enter the editor', async ({ editorPage }) => {
    // The `editorPage` fixture creates a blank canvas and waits for it
    const flowWrapper = editorPage.locator('.react-flow').first();
    await expect(flowWrapper).toBeVisible({ timeout: 5000 });
  });
});
