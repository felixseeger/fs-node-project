import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // Aggressive cleanup and start fresh
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, [data-testid="chat-ui"]').forEach(el => el.remove());
        document.querySelectorAll('*').forEach(el => {
            if (el instanceof HTMLElement) {
                el.style.filter = 'none';
                el.style.backdropFilter = 'none';
            }
        });
        document.body.style.overflow = 'auto';
    });

    await page.waitForTimeout(2000);

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });

    const nodes = [
        { type: 'Image', label: 'Image' },
        { type: 'Video', label: 'Video' },
        { type: 'Output', label: 'Output' }
    ];

    for (const n of nodes) {
        console.log(`Adding ${n.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await page.keyboard.press(' ');
        await page.waitForTimeout(500);
        
        // Find result and click
        const btn = page.locator(`.ms-node-list button.ms-node-btn:has-text("${n.type}")`).first();
        if (await btn.isVisible()) {
            await btn.click({ force: true });
        } else {
            await page.locator('button').filter({ hasText: n.type }).first().click({ force: true });
        }
        
        await page.waitForTimeout(3000); 
        await page.keyboard.press('Escape'); 

        // Capture
        await page.screenshot({ path: `tests/e2e/screenshots/node_${n.type}_final_v3.png` });

        // Reset
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
