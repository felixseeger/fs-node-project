import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');

  // Wait for the app to load
  await page.waitForTimeout(3000);

  // Take initial screenshot
  await page.screenshot({ path: 'test-debug-initial.png' });
  console.log('Initial screenshot saved as test-debug-initial.png');

  // Find and click the chat toggle button
  console.log('Opening chat...');
  // The ChatButton uses data-testid="chat-toggle"
  await page.click('button[data-testid="chat-toggle"]', { timeout: 5000 }).catch(async () => {
    // fallback if testid is not there
    await page.click('button[aria-label="Toggle Chat"]');
  });

  await page.waitForTimeout(1000);
  
  // Take screenshot with chat open
  await page.screenshot({ path: 'test-debug-chat-open.png' });
  console.log('Chat open screenshot saved as test-debug-chat-open.png');

  console.log('Typing message...');
  const chatInput = page.locator('textarea[data-testid="chat-input"]');
  await chatInput.waitFor({ state: 'visible' });
  await chatInput.fill('Please add an image generator node and a text node');

  console.log('Sending message...');
  // The send button might have data-testid="chat-generate" or an SVG inside a button next to the input
  await page.click('button[data-testid="chat-generate"]');

  console.log('Waiting for AI response...');
  // Wait for the "Apply Canvas Edits" button or "Import Workflow to Canvas"
  // It could take up to 20-30 seconds depending on the model
  
  try {
    // Wait for the Apply button
    const applyBtn = page.locator('button', { hasText: 'Apply Canvas Edits' });
    await applyBtn.waitFor({ state: 'visible', timeout: 30000 });
    
    console.log('Taking screenshot of AI response...');
    await page.screenshot({ path: 'test-debug-ai-response.png' });
    
    console.log('Clicking Apply Canvas Edits...');
    await applyBtn.click();
    
    // Wait for canvas to update
    await page.waitForTimeout(2000);
    
    console.log('Taking screenshot of updated canvas...');
    await page.screenshot({ path: 'test-debug-canvas-updated.png' });
    
    console.log('Test completed successfully!');
  } catch (e) {
    console.log('Could not find Apply button. Taking fallback screenshot...');
    await page.screenshot({ path: 'test-debug-fallback.png' });
    console.error(e);
  }

  await browser.close();
})();
