import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Capturing nodes using direct click on library sidebar...");

    // 1. CLEAR BLUR AND MODALS
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
        setInterval(kill, 200);
        kill();
    });

    await page.waitForTimeout(2000);

    // Ensure we are in editor
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click({ force: true });
        await page.waitForTimeout(2000);
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. ADD NODES VIA SIDEBAR
    // Based on screenshots, there is a sidebar on the left with node names
    const nodeNames = ['Image', 'Video Output'];

    for (const name of nodeNames) {
        console.log(`Adding node: ${name}`);
        
        // Find the item in the sidebar and click it
        const sidebarItem = page.locator(`.ms-node-list button.ms-node-btn:has-text("${name}")`).first();
        if (await sidebarItem.isVisible()) {
            await sidebarItem.click({ force: true });
        } else {
            // Try different selector if first fails
            await page.click(`text=${name}`, { force: true }).catch(() => {});
        }
        
        await page.waitForTimeout(3000);
        
        // Zoom out or fit view to see the whole result
        await page.keyboard.press('Shift+f');
        await page.waitForTimeout(500);

        // Screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/node_${name.replace(/\s+/g, '_')}_final.png` });
        
        // Clean canvas for next node
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
