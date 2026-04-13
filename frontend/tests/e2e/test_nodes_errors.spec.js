import { test, expect } from '@playwright/test';

test('Test adding nodes', async ({ page }) => {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });
  page.on('pageerror', exception => {
    console.log('PAGE EXCEPTION:', exception.message);
  });

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(5000);
});
