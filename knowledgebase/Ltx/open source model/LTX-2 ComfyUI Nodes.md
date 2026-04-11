***

title: LTX-2 ComfyUI Nodes
description: >-
ComfyUI nodes for enhanced LTX-2 workflows, including guidance, text encoding,
and IC-LoRA strength control
----------------------------

This page documents ComfyUI nodes released for LTX-2. These nodes address specific workflow pain points: prompt iteration speed, quality stability, advanced guidance control, and IC-LoRA strength tuning. All nodes are designed to be optional drop-ins that enhance existing workflows without requiring complete restructuring.

## Overview

**Gemma Text Encoding:**

* **GemmaAPITextEncode** - Free API-based text encoder that replaces the local Gemma and allows for reduced VRAM usage and faster runtimes
* **LTXVSaveConditioning** - Save text encodings to disk for reuse
* **LTXVLoadConditioning** - Load pre-saved text encodings

**Advanced Guidance:**

* **MultimodalGuider** - Independent control over audio and video guidance parameters
* **LTX Add Video IC-LoRA Guide Advanced** - Granular IC-LoRA strength control with global scaling and spatial masking

**Quality Enhancement:**

* **LTXVNormalizingSampler** - Latent normalization to prevent overbaking and audio clipping

***

## Gemma Text Encoding Nodes

### GemmaAPITextEncode

Location: [`gemma_api_conditioning.py`](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/gemma_api_conditioning.py)

**What it does**

Encodes text prompts using Lightricks' free API endpoint, bypassing the need to load Gemma locally. This eliminates all local VRAM usage for text encoding and enables sub-second prompt encoding.

**Why use it**

Gemma's large memory footprint (requires loading/unloading from VRAM) can create a bottleneck on consumer hardware, particualry during prompt iteration. Every time you change a prompt, Gemma must be reloaded, adding significant time to the workflow. This node solves that problem by offloading text encoding to a free API endpoint.

**When to use**

Use this node when:

* Working on consumer GPUs with limited VRAM
* Multiple generations use different prompts

**Parameters**

* `api_key` - Your LTX API key
* `prompt` - The text prompt to encode
* `ckpt_name` - The LTX-2 checkpoint file (used to extract model ID for encoding compatibility)

**Returns**

* `conditioning` - Encoded prompt conditioning ready for LTX-2 generation

**Getting an API key**

