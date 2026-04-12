import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('ImageNode - can create and has UPLOAD placeholder', async ({ page }) => {
    // Navigate and handle landing/login
    await page.goto('/');
    
    // Handle landing page "Get Started Free" or "Log in" if needed
    // But based on fixtures.js, editorPage already handles some setup.
    // If we use 'page' directly, we might need to bypass SLP.
    
    // Check if we are on dashboard
    const newProjectBtn = page.getByTestId('new-project-btn');
    if (await newProjectBtn.isVisible({ timeout: 10000 })) {
        await newProjectBtn.click();
    } else {
        // Fallback: try finding any "New" button
        await page.click('text=New Project', { timeout: 5000 }).catch(() => {});
    }

    // Wait for canvas
    await page.waitForSelector('.react-flow__pane', { state: 'visible', timeout: 20000 });

    // Open search menu
    await page.keyboard.press(' ');
    
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill('imageNode');
    await page.waitForTimeout(500);
    
    // Click result
    await page.click('.ms-node-list button.ms-node-btn', { timeout: 5000 });
    
    const imageNode = page.locator('.react-flow__node-imageNode').first();
    await expect(imageNode).toBeVisible({ timeout: 15000 });
    await expect(imageNode.locator('text=UPLOAD')).toBeVisible({ timeout: 15000 });
    
    await page.screenshot({ path: 'tests/e2e/screenshots/image_node_created.png' });
  });

  test('VideoOutputNode - can create and shows "No video connected"', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('new-project-btn').click({ timeout: 10000 }).catch(() => page.click('text=New Project'));
    await page.waitForSelector('.react-flow__pane', { state: 'visible', timeout: 20000 });

    await page.keyboard.press(' ');
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill('videoOutput');
    await page.waitForTimeout(500);
    
    await page.click('.ms-node-list button.ms-node-btn', { timeout: 5000 });
    
    const videoOutputNode = page.locator('.react-flow__node-videoOutput').first();
    await expect(videoOutputNode).toBeVisible({ timeout: 15000 });
    await expect(videoOutputNode.locator('text=No video connected')).toBeVisible();
  });
});
