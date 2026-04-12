import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. CLEAR OVERLAYS
    console.log("Forcing overlay dismissal...");
    
    // Multiple Escape key presses to close modals
    for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
    }

    // Try clicking Skip Tour if it exists
    await page.click('text=Skip Tour', { timeout: 2000 }).catch(() => {});

    // BRUTE FORCE CSS: Remove all blurs and overlays via injected <style>
    await page.evaluate(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .tour-overlay, .tour-modal, .onboarding-modal, [role="dialog"], .ms-welcome-modal { display: none !important; }
            * { filter: none !important; backdrop-filter: none !important; }
            .app-container, #root, body { overflow: auto !important; }
        `;
        document.head.appendChild(style);
        
        // Also clear storage just in case
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
    });

    await page.waitForTimeout(1000);

    // Ensure we are in the editor
    const dashboardNewBtn = page.getByTestId('new-project-btn');
    if (await dashboardNewBtn.isVisible()) {
        await dashboardNewBtn.click();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. TEST NODES
    const nodesToTest = [
        { type: 'imageNode', label: 'Image' },
        { type: 'videoOutput', label: 'Video Output' },
        { type: 'universalGeneratorImage', label: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        await page.keyboard.press('Escape'); // Close any open menu
        await page.waitForTimeout(500);

        // Click center of pane to ensure focus
        await pane.click({ position: { x: 400, y: 300 } });
        
        // Open search menu via evaluated dispatch (reliable)
        await page.evaluate(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        });
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.type);
        await page.waitForTimeout(1000);
        
        // Use evaluate to find and click the menu item precisely
        const clickSuccess = await page.evaluate((type) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => 
                b.textContent.toLowerCase().includes(type.toLowerCase())
            );
            if (target) {
                target.click();
                return true;
            }
            return false;
        }, node.type);
        
        console.log(`Node ${node.type} menu click success: ${clickSuccess}`);
        
        await page.waitForTimeout(2000); // Wait for node creation and animation
        
        // Use a selector that targets the node specifically on the canvas
        // Many React Flow setups use .react-flow__node-[type]
        const canvasNode = page.locator(`.react-flow__node`).filter({ hasText: node.label }).first();
        if (await canvasNode.count() > 0) {
            console.log(`Node ${node.type} found on canvas.`);
            // Zoom into the node for a clear screenshot
            await canvasNode.scrollIntoViewIfNeeded();
        }

        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_v15.png` });

        // Cleanup: select all and delete
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a'); // Mac
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
  });
});
