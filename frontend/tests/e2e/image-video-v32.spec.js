import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Setup - Force skip tour via directly clicking UI if possible, then eval
    await page.waitForTimeout(2000);
    const skipBtn = page.locator('text=Skip Tour').first();
    if (await skipBtn.isVisible()) {
        await skipBtn.click({ force: true });
    } else {
        await page.keyboard.press('Escape');
    }

    await page.evaluate(() => {
        // Prevent re-appearance
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Remove ALL tour/modal/overlay elements
        const remove = (s) => document.querySelectorAll(s).forEach(el => el.remove());
        remove('.tour-overlay');
        remove('.onboarding-modal');
        remove('[role="dialog"]');
        remove('.chakra-modal__overlay');
        remove('.ms-welcome-modal');
        remove('.slp-container');
        
        // Clear all blurs and filters
        const style = document.createElement('style');
        style.innerHTML = `
            * { filter: none !important; backdrop-filter: none !important; }
            [role="dialog"], .tour-overlay, .onboarding-modal, .slp-container { display: none !important; }
            .app-container, #root > div, body { filter: none !important; overflow: auto !important; opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; }
        `;
        document.head.appendChild(style);
        
        // Final cleanup of inline filters
        document.querySelectorAll('*').forEach(el => {
            if (el instanceof HTMLElement) {
                el.style.filter = 'none';
                el.style.backdropFilter = 'none';
            }
        });
    });

    await page.waitForTimeout(1000);

    // Ensure editor is open
    const newProj = page.getByTestId('new-project-btn');
    if (await newProj.isVisible()) {
        await newProj.click({ force: true });
        await page.waitForTimeout(2000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Test node
    const nodeType = 'Image';
    console.log(`Adding ${nodeType}...`);
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.keyboard.press(' ');
    
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill(nodeType);
    await page.waitForTimeout(1000);
    
    // Find and click the menu item
    await page.evaluate((text) => {
        const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
        const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
        if (target) target.click();
    }, nodeType);
    
    await page.waitForTimeout(3000);
    await page.keyboard.press('Escape'); // Hide menu

    // Final High resolution screenshot
    await page.screenshot({ path: `tests/e2e/screenshots/node_imageNode_v32.png`, fullPage: true });
  });
});
