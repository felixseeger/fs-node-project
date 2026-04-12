import { test, expect } from './fixtures.js';

test.describe('Chat Media Operations', () => {

  test('VibeChat - can post generated image to chat', async ({ editorPage: page }) => {
    await expect(page.locator('.react-flow__pane')).toBeVisible();

    // 1. Create a Generator Node using Command Palette
    await page.keyboard.press(' '); // Space to open search
    const searchInput = page.locator('.ms-search-input-overlay');
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill('generator');
    await page.keyboard.press('Enter');

    const genNode = page.locator('.react-flow__node-generator').first();
    await expect(genNode).toBeVisible({ timeout: 15000 });

    // 2. Open Chat using Shortcut
    await page.keyboard.press('Control+c'); // Changed from metaKey for broader compatibility
    const chatInput = page.locator('textarea[placeholder*="Ask anything"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // 3. Command to generate and post
    await chatInput.fill('Generate a test image and show it here');
    await chatInput.press('Enter');

    // 4. Verify image appears in chat
    const chatImage = page.locator('.ms-chat-message img').first();
    await expect(chatImage).toBeVisible({ timeout: 30000 });
    
    await page.screenshot({ path: 'tests/e2e/screenshots/chat_image_posted.png' });
  });

  test('VibeChat - can post generated video to chat', async ({ editorPage: page }) => {
    // Open Chat
    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', metaKey: true })); });
    const chatInput = page.locator('textarea[placeholder*="Ask anything"]');
    
    await chatInput.fill('Generate a short 5s test video and post it');
    await chatInput.press('Enter');

    // Verify video appears in chat
    const chatVideo = page.locator('.ms-chat-message video').first();
    await expect(chatVideo).toBeVisible({ timeout: 60000 });
    
    await page.screenshot({ path: 'tests/e2e/screenshots/chat_video_posted.png' });
  });
});
