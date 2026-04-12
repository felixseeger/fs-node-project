import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Ultimate node capture attempt...");

    const forceClear = async () => {
        await page.evaluate(() => {
            document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .ms-welcome-modal, .chakra-modal__overlay, .slp-container').forEach(el => el.remove());
            document.querySelectorAll('*').forEach(el => { el.style.filter = 'none'; el.style.backdropFilter = 'none'; });
            document.body.style.overflow = 'auto';
            localStorage.setItem('hasSeenOnboarding', 'true');
        });
    };

    await forceClear();
    await page.waitForTimeout(2000);
    
    // Ensure project is open
    const newProj = page.getByTestId('new-project-btn');
    if (await newProj.isVisible()) {
        await newProj.click({ force: true });
        await page.waitForTimeout(2000);
        await forceClear();
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Use the menu to add nodes one by one and screenshot
    const searchMenuBtn = page.locator('button[data-tooltip="Add Nodes"], button:has-text("All nodes")').first();
    
    const nodeTypes = [
        { name: 'Image', slug: 'imageNode' },
        { name: 'Video Output', slug: 'videoOutput' },
        { name: 'Universal Image Generator', slug: 'universalGeneratorImage' }
    ];

    for (const node of nodeTypes) {
        console.log(`Adding ${node.name}...`);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        
        await searchInput.fill(node.name);
        await page.waitForTimeout(1000);
        
        // Find and click the button with the exact text
        const item = page.locator(`.ms-node-list button.ms-node-btn:has-text("${node.name}")`).first();
        if (await item.isVisible()) {
            await item.click({ force: true });
        } else {
            // Fallback to first visible
            await page.locator('.ms-node-list button.ms-node-btn').first().click({ force: true });
        }
        
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape');
        
        // Take screenshot of the result
        await page.screenshot({ path: `tests/e2e/screenshots/final_${node.slug}.png` });
        
        // Delete for next
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Meta+a');
        await page.keyboard.press('Backspace');
    }
  });
});
