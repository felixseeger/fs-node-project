# Test Assets

Auto-generated test assets for the Node-Project.

## Directory Structure

```
test-assets/
├── images/          # Generated test images
│   ├── *.jpg        # JPEG test files
│   ├── *.png        # PNG test files
│   └── *.webp       # WebP test files
├── videos/          # Generated test videos
│   └── *.mp4        # MP4 test files
└── scripts/         # Generation scripts
    ├── generate-assets.py    # Python generator
    └── generate-assets.js    # Node.js generator
```

## Usage

### Python (Recommended)

```bash
# Install dependencies
pip3 install Pillow

# Generate all assets
python3 test-assets/scripts/generate-assets.py
```

### Node.js

```bash
# Requires ImageMagick or FFmpeg installed
node test-assets/scripts/generate-assets.js
```

### Manual Installation

**macOS:**
```bash
brew install imagemagick ffmpeg
pip3 install Pillow
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install imagemagick ffmpeg
pip3 install Pillow
```

## Test Image Sizes

- **Small**: 100x100px
- **Medium**: 640x480px
- **Large**: 1920x1080px
- **Square**: 500x500px
- **Wide**: 1280x720px
- **Portrait**: 720x1280px

## Test Video Configs

- **Short**: 640x480, 2 seconds, 24fps
- **HD**: 1280x720, 5 seconds, 30fps
