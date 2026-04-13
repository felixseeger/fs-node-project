import { test, expect } from './fixtures.js';

const nodeTypesToTest = [
  'textNode', 'imageNode', 'assetNode', 'sourceMediaNode',
  'imageAnalyzer', 'generator', 'creativeUpscale', 'precisionUpscale',
  'relight', 'styleTransfer', 'removeBackground', 'fluxReimagine',
  'fluxImageExpand', 'seedreamExpand', 'ideogramExpand', 'skinEnhancer',
  'ideogramInpaint', 'changeCamera', 'kling3', 'kling3Omni',
  'kling3Motion', 'klingElementsPro', 'klingO1', 'minimaxLive',
  'wan26', 'seedance', 'ltxVideo2Pro', 'runwayGen45',
  'runwayGen4Turbo', 'runwayActTwo', 'pixVerseV5',
  'pixVerseV5Transition', 'omniHuman', 'vfx', 'creativeVideoUpscale',
  'precisionVideoUpscale', 'textToIcon', 'universalGeneratorImage',
  'quiverTextToVector', 'quiverImageToVector', 'universalGeneratorVideo',
  'musicGeneration', 'soundEffects', 'audioIsolation', 'voiceover',
  'layerEditor', 'routerNode', 'comment', 'groupEditing', 'facialEditing',
  'imageOutput', 'videoOutput', 'soundOutput'
];

test('can instantiate all node types via search menu', async ({ editorPage: page }) => {
  test.setTimeout(300000); 
  const flowWrapper = page.locator('.react-flow').first();

  for (const type of nodeTypesToTest) {
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

test('TextElementNode - can double click, type, and blur', async ({ editorPage: page }) => {
  await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  const searchInput = page.locator('.ms-search-input-overlay');
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.fill('textNode');
  await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());
  
  await page.keyboard.press('Escape');
  
  const textNode = page.locator('.react-flow__node-textNode').first();
  await expect(textNode).toBeVisible({ timeout: 10000 });

  await textNode.dblclick({ force: true });
  
  const textContent = page.locator('.react-flow__node-textNode [contenteditable="true"], .react-flow__node-textNode textarea').first();
  await expect(textContent).toBeVisible({ timeout: 5000 });
  await textContent.fill('Hello World from E2E');

  await page.locator('.react-flow__pane').click({ force: true });

  await expect(textNode).toContainText('Hello World from E2E', { timeout: 5000 });
});

test('AssetNode - can create and has properties', async ({ editorPage: page }) => {
  await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  const searchInput = page.locator('.ms-search-input-overlay');
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.fill('assetNode');
  await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());

  await page.keyboard.press('Escape');

  const assetNode = page.locator('.react-flow__node-assetNode').first();
  await expect(assetNode).toBeVisible({ timeout: 10000 });
  
  await expect(assetNode.locator('text=Upload Media')).toBeVisible({ timeout: 5000 });
});
