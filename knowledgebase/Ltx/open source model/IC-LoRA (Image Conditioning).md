***

## title: IC-LoRA (Image Conditioning)

# IC-LoRA

IC-LoRA (In-Context LoRA) enables precise video-to-video control in LTX-2 by conditioning generation on reference signals like depth maps, pose skeletons, or edge detections. Unlike standard [LoRAs](/open-source-model/usage-guides/lo-ra) that modify style or effects, IC-LoRAs let you dictate the spatial structure and motion of your output with frame-level precision.

This enables workflows where you can animate depth maps into videos, retarget character motion using pose sequences, or generate videos following precise edge-based compositions.

## IC-LoRA Video Walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/NPjTpDmTdaw" title="LTX-2 IC-LoRA tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />

## Comparison: IC-LoRA vs LoRA

| Feature           | LoRA                                 | IC-LoRA                                  |
| ----------------- | ------------------------------------ | ---------------------------------------- |
| **Purpose**       | Style, effects, visual modifications | Structural control, motion guidance      |
| **Input**         | Text prompt only                     | Text prompt + control signal             |
| **Strength**      | 0.5-1.5 adjustable                   | 0-1.0 adjustable (global + spatial mask) |
| **Control**       | Global style influence               | Frame-level spatial control              |
| **Training Data** | Video datasets (single modality)     | Paired video + control signals           |
| **Use Case**      | "Make it look like cake"             | "Follow this depth map"                  |
| **Combining**     | Easily stack multiple                | Best used one control type at a time     |

**When to use which:**

* Need **style/effect**: Standard LoRA
* Need **structural control**: IC-LoRA
* Need **both**: Combine them (IC-LoRA 0.5-1.0 + effect LoRA 0.5-0.8)

## Available IC-LoRA Models

LTX-2 provides several official IC-LoRA control adapters, each trained for specific control types.

### Union IC-LoRA

Union Control is a single IC-LoRA that handles multiple control types (depth, canny, pose) in one checkpoint, instead of requiring separate IC-LoRA models for each.

**Model:** [LTX-2.3-20b-IC-LoRA-Union-Control](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control)

**Use Cases:**

* Apply depth, canny, and pose control from a single model without swapping IC-LoRA checkpoints between runs
* Simplify ComfyUI workflows by replacing three separate IC-LoRA models with one unified control adapter
* Reduce VRAM footprint when working with multiple control types by keeping a single IC-LoRA in memory

### Motion Control IC-LoRA

Guides object motion using sparse spline-based trajectories rendered as trails of circles. Supports single or multiple simultaneous motion paths for directing object movement within a scene.

**Model:** [LTX-2.3-20b-IC-LoRA-Motion-Track-Control](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Motion-Track-Control)

**Use Cases:**

* Direct object paths in product showcases, character scenes, or nature shots by drawing spline trajectories
* Create intentional, controlled object motion that is more precise than description via text
* Guide multiple objects simultaneously along independent paths within a single generation

## Using IC-LoRAs in ComfyUI

ComfyUI provides the recommended workflow for IC-LoRA due to its visual node-based interface for styling a video.

**Setup:**

1. Install [ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo) custom nodes
2. Download IC-LoRA model from Hugging Face (choose ComfyUI-compatible `.safetensors`)
3. Place in `ComfyUI/models/loras/` directory
4. Load the [ic-lora workflow](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/example_workflows/2.3/)

**Key nodes:**

* **LTX IC-LoRA Loader Model Only:** Loads the IC-LoRA checkpoint and applies it to the model. Supports the new generation of latent downscale.
* **LTX Add Video IC-LoRA Guide Advanced:** Applies the control signal with configurable `attention_strength` and `attention_mask`
* **LTX Draw Tracks:** Draws spline-based motion trajectories visually for use with the Motion Control IC-LoRA
* **LTX Sparse Track Editor:** Converts sparse keypoint positions into interpolated per-frame coordinate paths
* **LTX Sampler:** Generates video following the control signal
* **Text Encoder:** Provides prompt conditioning

