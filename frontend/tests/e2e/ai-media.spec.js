import { test, expect } from './fixtures.js';

test.describe('Chat Media Operations - Production Logic', () => {

  test('VibeChat - Aggressive open and post media', async ({ page }) => {
    // Dashboard is ready via fixtures
    await expect(page.getByTestId('new-project-btn').first()).toBeVisible({ timeout: 15000 });
    
    // Create Project
    await page.getByTestId('new-project-btn').first().click();
    await page.getByTestId('new-project-modal-confirm-new').click();
    
    // Wait for canvas
    await expect(page.locator('.react-flow__pane').first()).toBeVisible({ timeout: 15000 });
    
    // The "AI Assistant" window is already open in the center based on debug screenshots.
    // Let's find that central chat/input area.
    
    const aiInput = page.locator('textarea[placeholder*="Describe what you want to create"]').first();
    await expect(aiInput).toBeVisible({ timeout: 10000 });

    // Fill prompt to generate media
    await aiInput.fill('Create a high-quality cinematic image of a neon forest and post it here');
    await aiInput.press('Enter');

    // Wait for a message to appear in the AI Assistant output
    // Looking for a message container inside that central window
    const message = page.locator('.ms-ai-message, .ms-chat-message').first();
    await expect(message).toBeVisible({ timeout: 45000 });
    
    // Check for img or video
    const media = message.locator('img, video').first();
    await expect(media).toBeVisible({ timeout: 30000 });
    
    await page.screenshot({ path: 'tests/e2e/screenshots/ai_media_verified.png' });
  });
});
