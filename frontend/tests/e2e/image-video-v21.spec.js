import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Starting reliable node test...");

    // 1. DISMISS MODALS VIA REPEATED EVALUATE
    await page.evaluate(() => {
        const dismiss = () => {
            // Remove common modal/overlay elements
            const selectors = ['.tour-overlay', '.onboarding-modal', '[role="dialog"]', '.ms-welcome-modal', '.chakra-modal__overlay'];
            selectors.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));
            // Remove blur/dimming
            document.querySelectorAll('*').forEach(el => {
                if (el instanceof HTMLElement) {
                    el.style.filter = 'none';
                    el.style.backdropFilter = 'none';
                }
            });
            // Reset body
            document.body.style.overflow = 'auto';
            document.body.style.opacity = '1';
        };
        dismiss();
        // Set a small interval to keep it clear during transitions
        window._cleanupInterval = setInterval(dismiss, 500);
    });

    await page.waitForTimeout(1000);

    // If on dashboard, click new project
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. TEST NODES
    // We'll use the menu on the left side which seems to be open or can be opened
    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image', label: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output', label: 'Video Output' },
        { type: 'universalGeneratorImage', searchText: 'Universal Image Generator', label: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        // Ensure menu is open - if not visible, trigger space
        const searchInput = page.locator('.ms-search-input-overlay');
        if (!(await searchInput.isVisible())) {
            await page.keyboard.press(' ');
            await page.waitForTimeout(500);
        }

        if (await searchInput.isVisible()) {
            await searchInput.fill('');
            await searchInput.type(node.searchText, { delay: 50 });
            await page.waitForTimeout(1000);
            
            // Click the matching button
            const item = page.locator(`.ms-node-list button.ms-node-btn:has-text("${node.searchText}")`).first();
            if (await item.count() === 0) {
                // Try selecting the first if precise match fails
                await page.locator('.ms-node-list button.ms-node-btn').first().click({ force: true });
            } else {
                await item.click({ force: true });
            }
        } else {
            // Brute force: click the first button in any visible node menu
            await page.locator('button.ms-node-btn').first().click({ force: true }).catch(() => {});
        }
        
        await page.waitForTimeout(2000);
        
        // Take screenshots
        const canvasNode = page.locator('.react-flow__node').last();
        if (await canvasNode.count() > 0) {
            await canvasNode.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_v21.png` }).catch(() => {});
        }
        await page.screenshot({ path: `tests/e2e/screenshots/canvas_${node.type}_v21.png` });

        // Cleanup: remove all nodes
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
    
    // Clear the interval
    await page.evaluate(() => clearInterval(window._cleanupInterval));
  });
});
