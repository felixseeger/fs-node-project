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
  
  console.log("Clicking Sign up...");
  await page.locator('text="Sign up"').last().click();
  await page.waitForTimeout(2000);
  
  console.log("URL:", page.url());
  console.log("Body text:", await page.evaluate(() => document.body.innerText.substring(0, 1000)));
  
  console.log("Filling Sign up...");
  await emailInput.fill('newuser@nodeproject.dev');
  await page.fill('input[type="password"]', 'TestPass123!');
  await page.click('button:has-text("Create Account"), button[type="submit"]');
  
  console.log("Waiting 5s...");
  await page.waitForTimeout(5000);
  
  console.log("Taking screenshot...");
  await page.screenshot({ path: 'after-signup.png' });
  console.log("URL:", page.url());
  console.log("Body text:", await page.evaluate(() => document.body.innerText.substring(0, 1000)));
  
  await browser.close();
  server.kill();
})();
