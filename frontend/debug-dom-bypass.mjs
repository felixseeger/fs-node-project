import { chromium } from 'playwright';
import { spawn } from 'child_process';

(async () => {
  const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 5000));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000);
  
  console.log("Body:", await page.evaluate(() => document.body.innerText.substring(0, 1000)));
  
  await browser.close();
  server.kill();
})();
