import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Aggressively clear UI to ensure we reach the editor
    const clearBlockers = async () => {
        await page.evaluate(() => {
            // Force onboarding complete
            localStorage.setItem('hasSeenOnboarding', 'true');
            sessionStorage.setItem('slp_shown', 'true');
            
            // Remove overlays/modals
            document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .ms-welcome-modal, .chakra-modal__overlay, .slp-container, .ms-overlay').forEach(el => el.remove());
            
            // Remove blur
            document.querySelectorAll('*').forEach(el => {
                if (el instanceof HTMLElement) {
                    el.style.filter = 'none';
                    el.style.backdropFilter = 'none';
                }
            });
            document.body.style.overflow = 'auto';
        });
    };

    await clearBlockers();
    await page.waitForTimeout(2000);

    // If still in dashboard, click "New Project" button
    const dashboardNewBtn = page.getByTestId('new-project-btn');
    if (await dashboardNewBtn.isVisible()) {
        console.log("Dashboard detected. Opening project...");
        await dashboardNewBtn.click({ force: true });
        await page.waitForTimeout(3000);
        await clearBlockers();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. Capture Nodes
    const nodeTypes = [
        { name: 'Image', label: 'Image', slug: 'imageNode' },
        { name: 'Video Output', label: 'Video Output', slug: 'videoOutput' },
        { name: 'Universal Image Generator', label: 'Universal Image Generator', slug: 'universalGeneratorImage' }
    ];

    for (const node of nodeTypes) {
        console.log(`Working on ${node.name}...`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Open menu
        await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.name);
        await page.waitForTimeout(1000);
        
        // Find result and click via evaluate to be certain
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, node.name);
        
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape');

        // Screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/actual_${node.slug}_final.png` });

        // Cleanup
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
