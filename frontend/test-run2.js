import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Start server
  const { exec } = await import('child_process');
  const server = exec('npm run dev');
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 4000));
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  console.log('Navigating...');
  try {
    await page.goto('http://localhost:5173');
    console.log('Page loaded successfully');
    
    // Inject token to skip auth
    await page.evaluate(() => {
      // Mock being logged in?
      window.runSystemTest && window.runSystemTest();
    });
    
    await new Promise(r => setTimeout(r, 3000));
    console.log('Done wait');
  } catch (e) {
    console.log('Timeout or error:', e.message);
  }
  
  server.kill();
  await browser.close();
})();
