import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Force clear EVERYTHING with JS evaluate
    await page.evaluate(() => {
        // Clear onboarding/tour
        localStorage.setItem('hasSeenOnboarding', 'true');
        localStorage.setItem('onboarding_step', 'complete');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Remove tour elements from DOM directly
        const tourElements = document.querySelectorAll('.tour-overlay, .tour-modal, .onboarding-modal');
        tourElements.forEach(el => el.remove());
        
        // Remove blur from app container
        const app = document.querySelector('.app-container, #root > div');
        if (app) {
            app.style.filter = 'none';
            app.classList.remove('blur-sm', 'blur-md', 'blur-lg');
        }
    });

    await page.reload(); // Reload to apply storage changes and get a clean slate
    await page.waitForTimeout(2000);

    // Ensure we are in the editor
    if (await page.getByTestId('new-project-btn').isVisible()) {
      await page.getByTestId('new-project-btn').click();
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
        
        // Open search menu via evaluate to bypass any interceptors
        await page.evaluate(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        });
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.type);
        await page.waitForTimeout(1000);
        
        // Click result via evaluate
        await page.evaluate((type) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => 
                b.textContent.toLowerCase().includes(type.toLowerCase()) || 
                b.getAttribute('data-node-type') === type
            );
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, node.type);
        
        // Check if node appeared
        const canvasNode = page.locator(`.react-flow__node-${node.type}`).first();
        await expect(canvasNode).toBeVisible({ timeout: 20000 });
        
        // Take screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}.png` });

        // Cleanup
        await canvasNode.click({ force: true });
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
  });
});
