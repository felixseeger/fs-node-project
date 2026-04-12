import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('ImageNode - can create and has UPLOAD placeholder', async ({ editorPage: page }) => {
    await expect(page.locator('.react-flow__pane')).toBeVisible();

    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    });
    
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('imageNode');
    await page.waitForTimeout(300);
    
    await page.evaluate(() => {
      const btn = document.querySelector('.ms-node-list button.ms-node-btn');
      if (btn) btn.click();
    });
    
    const imageNode = page.locator('.react-flow__node-imageNode').first();
    await expect(imageNode).toBeVisible();
    await expect(imageNode.locator('text=UPLOAD')).toBeVisible({ timeout: 15000 });
    
    await page.screenshot({ path: 'tests/e2e/screenshots/image_node_created.png' });
  });

  test('VideoOutputNode - can create and shows "No video connected"', async ({ editorPage: page }) => {
    await expect(page.locator('.react-flow__pane')).toBeVisible();

    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    });
    
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('videoOutput');
    await page.waitForTimeout(500); // Increased wait
    
    await page.evaluate(() => {
      // Find the specific button for videoOutput
      const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
      const videoBtn = btns.find(b => b.textContent.includes('videoOutput'));
      if (videoBtn) videoBtn.click();
      else if (btns[0]) btns[0].click(); // Fallback to first if exact not found
    });
    
    const videoOutputNode = page.locator('.react-flow__node-videoOutput').first();
    await expect(videoOutputNode).toBeVisible({ timeout: 15000 });
    
    await expect(videoOutputNode.locator('text=No video connected')).toBeVisible();
    await page.screenshot({ path: 'tests/e2e/screenshots/video_output_node_created.png' });
  });

  test('ImageUniversalGeneratorNode - can create and check title', async ({ editorPage: page }) => {
    await expect(page.locator('.react-flow__pane')).toBeVisible();

    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
    
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('universalGeneratorImage');
    await page.waitForTimeout(500); // Increased wait
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
      const genBtn = btns.find(b => b.textContent.includes('universalGeneratorImage'));
      if (genBtn) genBtn.click();
      else if (btns[0]) btns[0].click();
    });

    const genNode = page.locator('.react-flow__node-universalGeneratorImage').first();
    await expect(genNode).toBeVisible({ timeout: 15000 });
    
    await expect(genNode.locator('text=Universal Image Generator')).toBeVisible();
    await page.screenshot({ path: 'tests/e2e/screenshots/image_gen_node_created.png' });
  });
});
