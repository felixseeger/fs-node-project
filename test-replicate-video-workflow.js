#!/usr/bin/env node
/**
 * Test Replicate Video Generation Workflow
 * Creates videos with Tel Aviv beach theme: image > video > reframe > upscale
 * Tests: minimax-video-01, luma-reframe, topaz-video-upscale
 */

import Replicate from 'replicate';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'downloads', 'latest-test');
const STEPS_DIR = path.join(OUTPUT_DIR, 'workflow-steps');

// Create output directories
[OUTPUT_DIR, STEPS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const WORKFLOW_CONFIG = {
  theme: 'beach of Tel Aviv in Israel - golden sand, turquoise Mediterranean sea, sunset lighting, tourists enjoying the coast',
  image: {
    model: 'black-forest-labs/flux-1.1-pro',
    params: {
      prompt: 'Cinematic shot of a beautiful golden hour sunset at the beach of Tel Aviv, Israel. Clear turquoise Mediterranean Sea, soft golden sand, relaxed beach atmosphere, tourists and locals enjoying the beautiful weather, modern Tel Aviv buildings in the distance, 8K cinematography, professional color grading',
      aspect_ratio: '16:9'
    }
  },
  videos: [
    {
      name: 'Minimax Video Generation',
      model: 'minimax/video-01',
      type: 'text-to-video',
      params: {
        prompt: 'Beach of Tel Aviv, Israel: Beautiful golden hour sunset over the Mediterranean Sea, turquoise waters, golden sand, relaxed beach atmosphere with people, waves gently rolling in',
        duration: 5,
        fps: 24
      }
    },
    {
      name: 'Luma Reframe Video',
      model: 'luma/reframe-video',
      type: 'video-reframe',
      params: {
        video_url: null, // Will be set dynamically
        prompt: 'Enhance the cinematic golden hour sunset at Tel Aviv beach with elegant camera motion and warm color grading',
        motion_amount: 'medium',
        style: 'cinematic',
        strength: 0.7
      }
    },
    {
      name: 'Topaz Video Upscale',
      model: 'topazlabs/video-upscale',
      type: 'video-upscale',
      params: {
        video: null, // Will be set dynamically
        target_resolution: '1080p',
        target_fps: 30
      }
    }
  ]
};

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

async function waitForPrediction(client, predictionId, timeout = 600000) {
  const startTime = Date.now();
  const pollInterval = 5000; // 5 seconds

  while (Date.now() - startTime < timeout) {
    const prediction = await client.predictions.get(predictionId);

    if (prediction.status === 'succeeded' || prediction.status === 'failed') {
      return prediction;
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    console.log(`   ⏳ Processing... (${elapsed}s elapsed, status: ${prediction.status})`);

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Replicate prediction ${predictionId} timed out after ${timeout}ms`);
}

async function generateImage(client, config) {
  console.log('\n📸 STEP 1: Generating Base Image');
  console.log(`   Model: ${config.image.model}`);
  console.log(`   Prompt: ${config.image.params.prompt.substring(0, 80)}...`);

  const prediction = await client.predictions.create({
    model: config.image.model,
    input: config.image.params
  });

  const completed = await waitForPrediction(client, prediction.id);

  if (completed.status === 'failed') {
    throw new Error(`Image generation failed: ${completed.error}`);
  }

  const imageUrl = Array.isArray(completed.output)
    ? completed.output[0]
    : completed.output;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const imagePath = path.join(STEPS_DIR, `${timestamp}-01-base-image.png`);

  await downloadFile(imageUrl, imagePath);
  console.log(`   ✅ Image saved: ${path.basename(imagePath)}`);

  return imagePath;
}

async function generateVideo(client, inputData, config, stepNum) {
  const videoConfig = config.videos[stepNum - 2]; // Step 2 and beyond are videos
  console.log(`\n🎬 STEP ${stepNum}: ${videoConfig.name}`);
  console.log(`   Model: ${videoConfig.model}`);

  let input = { ...videoConfig.params };

  // Handle input based on video type
  if (videoConfig.type === 'text-to-video' && stepNum === 2 && inputData) {
    // First video generation from image
    const imageData = fs.readFileSync(inputData);
    input.image = `data:image/png;base64,${imageData.toString('base64')}`;
  } else if (videoConfig.type === 'video-reframe' && inputData) {
    // Reframe takes video URL (pass through the Replicate output URL)
    input.video_url = inputData;
    console.log(`   Using video URL: ${inputData.substring(0, 50)}...`);
  } else if (videoConfig.type === 'video-upscale' && inputData) {
    // Upscale takes video URL
    input.video = inputData;
    console.log(`   Using video URL: ${inputData.substring(0, 50)}...`);
  }

  console.log(`   Starting prediction...`);
  const prediction = await client.predictions.create({
    model: videoConfig.model,
    input
  });

  const completed = await waitForPrediction(client, prediction.id, 900000); // 15 min timeout

  if (completed.status === 'failed') {
    console.error(`   ❌ Failed: ${completed.error}`);
    return null;
  }

  const videoUrl = Array.isArray(completed.output)
    ? completed.output[0]
    : completed.output;

  if (!videoUrl || typeof videoUrl !== 'string') {
    console.warn(`   ⚠️  Unexpected output format:`, videoUrl);
    return null;
  }

  // Return URL for chaining, also download for local storage
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const videoPath = path.join(STEPS_DIR, `${timestamp}-0${stepNum}-${videoConfig.name.replace(/\s+/g, '-').toLowerCase()}.mp4`);

  if (videoUrl.startsWith('data:')) {
    const base64 = videoUrl.split(',')[1];
    fs.writeFileSync(videoPath, Buffer.from(base64, 'base64'));
  } else if (videoUrl.startsWith('http')) {
    await downloadFile(videoUrl, videoPath);
  }

  console.log(`   ✅ Video saved: ${path.basename(videoPath)}`);

  // Return the Replicate URL for chaining to next step
  return { url: videoUrl, localPath: videoPath };
}

async function runWorkflow() {
  if (!API_KEY) {
    console.error('❌ REPLICATE_API_TOKEN or REPLICATE_API_KEY not set in environment');
    process.exit(1);
  }

  console.log('🎯 REPLICATE VIDEO WORKFLOW');
  console.log('=' .repeat(60));
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🌍 Theme: ${WORKFLOW_CONFIG.theme}`);
  console.log('=' .repeat(60));

  const client = new Replicate({ auth: API_KEY });

  try {
    // Step 1: Generate base image
    const imagePath = await generateImage(client, WORKFLOW_CONFIG);

    // Step 2: Generate video from image (Minimax)
    console.log('\n⏳ Waiting before next step...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const videoResult = await generateVideo(client, imagePath, WORKFLOW_CONFIG, 2);

    if (!videoResult) {
      console.log('\n⚠️  Video generation failed, skipping transform steps');
      return;
    }

    // Step 3: Reframe video (Luma) - pass the Replicate URL for chaining
    console.log('\n⏳ Waiting before reframing...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const reframedResult = await generateVideo(client, videoResult.url, WORKFLOW_CONFIG, 3);

    // Step 4: Upscale video (Topaz) - pass the reframed video URL
    if (reframedResult) {
      console.log('\n⏳ Waiting before upscaling...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      await generateVideo(client, reframedResult.url, WORKFLOW_CONFIG, 4);
    }

    // Copy final videos to main output directory
    console.log('\n📦 Copying final outputs to main directory...');
    const stepFiles = fs.readdirSync(STEPS_DIR).filter(f => f.endsWith('.mp4'));
    stepFiles.forEach(file => {
      const src = path.join(STEPS_DIR, file);
      const dest = path.join(OUTPUT_DIR, file);
      fs.copyFileSync(src, dest);
      console.log(`   ✅ ${file}`);
    });

    // Summary
    console.log('\n✨ WORKFLOW COMPLETE');
    console.log('=' .repeat(60));
    console.log(`📺 Videos saved to: ${OUTPUT_DIR}`);
    console.log(`📋 All steps available in: ${STEPS_DIR}`);
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('\n❌ Workflow failed:', error.message);
    process.exit(1);
  }
}

runWorkflow().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
