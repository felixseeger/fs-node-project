import { test, expect } from '@playwright/test';

test('Test adding nodes', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  // Actually check if canvas is there
  const count = await page.locator('.react-flow').count();
  console.log("REACT FLOW COUNT:", count);
  expect(count).toBeGreaterThan(0);
});
