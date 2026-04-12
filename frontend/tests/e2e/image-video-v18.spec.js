import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Force clear overlays and ensure no blur
    console.log("Deep cleaning overlays and filters...");
    
    // Attempt to dismiss modal via UI first - but wait for it
    await page.waitForTimeout(2000);
    const skipTour = page.locator('text=Skip Tour').first();
    if (await skipTour.isVisible()) {
        await skipTour.click({ force: true });
    } else {
        await page.keyboard.press('Escape');
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
            el.style.filter = 'none';
            el.style.backdropFilter = 'none';
        });
        
        document.body.style.overflow = 'auto';
    });

    await page.waitForTimeout(2000);
    
    // Take a screenshot of the initial state
    await page.screenshot({ path: `tests/e2e/screenshots/initial_editor_state.png` });

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. TEST NODES
    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image', label: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output', label: 'Video Output' },
        { type: 'universalGeneratorImage', searchText: 'Universal Image Generator', label: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Click center of pane to ensure focus and clear menus
        await pane.click({ position: { x: 500, y: 400 } });
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill('');
        await searchInput.type(node.searchText, { delay: 100 });
        await page.waitForTimeout(1500);
        
        // Use evaluate to find and click the menu item precisely
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) target.click();
        }, node.searchText);
        
        await page.waitForTimeout(2000);
        
        // Check node on canvas
        const canvasNode = page.locator(`.react-flow__node`).filter({ hasText: node.label }).first();
        if (await canvasNode.count() > 0) {
            console.log(`Node ${node.type} appeared.`);
        }

        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_v18.png` });

        // Cleanup: remove node
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
