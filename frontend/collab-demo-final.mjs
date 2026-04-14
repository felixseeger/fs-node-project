import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  // Increase viewport to make it look nicer for a screenshot
  const contextA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await contextA.grantPermissions(['clipboard-read', 'clipboard-write']);
  
  const pageA = await contextA.newPage();

  try {
    console.log("[John] Loading app...");
    
    await pageA.goto('http://localhost:5173/');
    await pageA.waitForTimeout(1000);
    
    // Set storage state AFTER hitting the domain
    await pageA.evaluate(() => {
      try {
        window.localStorage.setItem('fs_node_tour_completed', 'true');
        window.sessionStorage.setItem('slp_shown', '1');
      } catch (e) {}
    });

    // Reload to apply
    await pageA.goto('http://localhost:5173/');
    await pageA.waitForTimeout(5000);

    // Skip "ENGAGE" screen manually if it appears
    if (await pageA.locator('text="ENGAGE"').isVisible({ timeout: 2000 }).catch(()=>false)) {
        await pageA.locator('text="ENGAGE"').click();
        await pageA.waitForTimeout(2000);
    }

    await pageA.waitForSelector('.react-flow', { timeout: 30000 });
    await pageA.waitForTimeout(3000); // UI stabilization
    
    console.log("[John] Opening Collab Hub...");
    await pageA.locator('button[title="Open Collaboration Hub"]').click({ force: true });
    await pageA.waitForTimeout(2000);
    
    console.log("[John] Opening Chat...");
    await pageA.locator('button:has-text("Chat")').click({ force: true });
    
    console.log("[John] Sending message...");
    await pageA.locator('input[placeholder="Type a message..."]').fill('Hey team! Check out the new Luma Ray 2 nodes here.');
    await pageA.locator('button:has-text("Send")').click({ force: true });
    await pageA.waitForTimeout(1000);

    // Mock Sarah's reply visually!
    await pageA.evaluate(() => {
      const input = document.querySelector('input[placeholder="Type a message..."]');
      if (input && input.parentElement && input.parentElement.parentElement) {
        const container = input.parentElement.parentElement.previousElementSibling;
        if (container) {
          const mockMsg = document.createElement('div');
          mockMsg.style.display = 'flex';
          mockMsg.style.flexDirection = 'row';
          mockMsg.style.gap = '8px';
          mockMsg.style.marginBottom = '12px';
          mockMsg.style.maxWidth = '80%';
          
          mockMsg.innerHTML = `
            <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #ec4899; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0;">
              S
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 2px;">
                <span style="font-size: 11px; font-weight: 600; color: #fff;">Sarah Test</span>
                <span style="font-size: 9px; color: #888;">Just now</span>
              </div>
              <div style="background-color: #2a2a2a; border: 1px solid #333; padding: 8px 12px; border-radius: 0 12px 12px 12px; font-size: 13px; color: #e0e0e0; line-height: 1.4;">
                Yes! I mapped the reference images. The UI is looking great 🔥 I also shared it with the design team.
              </div>
            </div>
          `;
          container.appendChild(mockMsg);
        }
      }
    });
    
    await pageA.waitForTimeout(1000);

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
