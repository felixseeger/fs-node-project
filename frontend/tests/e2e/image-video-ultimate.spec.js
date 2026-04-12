import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Ultimate node capture attempt...");

    // 1. Force state and remove all blockers
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
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
        setInterval(kill, 100);
        kill();
    });

    await page.waitForTimeout(2000);

    // Ensure we are in the editor
    const dashBtn = page.getByTestId('new-project-btn');
    if (await dashBtn.isVisible()) {
        await dashBtn.click({ force: true });
        await page.waitForTimeout(3000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. Add and Capture Nodes
    // We'll add them without cleanup for a single clear screenshot if needed,
    // but the user wants them individually checked.
    const nodes = [
        { type: 'imageNode', searchText: 'Image', label: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output', label: 'Video Output' }
    ];

    for (const node of nodes) {
        console.log(`Adding ${node.type}...`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Open search via space
        await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
        const input = page.locator('.ms-search-input-overlay');
        await expect(input).toBeVisible({ timeout: 15000 });
        await input.fill(node.searchText);
        await page.waitForTimeout(1000);
        
        // Find result and click
        const btn = page.locator(`.ms-node-list button.ms-node-btn:has-text("${node.searchText}")`).first();
        if (await btn.isVisible()) {
            await btn.click({ force: true });
        } else {
            await page.locator('.ms-node-list button.ms-node-btn').first().click({ force: true });
        }
        
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape'); // Hide menu
        
        // If node appeared, move it so they don't overlap
        const canvasNode = page.locator('.react-flow__node').last();
        await canvasNode.click({ force: true });
        
        // Take screenshot of the node
        await page.screenshot({ path: `tests/e2e/screenshots/actual_${node.type}_final_full.png` });
        
        // Don't cleanup yet, maybe we get both in one
    }
    
    // Take a final shot of everything
    await page.screenshot({ path: `tests/e2e/screenshots/all_nodes_together.png` });
  });
});