**Example workflow steps:**

1. Load depth map or pose skeleton video
2. Apply IC-LoRA with strength 1.0 (control details [here](#control-strength))
3. Provide a descriptive text prompt
4. Generate video with standard LTX parameters

## Preparing Control Signals

The quality of your controls directly impacts IC-LoRA results. Here's how to prepare each type:

### Depth Maps

**Tools:**

* [Depthcrafter](https://depthcrafter.github.io/)
* Blender/3D software - For synthetic depth renders

**Best practices:**

* Use consistent depth range across all frames
* Ensure smooth temporal transitions (avoid flickering)
* Match resolution to target generation resolution

### Pose Skeletons

**Tools:**

* [OpenPose](https://github.com/CMU-Perceptual-Computing-Lab/openpose) - Multi-person pose estimation
* [MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose.html) - Fast single-person pose
* [DWPose](https://github.com/IDEA-Research/DWPose) - High-quality pose estimation

**Best practices:**

* Extract poses at consistent frame rate matching target generation
* Ensure pose keypoints are detected reliably across all frames
* Handle occlusions gracefully (interpolate missing keypoints)
* Use skeleton visualization format (lines connecting keypoints)

**Format:** Typically 17-18 keypoints for body skeleton rendered as visual overlay

### Canny Edges

**Tools:**

* OpenCV Canny edge detection
* PIL/Pillow image processing
* ComfyUI Canny preprocessor nodes

**Best practices:**

* Adjust threshold values to capture essential edges without noise
* Maintain consistent edge thickness across frames
* Blur input slightly before edge detection to reduce noise

### Sparse Track Conditioning

Used with the [Motion Control IC-LoRA](#motion-control-ic-lora). Instead of providing a per-frame visual signal (like depth or pose), you define motion by placing keypoints at specific frames. The system interpolates smooth spline trajectories between them, rendered as trails of circles that the IC-LoRA follows.

**Tools:**

* LTX Draw Tracks node (ComfyUI) — visual canvas for drawing motion paths
* LTX Sparse Track Editor node (ComfyUI) — fine-tune keypoint positions and timing

**Best practices:**

* Start with 3-4 keypoints per track; add more only if the interpolated path doesn't match your intent
* Keep trajectories physically plausible — sudden direction changes produce less natural results
* Match the track canvas resolution to your generation resolution

## IC-LoRA Parameters

### Control Strength

LTX-2.3 introduces full strength control for IC-LoRAs through two complementary parameters:

**`attention_strength`** — Global strength scalar (0.0 to 1.0)

Controls overall IC-LoRA influence on generation. This works by scaling the cross-attention scores between the conditioning signal tokens and the noisy latents.

* `1.0` — Full adherence to the control signal (default, matches previous behavior)
* `0.5` — Balanced blend of control signal and free generation
* `0.0` — Control signal is completely ignored

**`attention_mask`** — Spatial or spatiotemporal mask (optional)

An optional mask that provides region-level control over where the IC-LoRA takes effect. The mask is multiplied by `attention_strength` to produce the final per-region strength.

* **Spatial mask (H×W):** Apply control to specific areas of each frame (e.g., apply depth control only to the foreground)
* **Spatiotemporal mask (T×H×W):** Vary control across both space and time (e.g., gradually introduce pose control over the first 2 seconds)
* Values range from 0.0 (no control) to 1.0 (full control)
* When omitted, uniform full strength is applied everywhere

**How it works under the hood:**

The strength control operates at the attention layer level. During cross-attention between the noisy video latents and the IC-LoRA conditioning tokens, the attention scores are scaled by `attention_strength × attention_mask`. This means the control signal's influence can be precisely dialed in globally, regionally, or both.

**Practical examples:**

* **Soft depth guidance:** Set `attention_strength` to 0.6 for depth IC-LoRA to get approximate spatial structure while allowing the model more creative freedom
* **Foreground-only pose control:** Use a spatial `attention_mask` that's 1.0 on the character region and 0.0 on the background
* **Gradual control fade-in:** Use a spatiotemporal mask that ramps from 0.0 to 1.0 over the first 8 frames
* **Multi-region control:** Combine with spatial masks to apply different IC-LoRA strengths to different parts of the frame

### Resolution and Frame Rate

* Match control signal resolution to generation resolution
* Control FPS should match target generation FPS
* For best results: 704x1216 at 24-30 FPS
* IC-LoRAs work at various resolutions but quality depends on control signal clarity

## Training Custom IC-LoRAs

Create your own IC-LoRA control adapters using the [LTX-Video-Trainer](https://github.com/Lightricks/LTX-2/tree/main/packages/ltx-trainer).

## Best Practices

### Control Signal Quality

* Use high-quality control extraction tools
* Ensure temporal consistency (smooth transitions between frames)
* Match control resolution to generation resolution
* Pre-process control signals to remove noise and artifacts

### Prompt Alignment

* Describe visual style, not control type ("ornate architecture" not "depth map shows...")
* Align prompt with control signal motion and composition
* Be specific about materials, lighting, and atmosphere
* Avoid contradicting the control structure

### Performance Optimization

* IC-LoRAs add minimal overhead (less than 10% compute)
* Works with FP8 quantized models
* Compatible with distilled models for faster generation
* Use Video Detailer IC-LoRA for efficient upscaling

### Quality Validation

* Always test IC-LoRA with simple control signals first
* Verify control is being respected before complex generations
* Compare with and without IC-LoRA to assess control strength
* Iterate on control signal quality before increasing generation complexity

## IC-LoRA Troubleshooting

### Control Signal Not Being Followed

**Symptoms:** Generated video ignores control structure

**Solutions:**

* Verify IC-LoRA is loaded correctly (check adapter name)
* Check `attention_strength` value — if set below 1.0, control will be proportionally weaker
* If using `attention_mask`, verify it covers the intended regions (mask values of 0.0 will disable control in those areas)
* Check control signal format matches expected input (resolution, channels)
* Validate control signal has sufficient contrast/detail
* Verify model compatibility (IC-LoRA version matches base model)

### Temporal Flickering or Inconsistency

**Symptoms:** Unstable motion, frame-to-frame inconsistencies

**Solutions:**

* Smooth control signal temporal transitions (use interpolation)
* Increase inference steps (try 40-50 instead of 30)
* Ensure control signal FPS matches generation FPS
* Apply temporal filtering to control signal before generation
* Check for abrupt changes in control signal values

### Poor Quality or Artifacts

**Symptoms:** Visual artifacts, degraded quality, unwanted textures

**Solutions:**

* Improve control signal quality (better extraction tools)
* Ensure control signal resolution is adequate
* Adjust prompt to better describe desired style
* Try Video Detailer IC-LoRA for quality enhancement
* Check that control signal doesn't have noise or compression artifacts

### Control Too Strong or Rigid

**Symptoms:** Output looks constrained, lacks natural variation

**Solutions:**

* Reduce `attention_strength` to 0.5-0.8 for a softer control effect
* Use a spatial `attention_mask` to limit control to specific regions
* Adjust your control signal to be less restrictive (e.g., lighter edges)
* Use more flexible prompts that allow style variation
* Consider if standard LoRA might be better for your use case

### Memory Issues

**Symptoms:** Out of memory errors during generation

**Solutions:**

* Use FP8 quantized models to reduce VRAM
* Reduce generation resolution
* Process control signals in smaller batches

## Resources

### Official Models

Official LTX IC-LoRAs can be found on HuggingFace

[LTX-2.3 IC-LoRAs](https://huggingface.co/collections/Lightricks/ltx-23)

[LTX-2 IC-LoRAs](https://huggingface.co/collections/Lightricks/ltx-2)

### Training Resources

* [LTX-Video-Trainer](https://github.com/Lightricks/LTX-2/tree/main/packages/ltx-trainer)
