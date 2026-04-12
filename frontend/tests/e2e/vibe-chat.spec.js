import { test, expect } from './fixtures';

test.describe('Vibe Coding Chat', () => {
  test('should handle AI canvas actions and suggestions', async ({ editorPage }) => {
    // 1. Mock the /api/chat endpoint
    await editorPage.route('**/api/chat', async (route) => {
      const mockResponse = {
        success: true,
        response: "Sure, I've added a generator node for you!",
        commands: [
          { 
            "action": "ADD_NODE", 
            "id": "mock-gen-node", 
            "type": "generator", 
            "position": { "x": 200, "y": 200 }, 
            "data": { "label": "Mock Generator", "prompt": "a beautiful landscape" } 
          }
        ],
        suggestions: [
          "Connect an upscaler",
          "Change the prompt"
        ]
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    });

    // Ensure chat is open
    const chatInput = editorPage.getByTestId('chat-input');
    await expect(chatInput).toBeVisible({ timeout: 20000 });

    // 3. Type a message and submit
    await chatInput.fill('Add an image generator');
    await chatInput.press('Enter');

    // 4. Verify that the new node appears on the canvas
    const newNode = editorPage.locator('.react-flow__node').filter({ hasText: 'Mock Generator' });
    await expect(newNode).toBeVisible({ timeout: 20000 });

    // 5. Verify the node has highlighting
    await expect(newNode.locator('.glass-card')).toHaveClass(/node-highlighted/);

    // 6. Verify the toast notification
    await expect(editorPage.locator('text=/AI applied .* changes/')).toBeVisible();

    // 7. Verify the suggestions appeared
    await expect(editorPage.locator('button', { hasText: 'Connect an upscaler' })).toBeVisible();
  });
});
