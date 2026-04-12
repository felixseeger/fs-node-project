import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // Aggressive cleanup
    await page.evaluate(() => {
        const kill = (s) => document.querySelectorAll(s).forEach(el => el.remove());
        kill('.tour-overlay');
        kill('.tour-modal');
        kill('.onboarding-modal');
        kill('[role="dialog"]');
        kill('.slp-container');
        kill('[data-testid="chat-ui"]'); // Close AI assistant
        document.querySelectorAll('*').forEach(el => { el.style.filter = 'none'; el.style.backdropFilter = 'none'; });
    });

    await page.waitForTimeout(2000);

    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image', label: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output', label: 'Video Output' },
        { type: 'universalGeneratorImage', searchText: 'Universal Image Generator', label: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        // Open search
        await page.keyboard.press(' ');
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill(node.searchText);
        await page.waitForTimeout(1000);
        
        // Click result precisely - iterate and find by text
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase() === text.toLowerCase() || b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) target.click();
        }, node.searchText);
        
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape');

        // Screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_v25.png` });

        // Cleanup: remove node
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
