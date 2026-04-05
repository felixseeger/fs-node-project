/**
 * UI Changes Test Script
 * Tests the recent improvements to the node system
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const screenshotsDir = join(__dirname, 'test-screenshots');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testUIChanges() {
  console.log('🚀 Starting UI changes test...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to the app
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await delay(3000);
    
    // Take initial screenshot
    await page.screenshot({ path: join(screenshotsDir, '01-initial-load.png') });
    console.log('✅ Initial load screenshot saved');
    
    // Mock authentication by setting localStorage
    console.log('🔑 Mocking authentication...');
    await page.evaluate(() => {
      localStorage.setItem('authUser', JSON.stringify({
        uid: 'test-user',
        email: 'test@example.com',
        displayName: 'Test User'
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await delay(3000);
    await page.screenshot({ path: join(screenshotsDir, '02-after-auth.png') });
    console.log('✅ After auth screenshot saved');
    
    // Check if we're on the home page
    const homePageVisible = await page.locator('text=Workflows').isVisible().catch(() => false);
    console.log(`   Home page visible: ${homePageVisible ? '✅' : '❌'}`);
    
    // Navigate to editor by creating a workflow
    console.log('\n🧪 Test 1: Creating a new workflow...');
    const createBtn = await page.locator('text=Create Workflow').first();
    if (await createBtn.isVisible().catch(() => false)) {
      await createBtn.click();
      await delay(2000);
      await page.screenshot({ path: join(screenshotsDir, '03-editor-opened.png') });
      console.log('✅ Editor opened');
    } else {
      console.log('⚠️ Create Workflow button not found, trying alternative...');
      // Try clicking on a workflow if one exists
      const workflowCard = await page.locator('[class*="workflow"]').first();
      if (await workflowCard.isVisible().catch(() => false)) {
        await workflowCard.click();
        await delay(2000);
        await page.screenshot({ path: join(screenshotsDir, '03-editor-opened.png') });
        console.log('✅ Opened existing workflow');
      }
    }
    
    // Test 2: Add Image Universal Generator Node
    console.log('\n🧪 Test 2: Adding Image Universal Generator Node...');
    await page.click('text=Add Node');
    await delay(500);
    await page.click('text=Image Generation');
    await delay(500);
    await page.click('text=Universal Image Generator');
    await delay(1000);
    await page.screenshot({ path: join(screenshotsDir, '04-image-node-added.png') });
    console.log('✅ Image Universal Generator node added');
    
    // Test 3: Open Model Menu and Check Auto Selection
    console.log('\n🧪 Test 3: Testing Model Menu with Auto Selection...');
    await page.click('button:has-text("Auto")');
    await delay(1000);
    await page.screenshot({ path: join(screenshotsDir, '05-model-menu-open.png') });
    console.log('✅ Model menu screenshot saved');
    
    // Check if Auto info box is visible
    const autoInfoVisible = await page.locator('text=Will use').isVisible().catch(() => false);
    console.log(`   Auto info box visible: ${autoInfoVisible ? '✅' : '❌'}`);
    
    // Close menu
    await page.keyboard.press('Escape');
    await delay(500);
    
    // Test 4: Type a prompt and check if Auto updates
    console.log('\n🧪 Test 4: Testing prompt-based Auto selection...');
    const promptTextarea = await page.locator('textarea[placeholder*="prompt"]').first();
    await promptTextarea.click();
    await promptTextarea.fill('vector logo design');
    await delay(500);
    
    // Reopen model menu to see updated selection
    await page.click('button:has-text("Auto")');
    await delay(1000);
    await page.screenshot({ path: join(screenshotsDir, '06-auto-with-prompt.png') });
    console.log('✅ Auto selection with prompt screenshot saved');
    
    // Close menu
    await page.keyboard.press('Escape');
    await delay(500);
    
    // Test 5: Test Image Upload Drag & Drop Areas
    console.log('\n🧪 Test 5: Testing Image Upload areas...');
    await page.screenshot({ path: join(screenshotsDir, '07-image-upload-boxes.png') });
    console.log('✅ Image upload boxes screenshot saved');
    
    // Test 6: Add Video Universal Generator Node
    console.log('\n🧪 Test 6: Adding Video Universal Generator Node...');
    await page.click('text=Add Node');
    await delay(500);
    await page.click('text=Video Generation');
    await delay(500);
    await page.click('text=Universal Video Generator');
    await delay(1000);
    await page.screenshot({ path: join(screenshotsDir, '08-video-node-added.png') });
    console.log('✅ Video Universal Generator node added');
    
    // Test 7: Check Video Auto Selection
    console.log('\n🧪 Test 7: Testing Video Auto Selection...');
    // Find the video node (second node on canvas)
    const videoNode = await page.locator('[data-id]').nth(1);
    if (videoNode) {
      await videoNode.locator('button:has-text("Auto")').click();
      await delay(1000);
      await page.screenshot({ path: join(screenshotsDir, '09-video-auto-menu.png') });
      console.log('✅ Video Auto menu screenshot saved');
      
      // Check if text-to-video message appears (no image input)
      const textToVideoVisible = await page.locator('text=text-to-video').isVisible().catch(() => false);
      console.log(`   Text-to-video selection visible: ${textToVideoVisible ? '✅' : '❌'}`);
      
      // Close menu
      await page.keyboard.press('Escape');
      await delay(500);
    }
    
    // Test 8: Add Quiver Image to Vector Node
    console.log('\n🧪 Test 8: Adding Quiver Image to Vector Node...');
    await page.click('text=Add Node');
    await delay(500);
    await page.click('text=Image Generation');
    await delay(500);
    await page.click('text=Quiver Image to Vector');
    await delay(1000);
    await page.screenshot({ path: join(screenshotsDir, '10-quiver-node-added.png') });
    console.log('✅ Quiver Image to Vector node added');
    
    // Test 9: Check Image Upload Box in Quiver Node
    console.log('\n🧪 Test 9: Testing Quiver Image Upload Box...');
    const uploadBoxVisible = await page.locator('text=Click or drop image here').isVisible().catch(() => false);
    console.log(`   Upload box with drag-drop text visible: ${uploadBoxVisible ? '✅' : '❌'}`);
    
    // Test drag over effect
    const uploadBox = await page.locator('text=Click or drop image here').first();
    if (uploadBox) {
      // Simulate drag enter by evaluating in browser context
      await uploadBox.evaluate(el => {
        const event = new DragEvent('dragenter', {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer()
        });
        el.dispatchEvent(event);
      });
      await delay(500);
      await page.screenshot({ path: join(screenshotsDir, '11-drag-over-effect.png') });
      console.log('✅ Drag over effect screenshot saved');
    }
    
    // Test 10: Test drag-and-drop on Image Universal Generator node
    console.log('\n🧪 Test 10: Testing drag-and-drop on Image node uploads...');
    const imageUploadBox = await page.locator('[data-id]').first().locator('.nodrag.nopan').first();
    if (imageUploadBox) {
      await imageUploadBox.evaluate(el => {
        const event = new DragEvent('dragenter', {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer()
        });
        el.dispatchEvent(event);
      });
      await delay(500);
      await page.screenshot({ path: join(screenshotsDir, '12-image-drag-over.png') });
      console.log('✅ Image node drag over effect screenshot saved');
    }
    
    console.log('\n✅ All UI tests completed!');
    console.log(`\n📁 Screenshots saved to: ${screenshotsDir}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: join(screenshotsDir, 'error-screenshot.png') });
    throw error;
  } finally {
    await browser.close();
  }
}

// Create screenshots directory
import fs from 'fs';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

testUIChanges().catch(err => {
  console.error('Test script failed:', err);
  process.exit(1);
});
