import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REFERENCE_PATH = path.join(__dirname, 'visual-diff-output', 'reference.png');
const OUTPUT_DIR = path.join(__dirname, 'visual-diff-output');

async function run() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  if (!fs.existsSync(REFERENCE_PATH)) {
    console.log('No reference image found. Please place a reference.png in visual-diff-output.');
    process.exit(0);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  // Use the PNG directly
  console.log('Loading reference image...');
  const refPngPath = REFERENCE_PATH;

  // Capture screenshot
  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(5000); // Give the app some time to render

  const screenshotPath = path.join(OUTPUT_DIR, 'current.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Current screenshot captured');

  await browser.close();

  // Pixel comparison
  console.log('Comparing images...');
  const refImg = PNG.sync.read(fs.readFileSync(refPngPath));
  const curImg = PNG.sync.read(fs.readFileSync(screenshotPath));

  const width = Math.max(refImg.width, curImg.width);
  const height = Math.max(refImg.height, curImg.height);

  const refPadded = new PNG({ width, height });
  const curPadded = new PNG({ width, height });
  const diffPng = new PNG({ width, height });

  // Fill black
  for (let i = 0; i < width * height * 4; i += 4) {
    refPadded.data[i] = 0; refPadded.data[i+1] = 0; refPadded.data[i+2] = 0; refPadded.data[i+3] = 255;
    curPadded.data[i] = 0; curPadded.data[i+1] = 0; curPadded.data[i+2] = 0; curPadded.data[i+3] = 255;
  }

  // Copy ref
  for (let y = 0; y < refImg.height; y++) {
    for (let x = 0; x < refImg.width; x++) {
      const s = (y * refImg.width + x) * 4;
      const d = (y * width + x) * 4;
      refPadded.data[d] = refImg.data[s];
      refPadded.data[d+1] = refImg.data[s+1];
      refPadded.data[d+2] = refImg.data[s+2];
      refPadded.data[d+3] = refImg.data[s+3];
    }
  }

  // Copy cur
  for (let y = 0; y < curImg.height; y++) {
    for (let x = 0; x < curImg.width; x++) {
      const s = (y * curImg.width + x) * 4;
      const d = (y * width + x) * 4;
      curPadded.data[d] = curImg.data[s];
      curPadded.data[d+1] = curImg.data[s+1];
      curPadded.data[d+2] = curImg.data[s+2];
      curPadded.data[d+3] = curImg.data[s+3];
    }
  }

  const numDiffPixels = pixelmatch(refPadded.data, curPadded.data, diffPng.data, width, height, { threshold: 0.1 });

  const diffPath = path.join(OUTPUT_DIR, 'diff.png');
  fs.writeFileSync(diffPath, PNG.sync.write(diffPng));

  const totalPixels = width * height;
  const diffPercent = ((numDiffPixels / totalPixels) * 100).toFixed(2);

  console.log('\n' + '='.repeat(60));
  console.log('VISUAL COMPARISON REPORT');
  console.log('='.repeat(60));
  console.log(`Reference:       ${REFERENCE_PATH}`);
  console.log(`Current:         http://localhost:5173/`);
  console.log(`Reference size:  ${refImg.width}x${refImg.height}`);
  console.log(`Current size:    ${curImg.width}x${curImg.height}`);
  console.log(`Pixels different: ${numDiffPixels.toLocaleString()} / ${totalPixels.toLocaleString()}`);
  console.log(`Difference:       ${diffPercent}%`);
  console.log(`Diff image:       ${diffPath}`);
  console.log('='.repeat(60));

  if (numDiffPixels === 0) {
    console.log('PERFECT MATCH');
  } else if (parseFloat(diffPercent) < 1) {
    console.log('MINOR DIFFERENCES');
  } else if (parseFloat(diffPercent) < 5) {
    console.log('MODERATE DIFFERENCES');
  } else {
    console.log('SIGNIFICANT DIFFERENCES');
  }
}

run().catch(err => { console.error(err); process.exit(1); });
