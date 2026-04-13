import { test, expect } from './fixtures.js';

test.describe('Page Transitions and State Preservation', () => {
  test('should preserve canvas state when navigating between Editor and Dashboard', async ({ page }) => {
    // 1. Go to the app
    await page.goto('/');
    
    // 2. We might be on the landing page or dashboard.
    // Let's try to get to the editor.
    // If we are on the landing page, click "Get Started Free" or "Visual Editor"
    const blankCanvasBtn = page.getByTestId('blank-canvas-btn');
    const newProjectBtn = page.getByTestId('new-project-btn');
    
    if (await blankCanvasBtn.isVisible()) {
      await blankCanvasBtn.click();
    } else if (await newProjectBtn.isVisible()) {
      await newProjectBtn.first().click({ force: true });
      const confirmBtn = page.getByTestId('new-project-modal-confirm-new').first();
      await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
      await confirmBtn.click({ force: true });
    } else {
      // Maybe we need to click "New Workflow" in the top bar?
      const newWorkflowBtn = page.locator('text=New Workflow').first();
      if (await newWorkflowBtn.isVisible()) {
        await newWorkflowBtn.click();
      }
    }

    // Wait for Editor to be visible
    await expect(page.locator('.react-flow').first()).toBeVisible({ timeout: 15000 });

    // 3. Add a node
    await page.locator('.react-flow__pane').dblclick();
    const searchInput = page.locator('input[placeholder="Search nodes..."]');
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill('Text');
    await page.locator('.canvas-search-item').first().click();

    // Verify node is added
    await expect(page.locator('.react-flow__node-textNode')).toBeVisible();
    const nodeCountBefore = await page.locator('.react-flow__node').count();
    expect(nodeCountBefore).toBeGreaterThan(0);

    // 4. Navigate to Dashboard
    await page.locator('text=Nodespace').first().click();
    await page.locator('button:has-text("Back home")').click();

    // Wait for Dashboard to be visible
    await expect(page.getByTestId('new-project-btn').first()).toBeVisible({ timeout: 10000 });

    // 5. Navigate back to Editor
    const firstProject = page.locator('.project-card, .workflow-card, text=Board').first();
    await firstProject.click();

    // Wait for Editor to be visible
    await expect(page.locator('.react-flow').first()).toBeVisible({ timeout: 10000 });

    // 6. Verify the node is still there
    const nodeCountAfter = await page.locator('.react-flow__node').count();
    expect(nodeCountAfter).toBe(nodeCountBefore);
    await expect(page.locator('.react-flow__node-textNode')).toBeVisible();
  });
});
