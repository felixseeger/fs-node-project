const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Assuming the server is running on port 5173
  try {
    await page.goto('http://localhost:5173', { timeout: 10000 });
    console.log("Page loaded.");
    // Wait for the app to load
    await page.waitForTimeout(2000);
    
    // We can try to interact with the canvas, but it's hard without specific selectors.
    // Let's just log the success of loading the page.
    console.log("Successfully loaded the frontend.");
  } catch (err) {
    console.error("Error loading page:", err.message);
  } finally {
    await browser.close();
  }
})();
