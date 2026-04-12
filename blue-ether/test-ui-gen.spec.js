import { test, expect } from '@playwright/test';
import fs from 'fs';

test('create gemini avatar', async ({ page }) => {
  // Go to the local app
  await page.goto('http://localhost:5173/workspaces/test-workspace');

  // Add the Universal Image node
  await page.getByRole('button', { name: 'Add Node' }).click();
  await page.getByText('Universal Image').click();

  // The node should appear. Focus the textarea inside the node.
  // Using a generic locator for the prompt input.
  const node = page.locator('.react-flow__node').filter({ hasText: 'Universal Image' });
  await node.locator('textarea').fill('A glowing, majestic AI avatar named Gemini. Cosmic intelligence, neon blue and deep purple, glowing neural pathways, ultra-detailed, cinematic lighting, 8k resolution, photorealistic digital art.');

  // Click Generate
  await node.locator('button').filter({ hasText: 'Generate' }).click();

  // Wait for the image to appear inside the node
  // The image is usually an <img> tag. Wait for the loading to finish.
  await expect(node.locator('img')).toBeVisible({ timeout: 60000 });
  
  // Wait a bit for rendering
  await page.waitForTimeout(2000);

  // Take a screenshot of the specific node!
  await node.screenshot({ path: 'gemini-node-snapshot.png' });

  // Grab the image src if we want
  const imgSrc = await node.locator('img').getAttribute('src');
  if (imgSrc && imgSrc.startsWith('data:image')) {
     const b64 = imgSrc.replace(/^data:image\/.*?;base64,/, '');
     fs.writeFileSync('gemini_avatar_from_ui.png', b64, 'base64');
  }
});
