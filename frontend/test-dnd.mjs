import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173');
  console.log("Navigated to localhost:5173");
  
  // Wait for React Flow wrapper
  await page.waitForSelector('.react-flow', { timeout: 15000 });
  console.log("Canvas loaded");

  // Read files
  const fileContentMp4 = fs.readFileSync('/tmp/media_test/test.mp4').toString('base64');
  
  console.log("Attempting drop...");
  await page.evaluate(async (base64) => {
    const res = await fetch('data:video/mp4;base64,' + base64);
    const blob = await res.blob();
    const file = new File([blob], 'test.mp4', { type: 'video/mp4' });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const event = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: dataTransfer,
      clientX: 500,
      clientY: 500
    });

    // The wrapper has onDrop
    const wrapper = document.querySelector('.react-flow');
    if(wrapper) {
      wrapper.dispatchEvent(event);
    }
  }, fileContentMp4);

  console.log("Dispatched drop event, waiting for SourceMediaNode to appear...");
  
  // Wait 3 seconds to allow the node to be added
  await page.waitForTimeout(3000);
  
  const nodes = await page.$$('.react-flow__node');
  console.log(`Found ${nodes.length} nodes on canvas`);

  await page.screenshot({ path: 'test-dnd-result.png', fullPage: true });
  console.log("Screenshot saved to frontend/test-dnd-result.png");
  
  await browser.close();
})();
