import { test, expect } from '@playwright/test';

test.describe('Mega Menu', () => {
  test('All Models mega menu creates new nodes on canvas', async ({ page }) => {
    test.setTimeout(120000);
    
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);
    
    const desktopLogin = page.locator('.desktop-nav-login').first();
    try {
      await desktopLogin.waitFor({ state: 'visible', timeout: 2000 });
      await desktopLogin.click({ force: true });
      await page.waitForTimeout(2000);
    } catch(e) {}
    
    const emailInput = page.locator('input[placeholder="you@example.com"]');
    try {
      await emailInput.waitFor({ state: 'visible', timeout: 2000 });
      await page.fill('input[placeholder="you@example.com"]', 'testuser@nodeproject.dev');
      await page.fill('input[type="password"]', 'TestPass123!');
      await page.getByRole('button', { name: /Sign In|Log In/i }).first().click();
    } catch(e) {}

    const slpBtn = page.locator('.slp-ready').first();
    try {
      await slpBtn.waitFor({ state: 'visible', timeout: 25000 });
      await slpBtn.click({ force: true });
    } catch(e) {}
    
    await page.waitForTimeout(3000);

    const newProjBtn = page.getByTestId('new-project-btn').first();
    try {
      await newProjBtn.waitFor({ state: 'visible', timeout: 5000 });
      await newProjBtn.click({ force: true });
      
      const confirmBtn = page.getByTestId('new-project-modal-confirm-new').first();
      await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
      await confirmBtn.click({ force: true });
    } catch(e) {}
    
    await expect(page.locator('.react-flow').first()).toBeVisible({ timeout: 15000 });
    
    // Dismiss tour or assistant popups if any
    await page.evaluate(() => {
       document.querySelectorAll('[role="dialog"], .ms-modal-backdrop, .fixed.inset-0').forEach(el => {
         if (el.innerText.includes('Welcome') || el.innerText.includes('Tour') || el.innerText.includes('AI Assistant')) {
            el.remove();
         }
       });
    });

    const getNodesCount = async () => {
      const imgNodes = await page.locator('.react-flow__node-universalGeneratorImage').count();
      const vidNodes = await page.locator('.react-flow__node-universalGeneratorVideo').count();
      return imgNodes + vidNodes;
    };

    const initialCount = await getNodesCount();
    
    // 1. Click "All models" button
    const allModelsBtn = page.getByRole('button', { name: /All models/i }).first();
    await allModelsBtn.waitFor({ state: 'visible' });
    await allModelsBtn.click({ force: true });
    
    // 2. Wait for the Mega Menu portal to be visible
    const searchInput = page.getByPlaceholder(/Search models/i).first();
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });

    // 3. Search for a specific model
    await searchInput.fill('Nano Banana 2');
    await page.waitForTimeout(500);
    
    // Click the button containing "Nano Banana 2"
    const modelButton = page.getByRole('button', { name: /Nano Banana 2/i }).first();
    await modelButton.waitFor({ state: 'visible', timeout: 5000 });
    await modelButton.click({ force: true });

    // 4. Verify a new node was created
    await page.waitForTimeout(1000);

    const newCount = await getNodesCount();
    expect(newCount).toBeGreaterThan(initialCount);

    const newImageNode = page.locator('.react-flow__node-universalGeneratorImage').last();
    await expect(newImageNode).toBeVisible();
  });
});
