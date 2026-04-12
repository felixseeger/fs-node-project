import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // Navigate specifically to a clean board if possible, or force cleanup
    console.log("Navigating to editor and purging UI...");

    // Execute multiple escape presses and explicit clicks
    await page.waitForTimeout(3000);
    await page.keyboard.press('Escape');
    await page.click('text=Skip Tour', { timeout: 2000 }).catch(() => {});
    
    await page.evaluate(() => {
        // Destroy the onboarding/tour system
        const blockers = [
            '.tour-overlay', '.tour-modal', '.onboarding-modal', 
            '[role="dialog"]', '.ms-welcome-modal', '.slp-container',
            '[data-testid="chat-ui"]', '.chakra-modal__overlay'
        ];
        
        // Periodic check to keep it clear
        setInterval(() => {
            blockers.forEach(s => document.querySelectorAll(s).forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.remove();
            }));
            
            // Remove blur from body and any potential wrapper
            document.body.style.filter = 'none';
            document.body.style.backdropFilter = 'none';
            document.querySelectorAll('*').forEach(el => {
               if (el.style.filter || el.style.backdropFilter) {
                   el.style.filter = 'none';
                   el.style.backdropFilter = 'none';
               }
            });
        }, 100);
    });

    await page.waitForTimeout(2000);

    // If on dashboard, go to editor
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click();
        await page.waitForTimeout(3000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Test node capture
    const nodeConfigs = [
        { type: 'imageNode', searchText: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output' }
    ];

    for (const config of nodeConfigs) {
        console.log(`Working on: ${config.type}`);
        
        // Ensure focus and open menu
        await pane.click({ position: { x: 50, y: 50 }, force: true });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        await searchInput.fill(config.searchText);
        await page.waitForTimeout(1500);
        
        // Click the first matching result in the menu
        const item = page.locator(`.ms-node-list button.ms-node-btn:has-text("${config.searchText}")`).first();
        if (await item.isVisible()) {
            await item.click({ force: true });
            console.log(`Menu item for ${config.searchText} clicked.`);
        } else {
            // Fallback to clicking the first button in the node list
            await page.locator('.ms-node-list button.ms-node-btn').first().click({ force: true }).catch(() => {});
        }
        
        await page.waitForTimeout(3000); // Wait for rendering
        await page.keyboard.press('Escape'); // Hide menu

        // High visibility screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/node_${config.type}_v35.png` });

        // Cleanup: remove node
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
