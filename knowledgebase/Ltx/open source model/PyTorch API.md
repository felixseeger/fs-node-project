***

## title: PyTorch API

For developers who want direct Python integration or custom workflows beyond ComfyUI, LTX-2 offers two paths: the native `ltx-pipelines` package (full control, all features) and the HuggingFace Diffusers integration (familiar API, quick start).

## Repository Structure

The [LTX-2 codebase](https://github.com/Lightricks/LTX-2) is a monorepo with three packages:

| Package           | Purpose                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| **ltx-core**      | Model architecture, schedulers, guiders, noisers, and patchifiers                                         |
| **ltx-pipelines** | High-level inference pipelines for text-to-video, image-to-video, and IC-LoRA workflows                   |
| **ltx-trainer**   | LoRA, IC-LoRA, and full fine-tuning (see [Trainer docs](/open-source-model/ltx-2-trainer/ltx-2-training)) |

## Requirements

* Python >= 3.10
* CUDA > 12.7
* PyTorch \~= 2.7

See [System Requirements](/open-source-model/getting-started/system-requirements) for full hardware specifications.

## Installation

```bash
# Clone the repository
git clone https://github.com/Lightricks/LTX-2.git
cd LTX-2

# Set up the environment
uv sync --frozen
source .venv/bin/activate
```

## Download Models

```bash
# Download the distilled model (recommended for speed)
huggingface-cli download Lightricks/LTX-2.3 \
  --include "ltx-2.3-22b-distilled.safetensors" \
  --local-dir models/

# Download the full model (higher quality, slower generation)
huggingface-cli download Lightricks/LTX-2.3 \
  --include "ltx-2.3-22b-dev.safetensors" \
  --local-dir models/

# FP8 variant (smaller download, requires less VRAM)
huggingface-cli download Lightricks/LTX-2.3-fp8 \
  --include "ltx-2.3-22b-dev-fp8.safetensors" \
  --local-dir models/

```

A full list of available checkpoints (including spatial/temporal upscalers, distilled LoRA, IC-LoRA variants, and camera control LoRAs) is on the [LTX-2 GitHub repo](https://github.com/Lightricks/LTX-2#required-models).

***

## Option 1: Native Pipelines (ltx-pipelines)

The `ltx-pipelines` package provides the most complete feature set, including two-stage generation, IC-LoRA, and fine-grained guidance control.

### Available Pipelines

| Pipeline                        | Use Case                                                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `TI2VidTwoStagesPipeline`       | Text-to-video and image-to-video with two-stage upscaling. Best for high-quality production use.                                   |
| `TI2VidTwoStagesRes2sPipeline`  | Two-stage with res\_2s second-order sampler. Different quality/speed tradeoffs, fewer steps required.                              |
| `TI2VidOneStagePipeline`        | Single-stage text/image-to-video for quick prototyping without upscaling.                                                          |
| `DistilledPipeline`             | Fast two-stage generation using the distilled checkpoint. Best for speed and batch processing.                                     |
| `ICLoraPipeline`                | Video-to-video with IC-LoRA control signals (depth, pose, canny edges). Uses the distilled model. Best for guided transformations. |
| `A2VidPipelineTwoStage`         | Audio-to-video generation conditioned on input audio.                                                                              |
| `RetakePipeline`                | Regenerate specific time regions of existing video without starting over.                                                          |
| `KeyframeInterpolationPipeline` | Interpolate between keyframe images to generate smooth transitions.                                                                |

### Text-to-Video Example

This example generates a video using the distilled pipeline with a two-stage approach — base generation followed by upscale refinement.

```python
import torch
from ltx_pipelines.distilled_pipeline import DistilledPipeline

# Initialize
pipeline = DistilledPipeline.from_config("path/to/config.yaml")

# Generate
output = pipeline(
    prompt="A golden retriever running through a sunlit meadow, "
           "wildflowers swaying in a gentle breeze. "
           "Camera follows at ground level, tracking the dog. "
           "Warm afternoon light with soft bokeh in the background. "
           "Sound of panting, rustling grass, distant birdsong.",
    width=768,
    height=512,
    num_frames=97,
    fps=24.0,
    seed=42,
)
```

<Note>
  **Dimension constraints:** Width and height must be divisible by 32. Frame
  count must follow the pattern `8n + 1` (valid values: 1, 9, 17, 25, 33, 41,
  49, 57, 65, 73, 81, 89, 97, 121, etc.).
</Note>

### Guidance Parameters

The native pipelines expose `MultiModalGuiderParams` for fine-grained control over generation:

| Parameter        | Range       | Description                                                                               |
| ---------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `cfg_scale`      | 2.0–5.0     | Classifier-Free Guidance. Higher values increase prompt adherence. Set to 1.0 to disable. |
| `stg_scale`      | 0.5–1.5     | Spatio-Temporal Guidance for temporal coherence. Set to 0.0 to disable.                   |
| `stg_blocks`     | e.g. `[29]` | Transformer blocks to perturb for STG. Set to `[]` to disable.                            |
| `rescale_scale`  | \~0.7       | Rescales guided prediction to prevent over-saturation.                                    |
| `modality_scale` | 1.0–3.0     | Audio-visual sync strength. Set > 1.0 when generating with audio.                         |

### Memory Optimization

For consumer GPUs, enable FP8 quantization to reduce VRAM usage by \~40% with minimal quality loss:

```python
from ltx_core.quantization.policy import QuantizationPolicy

# FP8 Cast — broad GPU compatibility
pipeline = DistilledPipeline.from_config(
    "path/to/config.yaml",
    quantization=QuantizationPolicy.fp8_cast(),
)

# FP8 Scaled MM — optimized for Hopper GPUs (H100)
# Requires: uv sync --frozen --extra fp8-trtllm
pipeline = DistilledPipeline.from_config(
    "path/to/config.yaml",
    quantization=QuantizationPolicy.fp8_scaled_mm(),
)
```

From the command line:

```bash
# FP8 Cast (works on most GPUs)
python run_pipeline.py --quantization fp8-cast

# FP8 Scaled MM (Hopper GPUs only, uses TensorRT-LLM)
python run_pipeline.py --quantization fp8-scaled-mm
```

**Additional tip:** Set the environment variable `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True` to improve memory allocation.

***

## Option 2: HuggingFace Diffusers

If you're already working within the Diffusers ecosystem, LTX-2 is available as a native pipeline:

```python
import torch
from diffusers import LTX2Pipeline

pipeline = LTX2Pipeline.from_pretrained(
    "Lightricks/LTX-2",
    torch_dtype=torch.bfloat16,
)
pipeline.to("cuda")

# Generate
result = pipeline(
    prompt="A golden retriever running through a sunlit meadow, "
           "wildflowers swaying in a gentle breeze.",
    width=768,
    height=512,
    num_frames=97,
)
```

<Note>
  The Diffusers integration provides a simpler interface but may not expose all
  features available in the native `ltx-pipelines` package (e.g., IC-LoRA,
  advanced guidance parameters). For full feature access, use the native
  pipelines.
</Note>

For more on the Diffusers integration, see the [HuggingFace documentation](https://huggingface.co/docs/diffusers/main/en/api/pipelines/ltx2).

***

## Generation Parameters Reference

### Resolution

Standard aspect ratios:

| Resolution | Aspect Ratio  | Notes                       |
| ---------- | ------------- | --------------------------- |
| 768×512    | 3:2 landscape | Good default for wide shots |
| 512×768    | 2:3 portrait  | Vertical/mobile content     |
| 704×512    | 4:3 standard  | Classic frame               |
| 512×704    | 3:4 vertical  |                             |
| 640×640    | 1:1 square    | Social media                |

Higher resolutions are supported (up to 4K) but require significantly more VRAM. Start with lower resolutions for testing.

### Frame Count & Duration

| Frames | Duration (24fps) | Duration (25fps) |
| ------ | ---------------- | ---------------- |
| 65     | \~2.7s           | \~2.6s           |
| 97     | \~4.0s           | \~3.9s           |
| 121    | \~5.0s           | \~4.8s           |
| 161    | \~6.7s           | \~6.4s           |
| 257    | \~10.7s          | \~10.3s          |

### Sampling

| Parameter   | Distilled Model | Full Model |
| ----------- | --------------- | ---------- |
| Steps       | 4–8             | 20–50      |
| CFG Scale   | 1.0             | 2.0–5.0    |
| Recommended | 3.0–3.5         | 3.0–3.5    |

## What's Next

* [Prompting Guide](/open-source-model/usage-guides/prompting-guide) — write prompts that produce coherent motion and audio
* [LoRA Guide](/open-source-model/usage-guides/lo-ra) — customize style, motion, and character appearance
* [IC-LoRA Guide](/open-source-model/usage-guides/ic-lo-ra) — video-to-video with depth, pose, and edge control
* [Trainer Documentation](/open-source-model/ltx-2-trainer/ltx-2-training) — train your own LoRAs
