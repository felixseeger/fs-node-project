import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:5173');
  console.log("Navigated to localhost:5173");
  
  await page.waitForSelector('.react-flow', { timeout: 15000 });
  console.log("Canvas loaded.");
  
  const chatInput = await page.$('textarea[placeholder*="chat"], input[placeholder*="chat"], input[type="text"]');
  if (chatInput) {
    console.log("Found chat input, typing...");
    await chatInput.fill("Create a video of a cat");
    await chatInput.press('Enter');
    
    // We expect the chat to fail because REQUIRE_AUTH is not bypassed in the frontend,
    // but the canvas shouldn't crash.
    await page.waitForTimeout(5000);
    console.log("Finished waiting");
  } else {
    console.log("No chat input");
  }
  await browser.close();
})();
