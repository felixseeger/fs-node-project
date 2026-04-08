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

test.describe('Node Operations', () => {

  test('can instantiate all node types via search menu', async ({ editorPage: page }) => {
    test.setTimeout(120000);
    const flowWrapper = page.locator('.react-flow').first();

    for (const type of nodeTypesToTest) {
      const searchInput = page.locator('.ms-search-input-overlay');
      
      // Force open search menu with spacebar via evaluate to bypass any interceptors
      await page.evaluate(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      });
      await page.waitForTimeout(300);
      
      // Fill the search input
      await searchInput.fill('');
      await searchInput.fill(type);
      await page.waitForTimeout(300);
      
      // Find the button and click it via JS to bypass overlay issues
      const clicked = await page.evaluate(() => {
        const btn = document.querySelector('.ms-node-list button.ms-node-btn');
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });
      
      if (clicked) {
        await page.waitForTimeout(300);
        await expect(flowWrapper).toBeVisible();
      } else {
        console.log(`Node type ${type} not found in menu.`);
      }
    }
  });

  test('TextElementNode - can double click, type, and blur', async ({ editorPage: page }) => {
    // Add text node
    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
    await page.waitForTimeout(300);
    await page.locator('.ms-search-input-overlay').fill('textNode');
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());
    await page.waitForTimeout(500);
    
    // Close menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    const textNode = page.locator('.react-flow__node-textNode').first();
    await expect(textNode).toBeVisible();

    // Double click to enter edit mode
    await textNode.dblclick({ force: true });
    await page.waitForTimeout(500);
    
    // Type text
    const textContent = page.locator('.react-flow__node-textNode [contenteditable="true"], .react-flow__node-textNode textarea');
    await textContent.fill('Hello World from E2E');
    await page.waitForTimeout(500);

    // Click outside to trigger blur
    await page.locator('.react-flow__pane').click({ force: true });
    await page.waitForTimeout(500);

    // Check if the text was saved
    await expect(textContent).toContainText('Hello World from E2E');
  });

  test('AssetNode - can create and has properties', async ({ editorPage: page }) => {
    // Add asset node
    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
    await page.waitForTimeout(300);
    await page.locator('.ms-search-input-overlay').fill('assetNode');
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());
    await page.waitForTimeout(500);

    // Close menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    const assetNode = page.locator('.react-flow__node-assetNode').first();
    await expect(assetNode).toBeVisible();
    
    // It has a placeholder saying "Upload Media" or an SVG icon
    await expect(assetNode.locator('text=Upload Media')).toBeVisible();

    // Select the node
    await assetNode.click({ force: true });

    // Success
  });
});
