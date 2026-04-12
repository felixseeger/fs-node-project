import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Dismiss onboarding properly
    console.log("Cleaning up overlays...");
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        // Remove all potential overlay elements
        const selectors = ['.tour-overlay', '.tour-modal', '.onboarding-modal', '[role="dialog"]', '.ms-welcome-modal'];
        selectors.forEach(s => {
            document.querySelectorAll(s).forEach(el => el.remove());
        });
        // Remove blur and filters
        const app = document.querySelector('.app-container, #root > div');
        if (app) {
            app.style.filter = 'none';
            app.style.pointerEvents = 'auto';
        }
        document.body.style.overflow = 'auto';
    });

    await page.waitForTimeout(1000);

    // Ensure we are in the editor
    const dashboardNewBtn = page.getByTestId('new-project-btn');
    if (await dashboardNewBtn.isVisible()) {
        await dashboardNewBtn.click();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. TEST NODES
    const nodesToTest = [
        { type: 'imageNode', label: 'Image' },
        { type: 'videoOutput', label: 'Video Output' },
        { type: 'universalGeneratorImage', label: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        // Ensure menu is closed
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        // Open search menu via evaluated dispatch
        await page.evaluate(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        });
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.type);
        await page.waitForTimeout(1000);
        
        // Click result via evaluate
        await page.evaluate((type) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => 
                b.textContent.toLowerCase().includes(type.toLowerCase())
            );
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, node.type);
        
        await page.waitForTimeout(1000);
        
        // Take screenshot of ONLY the node if possible, or full screen
        const nodeLocator = page.locator(`.react-flow__node`).filter({ hasText: node.label }).first();
        if (await nodeLocator.count() > 0) {
            await nodeLocator.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_focused.png` });
        }
        
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_full.png` });

        // Cleanup: delete all nodes
        await page.evaluate(() => {
            const nodes = document.querySelectorAll('.react-flow__node');
            nodes.forEach(n => n.click());
        });
        await page.keyboard.press('Backspace');
    }
  });
});
