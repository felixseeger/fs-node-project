***

## title: Text-to-Video

Generate synchronized video and audio entirely from text prompts.

## What This Workflow Is For

Use Text-to-Video when you want:

* **Full creative freedom** to explore concepts from scratch
* **No fixed reference** - when there's no specific character or frame to anchor the scene
* **Narrative exploration** to test styles, moods, or story ideas

## Workflow Video Walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/d1tjLXsz8Wc" title="LTX-2 workflow walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />

### Before Starting

ComfyUI and the LTX-2 nodes need to be installed. See our [Installation guide](/open-source-model/integration-tools/comfy-ui) for full instructions.

## Step-by-Step Guide

### 1. Load the Workflow

1. Open ComfyUI
2. Load the Text-to-Video workflow JSON from the LTX-2 repository
3. The workflow will display as a node graph

### 2. Load Model Checkpoints

Locate the **LTXVCheckpointLoader** node and configure:

* **Model selection** - Choose between full or distilled checkpoint
  * **Full model**: Higher quality, slower generation
  * **Distilled model**: Faster generation, slightly reduced quality
* **VAE**: Automatically loaded with the checkpoint
* **Text encoder**: Gemma 3 encoder for processing prompts

### 3. Configure Parameters

Find the **LTXVImgToVideoConditioning** node (the same node is used for T2V) and set:

#### Resolution

Choose from standard aspect ratios:

* **768×512** (3:2 landscape)
* **512×768** (2:3 portrait)
* **704×512** (4:3 standard)
* **512×704** (3:4 vertical)
* **640×640** (1:1 square)

**Important**: Higher resolutions require more VRAM. Start with lower resolutions for testing.

#### Frame Count

* **Maximum**: 257 frames (\~10 seconds at 25fps)
* **Recommended range**: 121-161 frames for balanced quality and memory usage
* **Shorter videos**: Use 65-97 frames for quick iterations

#### Frame Rate

* **Standard**: 25 fps (default, works for most content)
* **Smooth motion**: 30 fps (better for fast action)
* **Cinematic**: 24 fps (film-like feel)

**Critical**: The frame rate must match across all nodes in your workflow, including the upscaler and video decoder.

### 4. Write Your Prompt

**Prompt quality matters** Without a starting image, the model relies entirely on your description.

#### Strong Prompts Include

* **Scene description** - Environment, lighting, time of day
  * Example: "A misty forest at dawn with rays of sunlight filtering through tall pine trees"
* **Character details** - Appearance, behavior, actions
  * Example: "A red fox with bright amber eyes carefully stepping through fallen leaves"
* **Camera motion** - Shot type, movement, angles
  * Example: "Slow dolly shot moving forward, low angle perspective"
* **Audio cues** - Dialogue, music, ambient sound effects
  * Example: "Gentle rustling of leaves, distant bird calls, soft wind"

**Longer, descriptive prompts consistently produce better motion, coherence, and audio alignment.**
See our [Prompting guide](/open-source-model/usage-guides/prompting-guide) for additional tips on writing good prompts.

### 5. Prompt Enhancement

Locate the **Prompt Enhancer** node:

* **Enabled by default**: Automatically expands and improves your prompt
* **Bypass option**: Disable when you need exact control over phrasing
* **Best for**: Shorter prompts that need more detail

The enhancer adds:

* Visual details and scene elements
* Motion descriptions and dynamics
* Audio cues and atmospheric details

### 6. Configure Sampling

Find the **KSampler** or **LTXVSampler** node:

#### Steps

* **Distilled model**: 4-8 steps (optimized for speed)
* **Full model**: 20-50 steps (higher quality)
* Start with lower values and increase if quality is insufficient

#### CFG (Classifier-Free Guidance)

* **Range**: 2.0-5.0
* **Lower values** (2.0-3.0): More creative, less prompt adherence
* **Higher values** (4.0-5.0): Stronger prompt adherence, less variation
* **Recommended**: 3.0-3.5 for balanced results

#### Sampler Type

* **euler**: Fast, good for testing
* **dpmpp\_2m**: Higher quality, slightly slower
* Experiment to find your preference

#### Seed

* **Fixed seed**: Reproducible results for iteration
* **Random seed**: Explore variations

### 7. Two-Stage Generation

The workflow uses a multi-scale approach:

#### Base Generation

* Generates at your specified resolution
* Fast iteration for testing prompts and parameters

#### Upscale Pass

* Increases resolution and refines details
* Uses the **LTXVUpscale** node
* **Scale factor**: Typically 2x
* **Frame rate**: Must match base generation

This approach provides:

* Faster experimentation at lower resolution
* High-quality final output without generating everything at max resolution from the start

### 8. Decoding

The workflow uses **LTXVDecoder** nodes:

#### Audio Decoder

* Processes audio latents separately
* Outputs synchronized audio stream
* Supports dialogue, music, and ambient sound

#### Video Decoder

* Uses tiled decoding to minimize VRAM usage
* Processes video latents in manageable chunks
* Maintains quality while reducing memory requirements

**Note**: Audio and video are generated separately, then merged during decoding for synchronized output.

### 9. Save Output

Configure the **SaveVideo** node:

* **Format**: MP4 (default), MOV, or WebM
* **Codec**: H.264 (compatibility) or H.265 (smaller files)
* **Audio**: Automatically embedded from audio decoder
* **Filename**: Use descriptive names for organization

## Advanced Techniques

## Full Model Variant

The full model workflow provides higher quality at the cost of longer generation time.

### Key Differences

* Uses the full LTX-2 checkpoint and specialized VAE
* **Stage 1:** 15-20 steps (up to 40 for experimentation)
* Uses LTXV Scheduler instead of manual sigmas
* Applies distilled LoRA in Stage 2 (recommended strength: 0.6)

### Using LoRAs

Add **LoRALoader** nodes to customize:

* **Style LoRAs**: Apply artistic styles or visual aesthetics
* **Motion LoRAs**: Enhance specific types of movement
* **Character LoRAs**: Maintain consistent character appearance

See the [LoRA guide](/open-source-model/usage-guides/lo-ra) for training and usage.
