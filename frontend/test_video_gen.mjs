import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const mockVideo = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  // Mock API for Kling3
  await page.route('**/api/kling3/text-to-video', route => {
    console.log('MOCK: Intercepted /api/kling3/text-to-video');
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          task_id: "mock-video-task-123"
        }
      })
    });
  });

  await page.route('**/api/kling3/mock-video-task-123', route => {
    console.log('MOCK: Intercepted /api/kling3/mock-video-task-123');
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          status: "COMPLETED",
          generated: [mockVideo]
        }
      })
    });
  });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  console.log("Navigating to http://localhost:5173/...");
  await page.goto('http://localhost:5173/');

  try {
    await page.waitForTimeout(3000);

    // Landing page to signup
    console.log("Starting from landing page...");
    // There might be multiple "Get Started Free" buttons, so we use first()
    await page.getByText('Get Started Free').first().click();
    await page.waitForTimeout(1000);

    // Sign up flow
    console.log("Signing up...");
    const testEmail = `test_gen_${Date.now()}@test.com`;
    await page.getByPlaceholder('Jane Doe').fill('Test User');
    await page.getByPlaceholder('you@example.com').fill(testEmail);
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Re-enter password').fill('password123');
    await page.evaluate(() => {
        const labels = Array.from(document.querySelectorAll('label'));
        for (const l of labels) {
            if (l.innerText.includes('Terms')) {
                const cb = l.querySelector('div');
                if (cb) cb.click();
                return;
            }
        }
    });
    await page.getByRole('button', { name: 'Create Account' }).click();

    console.log("Waiting for Dashboard or Loading screen...");
    // Wait for the loading screen to appear and then disappear, or just wait for the dashboard
    await page.waitForTimeout(5000); // Give it time to start loading

    console.log("Waiting for Search input to confirm Dashboard is loaded...");
    await page.waitForSelector('input[placeholder="Search"]', { timeout: 30000 });

    console.log("Creating new project...");
    await page.click('button.decode-button:has-text("New project")');
    await page.waitForTimeout(3000);

    // Now in editor. Add "Universal Video" node.
    console.log("Adding Universal Video node...");
    await page.waitForSelector('.react-flow__renderer', { timeout: 10000 });
    await page.click('button[data-tooltip="Add Nodes"]');
    await page.waitForTimeout(500);
    
    await page.fill('input[placeholder="Search nodes and models"]', 'Universal Video');
    await page.waitForTimeout(500);
    
    await page.click('button.ms-node-btn:has-text("Universal Video")');
    await page.waitForTimeout(1000);

    console.log("Node added. Entering prompt...");
    const promptArea = page.locator('.react-flow__node-universalGeneratorVideo textarea');
    await promptArea.fill('A blazing fire');

    console.log("Clicking Generate...");
    const genButton = page.locator('.react-flow__node-universalGeneratorVideo button:has(svg polyline[points="5 12 12 5 19 12"])');
    await genButton.click();

    console.log("Waiting for video output...");
    await page.waitForSelector(`.react-flow__node-universalGeneratorVideo video`, { timeout: 20000 });

    console.log("✅ VIDEO GENERATION TEST PASSED");

  } catch (err) {
    console.error("❌ VIDEO GENERATION TEST FAILED:", err);
    await page.screenshot({ path: 'test-video-gen-error.png' });
    console.log("Error screenshot saved to test-video-gen-error.png");
  } finally {
    await browser.close();
  }
}

run();
