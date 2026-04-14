import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000); 
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("TEXT CONTENT:\n", text);
  
  await browser.close();
})();
