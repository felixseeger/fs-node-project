import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:5173');
  
  console.log('Waiting for canvas to load...');
  await page.waitForTimeout(5000);
  
  console.log('Adding nodes...');
  // We can try to add nodes via the window functions if they are exposed, or clicking UI.
  // Actually let's just see if there are errors on load.
  await browser.close();
})();
