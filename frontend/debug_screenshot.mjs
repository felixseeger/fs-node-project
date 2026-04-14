import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000); // let it load
  await page.screenshot({ path: 'test-results/debug-home.png' });
  
  const content = await page.content();
  console.log(content.substring(0, 1000));
  
  await browser.close();
})();
