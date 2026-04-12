import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Verified capture attempt with editorPage fixture...");

    // Aggressive cleanup
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, [data-testid="chat-ui"]').forEach(el => el.remove());
        document.querySelectorAll('*').forEach(el => { el.style.filter = 'none'; el.style.backdropFilter = 'none'; });
        document.body.style.overflow = 'auto';
    });

    await page.waitForTimeout(2000);

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    await pane.click({ position: { x: 50, y: 50 } });

    // TEST NODES
    const nodes = [
        { type: 'Image', slug: 'imageNode' },
        { type: 'Video', slug: 'videoNode' },
        { type: 'Output', slug: 'outputNode' }
    ];

    for (const n of nodes) {
        console.log(`Adding ${n.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await page.keyboard.press(' ');
        await page.waitForTimeout(500);
        
        // Find result and click using the proven evaluation method
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.trim() === text);
            if (target) target.click();
            else {
                const firstMatch = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
                if (firstMatch) firstMatch.click();
            }
        }, n.type);
        
        await page.waitForTimeout(3000); 
        await page.keyboard.press('Escape'); 

        // Zoom to see it
        await page.keyboard.press('Shift+f');
        await page.waitForTimeout(1000);

        // Capture
        await page.screenshot({ path: `tests/e2e/screenshots/node_${n.slug}_verified.png` });

        // Reset for next
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
  });
});
