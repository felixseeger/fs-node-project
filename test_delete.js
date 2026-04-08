import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  
  let text = await page.evaluate(() => document.body.innerText);
  if (text.includes('Sign in')) {
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('text=Sign Up');
    await page.waitForTimeout(2000);
  }

  // Create a workflow
  await page.click('text=Start building');
  await page.waitForTimeout(1000);
  await page.click('text=From Scratch');
  await page.waitForTimeout(2000); // Wait for generation
  
  // Go back to home
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  
  // Click Select Multiple
  await page.click('text=Select Multiple');
  
  // Click Select All
  await page.click('text=Select All');
  
  // Click Delete
  page.on('dialog', dialog => dialog.accept());
  await page.click('button:has-text("Delete")');
  
  await page.waitForTimeout(1000);
  const textAfter = await page.evaluate(() => document.body.innerText);
  console.log("After delete:", textAfter.includes('Workflow 1'));
  
  await browser.close();
})();
