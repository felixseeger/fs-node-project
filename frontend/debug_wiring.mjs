import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  page.on('pageerror', err => logs.push('ERROR: ' + err.message));
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  
  // Expose a test function to add nodes and an edge
  const result = await page.evaluate(async () => {
    // Add two nodes by clicking the mega menu or dispatching events if possible.
    // Actually, we can get the React Fiber node and call its functions, but it's easier to use the UI.
    // Let's look for "Universal Image" or similar
    
    // Just click somewhere to open context menu if it exists, or find a button
    // Let's see what buttons we have
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.title || b.textContent);
    return buttons;
  });
  
  console.log("Buttons found:", result);
  
  console.log("LOGS:");
  console.log(logs.join('\n'));
  
  await browser.close();
})();
