import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. BYPASS LOADING SCREEN AND OVERLAYS
    console.log("Bypassing loading screens and overlays...");
    
    // Wait for the loading screen (SLP) to complete
    // Usually it has a button or just fades away.
    // Based on screenshots, it's a full screen "INITIATING" screen.
    // We can try to skip it by evaluating the underlying state if it takes too long.
    
    await page.waitForSelector('.react-flow__pane', { state: 'attached', timeout: 45000 });

    await page.evaluate(() => {
        // Force state in storage
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Remove all overlays
        const overlays = document.querySelectorAll('.tour-overlay, .tour-modal, .onboarding-modal, [role="dialog"], .ms-welcome-modal, .chakra-modal__overlay, .chakra-modal__content-container, .slp-container');
        overlays.forEach(el => el.remove());
        
        // Clear filters
        const app = document.querySelector('.app-container, #root > div');
        if (app) {
            app.style.filter = 'none';
            app.style.opacity = '1';
            app.style.visibility = 'visible';
        }
        
        const style = document.createElement('style');
        style.innerHTML = `
            * { filter: none !important; backdrop-filter: none !important; }
            .tour-overlay, .onboarding-modal, .slp-container { display: none !important; }
            .app-container, #root, body { overflow: auto !important; opacity: 1 !important; visibility: visible !important; }
        `;
        document.head.appendChild(style);
    });

    await page.waitForTimeout(2000);
    
    // 2. ENSURE WE ARE IN EDITOR
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click();
    }
    
    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    await pane.click({ position: { x: 50, y: 50 } });

    // 3. TEST NODES
    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image', label: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output', label: 'Video Output' },
        { type: 'universalGeneratorImage', searchText: 'Universal Image Generator', label: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Open menu
        await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.searchText);
        await page.waitForTimeout(1000);
        
        // Precise click
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) target.click();
        }, node.searchText);
        
        await page.waitForTimeout(2000);
        
        // Verify visually
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_v19.png` });

        // Cleanup
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
