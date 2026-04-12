import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');

  // Wait for the app to load
  await page.waitForTimeout(3000);
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("PAGE TEXT:", text.substring(0, 500));

  await browser.close();
})();
