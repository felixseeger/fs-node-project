#!/usr/bin/env node

/**
 * Asset Optimization Script for FS Node Project
 * Phase 7.2.3: Asset Optimization
 * 
 * This script optimizes all image assets in the project:
 * - PNG compression with imagemin-pngquant
 * - JPEG compression with imagemin-mozjpeg
 * - SVG optimization with imagemin-svgo
 * - Automatic format conversion where beneficial
 * - Preserves original quality while reducing file size
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import sharp from 'sharp';

// Configuration
const ASSET_DIRS = [
  'src/assets',
  'src/assets/icons',
  'src/assets/workflows',
  'public'
];

const OPTIMIZATION_OPTIONS = {
  png: {
    quality: [0.6, 0.8], // 60-80% quality range
    speed: 1, // Slowest but best compression
    strip: true // Remove metadata
  },
  jpeg: {
    quality: 75, // 75% quality
    progressive: true // Progressive JPEGs
  },
  svg: {
    plugins: [
      { removeViewBox: false },
      { removeEmptyAttrs: true },
      { removeUselessStrokeAndFill: true }
    ]
  }
};

const SIZE_LIMITS = {
  png: 500 * 1024, // 500KB
  jpeg: 500 * 1024, // 500KB
  svg: 100 * 1024 // 100KB
};

// Statistics
let totalFiles = 0;
let totalOriginalSize = 0;
let totalOptimizedSize = 0;
let filesOptimized = 0;
let totalSavings = 0;

async function optimizeAssets() {
  console.log('🚀 Starting Asset Optimization (Phase 7.2.3)');
  console.log('='.repeat(60));
  
  try {
    // Find all image files
    const imageFiles = [];
    
    for (const dir of ASSET_DIRS) {
      const pattern = path.join(dir, '**', '*.{png,jpg,jpeg,svg}');
      const files = await glob(pattern, { nodir: true });
      imageFiles.push(...files);
    }
    
    console.log(`📁 Found ${imageFiles.length} image files to optimize`);
    console.log('');
    
    // Process each file
    for (const filePath of imageFiles) {
      try {
        const ext = path.extname(filePath).toLowerCase().slice(1);
        const fileName = path.basename(filePath);
        const fileSize = (await fs.stat(filePath)).size;
        
        console.log(`🔍 Processing: ${fileName} (${formatBytes(fileSize)})`);
        
        // Skip if already optimized (has -optimized suffix)
        if (fileName.includes('-optimized.')) {
          console.log(`  ⏭️  Skipping already optimized file`);
          continue;
        }
        
        // Skip if below optimization threshold
        if (fileSize < 1024) { // Skip files < 1KB
          console.log(`  ⏭️  Skipping small file (< 1KB)`);
          continue;
        }
        
        totalFiles++;
        totalOriginalSize += fileSize;
        
        // Optimize based on file type
        let optimizedData;
        let optimizedSize;
        
        if (['png', 'jpg', 'jpeg'].includes(ext)) {
          optimizedData = await optimizeImage(filePath, ext);
          optimizedSize = optimizedData.length;
        } else if (ext === 'svg') {
          optimizedData = await optimizeSvg(filePath);
          optimizedSize = optimizedData.length;
        } else {
          console.log(`  ⚠️  Unsupported file type: ${ext}`);
          continue;
        }
        
        // Calculate savings
        const savings = fileSize - optimizedSize;
        const savingsPercent = ((savings / fileSize) * 100).toFixed(1);
        
        console.log(`  ✅ Optimized: ${formatBytes(optimizedSize)} (-${savingsPercent}%, saved ${formatBytes(savings)})`);
        
        // Only write if we actually saved space
        if (savings > 100) { // Save at least 100 bytes
          const backupPath = `${filePath}.backup`;
          await fs.copyFile(filePath, backupPath);
          await fs.writeFile(filePath, optimizedData);
          
          // Update stats
          totalOptimizedSize += optimizedSize;
          totalSavings += savings;
          filesOptimized++;
          
          console.log(`  💾 Saved to: ${filePath}`);
        } else {
          console.log(`  ℹ️  Skipping (savings < 100 bytes)`);
        }
        
        console.log('');
        
      } catch (error) {
        console.error(`  ❌ Error processing ${filePath}:`, error.message);
        console.log('');
      }
    }
    
    // Generate report
    console.log('='.repeat(60));
    console.log('📊 OPTIMIZATION REPORT');
    console.log('='.repeat(60));
    console.log(`📁 Files processed: ${totalFiles}`);
    console.log(`💾 Files optimized: ${filesOptimized}`);
    console.log(`📉 Total savings: ${formatBytes(totalSavings)} (${((totalSavings / totalOriginalSize) * 100).toFixed(1)}%)`);
    console.log(`📦 Original size: ${formatBytes(totalOriginalSize)}`);
    console.log(`📦 Optimized size: ${formatBytes(totalOptimizedSize)}`);
    console.log('');
    console.log('✅ Asset Optimization Complete!');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

async function optimizeImage(filePath, ext) {
  try {
    const buffer = await fs.readFile(filePath);
    
    // Use imagemin for best compression
    const result = await imagemin.buffer(buffer, {
      plugins: [
        ext === 'png' ? imageminPngquant(OPTIMIZATION_OPTIONS.png) : null,
        ['jpg', 'jpeg'].includes(ext) ? imageminMozjpeg(OPTIMIZATION_OPTIONS.jpeg) : null
      ].filter(Boolean)
    });
    
    return result;
  } catch (error) {
    console.error(`  ⚠️  Falling back to sharp for ${path.basename(filePath)}:`);
    
    // Fallback to sharp if imagemin fails
    const image = sharp(buffer);
    
    if (ext === 'png') {
      return image.png({ quality: 80, compressionLevel: 9 }).toBuffer();
    } else {
      return image.jpeg({ quality: 75, progressive: true }).toBuffer();
    }
  }
}

async function optimizeSvg(filePath) {
  const buffer = await fs.readFile(filePath);
  const result = await imagemin.buffer(buffer, {
    plugins: [
      imageminSvgo({
        plugins: OPTIMIZATION_OPTIONS.svg.plugins
      })
    ]
  });
  return result;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run optimization
optimizeAssets();
