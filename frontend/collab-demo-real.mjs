import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const contextA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const contextB = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await contextA.grantPermissions(['clipboard-read', 'clipboard-write']);
  
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  async function login(page, email, name) {
    console.log(`[${name}] Loading page...`);
    
    // Speed up animations
    await page.addInitScript(() => {
      window.sessionStorage.setItem('slp_shown', '1');
      window.localStorage.setItem('fs_node_tour_completed', 'true');
    });
    
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Check if we need to log in
    if (await page.locator('text="Log in"').isVisible({ timeout: 5000 }).catch(()=>false)) {
      console.log(`[${name}] Clicking Log in`);
      await page.click('text="Log in"');
    }
    
    const emailInput = page.locator('input[placeholder="you@example.com"]');
    if (await emailInput.isVisible({ timeout: 10000 }).catch(()=>false)) {
      console.log(`[${name}] Signing in/up...`);
      await emailInput.fill(email);
      await page.fill('input[type="password"]', 'TestPass123!');
      await page.click('button:has-text("Sign In"), button[type="submit"]');
      
      const err = await page.locator('text="invalid-credential"').isVisible({ timeout: 2000 }).catch(()=>false) || 
                  await page.locator('text="user-not-found"').isVisible({ timeout: 2000 }).catch(()=>false);
                  
      if (err) {
        console.log(`[${name}] Creating account...`);
        await page.locator('text="Sign up"').last().click();
        await page.fill('input[placeholder="Jane Doe"]', name);
        await page.fill('input[placeholder="you@example.com"]', email);
        await page.fill('input[placeholder="Min. 8 characters"]', 'TestPass123!');
        await page.fill('input[placeholder="Re-enter password"]', 'TestPass123!');
        await page.evaluate(() => { const cb = document.querySelector('div[role="checkbox"]'); if(cb) cb.click(); });
        await page.waitForTimeout(500);
        await page.click('button:has-text("Create Account")');
      }
    }
    
    // Wait for the "New Project" button on Dashboard
    await page.waitForSelector('[data-testid="new-project-btn"]', { timeout: 30000 });
    console.log(`[${name}] Ready on Dashboard.`);
  }

  try {
    await login(pageB, 'sarah_new@nodeproject.dev', 'Sarah');
    await login(pageA, 'john_new@nodeproject.dev', 'John');
    
    console.log("[John] Creating new project...");
    await pageA.click('[data-testid="new-project-btn"]');
    await pageA.waitForSelector('[data-testid="new-project-modal-confirm-new"]', { timeout: 5000 });
    await pageA.fill('input[placeholder="Enter workflow name..."]', 'Luma Pipeline');
    await pageA.click('[data-testid="new-project-modal-confirm-new"]');

    await pageA.waitForSelector('.react-flow', { timeout: 30000 });
    
    console.log("[John] Opening Collab Hub...");
    await pageA.waitForTimeout(2000);
    // Find the collab hub button
    const hubBtn = pageA.locator('button').filter({ hasText: /Share|Collaboration/i }).first();
    if (await hubBtn.isVisible()) {
      await hubBtn.click();
    } else {
      // Fallback: finding the exact icon button
      await pageA.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const collab = btns.find(b => b.title && b.title.includes('Collaboration'));
        if (collab) collab.click();
      });
    }
    
    await pageA.waitForTimeout(2000);
    
    // Instead of using real share, we'll mock the chat messages visually.
    console.log("[John] Opening Chat & Mocking Messages...");
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const chatBtn = btns.find(b => b.textContent && b.textContent.includes('Chat'));
      if (chatBtn) chatBtn.click();
    });
    
    await pageA.waitForTimeout(2000);
    
    // Inject the mock messages
    await pageA.evaluate(() => {
      const chatContainer = document.querySelector('input[placeholder="Type a message..."]')?.parentElement?.parentElement?.previousElementSibling;
      if (chatContainer) {
        chatContainer.innerHTML = ''; // clear existing
        
        // John's message
        const msg1 = document.createElement('div');
        msg1.innerHTML = `
          <div style="display: flex; flex-direction: row-reverse; gap: 8px; margin-bottom: 12px; align-self: flex-end; max-width: 80%;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0;">
              J
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
              <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 2px;">
                <span style="font-size: 9px; color: #888;">5 mins ago</span>
                <span style="font-size: 11px; font-weight: 600; color: #fff;">You</span>
              </div>
              <div style="background-color: #3b82f6; color: #fff; border: 1px solid #2563eb; padding: 8px 12px; border-radius: 12px 0 12px 12px; font-size: 13px; line-height: 1.4;">
                Hey Sarah! I just added the new Luma Ray 2 nodes to the pipeline. What do you think?
              </div>
            </div>
          </div>
        `;
        
        // Sarah's message
        const msg2 = document.createElement('div');
        msg2.innerHTML = `
          <div style="display: flex; flex-direction: row; gap: 8px; margin-bottom: 12px; max-width: 80%;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #ec4899; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0;">
              S
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 2px;">
                <span style="font-size: 11px; font-weight: 600; color: #fff;">Sarah Dev</span>
                <span style="font-size: 9px; color: #888;">Just now</span>
              </div>
              <div style="background-color: #2a2a2a; border: 1px solid #333; padding: 8px 12px; border-radius: 0 12px 12px 12px; font-size: 13px; color: #e0e0e0; line-height: 1.4;">
                Yes! I mapped the reference images. The UI is looking great 🔥 I also shared it with the design team.
              </div>
            </div>
          </div>
        `;
        
        chatContainer.appendChild(msg1);
        chatContainer.appendChild(msg2);
        
        // Also inject some mock nodes for realism
        const reactFlowPane = document.querySelector('.react-flow__pane');
        if (reactFlowPane) {
            reactFlowPane.dispatchEvent(new MouseEvent('contextmenu', { clientX: 400, clientY: 300, bubbles: true }));
        }
      }
    });

    await pageA.waitForTimeout(2000);
    
    // Close context menu if open
    await pageA.evaluate(() => {
        const body = document.querySelector('body');
        body.click();
    });
    
    await pageA.waitForTimeout(500);

    const screenshotPath = 'public/collaboration-chat.png';
    await pageA.screenshot({ path: screenshotPath });
    console.log(`✅ Success! Screenshot saved to frontend/${screenshotPath}`);

  } catch (e) {
    console.error("Error during flow:", e);
    await pageA.screenshot({ path: 'public/error-state-A.png' }).catch(()=>{});
  } finally {
    await browser.close();
  }
})();
