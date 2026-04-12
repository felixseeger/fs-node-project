import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Start server
  const { exec } = await import('child_process');
  const server = exec('npm run dev');
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 3000));
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  console.log('Navigating...');
  try {
    await page.goto('http://localhost:5173', { timeout: 10000 });
    console.log('Page loaded successfully');
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {
    console.log('Timeout or error:', e.message);
  }
  
  server.kill();
  await browser.close();
})();
