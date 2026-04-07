const { chromium } = require('playwright-core');

(async () => {
  console.log('Starting LayoutHelper test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to app...');
  await page.goto('http://localhost:5174/');
  
  // Wait for React app to load
  await page.waitForTimeout(3000);
  
  // Take initial screenshot to see what's on the page
  await page.screenshot({ path: '/tmp/layout_test_initial.png', fullPage: true });
  console.log('✅ Initial screenshot saved');
  
  // Wait for login form - try multiple selectors
  console.log('Waiting for login form...');
  await page.waitForSelector('input[name="email"], input[placeholder*="email" i], input[type="text"]', { timeout: 15000 });
  console.log('✅ Login page loaded');
  
  // Enter credentials (using test user from .env)
  await page.fill('input[name="email"], input[placeholder*="email" i], input[type="text"]', 'testuser@nodeproject.dev');
  await page.fill('input[name="password"], input[placeholder*="password" i]', 'TestPass123!');
  console.log('✅ Credentials filled');
  
  // Click sign in
  await page.click('button[type="submit"], button:has-text("Sign in")');
  console.log('✅ Sign in clicked');
  
  // Wait for redirect to workflows or canvas - longer wait for Firebase auth
  await page.waitForTimeout(5000);
  
  // Take screenshot of logged in state
  await page.screenshot({ path: '/tmp/layout_test_logged_in.png', fullPage: true });
  console.log('✅ Logged in screenshot saved');
  
  // Check if we're on the loading screen or workflows page
  const url = page.url();
  console.log('Current URL:', url);
  
  // If stuck on loading, try navigating directly to workflows
  if (url === 'http://localhost:5174/' || url.includes('loading')) {
    console.log('Trying to navigate to /workflows directly...');
    await page.goto('http://localhost:5174/workflows');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/layout_test_workflows.png', fullPage: true });
    console.log('✅ Workflows page screenshot saved');
  }
  
  // Look for workflow creation options
  const newBtn = await page.$('button:has-text("+ New")');
  const createFirst = await page.$('text=Create your first workflow');
  
  if (newBtn) {
    console.log('Found + New button, clicking...');
    await newBtn.click();
  } else if (createFirst) {
    console.log('Found Create your first workflow, clicking...');
    await createFirst.click();
  } else {
    console.log('No creation button found, checking page content...');
  }
  
  await page.waitForTimeout(2000);
  
  // Fill in workflow name if form appears
  const nameInput = await page.$('input[type="text"]');
  if (nameInput) {
    await nameInput.fill('Layout Test');
    await page.click('button:has-text("Create")');
    await page.waitForTimeout(3000);
    console.log('✅ Created new workflow');
  }
  
  // Now we should be on the canvas - wait for it
  console.log('Waiting for canvas...');
  try {
    await page.waitForSelector('.react-flow__renderer, .react-flow__container, .react-flow__pane', { timeout: 15000 });
    console.log('✅ Canvas loaded');
  } catch (e) {
    console.log('Canvas not found, taking screenshot...');
    await page.screenshot({ path: '/tmp/layout_test_no_canvas.png', fullPage: true });
    throw e;
  }
  
  // Take screenshot of canvas
  await page.screenshot({ path: '/tmp/layout_test_empty_canvas.png', fullPage: true });
  console.log('✅ Empty canvas screenshot saved');
  
  // Right-click on canvas to add nodes
  await page.click('.react-flow__pane, .react-flow__container', { button: 'right' });
  await page.waitForTimeout(1000);
  console.log('✅ Right-clicked on canvas');
  
  await page.screenshot({ path: '/tmp/layout_test_context_menu.png', fullPage: true });
  
  // Try to add first node
  const nodeOptions = ['Text Input', 'Image Input', 'Input', 'Generator', 'Response'];
  for (const type of nodeOptions) {
    const option = await page.$(`text=${type}`);
    if (option) {
      await option.click();
      console.log(`✅ Added first node: ${type}`);
      break;
    }
  }
  
  await page.waitForTimeout(1000);
  
  // Add second node
  await page.click('.react-flow__pane', { button: 'right' });
  await page.waitForTimeout(500);
  
  for (const type of nodeOptions) {
    const option = await page.$(`text=${type}`);
    if (option) {
      await option.click();
      console.log(`✅ Added second node: ${type}`);
      break;
    }
  }
  
  await page.waitForTimeout(1000);
  
  // Take screenshot with nodes
  await page.screenshot({ path: '/tmp/layout_test_with_nodes.png', fullPage: true });
  console.log('✅ Nodes added screenshot saved');
  
  // Select multiple nodes
  const nodes = await page.$$('.react-flow__node');
  console.log(`Found ${nodes.length} nodes`);
  
  if (nodes.length >= 2) {
    // Select first node
    await nodes[0].click();
    await page.waitForTimeout(500);
    console.log('✅ Selected first node');
    
    // Shift+click second node
    await nodes[1].click({ modifiers: ['Shift'] });
    await page.waitForTimeout(1000);
    console.log('✅ Multi-selected second node');
    
    // Screenshot - LayoutHelper should be visible
    await page.screenshot({ path: '/tmp/layout_test_helper_visible.png', fullPage: true });
    console.log('✅ LayoutHelper visibility screenshot saved');
    
    // Check for LayoutHelper
    const html = await page.content();
    const hasLayoutHelper = html.includes('Align Left') || html.includes('Align Right') || html.includes('Distribute');
    
    if (hasLayoutHelper) {
      console.log('✅✅✅ SUCCESS! LayoutHelper IS VISIBLE!');
      
      // Test align left
      const alignLeft = await page.$('button:has-text("Align Left")');
      if (alignLeft) {
        await alignLeft.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: '/tmp/layout_test_aligned.png', fullPage: true });
        console.log('✅ Align Left clicked and screenshot saved');
      }
    } else {
      console.log('❌ LayoutHelper NOT visible');
      
      // Debug: check how many nodes are selected
      const selected = await page.$$('.react-flow__node.selected');
      console.log(`Selected nodes count: ${selected.length}`);
    }
  } else {
    console.log('❌ Not enough nodes found');
  }
  
  await browser.close();
  console.log('\n🎉 Test complete! Check screenshots in /tmp/');
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
