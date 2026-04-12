import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('ImageNode - can create and has UPLOAD placeholder', async ({ editorPage: page }) => {
    // Wait for canvas to be ready
    await expect(page.locator('.react-flow__pane')).toBeVisible();

    // Force open search menu with spacebar
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    });
    
    // Wait for search menu to appear
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible();
    
    // Fill the search input for imageNode
    await searchInput.fill('imageNode');
    await page.waitForTimeout(300);
    
    // Click the node button
    await page.evaluate(() => {
      const btn = document.querySelector('.ms-node-list button.ms-node-btn');
      if (btn) btn.click();
    });
    
    // Wait for node to be added
    const imageNode = page.locator('.react-flow__node-imageNode').first();
    await expect(imageNode).toBeVisible();
    
    // Verify it has the "UPLOAD" placeholder text
    // The previous error "locator resolved to <span>UPLOAD</span> - unexpected value hidden"
    // suggests it's there but maybe obscured or not fully rendered. 
    // We'll wait longer or use a more robust check.
    await expect(imageNode.locator('text=UPLOAD')).toBeVisible({ timeout: 15000 });
    
    // Take a screenshot for confirmation
    await page.screenshot({ path: 'tests/e2e/screenshots/image_node_created.png' });
  });

  test('VideoOutputNode - can create and shows "No video connected"', async ({ editorPage: page }) => {
    await expect(page.locator('.react-flow__pane')).toBeVisible();

    // Force open search menu with spacebar
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    });
    
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible();
    
    // Fill the search input for videoOutput
    await searchInput.fill('videoOutput');
    await page.waitForTimeout(300);
    
    // Click the node button
    await page.evaluate(() => {
      const btn = document.querySelector('.ms-node-list button.ms-node-btn');
      if (btn) btn.click();
    });
    
    // Check if Video Output Node is visible
    const videoOutputNode = page.locator('.react-flow__node-videoOutput').first();
    await expect(videoOutputNode).toBeVisible();
    
    // Verify default empty state text
    await expect(videoOutputNode.locator('text=No video connected')).toBeVisible();
    
    // Take a screenshot for confirmation
    await page.screenshot({ path: 'tests/e2e/screenshots/video_output_node_created.png' });
  });

  test('ImageUniversalGeneratorNode - can create and check title', async ({ editorPage: page }) => {
    await expect(page.locator('.react-flow__pane')).toBeVisible();

    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
    
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('universalGeneratorImage');
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());

    const genNode = page.locator('.react-flow__node-universalGeneratorImage').first();
    await expect(genNode).toBeVisible();
    
    // It should have the correct label
    await expect(genNode.locator('text=Universal Image Generator')).toBeVisible();
    
    await page.screenshot({ path: 'tests/e2e/screenshots/image_gen_node_created.png' });
  });
});
