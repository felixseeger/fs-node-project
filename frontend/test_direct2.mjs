import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'debug1.png' });
  console.log("Took screenshot debug1.png");

  if (await page.locator('text="Log in"').isVisible()) {
    await page.click('text="Log in"');
    await page.waitForTimeout(2000);
    await page.fill('input[placeholder="you@example.com"]', 'verwaltung@felixseeger.de');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button:has-text("Sign In"), button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'debug2.png' });
    console.log("Took screenshot debug2.png");
  }
  
  await browser.close();
})();