1. Visit [console.ltx.video](https://console.ltx.video)
2. Sign up or log in
3. Generate a free API key
4. Copy the key into the node's `api_key` parameter

**Example workflow**

With API:

```
Encode via API → Generate → Change Prompt → Encode via API → Generate
```

Without API:

```
Load Gemma → Encode Prompt → Generate → Change Prompt → Reload Gemma → Encode → Generate
```

***

### LTXVSaveConditioning

Location: [`conditioning_saver.py`](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/conditioning_saver.py)

**What it does**

Saves computed text conditioning to disk as a .safetensors file, allowing you to reuse the exact same conditioning across multiple workflow sessions without re-encoding.

**Why use it**

Useful when:

* You have a prompt that works well and want to preserve its exact encoding
* Running batch generations with identical conditioning
* Building reusable workflow templates with pre-encoded prompts
* Working offline without API access

**When to use**

Use this node when:

* You want to lock in a specific prompt's encoding
* Multiple workflow sessions will use the same conditioning
* You need reproducible conditioning across different machines
* Building libraries of validated prompts

**Parameters**

* `conditioning` - The conditioning to save (from any text encoder or the API node)
* `filename` - Base filename (without extension)
* `dtype` - Precision for storage: "bfloat16" or "float16"

**Returns**

* UI notification showing saved filename and file size

**Output location**

Files are saved to: `ComfyUI/models/embeddings/`

**Storage**

Files are stored as .safetensors using the selected numerical precision:

* bfloat16: Higher precision, more commonly used
* float16: Alternative representation, minimal practical difference

***

### LTXVLoadConditioning

Location: [`conditioning_loader.py`](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/conditioning_loader.py)

**What it does**

Loads previously saved conditioning from disk, bypassing text encoding entirely.

**Why use it**

Works in tandem with LTXVSaveConditioning to enable instant conditioning loading. Perfect for workflows that reuse the same prompts or when you need guaranteed consistency.

**When to use**

Use this node when:

* Reusing conditioning saved in previous sessions
* Running batch workflows with preset prompts
* Working offline without API access
* You need bit-perfect conditioning reproducibility

**Parameters**

* `file_name` - The .safetensors file to load (from the embeddings folder)
* `device` - Where to load the conditioning: "cpu" or "gpu"

**Returns**

* `conditioning` - Loaded conditioning ready for generation

**Device selection**

* **cpu**: Loads to system RAM (slower but works on any system)
* **gpu**: Loads directly to VRAM if available (faster for generation)

**Workflow integration**

Pair with LTXVSaveConditioning to create prompt libraries:

1. Create and refine prompts with text encoder or API
2. Save successful conditioning with LTXVSaveConditioning
3. Load instantly in future sessions with LTXVLoadConditioning

***

## Advanced Model Guidance

### MultimodalGuider

Location: [`multimodal_guider.py`](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/guiders/multimodal_guider.py)

**What it does**

Provides independent, per-modality control over guidance parameters for audio and video. This is an extension of Classifier-Free Guidance (CFG) that allows you to separately control prompt adherence, artifact reduction, and cross-modal synchronization for each modality.

**Why use it**

Standard guidance treats audio and video as a single unit. When you increase guidance to improve video quality, it affects audio synchronization. When you fix synchronization, your visual style can break. The MultimodalGuider decouples these controls, letting you tune video guidance independently from audio guidance without trade-offs.

**When to use**

Use this node when:

* You need different guidance strengths for audio vs video
* Video quality needs to be prioritized over tight audio sync (or vice versa)
* You want to prevent the common issue where fixing synchronization breaks visual style
* You need fine-grained control over cross-modal attention

**How it works**

The guider can make up to four separate model inference calls per step:

1. **Positive conditioning** - Your prompt
2. **Negative conditioning** - Your negative prompt (for CFG)
3. **Perturbed conditioning** - Degraded version (for STG artifact reduction)
4. **Modality-isolated conditioning** - Each modality without cross-attention (for sync control)

By combining these strategically, you get independent control over:

* CFG strength per modality (prompt adherence)
* STG strength per modality (artifact reduction)
* Cross-modal attention strength (synchronization tightness)
* Step skipping per modality (performance optimization)

**Parameters**

* `model` - The LTX-2 model to apply guidance to
* `positive` - Positive conditioning
* `negative` - Negative conditioning
* `parameters` - A GUIDER\_PARAMETERS object containing per-modality settings
* `skip_blocks` - Comma-separated list of transformer blocks to skip for STG

**GUIDER\_PARAMETERS structure**

The parameters object exposes three independent guidance controls, each configurable per modality (audio and video separately):

**1. CFG Guidance (cfg > 1)**

Controls prompt adherence and semantic accuracy. Pushes the model toward the positive prompt and away from the negative prompt.

* **When to increase:** When visual style or object fidelity matters most
* **Effect:** Stronger prompt following, more accurate semantic content
* **Configurable per modality:** Yes

**2. Spatio-Temporal Guidance (stg > 0)**

Reduces artifacts by pushing the model away from a degraded, perturbed version of itself. Prevents breakup of rigid objects. Based on the [STG technique](https://arxiv.org/abs/2411.18664).

* **When to increase:** If you see structural artifacts or object breakup
* **Effect:** Fewer visual artifacts, more stable structures
* **Configurable per modality:** Yes

**3. Cross-Modal Guidance (modality\_scale > 1)**

Controls synchronization between audio and video. Pushes the model away from versions where modalities ignore each other.

* **When to adjust:** To balance synchronization versus natural motion
* **Higher values:** Tighter alignment (perfect for lip-sync or rhythmic action)
* **Lower values:** Looser, more natural coupling
* **Configurable per modality:** Yes

**Additional Per-Modality Parameters**

* **`skip_step`** - Periodically skip diffusion steps for this modality
  * `0`: No skipping
  * `1`: Skip every other step
  * `2`: Skip two out of every three steps
  * Use for performance optimization

* **`rescale`** - Normalization after applying CFG, STG, and cross-modal guidance
  * `0`: No normalization
  * `1`: Full renormalization to match the norm of the positive-prompt prediction
  * `0-1`: Partial normalization
  * Especially helpful for preventing oversaturation when using high CFG or STG values

* **`perturb_attn`** - Boolean controlling whether the perturbed model is perturbed for this modality during STG. Normally set to `True`.

* **`cross_attn`** - Boolean controlling whether cross-attention layers from this modality to the other modality are active. Normally set to `True`.

**Returns**

* `guider` - Configured guider ready for sampling

**Use cases**

**Use Case 1: Prioritize video quality, loose audio sync**

* Video: High CFG, moderate STG, low modality scale
* Audio: Low CFG, low STG, low modality scale
* Result: Beautiful video, audio follows general mood but not frame-locked

**Use Case 2: Tight lip-sync for dialogue**

* Video: Moderate CFG, moderate STG, high modality scale
* Audio: Moderate CFG, low STG, high modality scale
* Result: Audio and video tightly synchronized, good for speaking

**Use Case 3: Performance optimization**

* Video: Process every step
* Audio: Skip every other step (skip\_step = 1)
* Result: 2x faster generation with minimal audio quality impact

**Integration with other nodes**

* Works with all LTX-2 sampler nodes
* Can be combined with latent normalization for additional quality control
* Essential for looping sampler workflows

***

### LTX Add Video IC-LoRA Guide Advanced

**What it does**

Applies an IC-LoRA control adapter with granular strength control, replacing the fixed 1.0 strength behavior of the standard IC-LoRA node. Allows global strength adjustment and optional spatial/spatiotemporal masking.

**Why use it**

The standard IC-LoRA workflow applies control at full strength everywhere, which can over-constrain generation. This node lets you dial in exactly how much influence the control signal has, and where.

**When to use**

Use this node when:

* You want softer, less rigid IC-LoRA control
* You need IC-LoRA to apply only to specific regions of the frame
* You want to blend IC-LoRA control with free generation
* You're combining multiple control types and need to balance their influence

**Parameters**

* `attention_strength` (float, 0.0-1.0) — Global scaling factor for IC-LoRA cross-attention scores. Default: 1.0
* `attention_mask` (MASK, optional) — Spatial (H×W) or spatiotemporal (T×H×W) mask multiplied with attention\_strength

**Returns**

* Model with IC-LoRA applied at the specified strength/mask configuration

***

## Quality Enhancement

### LTXVNormalizingSampler

Location: [`easy_samplers.py`](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/easy_samplers.py)

**What it does**

A specialized sampler that applies statistical normalization to latents during generation to prevent overbaking (oversaturation) and audio clipping issues.

**Why use it**

Without normalization, latent values can drift into problematic ranges during the denoising process. This causes:

* Oversaturated, "overbaked" visual outputs with crushed colors
* Audio clipping and distortion
* Inconsistent quality across different prompts or settings

The NormalizingSampler keeps latent statistics in optimal ranges throughout generation, dramatically improving output quality.

**When to use**

Use this node when:

* You see oversaturated, "overbaked" visual outputs
* Audio has clipping or distortion artifacts
* Output quality varies unpredictably between generations
* Using high guidance values that tend to cause oversaturation

**How it works**

The sampler monitors latent statistics during the denoising process and applies normalization to keep values within target ranges. This is done using percentile-based statistics (excluding extreme outliers) to prevent both overbaking and excessive normalization.

**Key benefits**

* Prevents oversaturated, "overbaked" visual outputs
* Eliminates audio clipping artifacts
* More consistent quality across generations
* Works automatically - no manual tuning required
* Especially effective with high guidance values

**Integration**

This is a drop-in replacement for standard samplers in LTX-2 workflows. It maintains full compatibility with:

* All guider nodes (including MultimodalGuider)
* Text and image conditioning
* LoRA and IC-LoRA workflows

**Performance impact**

Minimal - the normalization adds negligible computational overhead while significantly improving output quality.

***

## Installation & Usage

### Installation

All nodes are available in the [ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo) repository.

**Via ComfyUI Manager (Recommended):**

1. Open ComfyUI Manager
2. Search for "ComfyUI-LTXVideo"
3. Click **Update** (if already installed) or **Install**
4. Restart ComfyUI

**Manual Update:**

```bash
cd ComfyUI/custom_nodes/ComfyUI-LTXVideo
git pull origin master
pip install -r requirements.txt
```

After installation/update, restart ComfyUI. The new nodes will appear under the **"Lightricks"** category.

## Troubleshooting

### GemmaAPITextEncode

**"Invalid API key" error**

* Verify your API key is correct
* Regenerate a new key at console.ltx.video
* Ensure no extra spaces in the API key field

**"Model ID cannot be identified" error**

* Your checkpoint file may be missing metadata
* Ensure you're using an official LTX-2 model
* Ensure the ckpt\_name field in the node matches the filename of the model loaded in your Checkpoint Loader

**Timeout errors**

* Check your internet connection
* The API may be experiencing high load

### LTXVSaveConditioning / LTXVLoadConditioning

**File not found**

* Ensure .safetensors extension is not doubled
* Check that files are in `ComfyUI/models/embeddings/`
* Ensure you are not mixing up the `models/embeddings/` folder with `models/text_encoders/`

**Out of memory when loading**

* CPU / GPU memory management is key to avoiding OOM errors

### MultimodalGuider

**No quality improvement vs standard guider**

* Ensure you have connected two GuiderParameters nodes (one for audio, one for video)
* High values can break the generation. Suggested baseline for balanced speed and consistency is Modality: 1 and Skip Step: 1

**Generation is slower than expected**

* NOTE: This node uses CFG > 1, which inherently makes generation slower
* Use Skip Step: 1 for increased speed, reduce this value if artifacts appear

### LTXVNormalizingSampler

**Still seeing overbaking**

* This is a sampler, not a post-process — ensure you have swapped out the SamplerCustomAdvanced node
* Try combining with lower guidance values
* Consider if your prompt or conditioning is the root cause

**Quality seems worse**

* Use this node ONLY for the first sampling stage. Revert to a standard sampler for the second/upscale stage
* Do not use this sampler for inpainting, video extension, or any workflow using masks. It may break the context audio
* Ensure you are using the Distilled model with the standard 8-step manual sigma schedule. This node is NOT tuned for the full model
* Normalization helps most with problematic outputs (clipping/saturation). If your generation is already clean, this node may introduce unnecessary noise. Test side-by-side with the same seed
