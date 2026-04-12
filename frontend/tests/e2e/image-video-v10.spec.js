import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Force clear everything and open a new project
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        document.querySelectorAll('.tour-overlay, .tour-modal, .onboarding-modal').forEach(el => el.remove());
    });

    // If "New Project" button in modal is visible, click it
    const modalNewBtn = page.locator('[role="dialog"] button:has-text("New project")').first();
    const dashboardNewBtn = page.getByTestId('new-project-btn');
    
    if (await modalNewBtn.isVisible()) {
        await modalNewBtn.click();
    } else if (await dashboardNewBtn.isVisible()) {
        await dashboardNewBtn.click();
    }

    // Wait for the pane to appear
    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Ensure focus
    await pane.click({ position: { x: 10, y: 10 } });

    // 2. TEST NODES
    const nodesToTest = [
        { type: 'imageNode' },
        { type: 'videoOutput' },
        { type: 'universalGeneratorImage' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        // Open search menu using space bar
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.type);
        await page.waitForTimeout(800);
        
        // Click the first result
        const firstResult = page.locator('.ms-node-list button.ms-node-btn').first();
        await expect(firstResult).toBeVisible();
        await firstResult.click({ force: true });
        
        // Check node on canvas
        const canvasNode = page.locator(`.react-flow__node-${node.type}`).first();
        await expect(canvasNode).toBeVisible({ timeout: 20000 });
        
        // Take screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}.png` });

        // Cleanup: remove node
        await canvasNode.click({ force: true });
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
  });
});
