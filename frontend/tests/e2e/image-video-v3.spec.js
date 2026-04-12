import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // This uses editorPage fixture which handles navigation and login
    await expect(page.locator('.react-flow__pane')).toBeVisible({ timeout: 30000 });

    const nodesToTest = [
        { type: 'imageNode', label: 'Image', expectedText: 'UPLOAD' },
        { type: 'videoOutput', label: 'Video Output', expectedText: 'No video connected' },
        { type: 'universalGeneratorImage', label: 'Universal Image Generator', expectedText: 'Image Generation' }
    ];

    for (const node of nodesToTest) {
        // Open search menu
        await page.evaluate(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        });
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill(node.type);
        await page.waitForTimeout(500);
        
        // Click the node button
        await page.evaluate((type) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(type.toLowerCase()));
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, node.type);
        
        // Check node on canvas
        const canvasNode = page.locator(`.react-flow__node-${node.type}`).first();
        await expect(canvasNode).toBeVisible({ timeout: 15000 });
        
        // Verify characteristic text
        if (node.expectedText) {
            await expect(canvasNode.locator(`text=${node.expectedText}`).first()).toBeVisible();
        }

        // Take screenshot of each node
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}.png` });
        
        // Clean up: delete node for next iteration (optional but keeps canvas clean)
        await canvasNode.click();
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(300);
    }
  });
});
