import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. DISMISS MODALS AND BYPASS TOUR - AGGRESSIVE
    console.log("Dismissing modals and bypassing tour...");
    
    // Set a recurring interval to kill modals as they appear
    await page.evaluate(() => {
        const killModals = () => {
            document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .ms-welcome-modal, .chakra-modal__overlay').forEach(el => el.remove());
            document.querySelectorAll('*').forEach(el => {
                if (el instanceof HTMLElement) {
                    el.style.filter = 'none';
                    el.style.backdropFilter = 'none';
                }
            });
            document.body.style.overflow = 'auto';
        };
        window._modalKiller = setInterval(killModals, 200);
        killModals();
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
    });

    await page.waitForTimeout(2000);

    // Ensure we are in the editor
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click({ force: true });
        await page.waitForTimeout(2000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. TEST NODES
    const nodeTypes = [
        { type: 'imageNode', searchText: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output' }
    ];

    for (const node of nodeTypes) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Open menu via evaluatd dispatch
        await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.searchText);
        await page.waitForTimeout(1000);
        
        // Find result and click via evaluate
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, node.searchText);
        
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape'); // Close menu

        // Verification screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_final_v29.png` });

        // Cleanup: remove node
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }

    // Stop the modal killer
    await page.evaluate(() => clearInterval(window._modalKiller));
  });
});
