import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Setup
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, [data-testid="chat-ui"]').forEach(el => el.remove());
        document.querySelectorAll('*').forEach(el => {
            if (el instanceof HTMLElement) {
                el.style.filter = 'none';
                el.style.backdropFilter = 'none';
            }
        });
        document.body.style.overflow = 'auto';
    });

    await page.waitForTimeout(2000);

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });

    // 2. TEST NODES - BASED ON DISCOVERED NAMES
    const nodes = [
        { searchText: 'Image', slug: 'imageNode' },
        { searchText: 'Asset', slug: 'assetNode' }
    ];

    for (const n of nodes) {
        console.log(`Adding ${n.searchText}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        await page.keyboard.press(' ');
        await page.waitForTimeout(500);
        
        // Find result and click
        const btn = page.locator(`.ms-node-list button.ms-node-btn:has-text("${n.searchText}")`).first();
        if (await btn.isVisible()) {
            await btn.click({ force: true });
        } else {
            await page.locator('button').filter({ hasText: n.searchText }).first().click({ force: true });
        }
        
        await page.waitForTimeout(3000); 
        await page.keyboard.press('Escape'); 

        // Capture
        await page.screenshot({ path: `tests/e2e/screenshots/node_${n.slug}_final.png`, fullPage: true });

        // Reset
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
    
    // Video test - search broadly
    console.log("Searching for Video Output...");
    await page.keyboard.press(' ');
    const searchInput = page.locator('input[placeholder*="Add node"], input[type="text"]').first();
    await searchInput.fill('Video');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `tests/e2e/screenshots/video_search_results.png` });
  });
});
