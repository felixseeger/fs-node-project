import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  const reactFlow = await page.evaluate(() => document.querySelector('.react-flow') !== null);
  const reactFlowPane = await page.evaluate(() => document.querySelector('.react-flow__pane') !== null);
  
  console.log(".react-flow exists:", reactFlow);
  console.log(".react-flow__pane exists:", reactFlowPane);
  await browser.close();
})();
