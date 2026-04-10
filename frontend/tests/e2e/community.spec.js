import { test, expect } from './fixtures.js';

test.describe('Community Features', () => {

  test('Community section is visible in sidebar and tabs', async ({ page }) => {
    // Check sidebar
    const communitySidebar = page.locator('.sidebar-item:has-text("Community")').first();
    await expect(communitySidebar).toBeVisible();

    // Check tabs
    const communityTab = page.locator('button').filter({ hasText: /^Community$/ });
    await expect(communityTab).toBeVisible();

    // Click Community tab
    await communityTab.click();
    
    // Check for empty state or cards
    const emptyState = page.locator('text=Be the first to share a workflow with the community!');
    const projectCards = page.locator('.project-card');
    
    // Either there's an empty state or there are cards
    const isEmptyVisible = await emptyState.isVisible();
    const isCardsVisible = await projectCards.count() > 0;
    
    expect(isEmptyVisible || isCardsVisible).toBeTruthy();
  });

  test('Can toggle a workflow to public', async ({ page }) => {
    // Go to "My Workflows"
    await page.locator('text=My Workflows').first().click();
    
    // Create a new board if none exists, or use the first one
    let projectCard = page.locator('.project-card').first();
    if (await projectCard.count() === 0) {
      await page.getByTestId('new-project-btn').first().click();
      await page.getByTestId('new-project-modal-confirm-new').click();
      // Wait for editor
      await page.waitForSelector('.react-flow');
      // Go back to dashboard
      await page.goto('/');
      await page.waitForSelector('.slp-ready', { timeout: 15000 }).then(el => el.click()).catch(() => {});
      await page.getByTestId('new-project-btn').waitFor({ state: 'visible', timeout: 15000 });
    }
    
    projectCard = page.locator('.project-card').first();
    await expect(projectCard).toBeVisible();

    // Right click to open context menu
    await projectCard.click({ button: 'right', force: true });
    
    // Check for "Make board public" option
    const publicBtn = page.locator('text=Make board public');
    const privateBtn = page.locator('text=Make board private');
    
    expect(await publicBtn.isVisible() || await privateBtn.isVisible()).toBeTruthy();
    
    // Toggle it
    if (await publicBtn.isVisible()) {
      await publicBtn.click();
    } else {
      await privateBtn.click();
    }
    
    // Wait for update
    await page.waitForTimeout(1000);
  });
});
