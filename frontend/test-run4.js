import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Start server
  const { exec } = await import('child_process');
  const server = exec('npm run dev');
  
  await new Promise(r => setTimeout(r, 4000));
  
  let hasErrors = false;
  page.on('console', msg => {
    console.log(`BROWSER [${msg.type()}]:`, msg.text());
    if (msg.type() === 'error') hasErrors = true;
  });
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
    hasErrors = true;
  });
  
  try {
    await page.goto('http://localhost:5173');
    console.log('Page loaded');
    
    // Simulate user flow:
    await page.evaluate(() => {
      // simulate skipping auth or something
      if (window.runSystemTest) {
        window.runSystemTest();
      }
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
  } catch (e) {
    console.log('Timeout or error:', e.message);
  }
  
  server.kill();
  await browser.close();
  
  if (hasErrors) process.exit(1);
})();
