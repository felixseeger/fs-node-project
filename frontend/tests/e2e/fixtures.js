import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

let creds;
try {
  creds = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'test-credentials.json'), 'utf8'));
} catch (e) {
  creds = { email: 'test@example.com', password: 'password123' };
}

export const test = base.extend({
  page: async ({ page }, use) => {
    // Skip SLP by overwriting the function on window or ignoring it
    await page.goto('/');
    
    // Check if we need to log in
    await page.waitForTimeout(1000);
    let html = await page.content();
    
    if (html.includes('Log in') && !html.includes('Email Address')) {
      await page.click('text=Log in', { timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(1000);
      html = await page.content();
    }
    
    if (html.includes('Sign in') || html.includes('Welcome Back')) {
      await page.fill('input[placeholder="you@example.com"]', creds.email);
      await page.fill('input[type="password"]', creds.password);
      await page.click('button[type="submit"]').catch(() => page.click('button:has-text("Sign In")'));
    }
    
    // The SLP will show once per session, log in or not
    try {
      await page.waitForSelector('.slp-ready', { timeout: 15000 });
      await page.click('.slp-ready', { timeout: 3000 });
      await page.waitForTimeout(1000);
    } catch(e) {}
    
    // Verify dashboard
    await page.getByTestId('new-project-btn').waitFor({ state: 'visible', timeout: 10000 });

    await use(page);
  },
  
  editorPage: async ({ page }, use) => {
    const newProjectBtn = page.getByTestId('new-project-btn').first();
    await expect(newProjectBtn).toBeVisible({ timeout: 15000 });
    await newProjectBtn.click();
    await page.getByTestId('new-project-modal-confirm-new').click();

    const flowWrapper = page.locator('.react-flow').first();
    await expect(flowWrapper).toBeVisible({ timeout: 10000 });
    
    await use(page);
  }
});

export { expect };
