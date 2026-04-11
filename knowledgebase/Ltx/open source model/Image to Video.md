***

## title: Image to Video

This guide will help you generate video from a single source image using LTX-2 in ComfyUI.

## When to Use

Image to Video workflows are ideal when you need to:

* **Animate a specific frame** - Bring a static image to life with motion
* **Maintain identity consistency** - Keep exact character appearance and framing
* **Control composition precisely** - Start from a known visual foundation

The LTX-2 workflow generates synchronized video and audio in a single pass.

<Note>
  For generation without a starting image, see the [Text-to-Video guide](/open-source-model/usage-guides/text-to-video).
</Note>

## Workflow Video Walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/d1tjLXsz8Wc" title="LTX-2 workflow walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />

### Before Starting

ComfyUI and the LTX-2 nodes need to be installed. See our [Installation guide](/open-source-model/integration-tools/comfy-ui) for full instructions.

You'll also need:

* **Source image** to add to the workflow
* **Sufficient VRAM** - At least 32GB recommended - more is better
* **Image-to-Video workflow** from the [LTX-2 repository](https://github.com/Lightricks/LTX-2)

## Step-by-Step Guide

### 1. Load the Workflow

1. Open ComfyUI
2. Load the Image-to-Video workflow JSON from the [LTX-2 repository](https://github.com/Lightricks/LTX-2)
3. The workflow will display as a node graph

### 2. Load Model Checkpoints

Locate the **LTXVCheckpointLoader** node and configure:

* **Model selection** - Choose between full or distilled checkpoint
  * **Distilled model** (default): Fast generation, optimized for iteration
  * **Full model**: Higher quality, slower generation (see [Full Model Variant](#full-model-variant))
* **VAE**: Automatically loaded with the checkpoint
* **Text encoder**: Gemma CLIP for processing prompts

### 3. Load Your Source Image

Find the **LoadImage** node:

* **Browse** to select your image file
* **Supported formats**: PNG, JPG, WebP
* **Recommended**: Use images that match your target aspect ratio

The image will be automatically resized to match your configured resolution.

### 4. Configure Parameters

Find the **LTXVImgToVideoConditioning** node and set:

#### Resolution

Choose from standard aspect ratios or specify custom dimensions:

* **1920×1080** (16:9 landscape) - Full HD
* **1080×1920** (9:16 portrait) - Vertical video
* **1280×720** (16:9) - HD, lower VRAM (\~720p)
* **768×512** (3:2) - Fast iteration
* **640×640** (1:1) - Square format

<Warning>
  Video dimensions must be divisible by 32. Higher resolutions require more VRAM. Start with lower resolutions for testing.
</Warning>

#### Frame Count

* **Maximum**: 257 frames (\~10 seconds at 25fps)
* **Recommended range**: 121-161 frames for balanced quality and memory usage
* **Shorter videos**: Use 65-97 frames for quick iterations

#### Frame Rate

* **24 fps** - Cinematic feel, film-like motion
* **25 fps** - Standard (default), works for most content
* **30 fps** - Smooth motion, better for fast action
* **48-60 fps** - High frame rate for very fast or dynamic motion

<Warning>
  The frame rate must match across all nodes in your workflow, including the upscaler and video decoder, or playback speed will be incorrect.
</Warning>

### 5. Write Your Prompt

Describe the motion, action, and audio you want to generate from your source image.

#### Strong Prompts Include

* **Motion description** - How the scene should move or change
  * Example: "Camera slowly zooms in while the character turns their head to look at the sunset"
* **Character actions** - What subjects in the frame should do
  * Example: "The woman smiles and waves, her hair gently blowing in the breeze"
* **Camera movement** - Shot type and camera motion
  * Example: "Steady tracking shot following the subject from the side"
* **Audio cues** - Dialogue, music, ambient sound effects
  * Example: "Soft acoustic guitar playing, distant ocean waves, seagulls calling"

See our [Prompting guide](/open-source-model/usage-guides/prompting-guide) for additional tips on writing good prompts.

### 6. Configure Sampling

Find the **KSampler** or **LTXVSampler** node:

#### Steps

* **Distilled model**: 8 steps (represented by 9 manual sigma values in workflow)
* **Full model**: 20-50 steps (higher quality)
* Start with lower values and increase if quality is insufficient

#### CFG (Classifier-Free Guidance)

* **Range**: 2.0-5.0
* **Lower values** (2.0-3.0): More creative, less prompt adherence
* **Higher values** (4.0-5.0): Stronger prompt adherence, less variation
* **Recommended**: 3.0-4.0 for balanced results

#### Sampler Type

* **euler**: Fast, good for testing
* **dpmpp\_2m**: Higher quality, slightly slower
* **Res-2-S**: Best for full model
* Experiment to find your preference

#### Seed

* **Fixed seed**: Reproducible results for iteration
* **Random seed**: Explore variations

### 7. Multi-Scale Generation

The workflow uses a two-stage approach for efficiency:

#### Stage 1: Base Generation

* Generates at half the target resolution (e.g., 1080p generates as 960×540 first)
* Fast iteration for testing prompts and parameters
* Establishes overall composition and motion

#### Stage 2: Upscale Pass

* Uses the **LTXVUpscale** node to double the resolution (2x)
* Refines details and enhances quality
* Frame rate must match Stage 1

This approach provides:

* Faster experimentation at lower resolution
* High-quality final output without generating everything at max resolution from the start
* Memory-efficient workflow

<Tip>
  For quick iterations: Connect the Save Video node to Stage 1 to preview low-resolution output. As long as Stage 1 and Stage 2 seeds are fixed, you can bypass the upscale stage until you're happy with the preview, then upscale to final resolution.
</Tip>

### 8. Sampling and Decoding

Image-to-Video uses LTX-2's unified audio-video architecture:

1. **Separate generation** - Audio and video latents are created independently
2. **Merge and sample** - Latents are combined for joint processing
3. **Split and re-merge** - Streams are separated, then recombined for coherent output
4. **Tiled decoding** - Minimizes memory usage during final decode

The workflow uses **LTXVDecoder** nodes:

#### Audio Decoder

* Processes audio latents separately
* Outputs synchronized audio stream
* Supports dialogue, music, and ambient sound

#### Video Decoder

* Uses tiled decoding to minimize VRAM usage
* Processes video latents in manageable chunks
* Maintains quality while reducing memory requirements

Both **distilled** and **full** model variants are supported.

### 9. Save Output

Configure the **Save Video** node:

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
