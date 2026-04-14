import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  // Increase viewport to make it look nicer for a screenshot
  const contextA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const contextB = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await contextA.grantPermissions(['clipboard-read', 'clipboard-write']);
  
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  async function login(page, email, name) {
    console.log(`[${name}] Loading page...`);
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for the UI to settle (Vite compilation)
    await page.waitForTimeout(5000);
    
    if (await page.locator('text="Log in"').isVisible({ timeout: 5000 }).catch(()=>false)) {
      console.log(`[${name}] Clicking Log in`);
      await page.click('text="Log in"');
    }
    
    console.log(`[${name}] Waiting for email input...`);
    const emailInput = page.locator('input[placeholder="you@example.com"]');
    await emailInput.waitFor({ state: 'visible', timeout: 60000 });
    
    await emailInput.fill(email);
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button:has-text("Sign In"), button[type="submit"]');
    
    await page.waitForTimeout(3000);
    const err = await page.locator('text="invalid-credential"').isVisible().catch(()=>false) || 
                await page.locator('text="user-not-found"').isVisible().catch(()=>false);
                
    if (err) {
      console.log(`[${name}] Creating account...`);
      await page.locator('text="Sign up"').last().click();
      await page.waitForTimeout(1000);
      
      await page.fill('input[placeholder="Jane Doe"]', name);
      await page.fill('input[placeholder="you@example.com"]', email);
      await page.fill('input[placeholder="Min. 8 characters"]', 'TestPass123!');
      await page.fill('input[placeholder="Re-enter password"]', 'TestPass123!');
      
      // Check the terms box properly
      await page.locator('div[role="checkbox"]').first().click({ force: true }).catch(() => {});
      
      await page.click('button:has-text("Create Account")');
    }
    
    await page.evaluate(() => {
      window.localStorage.setItem('fs_node_tour_completed', 'true');
      window.sessionStorage.setItem('slp_shown', '1');
    });
    
    await page.waitForSelector('[data-testid="new-project-btn"]', { timeout: 30000 });
    console.log(`[${name}] Logged in successfully.`);
  }

  try {
    await login(pageA, 'john@nodeproject.dev', 'John');
    await login(pageB, 'sarah@nodeproject.dev', 'Sarah');
    
    console.log("[John] Creating new project...");
    await pageA.goto('http://localhost:5173/');
    await pageA.waitForSelector('[data-testid="new-project-btn"]', { timeout: 30000 });
    await pageA.click('[data-testid="new-project-btn"]', { force: true });
    
    await pageA.waitForSelector('[data-testid="new-project-modal-confirm-new"]', { timeout: 10000 });
    await pageA.fill('input[placeholder="Enter workflow name..."]', 'Luma Assets Pipeline');
    await pageA.click('[data-testid="new-project-modal-confirm-new"]', { force: true });

    await pageA.waitForSelector('.react-flow', { timeout: 30000 });
    await pageA.waitForTimeout(3000); // UI stabilization
    
    console.log("[John] Opening Collab Hub...");
    await pageA.click('button[title="Open Collaboration Hub"]');
    await pageA.waitForSelector('button:has-text("Share Workflow")', { timeout: 10000 });

    console.log("[John] Sharing workflow...");
    await pageA.click('button:has-text("Share Workflow")');
    await pageA.fill('input[placeholder="Search or enter email address..."]', 'sarah@nodeproject.dev');
    await pageA.waitForTimeout(1000); // let suggestions pop up
    await pageA.click('button[type="submit"]:has-text("Share")');
    await pageA.waitForTimeout(2000); // wait for firebase
    await pageA.click('button:has-text("Done")');

    await pageA.waitForTimeout(1000);
    console.log("[John] Copying link...");
    await pageA.click('button:has-text("Copy Workflow Link")');
    const shareLink = await pageA.evaluate(() => navigator.clipboard.readText());
    console.log("Link:", shareLink);

    console.log("[John] Opening Chat...");
    await pageA.click('button:has-text("Chat")');
    
    console.log("[Sarah] Joining via link...");
    await pageB.goto(shareLink);
    await pageB.waitForSelector('.react-flow', { timeout: 30000 });
    await pageB.waitForTimeout(3000);

    console.log("[Sarah] Opening Hub & Chat...");
    await pageB.click('button[title="Open Collaboration Hub"]');
    await pageB.waitForTimeout(1000);
    await pageB.click('button:has-text("Chat")');
    await pageB.waitForTimeout(1000);

    console.log("[John] Sending message...");
    await pageA.fill('input[placeholder="Type a message..."]', 'Hey Sarah! I just added the new Luma Ray 2 nodes to the pipeline.');
    await pageA.click('button:has-text("Send")');
    await pageA.waitForTimeout(1500);

    console.log("[Sarah] Replying...");
    await pageB.fill('input[placeholder="Type a message..."]', 'Yes! I just mapped the reference images. The UI is looking great 🔥');
    await pageB.click('button:has-text("Send")');
    await pageB.waitForTimeout(1500);

    const screenshotPath = 'public/collaboration-chat.png';
    await pageB.screenshot({ path: screenshotPath });
    console.log(`✅ Success! Screenshot saved to frontend/${screenshotPath}`);

  } catch (e) {
    console.error("Error during flow:", e);
    await pageA.screenshot({ path: 'public/error-state-A.png' }).catch(()=>{});
    await pageB.screenshot({ path: 'public/error-state-B.png' }).catch(()=>{});
  } finally {
    await browser.close();
  }
})();
