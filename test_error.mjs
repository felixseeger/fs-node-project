import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message, err.stack));
  
  console.log("Navigating...");
  await page.goto('http://localhost:5173/');
  
  await page.waitForTimeout(3000);
  await browser.close();
}
run();
