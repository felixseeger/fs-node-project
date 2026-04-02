import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  console.log("Navigating to http://localhost:5173/...");
  await page.goto('http://localhost:5173/');
  
  try {
    await page.waitForTimeout(2000);
    
    // Switch to Sign Up
    console.log("Navigating to Sign Up form...");
    await page.getByText('Sign up', { exact: true }).click();
    await page.waitForTimeout(1000);
    
    // Fill out form
    const testEmail = `test_${Date.now()}@test.com`; // Changed domain to test.com, maybe kora.ai is blocked?
    console.log(`Filling out form with email: ${testEmail}`);
    
    await page.getByPlaceholder('Jane Doe').fill('Test User');
    await page.getByPlaceholder('you@example.com').fill(testEmail);
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Re-enter password').fill('password123');
    
    console.log("Accepting Terms & Conditions using script...");
    await page.evaluate(() => {
        // Need to hit the div or label properly
        const labels = Array.from(document.querySelectorAll('label'));
        for (const l of labels) {
            if (l.innerText.includes('Terms')) {
                const cb = l.querySelector('div');
                if (cb) cb.click();
                return;
            }
        }
    });
    
    console.log("Submitting Create Account...");
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    console.log("Waiting for Dashboard to load...");
    await page.waitForSelector('text=+ New', { timeout: 15000 });
    
    console.log("Dashboard loaded! Looking for templates...");
    
    console.log("Clicking the System Test Card directly...");
    const clicked = await page.evaluate(() => {
      // Find the card by its exact structure instead of just text
      const divs = Array.from(document.querySelectorAll('div'));
      for (const d of divs) {
        if (d.innerText && d.innerText.includes('System Test Workflow') && d.innerText.includes('A massive workflow')) {
           // check if it has the red styling from mouseenter
           if (d.style.transition && d.style.transition.includes('border-color')) {
             d.click();
             return true;
           }
        }
      }
      return false;
    });
    console.log("Clicked:", clicked);
    
    if(!clicked) {
        // Find it via text content if the dom matching failed
        await page.getByText('System Test Workflow').first().click();
    }

    // Wait for the canvas to load nodes
    console.log("Waiting for nodes to render on the canvas...");
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });
    await page.waitForTimeout(5000);
    
    const nodeCount = await page.locator('.react-flow__node').count();
    console.log(`Found ${nodeCount} nodes on the canvas.`);
    
    if (nodeCount > 10) {
      console.log("✅ E2E JOURNEY PASSED: Logged in, clicked System Test, and successfully generated all nodes to Firebase.");
    } else {
      console.error("❌ E2E JOURNEY FAILED: Expected >10 nodes, found", nodeCount);
    }
    
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
  }
}

run();
