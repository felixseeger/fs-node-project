import { test, expect } from './fixtures.js';

test('debug editor page navigation', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  
  if (await page.locator('text="Log in"').isVisible()) {
    await page.click('text="Log in"');
  }
  if (await page.locator('input[placeholder="you@example.com"]').isVisible()) {
    await page.fill('input[placeholder="you@example.com"]', 'verwaltung@felixseeger.de');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button:has-text("Sign In"), button[type="submit"]');
  }

  const btn = page.getByTestId('new-project-btn').first();
  await btn.waitFor({ state: 'visible', timeout: 15000 });
  await btn.click({ force: true });
  
  const confirmBtn = page.getByTestId('new-project-modal-confirm-new').first();
  await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
  await confirmBtn.click({ force: true });

  await page.waitForURL('**/project/*', { timeout: 15000 });
  console.log("Successfully navigated to:", page.url());
  
  await expect(page.locator('.react-flow').first()).toBeVisible({ timeout: 15000 });
  console.log("React flow is visible!");
});
