/* global process */
import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  console.log('Navigating to http://localhost:5175/ ...');
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'controls-screenshot.png' });
  console.log('Screenshot captured at controls-screenshot.png');
  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });
