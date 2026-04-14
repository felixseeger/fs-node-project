import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  const text = await page.evaluate(() => document.body.innerText);
  console.log("BODY TEXT:\n", text);
  await browser.close();
})();
