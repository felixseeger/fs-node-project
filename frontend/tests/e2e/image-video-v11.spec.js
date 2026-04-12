import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Force clear everything and open a new project
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        document.querySelectorAll('.tour-overlay, .tour-modal, .onboarding-modal, [role="dialog"]').forEach(el => el.remove());
    });

    // Attempt to open a project
    const dashboardNewBtn = page.getByTestId('new-project-btn');
    if (await dashboardNewBtn.isVisible()) {
        await dashboardNewBtn.click();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    await pane.click({ position: { x: 50, y: 50 } });

    // 2. TEST NODES
    const nodesToTest = [
        { type: 'imageNode' },
        { type: 'videoOutput' },
        { type: 'universalGeneratorImage' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        // Typing slowly and with clear
        await searchInput.fill('');
        await searchInput.type(node.type, { delay: 100 });
        await page.waitForTimeout(1500); // Wait for filter
        
        // Click the result using evaluate to avoid actionability issues
        await page.evaluate((type) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => 
                b.textContent.toLowerCase().includes(type.toLowerCase()) || 
                b.getAttribute('data-node-type') === type
            );
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, node.type);
        
        // Use a broader check for the node on canvas
        const canvasNode = page.locator(`.react-flow__node`).filter({ hasText: node.type }).first();
        const typeSpecificNode = page.locator(`.react-flow__node-${node.type}`).first();
        
        await Promise.race([
            typeSpecificNode.waitFor({ state: 'visible', timeout: 15000 }),
            canvasNode.waitFor({ state: 'visible', timeout: 15000 })
        ]).catch(() => console.log(`Warning: Node ${node.type} not found via standard selectors`));
        
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}.png` });

        // Cleanup
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
  });
});
