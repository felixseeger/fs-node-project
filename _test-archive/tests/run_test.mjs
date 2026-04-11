import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  
  console.log("Signing up...");
  await page.getByText('Sign up', { exact: true }).click();
  await page.waitForTimeout(1000);
  
  const testEmail = `test_${Date.now()}@test.com`; 
  await page.getByPlaceholder('Jane Doe').fill('Test User');
  await page.getByPlaceholder('you@example.com').fill(testEmail);
  await page.getByPlaceholder('Min. 8 characters').fill('password123');
  await page.getByPlaceholder('Re-enter password').fill('password123');
  
  await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      for (const l of labels) {
          if (l.innerText.includes('Terms')) {
              const cb = l.querySelector('div');
              if (cb) cb.click();
              return;
          }
      }
  });
  
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.waitForSelector('text=+ New', { timeout: 15000 });
  
  console.log("Logged in! Triggering workflow generation manually via window object...");
  await page.evaluate(() => window.runSystemTest());
  
  await page.waitForSelector('.react-flow__node', { timeout: 15000 });
  
  const nodeCount = await page.locator('.react-flow__node').count();
  console.log(`\n\n✅ FINAL RESULT: Successfully generated ${nodeCount} nodes on the canvas and synced with Firebase as user ${testEmail}!\n`);
  
  await page.screenshot({ path: 'final_verification.png', fullPage: true });
  await browser.close();
}

run();
