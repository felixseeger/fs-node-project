import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fetch from 'node-fetch';
import fs from 'fs';

const waitForServer = async (url, maxRetries = 30) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error("Server didn't start in time");
};

async function loginOrSignup(page, email, password) {
  await page.goto('http://localhost:5173/');
  
  // Wait for the login screen to render
  try {
    await page.waitForSelector('text="Sign in to your account to continue"', { timeout: 10000 });
  } catch (e) {
    // If it's already logged in or on dashboard, skip
    if (await page.locator('text="New Project"').isVisible()) return;
  }
  
  if (await page.locator('text="Log in"').isVisible()) {
    await page.click('text="Log in"');
  }
  
  await page.waitForSelector('input[placeholder="you@example.com"]');
  await page.fill('input[placeholder="you@example.com"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign In"), button[type="submit"]');
  await page.waitForTimeout(3000);

  const errorVisible = await page.locator('text="invalid-credential"').isVisible() || await page.locator('text="user-not-found"').isVisible() || await page.locator('text="Invalid login"').isVisible();
  
  if (errorVisible) {
    console.log(`User ${email} not found or wrong creds. Switching to sign up...`);
    await page.locator('a:has-text("Sign up"), button:has-text("Sign up")').first().click().catch(() => {});
    await page.waitForTimeout(1000);
    await page.fill('input[placeholder="you@example.com"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button:has-text("Create Account"), button:has-text("Sign up"), button[type="submit"]').first().click();
    await page.waitForTimeout(3000);
  }
  
  await page.evaluate(() => {
    window.localStorage.setItem('fs_node_tour_completed', 'true');
    window.sessionStorage.setItem('slp_shown', '1');
  });
}

(async () => {
  console.log("Starting dev server...");
  const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
  
  try {
    await waitForServer('http://localhost:5173/');
    console.log("Dev server is ready!");

    const browser = await chromium.launch({ headless: true });
    // Increase viewport to make it look nicer for a screenshot
    const contextA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const contextB = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await contextA.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    console.log("-> Initializing users...");
    await loginOrSignup(pageB, 'sarah@nodeproject.dev', 'SecurePass123!');
    await loginOrSignup(pageA, 'john@nodeproject.dev', 'SecurePass123!');
    
    console.log("-> Starting John's session...");
    await pageA.goto('http://localhost:5173/');
    
    const newBtnA = pageA.getByTestId('new-project-btn');
    await newBtnA.waitFor({ state: 'visible', timeout: 15000 });
    await newBtnA.click({ force: true });
    
    const confirmBtn = pageA.getByTestId('new-project-modal-confirm-new');
    await confirmBtn.waitFor({ state: 'visible' });
    // Name the project
    await pageA.fill('input[placeholder="Enter workflow name..."]', 'Marketing Asset Pipeline');
    await confirmBtn.click({ force: true });

    await pageA.waitForSelector('.react-flow', { timeout: 15000 });
    await pageA.waitForTimeout(2000);

    console.log("-> John adding some nodes...");
    // Let's just add an image node
    await pageA.evaluate(() => {
        // Trigger context menu at 500, 300
        const evt = new MouseEvent('contextmenu', { clientX: 500, clientY: 300, bubbles: true });
        document.querySelector('.react-flow__pane').dispatchEvent(evt);
    });
    await pageA.waitForTimeout(500);
    // Click "Universal Image" if it exists in the Gooey menu or context menu
    await pageA.locator('text="Universal Image"').click().catch(() => {});
    await pageA.waitForTimeout(1000);

    console.log("-> John opening Collaboration Hub...");
    const collabBtnA = pageA.locator('button[title="Open Collaboration Hub"]');
    await collabBtnA.waitFor({ state: 'visible', timeout: 10000 });
    await collabBtnA.click();
    await pageA.waitForTimeout(1000);

    console.log("-> John sharing workflow with Sarah...");
    await pageA.locator('button:has-text("Share Workflow")').first().click();
    await pageA.waitForTimeout(1000);
    
    await pageA.fill('input[placeholder="Search or enter email address..."]', 'sarah@nodeproject.dev');
    await pageA.waitForTimeout(1000);
    await pageA.locator('button[type="submit"]:has-text("Share")').first().click();
    await pageA.waitForTimeout(3000);
    await pageA.locator('button:has-text("Done")').first().click();
    await pageA.waitForTimeout(1000);

    console.log("-> John opening Chat...");
    await pageA.locator('button:has-text("Chat")').click();
    await pageA.waitForTimeout(500);

    // Get the share link
    await pageA.locator('button:has-text("Copy Workflow Link")').first().click();
    const shareLink = await pageA.evaluate(() => navigator.clipboard.readText());

    console.log(`-> Sarah joining via shared link: ${shareLink}`);
    await pageB.goto(shareLink);
    await pageB.waitForSelector('.react-flow', { timeout: 15000 });
    await pageB.waitForTimeout(3000);
    
    console.log("-> Sarah opening Collaboration Hub...");
    const collabBtnB = pageB.locator('button[title="Open Collaboration Hub"]');
    await collabBtnB.waitFor({ state: 'visible', timeout: 10000 });
    await collabBtnB.click();
    await pageB.waitForTimeout(1000);

    // Click on Chat tab
    await pageB.locator('button:has-text("Chat")').click();
    await pageB.waitForTimeout(500);

    console.log("-> Chat simulation...");
    await pageA.fill('input[placeholder="Type a message..."]', 'Hey Sarah! I just added the new Luma Ray 2 node to the pipeline.');
    await pageA.locator('button:has-text("Send")').click();
    await pageA.waitForTimeout(2000);

    await pageB.fill('input[placeholder="Type a message..."]', 'Awesome! Does it support the new Image-to-Video feature?');
    await pageB.locator('button:has-text("Send")').click();
    await pageB.waitForTimeout(2000);

    await pageA.fill('input[placeholder="Type a message..."]', 'Yes! I just mapped the references for it. Let me know what you think.');
    await pageA.locator('button:has-text("Send")').click();
    await pageA.waitForTimeout(2000);

    console.log("-> Taking Screenshot of Sarah's View...");
    // Let's create the public folder if it doesn't exist
    if (!fs.existsSync('./public')) fs.mkdirSync('./public');
    const screenshotPath = './public/collaboration-chat.png';
    await pageB.screenshot({ path: screenshotPath });

    console.log(`✅ Success! Screenshot saved to ${screenshotPath}`);

    await browser.close();
  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    server.kill();
  }
})();
