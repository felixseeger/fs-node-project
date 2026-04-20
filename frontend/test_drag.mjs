import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  
  const dismissBtn = page.locator('button', { hasText: 'Dismiss' });
  if (await dismissBtn.count() > 0) {
    await dismissBtn.click();
    await page.waitForTimeout(1000);
  }
  
  await page.evaluate(() => {
    // try to find the internal state by reading a fiber
    const container = document.querySelector('.react-flow');
    if (!container) return;
    const key = Object.keys(container).find(key => key.startsWith('__reactFiber$'));
    if (!key) return;
    const fiber = container[key];
    console.log("Fiber found");
  });
  
  await browser.close();
})();
