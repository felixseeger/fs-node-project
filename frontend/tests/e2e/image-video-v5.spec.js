import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Explicitly check for and dismiss the onboarding tour
    // Based on the screenshot, there is a "Welcome" modal.
    // Try clicking "Skip Tour" or "Next" or just hitting Escape multiple times.
    
    console.log("Checking for tour/onboarding overlays...");
    
    // The tour seems to have multiple steps. Let's try to skip it.
    const skipButton = page.locator('button:has-text("Skip Tour")');
    if (await skipButton.isVisible({ timeout: 5000 })) {
        await skipButton.click();
    } else {
        // Fallback: hit Escape a few times to clear modals
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        await page.keyboard.press('Escape');
    }

    // Wait for the blur/overlay to disappear. 
    // Usually checking for actionability of the pane is good.
    await expect(page.locator('.react-flow__pane')).toBeVisible({ timeout: 30000 });
    // Also wait for the blur class to be removed if it exists on a parent
    await page.waitForFunction(() => !document.body.classList.contains('tour-active') && !document.querySelector('.tour-overlay'), { timeout: 10000 }).catch(() => {});

    const nodesToTest = [
        { type: 'imageNode', label: 'Image', expectedText: 'UPLOAD' },
        { type: 'videoOutput', label: 'Video Output', expectedText: 'No video connected' },
        { type: 'universalGeneratorImage', label: 'Universal Image Generator', expectedText: 'Image Generation' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        // Open search menu - using evaluate to ensure event is fired
        await page.evaluate(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        });
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        await searchInput.fill(node.type);
        await page.waitForTimeout(800);
        
        // Click the node button
        await page.evaluate((type) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            // Be more precise with text matching
            const target = btns.find(b => b.textContent.trim() === type || b.textContent.toLowerCase().includes(type.toLowerCase()));
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, node.type);
        
        // Check node on canvas
        const canvasNode = page.locator(`.react-flow__node-${node.type}`).first();
        await expect(canvasNode).toBeVisible({ timeout: 20000 });
        
        // Verify characteristic text - use text() with exact match if possible or first
        if (node.expectedText) {
            // We'll use a more lenient locator first and then check visibility
            const characteristic = canvasNode.locator(`text=${node.expectedText}`).first();
            await expect(characteristic).toBeVisible({ timeout: 15000 });
        }

        // Take screenshot of each node
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}.png` });
        
        // Clean up
        await canvasNode.click({ force: true });
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
  });
});
