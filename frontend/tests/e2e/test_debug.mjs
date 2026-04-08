import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch(); // headless by default
  const page = await browser.newPage();
  
  await page.addInitScript(() => {
    sessionStorage.setItem('slp_shown', 'true');
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  
  let html = await page.content();
  if (html.includes('Log in') && !html.includes('Email Address')) {
    await page.click('text=Log in');
  }
  
  await page.waitForTimeout(1000);
  html = await page.content();
  if (html.includes('Sign in') || html.includes('Welcome Back') || html.includes('Create your account')) {
    const testEmail = `test_${Date.now()}@example.com`;
    
    try {
      await page.click('text=Sign up', { timeout: 2000 });
      await page.waitForTimeout(500);
    } catch(e) {}
    
    await page.fill('input[placeholder="Jane Doe"]', 'Playwright Tester');
    await page.fill('input[placeholder="you@example.com"]', testEmail);
    const pwInputs = page.locator('input[type="password"]');
    await pwInputs.nth(0).fill('password123');
    await pwInputs.nth(1).fill('password123');
    
    await page.locator('text=I agree').click();
    await page.click('button:has-text("Create Account")');
    
    await page.waitForTimeout(3000);
  }
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("DASHBOARD TEXT:\n", text.substring(0, 300));
  await page.screenshot({ path: 'test-debug.png' });
  await browser.close();
})();
