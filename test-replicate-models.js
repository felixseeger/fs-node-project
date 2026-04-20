#!/usr/bin/env node
/**
 * Test Replicate Free Tier Models
 * Generates test outputs from key models and saves to downloads/latest-test/
 */

import Replicate from 'replicate';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'downloads', 'latest-test');
const SAMPLE_IMAGES_DIR = path.join(__dirname, 'downloads', 'sample-images');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const TEST_MODELS = [
  {
    name: 'Flux 1.1 Pro (Text-to-Image)',
    model: 'black-forest-labs/flux-1.1-pro',
    type: 'text-to-image',
    params: { prompt: 'A serene mountain landscape at sunset, ultra-detailed, 8k', aspect_ratio: '16:9' }
  },
  {
    name: 'Flux Dev (Faster Generation)',
    model: 'black-forest-labs/flux-dev',
    type: 'text-to-image',
    params: { prompt: 'A futuristic city with neon lights, cyberpunk aesthetic', aspect_ratio: '16:9' }
  },
  {
    name: 'Flux Pro (Premium)',
    model: 'black-forest-labs/flux-pro',
    type: 'text-to-image',
    params: { prompt: 'A professional product photo of a luxury watch on marble table', aspect_ratio: '1:1' }
  },
  {
    name: 'LLaVA Image Captioning',
    model: 'replicate/llava-13b',
    type: 'image-analysis',
    params: { prompt: 'Describe this image in detail' },
    requiresImage: true
  },
  {
    name: 'Upscayl 4x Upscaler',
    model: 'replicate/upscayl',
    type: 'image-upscale',
    params: { scale: 4 },
    requiresImage: true
  },
];

async function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    });
    request.on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function getImageInput() {
  const files = fs.readdirSync(SAMPLE_IMAGES_DIR).filter(f => /\.(jpg|png|webp)$/i.test(f));
  if (files.length === 0) return null;

  const imagePath = path.join(SAMPLE_IMAGES_DIR, files[0]);
  const imageData = fs.readFileSync(imagePath);
  return `data:image/jpeg;base64,${imageData.toString('base64')}`;
}

async function testModel(client, modelConfig, sampleImage) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const modelName = modelConfig.name.replace(/\s+/g, '-').toLowerCase();
  const filename = `${timestamp}-${modelName}`;

  try {
    console.log(`\n🔄 Testing: ${modelConfig.name}`);

    const params = { ...modelConfig.params };

    // Add image input if model requires it and sample image exists
    if (modelConfig.requiresImage && sampleImage) {
      params.image = sampleImage;
    }

    const prediction = await client.predictions.create({
      model: modelConfig.model,
      input: params
    });

    console.log(`   Prediction ID: ${prediction.id}`);
    console.log(`   Status: ${prediction.status}`);

    // Poll for completion (max 10 minutes)
    let completed = prediction;
    let pollCount = 0;
    const maxPolls = 120; // 10 minutes at 5-second intervals

    while ((completed.status === 'processing' || completed.status === 'starting') && pollCount < maxPolls) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      completed = await client.predictions.get(prediction.id);
      pollCount++;

      if (pollCount % 6 === 0) { // Log every 30 seconds
        console.log(`   Still processing... (${Math.floor(pollCount * 5 / 60)}m elapsed, status: ${completed.status})`);
      }
    }

    if (completed.status === 'failed') {
      console.error(`   ❌ Failed: ${completed.error}`);
      return {
        model: modelConfig.name,
        status: 'failed',
        error: completed.error
      };
    }

    if (completed.status === 'succeeded') {
      const output = completed.output;

      if (Array.isArray(output) && output.length > 0) {
        // Handle array of URLs
        const urls = output.filter(o => typeof o === 'string' && (o.startsWith('http') || o.startsWith('data:')));

        const savedFiles = [];
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];
          const ext = modelConfig.type === 'text-to-video' ? '.mp4' : '.png';
          const outputPath = path.join(OUTPUT_DIR, `${filename}${i > 0 ? `-${i}` : ''}${ext}`);

          if (url.startsWith('data:')) {
            // Handle base64
            const base64 = url.split(',')[1];
            fs.writeFileSync(outputPath, Buffer.from(base64, 'base64'));
          } else {
            // Download from URL
            await downloadFile(url, outputPath);
          }

          savedFiles.push(outputPath);
          console.log(`   ✅ Saved: ${path.basename(outputPath)}`);
        }

        return {
          model: modelConfig.name,
          status: 'success',
          files: savedFiles,
          predictionId: completed.id
        };
      } else if (typeof output === 'string') {
        // Single URL/base64
        const ext = modelConfig.type === 'text-to-video' ? '.mp4' : '.png';
        const outputPath = path.join(OUTPUT_DIR, `${filename}${ext}`);

        if (output.startsWith('data:')) {
          const base64 = output.split(',')[1];
          fs.writeFileSync(outputPath, Buffer.from(base64, 'base64'));
        } else {
          await downloadFile(output, outputPath);
        }

        console.log(`   ✅ Saved: ${path.basename(outputPath)}`);

        return {
          model: modelConfig.name,
          status: 'success',
          files: [outputPath],
          predictionId: completed.id
        };
      } else {
        throw new Error('No output from model');
      }
    } else {
      console.error(`   ⚠️  Unexpected status: ${completed.status}`);
      return {
        model: modelConfig.name,
        status: completed.status,
        error: 'Unexpected completion status'
      };
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return {
      model: modelConfig.name,
      status: 'error',
      error: error.message
    };
  }
}

async function runTests() {
  if (!API_KEY) {
    console.error('❌ REPLICATE_API_TOKEN or REPLICATE_API_KEY not set in environment');
    process.exit(1);
  }

  console.log('🚀 Starting Replicate Model Tests');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🖼️  Sample images: ${SAMPLE_IMAGES_DIR}`);

  const client = new Replicate({ auth: API_KEY });
  const sampleImage = await getImageInput();

  if (!sampleImage) {
    console.warn('⚠️  No sample images found, text-to-image models will work but image-based models may fail');
  }

  const results = [];

  for (const modelConfig of TEST_MODELS) {
    const result = await testModel(client, modelConfig, sampleImage);
    results.push(result);

    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  console.log('\n\n📊 Test Summary');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const errors = results.filter(r => r.status === 'error').length;

  for (const result of results) {
    const icon = result.status === 'success' ? '✅' : '❌';
    console.log(`${icon} ${result.model}: ${result.status}`);
    if (result.files) {
      result.files.forEach(f => console.log(`   └─ ${path.basename(f)}`));
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${results.length} | Success: ${successful} | Failed: ${failed} | Errors: ${errors}`);
  console.log(`Files saved to: ${OUTPUT_DIR}`);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
