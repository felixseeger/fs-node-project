#!/bin/bash
# Test Asset Generator Script
# Usage: ./generate.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
IMAGES_DIR="$BASE_DIR/images"
VIDEOS_DIR="$BASE_DIR/videos"

# Create directories
mkdir -p "$IMAGES_DIR"
mkdir -p "$VIDEOS_DIR"

echo "🚀 Test Asset Generator"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for ImageMagick
if command -v convert &> /dev/null || command -v magick &> /dev/null; then
    CONVERT_CMD="convert"
    if command -v magick &> /dev/null; then
        CONVERT_CMD="magick"
    fi
    
    echo ""
    echo "🎨 Generating test images..."
    echo ""
    
    # Small (100x100, Red)
    $CONVERT_CMD -size 100x100 xc:red "$IMAGES_DIR/test-small.jpg"
    $CONVERT_CMD -size 100x100 xc:red "$IMAGES_DIR/test-small.png"
    $CONVERT_CMD -size 100x100 xc:red "$IMAGES_DIR/test-small.webp"
    echo "  ✓ test-small (100x100, red)"
    
    # Medium (640x480, Blue)
    $CONVERT_CMD -size 640x480 xc:blue "$IMAGES_DIR/test-medium.jpg"
    $CONVERT_CMD -size 640x480 xc:blue "$IMAGES_DIR/test-medium.png"
    $CONVERT_CMD -size 640x480 xc:blue "$IMAGES_DIR/test-medium.webp"
    echo "  ✓ test-medium (640x480, blue)"
    
    # Large (1920x1080, Green)
    $CONVERT_CMD -size 1920x1080 xc:green "$IMAGES_DIR/test-large.jpg"
    $CONVERT_CMD -size 1920x1080 xc:green "$IMAGES_DIR/test-large.png"
    $CONVERT_CMD -size 1920x1080 xc:green "$IMAGES_DIR/test-large.webp"
    echo "  ✓ test-large (1920x1080, green)"
    
    # Square (500x500, Yellow)
    $CONVERT_CMD -size 500x500 xc:yellow "$IMAGES_DIR/test-square.jpg"
    $CONVERT_CMD -size 500x500 xc:yellow "$IMAGES_DIR/test-square.png"
    $CONVERT_CMD -size 500x500 xc:yellow "$IMAGES_DIR/test-square.webp"
    echo "  ✓ test-square (500x500, yellow)"
    
    # Wide (1280x720, Purple)
    $CONVERT_CMD -size 1280x720 xc:purple "$IMAGES_DIR/test-wide.jpg"
    $CONVERT_CMD -size 1280x720 xc:purple "$IMAGES_DIR/test-wide.png"
    $CONVERT_CMD -size 1280x720 xc:purple "$IMAGES_DIR/test-wide.webp"
    echo "  ✓ test-wide (1280x720, purple)"
    
    # Portrait (720x1280, Orange)
    $CONVERT_CMD -size 720x1280 xc:orange "$IMAGES_DIR/test-portrait.jpg"
    $CONVERT_CMD -size 720x1280 xc:orange "$IMAGES_DIR/test-portrait.png"
    $CONVERT_CMD -size 720x1280 xc:orange "$IMAGES_DIR/test-portrait.webp"
    echo "  ✓ test-portrait (720x1280, orange)"
    
else
    echo "⚠️  ImageMagick not found. Skipping image generation."
    echo "   Install: brew install imagemagick (macOS)"
fi

# Check for FFmpeg
if command -v ffmpeg &> /dev/null; then
    echo ""
    echo "🎬 Generating test videos..."
    echo ""
    
    # Short video (640x480, 2s)
    ffmpeg -y -f lavfi -i testsrc=size=640x480:rate=24:duration=2 \
        -c:v libx264 -preset ultrafast -pix_fmt yuv420p \
        "$VIDEOS_DIR/test-short.mp4" 2>/dev/null
    echo "  ✓ test-short.mp4 (640x480, 2s, 24fps)"
    
    # HD video (1280x720, 5s)
    ffmpeg -y -f lavfi -i testsrc=size=1280x720:rate=30:duration=5 \
        -c:v libx264 -preset ultrafast -pix_fmt yuv420p \
        "$VIDEOS_DIR/test-hd.mp4" 2>/dev/null
    echo "  ✓ test-hd.mp4 (1280x720, 5s, 30fps)"
else
    echo ""
    echo "🎬 FFmpeg not found. Skipping video generation."
    echo "   Install: brew install ffmpeg (macOS)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Asset generation complete!"
echo ""
echo "📁 Images: $IMAGES_DIR"
echo "📁 Videos: $VIDEOS_DIR"
echo ""

# List generated files
if [ -d "$IMAGES_DIR" ] && [ "$(ls -A $IMAGES_DIR 2>/dev/null)" ]; then
    echo "📸 Generated images:"
    ls -lh "$IMAGES_DIR" | tail -n +2 | awk '{print "   " $9 " (" $5 ")"}'
    echo ""
fi

if [ -d "$VIDEOS_DIR" ] && [ "$(ls -A $VIDEOS_DIR 2>/dev/null)" ]; then
    echo "🎥 Generated videos:"
    ls -lh "$VIDEOS_DIR" | tail -n +2 | awk '{print "   " $9 " (" $5 ")"}'
    echo ""
fi
