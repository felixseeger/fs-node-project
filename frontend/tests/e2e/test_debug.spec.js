import { test, expect } from './fixtures.js';

test('debug sourceMediaNode crash', async ({ editorPage: page }) => {
  const logs = [];
  page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));
  page.on('pageerror', err => logs.push('PAGE_ERROR: ' + err.message));
  
  await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  const searchInput = page.locator('.ms-search-input-overlay');
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.fill('sourceMediaNode');
  await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());
  
  await page.waitForTimeout(2000);
  console.log("Browser Logs:", logs);
});
