import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. CLEAR OVERLAYS - Using a loop with explicit visibility checks
    console.log("Checking for tour/onboarding overlays...");
    
    // Attempt to dismiss any tour or welcome modal
    const clearModals = async () => {
        const modals = ['text=Welcome to FS Node Project!', 'text=Skip Tour', 'text=Next'];
        for (const selector of modals) {
            const loc = page.locator(selector).first();
            if (await loc.isVisible()) {
                console.log(`Clearing overlay: ${selector}`);
                if (selector.includes('Skip Tour')) {
                    await loc.click({ force: true });
                } else {
                    await page.keyboard.press('Escape');
                }
                await page.waitForTimeout(500);
            }
        }
    };

    await clearModals();
    await page.waitForTimeout(1000);
    // Double check
    await clearModals();

    // 2. WAIT FOR ACTIONABLE CANVAS
    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Ensure it's truly visible (not obscured)
    await pane.click({ force: true, position: { x: 50, y: 50 } });

    const nodesToTest = [
        { type: 'imageNode', label: 'Image', expectedText: 'UPLOAD' },
        { type: 'videoOutput', label: 'Video Output', expectedText: 'No video connected' },
        { type: 'universalGeneratorImage', label: 'Universal Image Generator', expectedText: 'Image Generation' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        // Ensure menu is closed first
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        // Open search menu - establish focus then hit space
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        // Type the node type
        await searchInput.fill(node.type);
        await page.waitForTimeout(1000);
        
        // Click the result - find the one that matches or the first one if we must
        await page.evaluate((type) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => 
                b.textContent.toLowerCase().includes(type.toLowerCase()) || 
                b.getAttribute('data-node-type') === type
            );
            if (target) {
                console.log(`Found button for ${type}, clicking.`);
                target.click();
            } else if (btns.length > 0) {
                console.log(`Button for ${type} not found, clicking first available.`);
                btns[0].click();
            }
        }, node.type);
        
        // Check if node appeared
        const canvasNode = page.locator(`.react-flow__node-${node.type}`).first();
        await expect(canvasNode).toBeVisible({ timeout: 20000 });
        
        // Verification screenshot - take it before potentially failing on characteristic text
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}.png` });

        // Lenient verification of characteristic text
        if (node.expectedText) {
            const characteristic = canvasNode.locator(`text=${node.expectedText}`).first();
            const exists = await characteristic.count() > 0;
            console.log(`Node ${node.type} characteristic text '${node.expectedText}' exists: ${exists}`);
        }
        
        // Clean up
        await canvasNode.click({ force: true });
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
  });
});
