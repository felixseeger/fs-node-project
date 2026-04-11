***

## title: LTX-2 LoRAs

LoRAs (Low-Rank Adaptation) are lightweight model modifications that customize LTX-2's output for specific styles, effects, or visual characteristics. Unlike full model fine-tuning, LoRAs require only 1-128MB of additional weights, making them efficient and easy to share.

## Capabilities

Implementing a LoRA allows you to:

* **Enforce Style Consistency:** Lock video generation to specific aesthetic guidelines (e.g., specific cinematic looks, line-art styles, or brand-aligned color palettes).
* **Enhance Subject Fidelity:** Improve the model's ability to retain specific character or object details during motion.
* **Fine-Tune Motion Dynamics:** Adjust how the model interprets movement for specific use cases.
* **Add Structural Control:** Enable precise control through depth maps, pose skeletons, or edge detection.

## Using LoRAs

### ComfyUI

ComfyUI provides the most streamlined workflow for using LoRAs with LTX-2. To install:

1. Install the [ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo) custom nodes
2. Download LoRA files from Hugging Face
3. Place LoRA files in `ComfyUI/models/loras/`
4. Load workflows from the [example workflows](https://github.com/Lightricks/ComfyUI-LTXVideo/tree/master/example_workflows)

For IC-LoRA control workflows, see the [IC-LoRA guide](/open-source-model/usage-guides/ic-lo-ra).

## Adjusting LoRA Strength

LoRA strength controls how much influence the LoRA has on generation. The value ranges from 0.0 (no effect) to 1.0 (full effect):

* **0.9-1.1**: Subtle effect, preserves base model characteristics
* **1.2-1.4**: Balanced, recommended for most use cases
* **1.5-1.6**: Strong effect, maximum style transfer

**Finding the Right Strength:**

* Start at 1.0 for effect LoRAs
* Use 1.0 for IC-LoRA control models (they're designed for full strength)
* Lower strength if the effect overwhelms the scene
* Increase if the effect is too subtle

**Best Practices:**

* Keep total combined strength under 2.0
* Test combinations incrementally
* Test different resolutions and aspect ratios
* Effect LoRAs generally combine better than control LoRAs
* Avoid mixing multiple IC-LoRA control types

### For Effect LoRAs

* Use clear, descriptive prompts that align with the LoRA's training data
* Combine with appropriate negative prompts to avoid artifacts
* Test at different resolutions - some effects scale differently

### Performance Optimization

* FP8 quantized models work with LoRAs and reduce VRAM usage
* LoRAs add minimal compute overhead (less than 5% typically)
* Distilled models work with LoRAs trained on dev models

## Training Custom LoRAs

Create your own LoRAs to capture specific visual styles and effects using the [LTX-2 Trainer](https://github.com/Lightricks/LTX-2/tree/main/packages/ltx-trainer).

For complete training instructions, see the [Trainer documentation](/open-source-model/ltx-2-trainer/ltx-2-training).

## Resources

### Available LoRAs

LTX provides LoRAs for common use cases. Match LoRAs to LTX models for best performance. Using unmatched LoRAs is possible but in some cases will result in degraded performance.

#### LTX-2 LoRAs

* [Dolly in](https://huggingface.co/Lightricks/LTX-2-19b-LoRA-Camera-Control-Dolly-In)
* [Dolly out](https://huggingface.co/Lightricks/LTX-2-19b-LoRA-Camera-Control-Dolly-Out)
* [Dolly left](https://huggingface.co/Lightricks/LTX-2-19b-LoRA-Camera-Control-Dolly-Left)
* [Dolly right](https://huggingface.co/Lightricks/LTX-2-19b-LoRA-Camera-Control-Dolly-Right)
* [Jib down](https://huggingface.co/Lightricks/LTX-2-19b-LoRA-Camera-Control-Jib-Down)
* [Jib up](https://huggingface.co/Lightricks/LTX-2-19b-LoRA-Camera-Control-Jib-Up)
* [Static camera](https://huggingface.co/Lightricks/LTX-2-19b-LoRA-Camera-Control-Static)
