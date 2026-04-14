import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000);
  if (await page.locator('text="Log in"').isVisible()) {
    await page.click('text="Log in"');
  }
  const emailInput = page.locator('input[placeholder="you@example.com"]');
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.fill('john@nodeproject.dev');
  await page.fill('input[type="password"]', 'TestPass123!');
  await page.click('button:has-text("Sign In"), button[type="submit"]');
  
  await page.waitForTimeout(5000);
  console.log("Body:", await page.evaluate(() => document.body.innerText.substring(0, 1000)));
  console.log("Test ID exists?", await page.evaluate(() => !!document.querySelector('[data-testid="new-project-btn"]')));
  
  await browser.close();
})();
