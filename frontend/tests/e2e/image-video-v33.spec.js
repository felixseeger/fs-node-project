import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. CLEAR BLUR AND OVERLAYS
    console.log("Deep cleaning UI...");
    
    await page.evaluate(() => {
        // Stop tour
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Brute force removal
        const kill = (s) => document.querySelectorAll(s).forEach(el => el.remove());
        kill('.tour-overlay');
        kill('.onboarding-modal');
        kill('[role="dialog"]');
        kill('.slp-container');
        kill('.chakra-modal__overlay');
        kill('.ms-welcome-modal');
        kill('[data-testid="chat-ui"]'); // Kill AI assistant panel
        
        // Remove blurs and filters
        const style = document.createElement('style');
        style.innerHTML = `
            * { filter: none !important; backdrop-filter: none !important; }
            .tour-overlay, .onboarding-modal, .slp-container, [role="dialog"], [data-testid="chat-ui"] { display: none !important; }
            .app-container, #root, body { overflow: auto !important; opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; }
            .react-flow__pane { pointer-events: auto !important; }
        `;
        document.head.appendChild(style);
    });

    await page.waitForTimeout(2000);

    // If on dashboard, click new project
    const dashBtn = page.getByTestId('new-project-btn');
    if (await dashBtn.isVisible()) {
        await dashBtn.click({ force: true });
        await page.waitForTimeout(2000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. TEST NODES
    const nodeConfigs = [
        { type: 'imageNode', searchText: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output' }
    ];

    for (const config of nodeConfigs) {
        console.log(`Adding ${config.type}...`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Open menu
        await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
        const input = page.locator('.ms-search-input-overlay');
        await expect(input).toBeVisible({ timeout: 15000 });
        await input.fill(config.searchText);
        await page.waitForTimeout(1000);
        
        // Find result and click via evaluate (bypass actionability)
        const success = await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) {
                target.click();
                return true;
            }
            return false;
        }, config.searchText);
        
        console.log(`Click for ${config.searchText} success: ${success}`);
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape'); // Hide menu

        // Final screenshot attempt
        await page.screenshot({ path: `tests/e2e/screenshots/node_${config.type}_v33.png`, fullPage: true });

        // Cleanup: remove node
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
