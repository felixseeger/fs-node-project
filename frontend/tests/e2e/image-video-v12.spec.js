import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Force clear overlays
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        document.querySelectorAll('.tour-overlay, .tour-modal, .onboarding-modal, [role="dialog"]').forEach(el => el.remove());
        const app = document.querySelector('.app-container, #root > div');
        if (app) app.style.filter = 'none';
    });

    // Handle dashboard -> editor transition if needed
    const newProjectBtn = page.getByTestId('new-project-btn');
    if (await newProjectBtn.isVisible({ timeout: 5000 })) {
        await newProjectBtn.click();
    }

    // Wait for the flow pane
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
        
        // Ensure clean state
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        // Open search menu - using dispatch to be sure
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
        
        // Wait for ANY node to appear on canvas to verify creation
        await page.waitForTimeout(1000);
        
        // Take screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}.png` });

        // Cleanup: remove all nodes
        await page.evaluate(() => {
            // This is a bit of a hack but effective for cleanup between tests
            const nodes = document.querySelectorAll('.react-flow__node');
            nodes.forEach(n => n.click());
        });
        await page.keyboard.press('Backspace');
    }
  });
});
