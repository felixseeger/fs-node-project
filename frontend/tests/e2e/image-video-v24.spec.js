import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. DISMISS MODALS
    console.log("Dismissing modals...");
    await page.waitForTimeout(2000);
    
    // Explicitly click Skip Tour and Next
    await page.locator('text=Skip Tour').click({ force: true }).catch(() => {});
    await page.locator('button:has-text("Next")').click({ force: true }).catch(() => {});
    await page.keyboard.press('Escape');

    // 2. ENSURE WE ARE IN EDITOR
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click();
        await page.waitForTimeout(2000);
        await page.locator('text=Skip Tour').click({ force: true }).catch(() => {});
    }

    // BRUTE FORCE DELETE OVERLAYS
    await page.evaluate(() => {
        const kill = (s) => document.querySelectorAll(s).forEach(el => el.remove());
        kill('.tour-overlay');
        kill('.tour-modal');
        kill('.onboarding-modal');
        kill('[role="dialog"]');
        kill('.slp-container');
        document.querySelectorAll('*').forEach(el => { el.style.filter = 'none'; el.style.backdropFilter = 'none'; });
    });

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 3. TEST NODES
    // We use the search menu precisely
    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image', label: 'Image' },
        { type: 'videoOutput', searchText: 'Video', label: 'Video Output' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill(node.searchText);
        await page.waitForTimeout(1000);
        
        // Find result and click
        const result = page.locator('.ms-node-list button.ms-node-btn').first();
        await expect(result).toBeVisible();
        await result.click({ force: true });
        
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape'); // Close menu

        // Final screenshot attempt
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_final_v24.png` });

        // Cleanup
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
