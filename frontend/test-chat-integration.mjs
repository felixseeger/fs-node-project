import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });

  console.log('Waiting for app to compile and load...');
  // Wait until either "Log in" or "Get Started Free" appears, meaning the React app has mounted
  await page.waitForFunction(() => {
    return document.body.innerText.includes('Log in') || 
           document.body.innerText.includes('Get Started') ||
           document.body.innerText.includes('Sign in');
  }, { timeout: 60000 });

  await page.waitForTimeout(2000);

  const getStartedBtn = page.locator('button', { hasText: 'Get Started Free' }).first();
  if (await getStartedBtn.isVisible()) {
    console.log('Clicking Get Started Free...');
    await getStartedBtn.click({ force: true });
    await page.waitForTimeout(2000);
  } else {
    const loginLink = page.locator('*:has-text("Log in")').last();
    if (await loginLink.isVisible()) {
      console.log('Clicking Log in...');
      await loginLink.click({ force: true });
      await page.waitForTimeout(2000);
    }
  }

  // Wait for auth page to load
  await page.waitForFunction(() => {
    return document.body.innerText.includes('Sign in') || 
           document.body.innerText.includes('Create an account') ||
           document.body.innerText.includes('Jane Doe');
  }, { timeout: 10000 }).catch(() => console.log('Auth page wait timed out.'));

  // Find signup link
  const signupLink = page.locator('*:has-text("Sign up")').last();
  if (await signupLink.isVisible()) {
    console.log('Clicking Sign up...');
    await signupLink.click({ force: true });
    await page.waitForTimeout(1000);
  }

  // Fill signup
  const randomEmail = `test_${Date.now()}@example.com`;
  console.log(`Using email: ${randomEmail}`);
  
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
  
  // Click terms
  const label = page.locator('label', { hasText: 'Terms of Service' });
  if (await label.isVisible()) {
    await label.click({ force: true });
  }

  // Click create account
  const createBtn = page.locator('button', { hasText: 'Create Account' });
  if (await createBtn.isVisible()) {
    await createBtn.click();
    console.log('Clicked Create Account');
  }

  // Wait for the app to redirect
  await page.waitForTimeout(4000);
  
  // Check if we need to click "New Project"
  try {
    console.log('Waiting for New Project button...');
    await page.click('[data-testid="new-project-btn"]', { timeout: 15000 });
    console.log('Clicked New Project...');
    await page.waitForTimeout(2000);
    
    // In modal
    console.log('Waiting for New Project option in modal...');
    await page.click('text="Start a new workflow"', { timeout: 5000 }).catch(async () => {
      await page.click('text="New project"');
    });
    
    // Wait for navigation to the board or wait for "Board 01" to appear and click it
    await page.waitForTimeout(3000);
    
    const boardLink = page.locator('text="Board 01"').first();
    if (await boardLink.isVisible()) {
      console.log('Clicking on Board 01 to enter the editor...');
      await boardLink.click({ force: true });
      await page.waitForTimeout(3000);
    }
  } catch (e) {
    console.log('Not on dashboard or New Project button not found.');
  }

  await page.screenshot({ path: 'test-debug-canvas.png' });
  console.log('Initial canvas screenshot saved as test-debug-canvas.png');

  // Skip welcome tour if present
  console.log('Checking for welcome tour...');
  const skipBtn = page.locator('*:has-text("Skip Tour")').last();
  if (await skipBtn.isVisible()) {
    await skipBtn.click({ force: true });
    console.log('Clicked Skip Tour');
    await page.waitForTimeout(1000);
  }

  // Find and click the chat toggle button
  console.log('Opening chat...');
  try {
    await page.waitForTimeout(2000);
    // Find the chat toggle
    const toggleBtn = page.locator('button[data-testid="chat-toggle"]').first();
    await toggleBtn.click({ force: true });
    
    // Wait for the chat to become visible (opacity 1)
    await page.waitForTimeout(2000);
  } catch (err) {
    console.log('Chat toggle error:');
    throw err;
  }

  await page.waitForTimeout(1000);
  
  // Take screenshot with chat open
  await page.screenshot({ path: 'test-debug-chat-open.png' });
  console.log('Chat open screenshot saved as test-debug-chat-open.png');

  console.log('Typing message...');
  const chatInput = page.locator('textarea[data-testid="chat-input"]').first();
  await chatInput.fill('Please add an image generator node and a text node', { force: true });

  console.log('Sending message...');
  await chatInput.press('Enter');
  
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
