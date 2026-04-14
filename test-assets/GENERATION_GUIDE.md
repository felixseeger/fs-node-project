# Test Asset Generation Guide

This directory contains test assets for the Node-Project.

## Quick Start

### Option 1: Using Homebrew (macOS) - Recommended

```bash
# Install required tools
brew install imagemagick ffmpeg

# Generate images
convert -size 100x100 xc:red test-assets/images/test-small.jpg
convert -size 100x100 xc:red test-assets/images/test-small.png
convert -size 100x100 xc:red test-assets/images/test-small.webp

convert -size 640x480 xc:blue test-assets/images/test-medium.jpg
convert -size 640x480 xc:blue test-assets/images/test-medium.png
convert -size 640x480 xc:blue test-assets/images/test-medium.webp

convert -size 1920x1080 xc:green test-assets/images/test-large.jpg
convert -size 1920x1080 xc:green test-assets/images/test-large.png
convert -size 1920x1080 xc:green test-assets/images/test-large.webp

convert -size 500x500 xc:yellow test-assets/images/test-square.jpg
convert -size 500x500 xc:yellow test-assets/images/test-square.png
convert -size 500x500 xc:yellow test-assets/images/test-square.webp

convert -size 1280x720 xc:purple test-assets/images/test-wide.jpg
convert -size 1280x720 xc:purple test-assets/images/test-wide.png
convert -size 1280x720 xc:purple test-assets/images/test-wide.webp

convert -size 720x1280 xc:orange test-assets/images/test-portrait.jpg
convert -size 720x1280 xc:orange test-assets/images/test-portrait.png
convert -size 720x1280 xc:orange test-assets/images/test-portrait.webp

# Generate videos
ffmpeg -y -f lavfi -i testsrc=size=640x480:rate=24:duration=2 -c:v libx264 -preset ultrafast -pix_fmt yuv420p test-assets/videos/test-short.mp4

ffmpeg -y -f lavfi -i testsrc=size=1280x720:rate=30:duration=5 -c:v libx264 -preset ultrafast -pix_fmt yuv420p test-assets/videos/test-hd.mp4
```

### Option 2: Using Python with Pillow

```bash
# Install Pillow
pip3 install Pillow

# Run the generator
python3 test-assets/scripts/generate-assets.py
```

### Option 3: Using Node.js with canvas

```bash
# Install dependencies
npm install canvas

# Run the generator
node test-assets/scripts/generate-assets.js
```

## Asset Specifications

### Images

| Name | Dimensions | Color | Formats |
|------|-----------|-------|---------|
| test-small | 100x100 | Red | JPG, PNG, WebP |
| test-medium | 640x480 | Blue | JPG, PNG, WebP |
| test-large | 1920x1080 | Green | JPG, PNG, WebP |
| test-square | 500x500 | Yellow | JPG, PNG, WebP |
| test-wide | 1280x720 | Purple | JPG, PNG, WebP |
| test-portrait | 720x1280 | Orange | JPG, PNG, WebP |

### Videos

| Name | Dimensions | Duration | FPS | Codec |
|------|-----------|----------|-----|-------|
| test-short | 640x480 | 2s | 24 | H.264 |
| test-hd | 1280x720 | 5s | 30 | H.264 |

## Verification

After generating, verify the assets exist:

```bash
ls -lh test-assets/images/
ls -lh test-assets/videos/
```

Expected output:
- 18 image files (6 configs × 3 formats)
- 2 video files

## Troubleshooting

### ImageMagick not found
```bash
# macOS
brew install imagemagick

# Linux
sudo apt-get install imagemagick
```

### FFmpeg not found
```bash
# macOS
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg
```

### Python Pillow not found
```bash
pip3 install Pillow
```

## Clean Up

To remove all generated assets:
```bash
rm -rf test-assets/images/*
rm -rf test-assets/videos/*
```
