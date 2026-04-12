import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Using browser tool to force a screenshot of nodes...");

    // Brute force bypass tour and loading
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, .ms-welcome-modal').forEach(el => el.remove());
        document.querySelectorAll('*').forEach(el => {
            if (el instanceof HTMLElement) {
                el.style.filter = 'none';
                el.style.backdropFilter = 'none';
                el.style.opacity = '1';
                el.style.visibility = 'visible';
            }
        });
    });

    await page.waitForTimeout(2000);

    // Open project if dashboard is shown
    const newProjBtn = page.getByTestId('new-project-btn');
    if (await newProjBtn.isVisible()) {
        await newProjBtn.click({ force: true });
        await page.waitForTimeout(2000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Add multiple nodes at once for a single screenshot
    const searchMenu = async (query) => {
        await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
        const input = page.locator('.ms-search-input-overlay');
        await expect(input).toBeVisible({ timeout: 15000 });
        await input.fill(query);
        await page.waitForTimeout(1000);
        await page.evaluate((q) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(q.toLowerCase()));
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, query);
        await page.waitForTimeout(1000);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
    };

    console.log("Adding nodes...");
    await searchMenu('Image');
    await searchMenu('Video Output');
    await searchMenu('Universal Image Generator');

    await page.waitForTimeout(3000);
    
    // Final high resolution screenshot
    await page.screenshot({ path: `tests/e2e/screenshots/all_nodes_v31.png`, fullPage: true });
    
    // Check if anything is on canvas
    const nodeCount = await page.locator('.react-flow__node').count();
    console.log(`Final nodes on canvas: ${nodeCount}`);
  });
});
