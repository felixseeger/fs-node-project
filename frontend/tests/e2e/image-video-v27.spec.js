import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Capturing nodes directly by bypassing tour...");

    // Brute force bypass and setup
    await page.evaluate(() => {
        // Clear blockers
        document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container, .chakra-modal__overlay').forEach(el => el.remove());
        document.querySelectorAll('*').forEach(el => { el.style.filter = 'none'; el.style.backdropFilter = 'none'; });
        document.body.style.overflow = 'auto';
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
    });

    // Ensure we have a project open
    if (await page.getByTestId('new-project-btn').isVisible()) {
        await page.getByTestId('new-project-btn').click({ force: true });
        await page.waitForTimeout(2000);
        await page.evaluate(() => {
            document.querySelectorAll('.tour-overlay, .onboarding-modal, [role="dialog"], .slp-container').forEach(el => el.remove());
            document.querySelectorAll('*').forEach(el => { el.style.filter = 'none'; el.style.backdropFilter = 'none'; });
        });
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // Add nodes via space -> search -> click
    const nodes = [
        { name: 'Image', label: 'Image', slug: 'imageNode' },
        { name: 'Video Output', label: 'Video Output', slug: 'videoOutput' },
        { name: 'Universal Image Generator', label: 'Universal Image Generator', slug: 'universalGeneratorImage' }
    ];

    for (const node of nodes) {
        console.log(`Adding ${node.name}...`);
        
        // Use a small JS interval to keep the tour from popping back up
        const tourKiller = await page.evaluateHandle(() => {
            return setInterval(() => {
                document.querySelectorAll('.tour-overlay, .onboarding-modal').forEach(el => el.remove());
            }, 500);
        });

        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        await searchInput.fill(node.name);
        await page.waitForTimeout(1000);
        
        // Find button in list
        const nodeBtn = page.locator('.ms-node-list button.ms-node-btn').first();
        await expect(nodeBtn).toBeVisible({ timeout: 10000 });
        await nodeBtn.click({ force: true });
        
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape');

        // Locate node and zoom
        const canvasNode = page.locator('.react-flow__node').last();
        await canvasNode.scrollIntoViewIfNeeded();
        
        // High quality screenshot
        await page.screenshot({ path: `tests/e2e/screenshots/actual_${node.slug}.png` });
        
        // Clean up
        await page.evaluate(() => {
            const nodes = document.querySelectorAll('.react-flow__node');
            nodes.forEach(n => n.click());
        });
        await page.keyboard.press('Backspace');
        
        await page.evaluate((id) => clearInterval(id), tourKiller);
    }
  });
});
