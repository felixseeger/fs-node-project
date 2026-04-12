import { test, expect } from './fixtures.js';

test.describe('Dashboard and Chat Initialization', () => {

  test('Project creation and Chat access', async ({ page }) => {
    // 1. Dashboard should be ready (fixtures handles login/tour)
    await expect(page.getByTestId('new-project-btn').first()).toBeVisible({ timeout: 15000 });
    
    // 2. Create new project
    await page.getByTestId('new-project-btn').first().click();
    await page.getByTestId('new-project-modal-confirm-new').click();
    
    // 3. Verify Canvas
    const canvas = page.locator('.react-flow__pane').first();
    await expect(canvas).toBeVisible({ timeout: 15000 });
    
    // 4. Open Chat (Shortcut)
    await page.keyboard.press('Control+c');
    
    // 5. Verify Chat input
    const chatInput = page.locator('textarea[placeholder*="Ask anything"]').first();
    await expect(chatInput).toBeVisible({ timeout: 10000 });
    
    // 6. Test interaction
    await chatInput.fill('Verify system connectivity');
    await chatInput.press('Enter');
    
    // 7. Check for response
    await expect(page.locator('.ms-chat-message').first()).toBeVisible({ timeout: 15000 });
    
    await page.screenshot({ path: 'tests/e2e/screenshots/system_verified.png' });
  });
});
