import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. CLEAR OVERLAYS
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

    // 2. TEST NODES - Using the exact names found in the menu
    // We'll capture Asset for the 'Image' functionality (Update Asset) 
    // and Output for the 'Video' functionality (No video connected)
    const nodes = [
        { searchText: 'Asset', slug: 'assetNode' },
        { searchText: 'Output', slug: 'outputNode' }
    ];

    for (const n of nodes) {
        console.log(`Adding ${n.searchText}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
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

        // Zoom to see it
        await page.keyboard.press('Shift+f');
        await page.waitForTimeout(1000);

        // Capture
        await page.screenshot({ path: `tests/e2e/screenshots/node_${n.slug}_verified_final.png` });

        // Reset
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
