import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  
  if (await page.locator('text="Log in"').isVisible()) {
    console.log("Clicking Log in");
    await page.click('text="Log in"');
    await page.waitForTimeout(1000);
  }
  
  const emailInput = page.locator('input[placeholder="you@example.com"]');
  if (await emailInput.isVisible()) {
    console.log("Filling email");
    await emailInput.fill('verwaltung@felixseeger.de');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button:has-text("Sign In"), button[type="submit"]');
    await page.waitForTimeout(3000);
  }
  
  const content = await page.evaluate(() => document.body.innerText);
  console.log("POST LOGIN CONTENT:\n", content.substring(0, 500));
  
  await browser.close();
})();
