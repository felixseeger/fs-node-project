import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Final attempt to clear UI and capture nodes...");

    const forceClean = async () => {
        await page.evaluate(() => {
            // Remove blocking elements
            const selectors = ['.tour-overlay', '.onboarding-modal', '[role="dialog"]', '.ms-welcome-modal', '.chakra-modal__overlay', '.slp-container'];
            selectors.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));
            
            // Unblur app
            const app = document.querySelector('.app-container, #root > div');
            if (app) {
                app.style.filter = 'none';
                app.style.opacity = '1';
                app.style.pointerEvents = 'auto';
            }
            document.body.style.filter = 'none';
            document.body.style.overflow = 'auto';
            
            // Set seen flags
            localStorage.setItem('hasSeenOnboarding', 'true');
            sessionStorage.setItem('slp_shown', 'true');
        });
    };

    await forceClean();
    await page.waitForTimeout(2000);
    await forceClean();

    // Open project
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click({ force: true });
        await page.waitForTimeout(3000);
        await forceClean();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // TEST NODES
    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image', label: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output', label: 'Video Output' },
        { type: 'universalGeneratorImage', searchText: 'Universal Image Generator', label: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Open menu via evaluatd event
        await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.searchText);
        await page.waitForTimeout(1000);
        
        // Use evaluate to find the exact button by text and click it
        const clickResult = await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase() === text.toLowerCase() || b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) {
                target.click();
                return true;
            }
            return false;
        }, node.searchText);
        
        console.log(`Click result for ${node.searchText}: ${clickResult}`);
        await page.waitForTimeout(2000);
        
        // Ensure menu is closed for clear screenshot
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_v23.png`, fullPage: true });

        // Cleanup
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
  });
});
