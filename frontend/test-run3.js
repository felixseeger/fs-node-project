import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Start server
  const { exec } = await import('child_process');
  const server = exec('npm run dev');
  
  await new Promise(r => setTimeout(r, 4000));
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:5173');
    console.log('Page loaded');
    
    // Simulate login and click
    await page.evaluate(() => {
      // Set to editor
      window.runSystemTest && window.runSystemTest();
    });
    
    await new Promise(r => setTimeout(r, 3000));
    console.log('Evaluated click');
    
    const url = page.url();
    console.log('URL is now', url);
  } catch (e) {
    console.log('Timeout or error:', e.message);
  }
  
  server.kill();
  await browser.close();
})();
