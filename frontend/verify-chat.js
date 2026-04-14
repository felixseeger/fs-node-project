import { chromium } from 'playwright';

async function loginOrSignup(page, email, password) {
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000); // Wait for initialization

  // Try to find the email input immediately. It might be on the page already.
  let emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
  
  if (!(await emailInput.first().isVisible())) {
    if (await page.locator('text="Log in"').first().isVisible()) {
      await page.locator('text="Log in"').first().click();
      await page.waitForTimeout(2000);
    }
  }
  
  if (await emailInput.first().isVisible()) {
    await emailInput.first().fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page.locator('button:has-text("Sign In"), button:has-text("Log in"), button[type="submit"]').first().click();
    await page.waitForTimeout(4000);
  } else {
    console.log("Could not find email input to login!");
    await page.screenshot({ path: `test-results/debug-${email.split('@')[0]}.png` });
  }

  const errorVisible = await page.locator('text="invalid-credential"').isVisible() || await page.locator('text="user-not-found"').isVisible() || await page.locator('text="Invalid login"').isVisible();
  
  if (errorVisible) {
    console.log(`User ${email} not found or wrong creds. Switching to sign up...`);
    await page.locator('a:has-text("Sign up"), button:has-text("Sign up")').first().click().catch(() => {});
    await page.waitForTimeout(2000);
    await emailInput.first().fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page.locator('button:has-text("Create Account"), button:has-text("Sign up"), button[type="submit"]').first().click();
    await page.waitForTimeout(4000);
  }
  
  await page.evaluate(() => {
    window.localStorage.setItem('fs_node_tour_completed', 'true');
    window.sessionStorage.setItem('slp_shown', '1');
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  await contextA.grantPermissions(['clipboard-read', 'clipboard-write']);
  
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  console.log("-> Initializing users...");
  await loginOrSignup(pageB, 'testuser2@nodeproject.dev', 'TestPass123!');
  await loginOrSignup(pageA, 'testuser@nodeproject.dev', 'TestPass123!');
  
  console.log("-> Starting User A session...");
  await pageA.goto('http://localhost:5173/');
  await pageA.waitForTimeout(3000);
  
  const newBtnA = pageA.getByTestId('new-project-btn');
  await newBtnA.waitFor({ state: 'visible', timeout: 15000 }).catch(() => console.log("new project btn not visible"));
  if (await newBtnA.isVisible()) {
    await newBtnA.click({ force: true });
    await pageA.waitForTimeout(1000);
    const confirmBtn = pageA.getByTestId('new-project-modal-confirm-new');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click({ force: true });
    }
  }

  await pageA.waitForSelector('.react-flow', { timeout: 15000 });
  await pageA.waitForTimeout(5000);

  console.log("-> User A opening Collaboration Hub...");
  const collabBtnA = pageA.locator('button[title="Open Collaboration Hub"]');
  await collabBtnA.waitFor({ state: 'visible', timeout: 10000 });
  await collabBtnA.click();
  await pageA.waitForTimeout(1000);

  console.log("-> User A copying share link...");
  await pageA.locator('button:has-text("Copy Workflow Link")').first().click();
  await pageA.waitForTimeout(1000);
  const shareLink = await pageA.evaluate(() => navigator.clipboard.readText());
  console.log("-> Share Link:", shareLink);

  console.log("-> User A sharing workflow with User B...");
  await pageA.locator('button:has-text("Share Workflow")').first().click();
  await pageA.waitForTimeout(1000);
  
  await pageA.locator('input[placeholder="Search or enter email address..."]').fill('testuser2@nodeproject.dev');
  await pageA.waitForTimeout(1000);
  
  await pageA.locator('button[type="submit"]:has-text("Share")').first().click();
  await pageA.waitForTimeout(3000);
  await pageA.locator('button:has-text("Done")').first().click();
  await pageA.waitForTimeout(1000);

  await pageA.locator('button:has-text("Chat")').click();
  await pageA.waitForTimeout(500);

  console.log(`-> User B going to shared link: ${shareLink}`);
  await pageB.goto(shareLink);
  await pageB.waitForTimeout(5000);
  
  console.log("-> User B opening Collaboration Hub...");
  const collabBtnB = pageB.locator('button[title="Open Collaboration Hub"]');
  try {
    await collabBtnB.waitFor({ state: 'visible', timeout: 15000 });
    await collabBtnB.click();
    await pageB.waitForTimeout(1000);

    // Click on Chat tab
    await pageB.locator('button:has-text("Chat")').click();
    await pageB.waitForTimeout(500);

    console.log("-> Testing messaging from User A to User B...");
    await pageA.fill('input[placeholder="Type a message..."]', 'Hello from User A!');
    await pageA.locator('button:has-text("Send")').click();
    await pageA.waitForTimeout(3000);

    const msgFromA = await pageB.locator('text="Hello from User A!"').isVisible();
    console.log(`User B received message: ${msgFromA ? 'YES' : 'NO'}`);

    console.log("-> Testing messaging from User B to User A...");
    await pageB.fill('input[placeholder="Type a message..."]', 'Hi User A! This is User B.');
    await pageB.locator('button:has-text("Send")').click();
    await pageA.waitForTimeout(3000);

    const msgFromB = await pageA.locator('text="Hi User A! This is User B."').isVisible();
    console.log(`User A received reply: ${msgFromB ? 'YES' : 'NO'}`);

    if (msgFromA && msgFromB) {
      console.log("✅ Chat Integration Test Passed!");
    } else {
      console.log("❌ Chat Integration Test Failed!");
    }
  } catch (e) {
    console.log("Failed to open Hub for User B. Error:", e.message);
  }

  await browser.close();
})();
