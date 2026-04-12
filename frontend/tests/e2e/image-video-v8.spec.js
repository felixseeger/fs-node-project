import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    console.log("Checking for tour/onboarding overlays...");
    
    // 1. DISMISS WELCOME MODAL
    // We'll use multiple strategies to ensure it's gone
    const dismissWelcome = async () => {
      // Look for the Blue "Next" button or "Skip Tour" link
      const nextBtn = page.locator('button:has-text("Next")');
      const skipLink = page.locator('text=Skip Tour');
      
      if (await skipLink.isVisible()) {
          console.log("Clicking Skip Tour");
          await skipLink.click({ force: true });
      } else if (await nextBtn.isVisible()) {
          console.log("Clicking Next through tour...");
          for (let i = 0; i < 6; i++) {
              if (await nextBtn.isVisible()) {
                  await nextBtn.click({ force: true });
                  await page.waitForTimeout(300);
              }
          }
      }
      
      // Hitting Escape as a broad backup
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    };

    await dismissWelcome();
    
    // 2. ENSURE WE ARE IN THE EDITOR
    // If we are still in the dashboard, we need to open a project
    if (await page.getByTestId('new-project-btn').isVisible()) {
      console.log("Still in dashboard, clicking New Project");
      await page.getByTestId('new-project-btn').click();
    }
    
    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 3. TEST NODES
    const nodesToTest = [
        { type: 'imageNode', label: 'Image', expectedText: 'UPLOAD' },
        { type: 'videoOutput', label: 'Video Output', expectedText: 'No video connected' },
        { type: 'universalGeneratorImage', label: 'Universal Image Generator', expectedText: 'Image Generation' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        // Ensure search menu is closed
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        // Open search menu via space bar - ensure focus on pane first
        await pane.click({ force: true });
        await page.keyboard.press(' ');
        
        const searchInput = page.locator('.ms-search-input-overlay');
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        
        await searchInput.fill(node.type);
        await page.waitForTimeout(1000);
        
        // Use a precise locator for the node creation button
        // Based on fixtures.js it's .ms-node-list button.ms-node-btn
        const nodeBtn = page.locator('.ms-node-list button.ms-node-btn').first();
        await expect(nodeBtn).toBeVisible({ timeout: 10000 });
        await nodeBtn.click({ force: true });
        
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
