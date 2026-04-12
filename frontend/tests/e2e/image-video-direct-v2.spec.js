import { test, expect } from '@playwright/test';

test.describe('Image and Video Node Operations', () => {

  test('Capture Nodes Availability and Visuals', async ({ page }) => {
    // Navigate directly
    await page.goto('http://localhost:5173/');
    
    //Aggressive cleanup
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Setup a strict interval that removes blockers
        setInterval(() => {
            const blockers = document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, .chakra-modal__overlay, .ms-welcome-modal, [data-testid="chat-ui"]');
            blockers.forEach(el => {
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

    // Click "New Project" if visible on dashboard
    const dashBtn = page.getByTestId('new-project-btn');
    if (await dashBtn.isVisible()) {
        await dashBtn.click({ force: true });
        await page.waitForTimeout(2000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 45000 });
    
    // Add nodes
    const nodeConfigs = [
        { type: 'image', searchText: 'Image' },
        { type: 'video', searchText: 'Video' },
        { type: 'output', searchText: 'Output' }
    ];

    for (const config of nodeConfigs) {
        console.log(`Working on: ${config.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('input[placeholder*="Add node"], input[type="text"]').first();
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        await searchInput.fill(config.searchText);
        await page.waitForTimeout(1000);
        
        // Find and click the button
        const btn = page.locator('.ms-node-list button.ms-node-btn').first();
        await btn.click({ force: true });
        
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape');

        // Capture
        await page.screenshot({ path: `tests/e2e/screenshots/node_${config.type}_final.png` });

        // Reset canvas
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
