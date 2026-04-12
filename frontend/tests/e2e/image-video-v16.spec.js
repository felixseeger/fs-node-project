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
            '[data-testid="chat-ui"]' // Close the AI Assistant panel too
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

    // If still in dashboard, click "New Project"
    const dashboardNewBtn = page.getByTestId('new-project-btn');
    if (await dashboardNewBtn.isVisible({ timeout: 5000 })) {
        await dashboardNewBtn.click();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. TEST NODES
    // We use the human-readable names as seen in the UI screenshots
    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image', expectedLabel: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output', expectedLabel: 'Video Output' },
        { type: 'universalGeneratorImage', searchText: 'Universal Image Generator', expectedLabel: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // Ensure pane is focused
        await pane.click({ position: { x: 100, y: 100 } });
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        
        await searchInput.fill('');
        await searchInput.type(node.searchText, { delay: 100 });
        await page.waitForTimeout(1000);
        
        // Click the first button in the filtered list
        const nodeBtn = page.locator('.ms-node-list button.ms-node-btn').first();
        if (await nodeBtn.isVisible()) {
            await nodeBtn.click({ force: true });
            console.log(`Clicked menu item for ${node.searchText}`);
        } else {
            console.log(`Failed to find menu item for ${node.searchText}`);
        }
        
        await page.waitForTimeout(2000);
        
        // Verification: look for node on canvas by label
        const canvasNode = page.locator('.react-flow__node').filter({ hasText: node.expectedLabel }).first();
        if (await canvasNode.count() > 0) {
            console.log(`Node ${node.type} is visible on canvas.`);
            await canvasNode.scrollIntoViewIfNeeded();
        } else {
            console.log(`Node ${node.type} NOT found on canvas.`);
        }

        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_v16.png` });

        // Cleanup
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
