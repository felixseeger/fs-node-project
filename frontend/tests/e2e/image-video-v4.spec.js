import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Dismiss the "Welcome" / onboarding tour if it appears
    const welcomeModal = page.locator('text=Welcome to FS Node Project!');
    if (await welcomeModal.isVisible({ timeout: 5000 })) {
        console.log("Dismissing welcome modal...");
        await page.keyboard.press('Escape');
    }
    
    // Ensure the overlay/blur is gone
    await expect(page.locator('.react-flow__pane')).toBeVisible({ timeout: 30000 });

    const nodesToTest = [
        { type: 'imageNode', label: 'Image', expectedText: 'UPLOAD' },
        { type: 'videoOutput', label: 'Video Output', expectedText: 'No video connected' },
        { type: 'universalGeneratorImage', label: 'Universal Image Generator', expectedText: 'Image Generation' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
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
        
        // Verify characteristic text (allowing it to be hidden initially and waiting for it to become visible/interactable)
        if (node.expectedText) {
            await expect(canvasNode.locator(`text=${node.expectedText}`).first()).toBeVisible({ timeout: 10000 });
        }

        // Take screenshot of each node
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}.png` });
        
        // Clean up
        await canvasNode.click({ force: true });
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(300);
    }
  });
});
