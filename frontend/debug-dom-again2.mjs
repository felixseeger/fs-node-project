import { chromium } from 'playwright';
import { spawn } from 'child_process';

(async () => {
  console.log("Starting dev server...");
  const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 5000));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Loading page...");
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  
  if (await page.locator('text="Log in"').isVisible()) {
    await page.click('text="Log in"');
  }
  
  const emailInput = page.locator('input[placeholder="you@example.com"]');
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  
  await page.locator('text="Sign up"').last().click();
  await page.waitForTimeout(1000);
  
  await page.fill('input[placeholder="Jane Doe"]', 'Sarah Test');
  await page.fill('input[placeholder="you@example.com"]', 'sarah55@nodeproject.dev');
  await page.fill('input[placeholder="Min. 8 characters"]', 'TestPass123!');
  await page.fill('input[placeholder="Re-enter password"]', 'TestPass123!');
  
  await page.locator('input[type="checkbox"]').click({ force: true }).catch(() => {});
  await page.locator('text="I agree"').click({ force: true }).catch(() => {});
  await page.click('button:has-text("Create Account")');
  
  await page.waitForTimeout(5000);
  
  console.log("Body text:", await page.evaluate(() => document.body.innerText.substring(0, 1000)));
  
  await browser.close();
  server.kill();
})();
