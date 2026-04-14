#!/usr/bin/env python3
"""
Test Asset Generator
Generates sample images (JPG, PNG, WebP) and videos (MP4) for testing

Usage: python3 test-assets/scripts/generate-assets.py
"""

import os
import subprocess
import sys
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
BASE_DIR = SCRIPT_DIR.parent
IMAGES_DIR = BASE_DIR / "images"
VIDEOS_DIR = BASE_DIR / "videos"

# Test image configurations
IMAGE_CONFIGS = [
    {"name": "test-small", "width": 100, "height": 100, "color": (255, 0, 0)},
    {"name": "test-medium", "width": 640, "height": 480, "color": (0, 0, 255)},
    {"name": "test-large", "width": 1920, "height": 1080, "color": (0, 255, 0)},
    {"name": "test-square", "width": 500, "height": 500, "color": (255, 255, 0)},
    {"name": "test-wide", "width": 1280, "height": 720, "color": (128, 0, 128)},
    {"name": "test-portrait", "width": 720, "height": 1280, "color": (255, 165, 0)},
]

# Test video configurations
VIDEO_CONFIGS = [
    {"name": "test-short", "width": 640, "height": 480, "duration": 2, "fps": 24},
    {"name": "test-hd", "width": 1280, "height": 720, "duration": 5, "fps": 30},
]


def command_exists(command):
    """Check if a command exists."""
    try:
        subprocess.run(
            ["which", command],
            check=True,
            capture_output=True,
            text=True,
        )
        return True
    except subprocess.CalledProcessError:
        return False


def generate_with_pillow():
    """Generate test images using Pillow."""
    try:
        from PIL import Image

        print("🎨 Generating test images with Pillow...\n")
        generated = 0
        formats = ["JPEG", "PNG", "WEBP"]
        extensions = ["jpg", "png", "webp"]

        for config in IMAGE_CONFIGS:
            for fmt, ext in zip(formats, extensions):
                filename = f"{config['name']}.{ext}"
                filepath = IMAGES_DIR / filename

                try:
                    # Create solid color image
                    img = Image.new("RGB", (config["width"], config["height"]), config["color"])
                    
                    # Save with appropriate format
                    if ext == "jpg":
                        img.save(filepath, "JPEG", quality=95)
                    elif ext == "png":
                        img.save(filepath, "PNG")
                    elif ext == "webp":
                        img.save(filepath, "WEBP", quality=95)

                    size_kb = filepath.stat().st_size / 1024
                    print(f"  ✓ {filename} ({size_kb:.2f} KB)")
                    generated += 1
                except Exception as e:
                    print(f"  ✗ {filename} (failed: {e})")

        return generated
    except ImportError:
        print("  ⚠ Pillow not installed.")
        print("  Install: pip install Pillow")
        return 0


def generate_with_ffmpeg_images():
    """Generate test images using FFmpeg as fallback."""
    if not command_exists("ffmpeg"):
        return 0

    print("\n🎨 Generating test images with FFmpeg...\n")
    generated = 0
    colors = ["red", "blue", "green", "yellow", "purple", "orange"]
    extensions = ["jpg", "png", "webp"]

    for i, config in enumerate(IMAGE_CONFIGS):
        color = colors[i % len(colors)]
        for ext in extensions:
            filename = f"{config['name']}.{ext}"
            filepath = IMAGES_DIR / filename

            try:
                cmd = [
                    "ffmpeg",
                    "-y",
                    "-f",
                    "lavfi",
                    "-i",
                    f"color=c={color}:s={config['width']}x{config['height']}:d=1",
                    "-frames:v",
                    "1",
                    str(filepath),
                ]
                subprocess.run(cmd, check=True, capture_output=True)

                size_kb = filepath.stat().st_size / 1024
                print(f"  ✓ {filename} ({size_kb:.2f} KB)")
                generated += 1
            except subprocess.CalledProcessError:
                print(f"  ✗ {filename} (failed)")

    return generated


def generate_videos():
    """Generate test videos using FFmpeg."""
    if not command_exists("ffmpeg"):
        print("\n🎬 Generating test videos...")
        print("  ⚠ FFmpeg not found. Skipping video generation.")
        print("  Install FFmpeg: brew install ffmpeg (macOS)")
        return 0

    print("\n🎬 Generating test videos...\n")
    generated = 0

    for config in VIDEO_CONFIGS:
        filename = f"{config['name']}.mp4"
        filepath = VIDEOS_DIR / filename

        try:
            cmd = [
                "ffmpeg",
                "-y",
                "-f",
                "lavfi",
                "-i",
                f"testsrc=size={config['width']}x{config['height']}:rate={config['fps']}:duration={config['duration']}",
                "-c:v",
                "libx264",
                "-preset",
                "ultrafast",
                "-pix_fmt",
                "yuv420p",
                str(filepath),
            ]
            subprocess.run(cmd, check=True, capture_output=True)

            size_kb = filepath.stat().st_size / 1024
            print(f"  ✓ {filename} ({size_kb:.2f} KB)")
            generated += 1
        except subprocess.CalledProcessError:
            print(f"  ✗ {filename} (failed)")

    return generated


def main():
    """Main execution."""
    print("🚀 Test Asset Generator\n")
    print("━" * 50)

    # Ensure output directories exist
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

    # Try Pillow first, then FFmpeg
    image_count = generate_with_pillow()
    if image_count == 0:
        image_count = generate_with_ffmpeg_images()

    video_count = generate_videos()

    print("\n" + "━" * 50)
    print("\n✅ Asset generation complete!")
    print(f"   📸 Images generated: {image_count}")
    print(f"   🎥 Videos generated: {video_count}")
    print(f"\n📁 Images: {IMAGES_DIR}")
    print(f"📁 Videos: {VIDEOS_DIR}")


if __name__ == "__main__":
    main()
