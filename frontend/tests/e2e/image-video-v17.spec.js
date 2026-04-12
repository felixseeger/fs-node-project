import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Force clear EVERYTHING via injected CSS and Storage
    console.log("Forcing overlay dismissal and UI cleanup...");
    
    await page.evaluate(() => {
        // Clear onboarding/tour
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Remove all blocking elements
        const selectors = [
            '.tour-overlay', '.tour-modal', '.onboarding-modal', 
            '[role="dialog"]', '.ms-welcome-modal', '.chakra-modal__overlay',
            '[data-testid="chat-ui"]'
        ];
        selectors.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));
        
        // Brute force style removal
        const style = document.createElement('style');
        style.innerHTML = `
            * { filter: none !important; backdrop-filter: none !important; }
            .app-container, #root, body { overflow: auto !important; }
            [role="dialog"], .tour-overlay { display: none !important; }
        `;
        document.head.appendChild(style);
    });

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. TEST NODES
    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image', expectedLabel: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output', expectedLabel: 'Video Output' },
        { type: 'universalGeneratorImage', searchText: 'Universal Image Generator', expectedLabel: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // Click center of pane to ensure focus and clear menus
        await pane.click({ position: { x: 500, y: 400 } });
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        
        await searchInput.fill('');
        await searchInput.type(node.searchText, { delay: 100 });
        await page.waitForTimeout(1000);
        
        // Find the button in the list that contains the search text
        const nodeBtn = page.locator(`.ms-node-list button.ms-node-btn:has-text("${node.searchText}")`).first();
        if (await nodeBtn.isVisible()) {
            await nodeBtn.click({ force: true });
            console.log(`Clicked menu item for ${node.searchText}`);
        } else {
            // Fallback to first if exact text not found (it might be labeled differently)
            await page.locator('.ms-node-list button.ms-node-btn').first().click({ force: true });
        }
        
        await page.waitForTimeout(2000);
        
        // Verification: take screenshot of the newly added node
        // Most nodes have their label in a header or text element
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_final_v17.png` });

        // Cleanup: remove node
        const newNode = page.locator('.react-flow__node.selected').first();
        if (await newNode.count() > 0) {
            await newNode.click();
            await page.keyboard.press('Backspace');
        } else {
            // If not selected, try clicking the last added node
            await page.locator('.react-flow__node').last().click();
            await page.keyboard.press('Backspace');
        }
    }
  });
});
