import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const contextA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  // Directly patch app to avoid auth issues during screenshot run
  let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
  let originalAppCode = appCode;
  
  appCode = appCode.replace(
    'const [currentPage, setCurrentPage] = useState<PageType>(\'landing\');',
    'const [currentPage, setCurrentPage] = useState<PageType>(\'editor\');'
  );
  appCode = appCode.replace(
    'const [activeWorkflowId, setActiveWorkflowId] = useState<string | undefined>(undefined);',
    'const [activeWorkflowId, setActiveWorkflowId] = useState<string | undefined>("wf_mock_123");'
  );
  
  // Inject fake auth + fake workflow + skip SLP
  appCode = appCode.replace(
    /const unsubscribeAuth = \(\) => \{\};\n\s+setAuthLoading\(false\);\n\s+setIsAuthenticated\(true\);\n\s+setCurrentUserId\("testuser@nodeproject.dev"\);\n\s+setCurrentUserEmail\("testuser@nodeproject.dev"\);\n\s+initializeProfile\("testuser@nodeproject.dev", "testuser@nodeproject.dev", "Test User"\);/g,
    `const unsubscribeAuth = () => {};
      setAuthLoading(false);
      setIsAuthenticated(true);
      setCurrentUserId("john@nodeproject.dev");
      setCurrentUserEmail("john@nodeproject.dev");
      initializeProfile("john@nodeproject.dev", "john@nodeproject.dev", "John Doe");
      setWorkflows([{
        id: "wf_mock_123",
        name: "Luma Creative Generation",
        nodes: [
          { id: '1', type: 'imageUniversalGenerator', position: { x: 100, y: 100 }, data: { label: 'Luma Photon 1' } },
          { id: '2', type: 'videoUniversalGenerator', position: { x: 500, y: 100 }, data: { label: 'Luma Ray 2' } }
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', sourceHandle: 'image-out', targetHandle: 'image1' }
        ],
        sharedWith: ["sarah@nodeproject.dev"],
        authorId: "john@nodeproject.dev"
      }]);
      setReady(true);
      window.sessionStorage.setItem('slp_shown', '1');
      window.localStorage.setItem('fs_node_tour_completed', 'true');
    `
  );
  fs.writeFileSync('src/App.tsx', appCode);

  try {
    const pageA = await contextA.newPage();
    await pageA.goto('http://localhost:5173/');
    await pageA.waitForTimeout(5000);
    
    // Check if slp is somehow still there
    if (await pageA.locator('text="ENGAGE"').isVisible({ timeout: 2000 }).catch(()=>false)) {
        await pageA.locator('text="ENGAGE"').click();
        await pageA.waitForTimeout(2000);
    }

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
              <div style="display: flex; flex-direction: row-reverse; gap: 8px; align-self: flex-end; max-width: 80%;">
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
    });
    
    await pageA.waitForTimeout(1000);

    const screenshotPath = 'public/collaboration-chat.png';
    await pageA.screenshot({ path: screenshotPath });
    console.log(`✅ Success! Screenshot saved to frontend/${screenshotPath}`);

  } catch (e) {
    console.error("Error:", e);
    await pageA.screenshot({ path: 'public/error-screenshot.png' }).catch(()=>{});
  } finally {
    // Revert App.tsx
    fs.writeFileSync('src/App.tsx', originalAppCode);
    await browser.close();
  }
})();
