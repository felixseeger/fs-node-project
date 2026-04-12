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

  // Check if we are on the landing page
  let text = await page.evaluate(() => document.body.innerText);
  if (text.includes('Get Started Free')) {
    console.log('On landing page, clicking Get Started...');
    await page.click('text="Get Started Free"').catch(() => page.click('text="Log in"'));
    await page.waitForTimeout(3000);
    text = await page.evaluate(() => document.body.innerText);
  }
  
  // Check if we are on the auth page
  const isAuthPage = text.includes('Sign In') || 
           text.includes('Sign in') ||
           text.includes('Create an account') ||
           text.includes('Welcome back');
  
  if (isAuthPage) {
    console.log('On Auth page, creating a test account...');
    
    // Switch to signup if needed
    const signupLink = page.locator('text=Sign up').first();
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await page.waitForTimeout(1000);
    }
    
    // Fill signup form
    const randomEmail = `test_${Date.now()}@example.com`;
    
    const nameInputs = await page.locator('input[placeholder="Jane Doe"]').all();
    if (nameInputs.length > 0) await nameInputs[0].fill('Test User');
    
    const emailInputs = await page.locator('input[placeholder="you@example.com"]').all();
    if (emailInputs.length > 0) await emailInputs[0].fill(randomEmail);
    
    const passInputs = await page.locator('input[type="password"]').all();
    if (passInputs.length >= 2) {
      await passInputs[0].fill('password123');
      await passInputs[1].fill('password123');
    } else if (passInputs.length === 1) {
      await passInputs[0].fill('password123');
    }
    
    // Submit
    await page.keyboard.press('Enter');
    console.log(`Registered with ${randomEmail}`);
    
    // Wait for the main editor or dashboard
    await page.waitForTimeout(5000); 
  }

  // Let's check if we are on the ProjectsDashboard and need to open a workflow
  const currentText = await page.evaluate(() => document.body.innerText);
  if (currentText.includes('New Workflow') || currentText.includes('My Projects')) {
    console.log('On dashboard, creating/opening a workflow...');
    const newWfBtn = page.locator('text="New Workflow"').first();
    if (await newWfBtn.isVisible()) {
      await newWfBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  // Take initial screenshot of the canvas
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
