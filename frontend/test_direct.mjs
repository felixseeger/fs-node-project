import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'tests/e2e/storageState.json' });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  
  // Clear canvas
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('open-command-palette')));
  await page.waitForTimeout(500);
  await page.fill('input[placeholder="Search commands..."]', 'Clear Canvas');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);

  // Add sourceMediaNode
  await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  await page.waitForTimeout(500);
  await page.fill('.ms-search-input-overlay', 'sourceMediaNode');
  await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());
  await page.keyboard.press('Escape');

  await page.waitForTimeout(2000);
  console.log("Done checking sourceMediaNode");

  // Add imageAnalyzer
  await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  await page.waitForTimeout(500);
  await page.fill('.ms-search-input-overlay', 'imageAnalyzer');
  await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());
  await page.keyboard.press('Escape');
  
  await page.waitForTimeout(2000);
  console.log("Done checking imageAnalyzer");
  
  await browser.close();
})();
