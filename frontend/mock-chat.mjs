import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const contextA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  const pageA = await contextA.newPage();

  try {
    // Navigate straight to the canvas with the hash to trigger the mock
    await pageA.addInitScript(() => {
      window.localStorage.setItem('fs_node_tour_completed', 'true');
      window.sessionStorage.setItem('slp_shown', '1');
      // Mock the auth
      Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
    });

    await pageA.goto('http://localhost:5173/');
    await pageA.waitForTimeout(5000);
    
    // Login
    if (await pageA.locator('text="Log in"').isVisible({ timeout: 5000 }).catch(()=>false)) {
      await pageA.click('text="Log in"');
      await pageA.fill('input[placeholder="you@example.com"]', 'john@nodeproject.dev').catch(()=>{});
      await pageA.fill('input[type="password"]', 'TestPass123!').catch(()=>{});
      await pageA.click('button:has-text("Sign In"), button[type="submit"]').catch(()=>{});
      
      const err = await pageA.locator('text="invalid-credential"').isVisible({ timeout: 2000 }).catch(()=>false) || 
                  await pageA.locator('text="user-not-found"').isVisible({ timeout: 2000 }).catch(()=>false);
      
      if (err) {
        await pageA.locator('text="Sign up"').last().click().catch(()=>{});
        await pageA.fill('input[placeholder="Jane Doe"]', 'John').catch(()=>{});
        await pageA.fill('input[placeholder="you@example.com"]', 'john@nodeproject.dev').catch(()=>{});
        await pageA.fill('input[placeholder="Min. 8 characters"]', 'TestPass123!').catch(()=>{});
        await pageA.fill('input[placeholder="Re-enter password"]', 'TestPass123!').catch(()=>{});
        await pageA.evaluate(() => { const cb = document.querySelector('div[role="checkbox"]'); if(cb) cb.click(); });
        await pageA.waitForTimeout(500);
        await pageA.click('button:has-text("Create Account")').catch(()=>{});
      }
    }
    
    // Check if slp is somehow still there
    if (await pageA.locator('text="ENGAGE"').isVisible({ timeout: 2000 }).catch(()=>false)) {
        await pageA.locator('text="ENGAGE"').click();
        await pageA.waitForTimeout(2000);
    }
    
    await pageA.waitForSelector('[data-testid="new-project-btn"]', { timeout: 30000 });
    
    console.log("Creating new project...");
    await pageA.locator('text="New Project", [data-testid="new-project-btn"]').first().click({ force: true });
    await pageA.locator('text="New project", [data-testid="new-project-modal-confirm-new"]').first().waitFor({ state: 'visible', timeout: 5000 });
    await pageA.fill('input[placeholder="Enter workflow name..."]', 'Luma Assets Pipeline').catch(()=>{});
    await pageA.locator('text="New project", [data-testid="new-project-modal-confirm-new"]').first().click({ force: true });

    await pageA.waitForSelector('.react-flow', { timeout: 15000 });
    
    // Open Hub
    await pageA.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const cb = btns.find(b => b.title?.includes('Collaboration'));
        if (cb) cb.click();
    });
    await pageA.waitForTimeout(1000);
    
    // Open Chat Tab
    await pageA.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const ct = btns.find(b => b.textContent?.includes('Chat'));
        if (ct) ct.click();
    });
    await pageA.waitForTimeout(1000);
    
    // Inject chat
    await pageA.evaluate(() => {
      const input = document.querySelector('input[placeholder="Type a message..."]');
      if (input && input.parentElement && input.parentElement.parentElement) {
        const container = input.parentElement.parentElement.previousElementSibling;
        if (container) {
          container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 12px; padding-bottom: 20px;">
              <div style="display: flex; flex-direction: row-reverse; gap: 8px; align-self: flex-end; max-width: 80%; justify-content: flex-end;">
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

              <div style="display: flex; flex-direction: row; gap: 8px; max-width: 80%;">
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
            </div>
          `;
        }
      }
      
      const reactFlowPane = document.querySelector('.react-flow__pane');
      if (reactFlowPane) {
          reactFlowPane.dispatchEvent(new MouseEvent('contextmenu', { clientX: 400, clientY: 300, bubbles: true }));
      }
    });
    
    await pageA.waitForTimeout(1000);

    const screenshotPath = 'public/collaboration-chat.png';
    await pageA.screenshot({ path: screenshotPath });
    console.log(`✅ Success! Screenshot saved to frontend/${screenshotPath}`);

  } catch (e) {
    console.error("Error:", e);
    await pageA.screenshot({ path: 'public/error-screenshot.png' }).catch(()=>{});
  } finally {
    await browser.close();
  }
})();
