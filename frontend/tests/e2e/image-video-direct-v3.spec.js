import { test, expect } from '@playwright/test';

test.describe('Image and Video Node Operations', () => {

  test('Capture Nodes Availability and Visuals', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // 1. Click "Get Started Free" to bypass landing page
    const getStartedBtn = page.locator('text=Get Started Free');
    await expect(getStartedBtn).toBeVisible({ timeout: 15000 });
    await getStartedBtn.click();
    
    // Wait for potentially being on the dashboard or automatic login
    await page.waitForTimeout(3000);
    
    // 2. Handle potential onboarding modals and blurs
    await page.evaluate(() => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        const killBlockers = () => {
            document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, .chakra-modal__overlay, .ms-welcome-modal, [data-testid="chat-ui"]').forEach(el => el.remove());
            document.querySelectorAll('*').forEach(el => {
                if (el instanceof HTMLElement) {
                    el.style.filter = 'none';
                    el.style.backdropFilter = 'none';
                }
            });
            document.body.style.overflow = 'auto';
        };
        setInterval(killBlockers, 200);
        killBlockers();
    });

    // 3. Open a project if we are on dashboard
    const newProjBtn = page.getByTestId('new-project-btn');
    const projectBoard = page.locator('.project-card').first();
    
    if (await newProjBtn.isVisible({ timeout: 10000 })) {
        await newProjBtn.click();
    } else if (await projectBoard.isVisible()) {
        await projectBoard.click();
    }
    
    // Wait for editor pane
    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 45000 });
    
    // 4. Test nodes
    const nodeConfigs = [
        { type: 'image', searchText: 'Image' },
        { type: 'video', searchText: 'Video' },
        { type: 'output', searchText: 'Output' }
    ];

    for (const config of nodeConfigs) {
        console.log(`Working on: ${config.type}`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('input[placeholder*="Add node"], input[type="text"]').first();
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        await searchInput.fill(config.searchText);
        await page.waitForTimeout(1500);
        
        // Find and click the button
        const btn = page.locator('.ms-node-list button.ms-node-btn').first();
        await btn.click({ force: true });
        
        await page.waitForTimeout(3000);
        await page.keyboard.press('Escape');

        // Capture
        await page.screenshot({ path: `tests/e2e/screenshots/node_${config.type}_final_direct.png` });

        // Cleanup
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
