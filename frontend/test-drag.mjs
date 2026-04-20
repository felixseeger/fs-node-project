import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  
  // Right click to open context menu
  await page.mouse.click(300, 300, { button: 'right' });
  await page.waitForTimeout(500);
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const textBtn = btns.find(b => b.innerText.includes('Text'));
    if (textBtn) textBtn.click();
  });
  await page.waitForTimeout(500);

  await page.mouse.click(600, 300, { button: 'right' });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const imgBtn = btns.find(b => b.innerText.includes('Images'));
    if (imgBtn) imgBtn.click();
  });
  await page.waitForTimeout(500);

  const nodesCount = await page.locator('.react-flow__node').count();
  console.log('Nodes count:', nodesCount);

  if (nodesCount >= 2) {
    const sourceHandle = page.locator('.react-flow__node').nth(0).locator('.react-flow__handle.source').first();
    const targetHandle = page.locator('.react-flow__node').nth(1).locator('.react-flow__handle.target').first();
    
    if (await sourceHandle.count() > 0 && await targetHandle.count() > 0) {
      console.log('Dragging from source to target...');
      const box1 = await sourceHandle.boundingBox();
      const box2 = await targetHandle.boundingBox();
      
      await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2);
      await page.mouse.down();
      await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2, { steps: 5 });
      await page.mouse.up();
      
      await page.waitForTimeout(1000);
      const edgesCount = await page.locator('.react-flow__edge').count();
      console.log('Edges count:', edgesCount);
    }
  }

  await browser.close();
})();
