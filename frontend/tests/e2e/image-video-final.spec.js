import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // Aggressive cleanup and start fresh
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, [data-testid="chat-ui"]').forEach(el => el.remove());
        document.querySelectorAll('*').forEach(el => { el.style.filter = 'none'; el.style.backdropFilter = 'none'; });
    });

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });

    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Click the plus button in the toolbar if possible, or use space
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.searchText);
        await page.waitForTimeout(1000);
        
        // Find and click the button
        const nodeBtn = page.locator('.ms-node-list button.ms-node-btn').first();
        await nodeBtn.click({ force: true });
        
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape'); // Close menu

        // Verification screenshot - use full page to see everything
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_final_full.png` });

        // Cleanup: remove node
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
