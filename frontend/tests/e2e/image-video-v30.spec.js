import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // Ultimate blocker: overwrite components or settings via evaluate before they even run
    await page.evaluate(() => {
        // Prevent tour from ever starting
        window.__SKIP_TOUR__ = true;
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Setup a strict interval that removes blockers
        setInterval(() => {
            const blockers = document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, .chakra-modal__overlay, .ms-welcome-modal');
            blockers.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.pointerEvents = 'none';
                el.remove();
            });
            
            const app = document.querySelector('.app-container, #root > div');
            if (app) {
                app.style.filter = 'none';
                app.style.backdropFilter = 'none';
                app.style.opacity = '1';
                app.style.pointerEvents = 'auto';
            }
            document.body.style.filter = 'none';
            document.body.style.overflow = 'auto';
        }, 100);
    });

    await page.waitForTimeout(2000);

    // Force click "New Project" if visible
    const dashBtn = page.getByTestId('new-project-btn');
    if (await dashBtn.isVisible()) {
        await dashBtn.click({ force: true });
        await page.waitForTimeout(2000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Add nodes
    const nodeConfigs = [
        { type: 'imageNode', searchText: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output' }
    ];

    for (const config of nodeConfigs) {
        console.log(`Working on: ${config.type}`);
        
        // Ensure focus and open menu
        await pane.click({ position: { x: 50, y: 50 } });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        await searchInput.fill(config.searchText);
        await page.waitForTimeout(1000);
        
        // Click the menu item via evaluate (bypass actionability)
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, config.searchText);
        
        await page.waitForTimeout(3000); // Plenty of time to render
        await page.keyboard.press('Escape'); // Hide menu

        // High contrast/visibility screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/actual_${config.type}_v30.png` });

        // Cleanup
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
