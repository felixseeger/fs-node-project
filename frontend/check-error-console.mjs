import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('about:blank');
  await page.evaluate(() => {
    try {
      window.localStorage.setItem('fs_node_tour_completed', 'true');
      window.sessionStorage.setItem('slp_shown', '1');
    } catch (e) {}
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
