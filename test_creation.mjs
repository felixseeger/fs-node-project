import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  await page.goto('http://localhost:5173/');
  
  try {
    await page.waitForTimeout(2000);
    console.log("Checking for System Test Workflow card...");
    // Just evaluate JS to click it to avoid interception issues
    const clicked = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div')).filter(d => d.innerText && d.innerText.includes('System Test Workflow') && d.innerText.includes('A massive workflow'));
      let best = cards[0];
      for (let c of cards) {
        if (c.innerText.length < best.innerText.length) best = c;
      }
      if (best) {
        best.click();
        return true;
      }
      return false;
    });
    
    if (clicked) {
      console.log("Clicked System Test Workflow. Waiting for nodes to load...");
    } else {
      console.error("Failed to click card");
    }
    
    await page.waitForTimeout(5000);
    const nodeCount = await page.locator('.react-flow__node').count();
    console.log(`Found ${nodeCount} nodes on the canvas.`);
    
    if (nodeCount > 10) {
      console.log("SYSTEM TEST PASSED: All nodes loaded successfully.");
    } else {
      console.error("SYSTEM TEST FAILED: Nodes not loaded.");
      await page.screenshot({ path: 'test_system_test.png' });
    }
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
  }
}
run();
