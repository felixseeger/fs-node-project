import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Forcing node capture with direct canvas interaction...");

    // 1. CLEAR UI
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Remove ALL overlays
        const kill = (s) => document.querySelectorAll(s).forEach(el => el.remove());
        kill('.tour-overlay');
        kill('.onboarding-modal');
        kill('[role="dialog"]');
        kill('.ms-welcome-modal');
        kill('.chakra-modal__overlay');
        kill('.slp-container');
        kill('[data-testid="chat-ui"]');
        kill('.ms-menu-wrapper'); // Close specific menus if they are open
        
        // Force unblur
        const style = document.createElement('style');
        style.innerHTML = `
            * { filter: none !important; backdrop-filter: none !important; }
            .tour-overlay, .onboarding-modal, .slp-container { display: none !important; }
            .app-container, #root > div, body { overflow: auto !important; opacity: 1 !important; visibility: visible !important; }
        `;
        document.head.appendChild(style);
    });

    await page.waitForTimeout(2000);

    // Go to project
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Ensure canvas is focused and ready
    await pane.click({ position: { x: 100, y: 100 } });

    // 2. ADD NODES VIA SPACE MENU
    const nodes = [
        { searchText: 'Image', slug: 'imageNode' },
        { searchText: 'Video Output', slug: 'videoOutput' }
    ];

    for (const n of nodes) {
        console.log(`Adding ${n.searchText}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await page.keyboard.press(' ');
        
        const search = page.locator('.ms-search-input-overlay');
        await expect(search).toBeVisible({ timeout: 15000 });
        await search.fill(n.searchText);
        await page.waitForTimeout(1000);
        
        // Find result and click
        const btn = page.locator(`.ms-node-list button.ms-node-btn:has-text("${n.searchText}")`).first();
        await btn.click({ force: true });
        
        await page.waitForTimeout(3000); // render time
        await page.keyboard.press('Escape'); // close menu

        // Final zoom out to see it clearly
        await page.keyboard.press('Shift+f');
        await page.waitForTimeout(1000);

        // Screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/node_${n.slug}_captured.png`, fullPage: true });

        // Select all and delete for next node
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
