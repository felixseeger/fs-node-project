import { test, expect } from '@playwright/test';
import path from 'path';

test('Test SAM 3 Segmentation Node', async ({ page }) => {
  // Wait for the app to load
  await page.goto('http://localhost:5173');
  
  // Create a SAM 3 Node
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  });
  await page.waitForTimeout(500);
  await page.fill('input[placeholder="Search nodes..."]', 'SAM 3 Segmentation');
  await page.waitForTimeout(500);
  await page.click('text=SAM 3 Segmentation');
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'frontend/tests/e2e/screenshots/sam3-node.png' });
  
  // Let's add a Layer Editor
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  });
  await page.waitForTimeout(500);
  await page.fill('input[placeholder="Search nodes..."]', 'Layer Editor');
  await page.waitForTimeout(500);
  await page.click('text=Layer Editor');

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'frontend/tests/e2e/screenshots/sam3-layer.png' });

  // Let's add Output Gallery
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  });
  await page.waitForTimeout(500);
  await page.fill('input[placeholder="Search nodes..."]', 'Output Gallery');
  await page.waitForTimeout(500);
  await page.click('text=Output Gallery');

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'frontend/tests/e2e/screenshots/sam3-all.png' });
});
