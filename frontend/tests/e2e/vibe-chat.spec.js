import { test, expect } from './fixtures';

test.describe('Vibe Coding Chat', () => {
  test('should handle AI canvas actions and suggestions', async ({ editorPage }) => {
    // 1. Mock the /api/chat endpoint so we don't hit the real backend
    await editorPage.route('**/api/chat', async (route) => {
      const request = route.request();
      const body = JSON.parse(request.postData() || '{}');
      
      // Simulate an AI response that adds a node, updates an existing one, and gives suggestions
      // We will pretend the user asked "Add an image generator"
      const mockResponse = {
        success: true,
        response: `Sure, I've added a generator node for you!
\`\`\`json
{
  "canvas_actions": [
    { 
      "action": "ADD_NODE", 
      "id": "mock-gen-node", 
      "type": "generator", 
      "position": { "x": 200, "y": 200 }, 
      "data": { "label": "Mock Generator", "prompt": "a beautiful landscape" } 
    }
  ],
  "suggestions": [
    "Connect an upscaler",
    "Change the prompt"
  ]
}
\`\`\``
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    });

    // 2. Open chat if not open, or just find the input
    const chatInput = editorPage.getByTestId('chat-input');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // 3. Type a message and submit (press Enter)
    await chatInput.fill('Add an image generator');
    await chatInput.press('Enter');

    // 4. Verify that the new node appears on the canvas
    // It should have the text "Mock Generator"
    const newNode = editorPage.locator('.react-flow__node').filter({ hasText: 'Mock Generator' });
    await expect(newNode).toBeVisible({ timeout: 10000 });

    // 5. Verify the node has the highlighting animation class
    await expect(newNode.locator('.glass-card')).toHaveClass(/node-highlighted/);

    // 6. Verify the toast notification
    const toast = editorPage.locator('text=AI applied 1 changes to canvas');
    await expect(toast).toBeVisible();

    // 7. Verify the suggestions appeared in the chat UI
    const suggestion1 = editorPage.locator('button', { hasText: 'Connect an upscaler' });
    const suggestion2 = editorPage.locator('button', { hasText: 'Change the prompt' });
    await expect(suggestion1).toBeVisible();
    await expect(suggestion2).toBeVisible();
    
    // 8. Verify the AI response text
    const aiMessage = editorPage.locator('text=Sure, I\'ve added a generator node for you!');
    await expect(aiMessage).toBeVisible();
  });
});
