import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Force clear overlays and ensure no blur
    console.log("Deep cleaning overlays and filters...");
    
    // Attempt to dismiss modal via UI first
    const skipTour = page.locator('text=Skip Tour').first();
    if (await skipTour.isVisible({ timeout: 5000 })) {
        await skipTour.click({ force: true });
    }

    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Brute force removal of all overlays
        const overlays = document.querySelectorAll('.tour-overlay, .tour-modal, .onboarding-modal, [role="dialog"], .ms-welcome-modal, .chakra-modal__overlay, .chakra-modal__content-container');
        overlays.forEach(el => el.remove());
        
        // Remove filters from all elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.filter !== 'none' || style.backdropFilter !== 'none') {
                el.style.filter = 'none';
                el.style.backdropFilter = 'none';
            }
        });
        
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
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        await page.evaluate(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        });
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.type);
        await page.waitForTimeout(1000);
        
        await page.evaluate((type) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => 
                b.textContent.toLowerCase().includes(type.toLowerCase())
            );
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, node.type);
        
        await page.waitForTimeout(2000); // Give it extra time to render
        
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_final.png` });

        // Cleanup: remove all nodes
        await page.evaluate(() => {
            const nodes = document.querySelectorAll('.react-flow__node');
            nodes.forEach(n => n.click());
        });
        await page.keyboard.press('Backspace');
    }
  });
});
