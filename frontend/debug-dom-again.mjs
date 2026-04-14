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
    console.log("Clicking log in");
    await page.click('text="Log in"');
  }
  
  console.log("Filling Sign In form");
  const emailInput = page.locator('input[placeholder="you@example.com"]');
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.fill('sarah@nodeproject.dev');
  await page.fill('input[type="password"]', 'TestPass123!');
  await page.click('button:has-text("Sign In"), button[type="submit"]');
  
  await page.waitForTimeout(3000);
  
  console.log("Filling Sign Up form");
  await page.locator('text="Sign up"').last().click();
  await page.waitForTimeout(1000);
  
  await page.fill('input[placeholder="Jane Doe"]', 'Sarah');
  await page.fill('input[placeholder="you@example.com"]', 'sarah@nodeproject.dev');
  await page.fill('input[placeholder="Min. 8 characters"]', 'TestPass123!');
  await page.fill('input[placeholder="Re-enter password"]', 'TestPass123!');
  
  // Check the terms box
  await page.locator('input[type="checkbox"]').check();
  await page.click('button:has-text("Create Account")');
  
  console.log("Waiting 5s...");
  await page.waitForTimeout(5000);
  
  console.log("URL:", page.url());
  console.log("Body text:", await page.evaluate(() => document.body.innerText.substring(0, 1000)));
  
  await browser.close();
  server.kill();
})();
