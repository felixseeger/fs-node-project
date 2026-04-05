const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  
  // Wait for page to load
  await page.waitForTimeout(2000);

  // Print all texts on the page to see where we are
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.substring(0, 500));
  
  // If we are at login:
  if (text.includes('Welcome back')) {
     await page.fill('input[type="email"]', 'test@test.com');
     await page.fill('input[type="password"]', 'testpassword');
     await page.click('button:has-text("Sign In")');
     await page.waitForTimeout(2000);
     
     const textAfter = await page.evaluate(() => document.body.innerText);
     console.log('After login:', textAfter.substring(0, 500));
  }
  
  await browser.close();
})();
