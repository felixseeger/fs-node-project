import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const mockImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  // Mock API
  await page.route('**/api/generate-image', route => {
    console.log('MOCK: Intercepted /api/generate-image');
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          task_id: "mock-task-123"
        }
      })
    });
  });

  await page.route('**/api/status/mock-task-123', route => {
    console.log('MOCK: Intercepted /api/status/mock-task-123');
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          status: "COMPLETED",
          generated: [mockImage]
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
    // Find the New Project button - it's a primary variant decode-button
    await page.click('button.decode-button:has-text("New project")');
    await page.waitForTimeout(3000);

    // Now in editor. Add "Universal Image" node.
    console.log("Adding Universal Image node...");
    // Wait for the React Flow canvas
    await page.waitForSelector('.react-flow__renderer', { timeout: 10000 });
    // Open the menu
    await page.click('button[data-tooltip="Add Nodes"]');
    await page.waitForTimeout(500);
    
    // Search
    await page.fill('input[placeholder="Search nodes and models"]', 'Universal Image');
    await page.waitForTimeout(500);
    
    // Click the node button
    await page.click('button.ms-node-btn:has-text("Universal Image")');
    await page.waitForTimeout(1000);

    console.log("Node added. Entering prompt...");
    // Find the textarea inside the universalGeneratorImage node
    const promptArea = page.locator('.react-flow__node-universalGeneratorImage textarea');
    await promptArea.fill('A black square');

    console.log("Clicking Generate...");
    // Find the generate button inside the node
    // It has the CATEGORY_COLORS.imageGeneration (#f97316 for Images category usually)
    // In shared.js CATEGORY_COLORS.imageGeneration might be defined.
    // Based on ImageUniversalGeneratorNode.jsx, it's a button with a specific SVG.
    const genButton = page.locator('.react-flow__node-universalGeneratorImage button:has(svg polyline[points="5 12 12 5 19 12"])');
    await genButton.click();

    console.log("Waiting for image output...");
    // The OutputPreview should show the image.
    // We look for the img tag with the mockImage src inside the node.
    await page.waitForSelector(`.react-flow__node-universalGeneratorImage img[src="${mockImage}"]`, { timeout: 20000 });

    console.log("✅ IMAGE GENERATION TEST PASSED");

  } catch (err) {
    console.error("❌ IMAGE GENERATION TEST FAILED:", err);
    await page.screenshot({ path: 'test-image-gen-error.png' });
    console.log("Error screenshot saved to test-image-gen-error.png");
  } finally {
    await browser.close();
  }
}

run();
