import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  
  await page.evaluate(() => {
    try {
      window.localStorage.setItem('fs_node_tour_completed', 'true');
      window.sessionStorage.setItem('slp_shown', '1');
    } catch (e) {}
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000);
  
  if (await page.locator('text="ENGAGE"').isVisible({ timeout: 2000 }).catch(()=>false)) {
      await page.locator('text="ENGAGE"').click();
      await page.waitForTimeout(2000);
  }
  
  console.log("Body:", await page.evaluate(() => document.body.innerText.substring(0, 1000)));
  
  await browser.close();
})();
