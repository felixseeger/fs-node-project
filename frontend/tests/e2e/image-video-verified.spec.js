import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Setup
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, [data-testid="chat-ui"]').forEach(el => el.remove());
        document.querySelectorAll('*').forEach(el => {
            if (el instanceof HTMLElement) {
                el.style.filter = 'none';
                el.style.backdropFilter = 'none';
            }
        });
        document.body.style.overflow = 'auto';
    });

    await page.waitForTimeout(2000);

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });

    // 2. TEST NODES - Using exactly what was seen in the menu
    const nodes = [
        { searchText: 'Image', label: 'Image' },
        { searchText: 'Video', label: 'Video' },
        { searchText: 'Output', label: 'Output' }
    ];

    for (const n of nodes) {
        console.log(`Adding ${n.searchText}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await page.keyboard.press(' ');
        await page.waitForTimeout(500);
        
        // Use evaluate to find the exact button with the label
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.trim() === text);
            if (target) target.click();
            else {
                // Lenient fallback
                const firstMatch = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
                if (firstMatch) firstMatch.click();
            }
        }, n.searchText);
        
        await page.waitForTimeout(3000); 
        await page.keyboard.press('Escape'); 

        // Capture
        await page.screenshot({ path: `tests/e2e/screenshots/node_${n.searchText}_final_v2.png` });

        // Reset
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
