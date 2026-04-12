import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  let hasErrors = false;
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
      hasErrors = true;
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    hasErrors = true;
  });

  await page.setViewportSize({ width: 1280, height: 900 });

  console.log('Navigating to http://localhost:5173/ ...');
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
    console.log('Page loaded. Any errors? ' + hasErrors);
  } catch (e) {
    console.log('Navigation failed:', e.message);
  }
  
  await browser.close();
}

run();
