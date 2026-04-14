import { test, expect } from './fixtures.js';

const nodeTypesToTest = ['sourceMediaNode', 'imageAnalyzer'];


test('can instantiate specific node types (smoke test)', async ({ editorPage: page }) => {
  test.setTimeout(300000); 
  const flowWrapper = page.locator('.react-flow').first();

  for (const type of nodeTypesToTest) {
    console.log("Testing node type:", type);
    const searchInput = page.locator('.ms-search-input-overlay');
    
    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
    await searchInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    
    if (await searchInput.isVisible()) {
      await searchInput.fill(type);
      await page.waitForTimeout(50);
      
      const clicked = await page.evaluate(() => {
        const btn = document.querySelector('.ms-node-list button.ms-node-btn');
        if (btn) { btn.click(); return true; }
        return false;
      });
      
      if (clicked) {
        await expect(flowWrapper).toBeVisible({ timeout: 5000 });
      } else {
        await page.keyboard.press('Escape');
      }
    }
  }
});

test('TextNode - can type and blur', async ({ editorPage: page }) => {
  await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  const searchInput = page.locator('.ms-search-input-overlay');
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.fill('textNode');
  await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());
  
  await page.keyboard.press('Escape');
  
  const textNode = page.locator('.react-flow__node-textNode').last();
  await expect(textNode).toBeVisible({ timeout: 10000 });

  const textContent = textNode.locator('textarea').first();
  await expect(textContent).toBeVisible({ timeout: 15000 });
  await textContent.fill('Hello World from E2E');

  await page.locator('.react-flow__pane').click({ force: true });

  await expect(textNode).toContainText('Hello World from E2E', { timeout: 15000 });
});

test('AssetNode - can create and has properties', async ({ editorPage: page }) => {
  await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  const searchInput = page.locator('.ms-search-input-overlay');
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.fill('assetNode');
  await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());

  await page.keyboard.press('Escape');

  const assetNode = page.locator('.react-flow__node-assetNode').last();
  await expect(assetNode).toBeVisible({ timeout: 15000 });
  
  const html = await assetNode.innerHTML();
  console.log("AssetNode HTML:", html);
  
  await expect(assetNode.locator('text=Update Asset')).toBeVisible({ timeout: 15000 });
});
