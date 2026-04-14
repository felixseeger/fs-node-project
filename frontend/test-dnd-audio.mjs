import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173');
  console.log("Navigated to localhost:5173");
  
  await page.waitForSelector('.react-flow', { timeout: 15000 });
  console.log("Canvas loaded");

  const fileContentMp3 = fs.readFileSync('/tmp/media_test/test.mp3').toString('base64');
  
  console.log("Attempting audio drop...");
  await page.evaluate(async (base64) => {
    const res = await fetch('data:audio/mp3;base64,' + base64);
    const blob = await res.blob();
    const file = new File([blob], 'test.mp3', { type: 'audio/mp3' });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const event = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: dataTransfer,
      clientX: 500,
      clientY: 500
    });

    const wrapper = document.querySelector('.react-flow');
    if(wrapper) {
      wrapper.dispatchEvent(event);
    }
  }, fileContentMp3);

  console.log("Dispatched drop event, waiting for SourceMediaNode to appear...");
  
  await page.waitForTimeout(3000);
  
  const nodes = await page.$$('.react-flow__node');
  console.log(`Found ${nodes.length} nodes on canvas`);

  await page.screenshot({ path: 'test-dnd-audio-result.png', fullPage: true });
  console.log("Screenshot saved to frontend/test-dnd-audio-result.png");
  
  await browser.close();
})();
