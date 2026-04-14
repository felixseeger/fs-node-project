#!/usr/bin/env node

/**
 * Test Asset Generator (Simplified)
 * Generates sample images (JPG, PNG, WebP) and videos (MP4) for testing
 * 
 * Usage: node test-assets/scripts/generate-assets.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const VIDEOS_DIR = path.join(__dirname, '..', 'videos');

// Test image configurations
const IMAGE_CONFIGS = [
  { name: 'test-small', width: 100, height: 100, color: 'red' },
  { name: 'test-medium', width: 640, height: 480, color: 'blue' },
  { name: 'test-large', width: 1920, height: 1080, color: 'green' },
  { name: 'test-square', width: 500, height: 500, color: 'yellow' },
  { name: 'test-wide', width: 1280, height: 720, color: 'purple' },
  { name: 'test-portrait', width: 720, height: 1280, color: 'orange' },
];

// Test video configurations
const VIDEO_CONFIGS = [
  { name: 'test-short', width: 640, height: 480, duration: 2, fps: 24 },
  { name: 'test-hd', width: 1280, height: 720, duration: 5, fps: 30 },
];

/**
 * Check if a command exists
 */
function commandExists(command) {
  try {
    execSync(`which ${command} 2>/dev/null || command -v ${command} 2>/dev/null`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate test images using available tools
 */
function generateImages() {
  console.log('🎨 Generating test images...\n');

  const formats = ['jpg', 'png', 'webp'];
  let generated = 0;

  for (const config of IMAGE_CONFIGS) {
    for (const format of formats) {
      const filename = `${config.name}.${format}`;
      const filepath = path.join(IMAGES_DIR, filename);

      try {
        let success = false;

        // Try ImageMagick (convert command)
        if (commandExists('convert') || commandExists('magick')) {
          const cmd = commandExists('magick') ? 'magick' : 'convert';
          execSync(
            `${cmd} -size ${config.width}x${config.height} xc:${config.color} "${filepath}"`,
            { stdio: 'pipe' }
          );
          success = true;
        }
        // Try FFmpeg as fallback
        else if (commandExists('ffmpeg')) {
          execSync(
            `ffmpeg -y -f lavfi -i color=c=${config.color}:s=${config.width}x${config.height}:d=1 -frames:v 1 "${filepath}" 2>/dev/null`,
            { stdio: 'pipe' }
          );
          success = true;
        }

        if (success) {
          const stats = fs.statSync(filepath);
          console.log(`  ✓ ${filename} (${(stats.size / 1024).toFixed(2)} KB)`);
          generated++;
        }
      } catch (error) {
        console.log(`  ✗ ${filename} (failed)`);
      }
    }
  }

  if (generated === 0) {
    console.log('\n  ⚠ No image generation tools found.');
    console.log('  Install ImageMagick: brew install imagemagick (macOS)');
    console.log('  Or FFmpeg: brew install ffmpeg (macOS)');
  }

  return generated;
}

/**
 * Generate test videos using FFmpeg
 */
function generateVideos() {
  console.log('\n🎬 Generating test videos...\n');

  if (!commandExists('ffmpeg')) {
    console.log('  ⚠ FFmpeg not found. Skipping video generation.');
    console.log('  Install FFmpeg: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)');
    return 0;
  }

  let generated = 0;

  for (const config of VIDEO_CONFIGS) {
    const filename = `${config.name}.mp4`;
    const filepath = path.join(VIDEOS_DIR, filename);

    try {
      // Generate a test video with color bars
      execSync(
        `ffmpeg -y -f lavfi -i testsrc=size=${config.width}x${config.height}:rate=${config.fps}:duration=${config.duration} -c:v libx264 -preset ultrafast -pix_fmt yuv420p "${filepath}" 2>/dev/null`,
        { stdio: 'pipe' }
      );

      const stats = fs.statSync(filepath);
      console.log(`  ✓ ${filename} (${(stats.size / 1024).toFixed(2)} KB)`);
      generated++;
    } catch (error) {
      console.log(`  ✗ ${filename} (failed)`);
    }
  }

  return generated;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Test Asset Generator\n');
  console.log('━'.repeat(50));
  
  // Ensure output directories exist
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }

  const imageCount = generateImages();
  const videoCount = generateVideos();

  console.log('\n' + '━'.repeat(50));
  console.log('\n✅ Asset generation complete!');
  console.log(`   📸 Images generated: ${imageCount}`);
  console.log(`   🎥 Videos generated: ${videoCount}`);
  console.log(`\n📁 Images: ${IMAGES_DIR}`);
  console.log(`📁 Videos: ${VIDEOS_DIR}`);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { generateImages, generateVideos };
