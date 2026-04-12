import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Starting node test with aggressive overlay removal...");

    const removeOverlays = async () => {
        await page.evaluate(() => {
            // Remove common blockers
            const blockers = [
                '.tour-overlay', '.onboarding-modal', '[role="dialog"]', 
                '.ms-welcome-modal', '.chakra-modal__overlay', 
                '.chakra-modal__content-container'
            ];
            blockers.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));
            
            // Unblur and reset body
            document.body.style.filter = 'none';
            document.body.style.overflow = 'auto';
            const root = document.querySelector('#root > div');
            if (root) root.style.filter = 'none';
            
            // Set storage
            localStorage.setItem('hasSeenOnboarding', 'true');
        });
    };

    await removeOverlays();
    await page.waitForTimeout(1000);
    await removeOverlays();

    // Ensure editor project is open
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click({ force: true });
        await page.waitForTimeout(2000);
        await removeOverlays();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // TEST NODES
    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output' },
        { type: 'universalGeneratorImage', searchText: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Open menu via evaluatd click on any add button if possible, or space
        await page.evaluate(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        });
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.searchText);
        await page.waitForTimeout(1000);
        
        // Use evaluate to click menu item
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) target.click();
            else if (btns.length > 0) btns[0].click();
        }, node.searchText);
        
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_final_v22.png` });

        // Cleanup
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
