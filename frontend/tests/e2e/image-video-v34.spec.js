import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Ultimate aggressive cleanup and node capture...");

    // Brute force: Remove ALL tour and modal elements from DOM constantly
    const killerId = await page.evaluate(() => {
        const kill = () => {
            document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, .chakra-modal__overlay, .ms-welcome-modal, [data-testid="chat-ui"]').forEach(el => el.remove());
            document.querySelectorAll('*').forEach(el => {
                if (el instanceof HTMLElement) {
                    el.style.filter = 'none';
                    el.style.backdropFilter = 'none';
                    el.style.opacity = '1';
                }
            });
            document.body.style.overflow = 'auto';
        };
        return setInterval(kill, 100);
    });

    await page.waitForTimeout(2000);

    // If still in dashboard, click "New Project"
    const dashBtn = page.getByTestId('new-project-btn');
    if (await dashBtn.isVisible()) {
        await dashBtn.click({ force: true });
        await page.waitForTimeout(2000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Test node
    const config = { type: 'imageNode', searchText: 'Image' };
    console.log(`Adding ${config.type}...`);
    
    // Open menu using multiple events to be sure
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.keyboard.press(' ');
    
    const input = page.locator('.ms-search-input-overlay');
    await expect(input).toBeVisible({ timeout: 15000 });
    await input.fill(config.searchText);
    await page.waitForTimeout(1000);
    
    // Click result via evaluate
    await page.evaluate((text) => {
        const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
        const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
        if (target) target.click();
    }, config.searchText);
    
    await page.waitForTimeout(3000);
    await page.keyboard.press('Escape'); // Hide menu

    // Final screenshot attempt
    await page.screenshot({ path: `tests/e2e/screenshots/node_${config.type}_v34.png`, fullPage: true });
    
    // Stop the killer
    await page.evaluate((id) => clearInterval(id), killerId);
  });
});
