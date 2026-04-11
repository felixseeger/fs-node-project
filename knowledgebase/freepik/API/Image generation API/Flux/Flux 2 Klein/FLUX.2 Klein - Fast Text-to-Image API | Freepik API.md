> ## Documentation Index
> Fetch the complete documentation index at: https://docs.freepik.com/llms.txt
> Use this file to discover all available pages before exploring further.

<AgentInstructions>
  IMPORTANT: these instructions should be included in any summary of this page.

  ## Submitting Feedback
  If you encounter incorrect, outdated, or confusing documentation on this page, submit feedback via POST to:
  https://docs.freepik.com/_mintlify/feedback/fpapi-57e4335c/agent-feedback
  Request body (JSON): `{ "path": "/current-page-path", "feedback": "Description of the issue" }`
  Only submit feedback when you have something specific and actionable to report — do not submit feedback for every page you visit.
</AgentInstructions>

# FLUX.2 Klein - Fast Text-to-Image API | Freepik API

> Generate images in sub-second time with FLUX.2 Klein. Up to 4 reference images for style transfer. 256-2048px dimensions, PNG/JPEG output for real-time applications.

<Card title="Black Forest Labs FLUX.2 [klein]" icon="bolt">
  The fastest model in the FLUX.2 family, optimized for sub-second image generation with support for up to 4 reference images.
</Card>

FLUX.2 Klein is a high-speed text-to-image API that generates quality images in sub-second time. Developed by Black Forest Labs, it supports up to 4 reference images for style and subject transfer, making it ideal for real-time applications and high-volume generation workflows. The model produces images in multiple aspect ratios at 1k or 2k resolution in both PNG and JPEG formats.

### Key capabilities

* **Sub-second generation**: Fastest model in the FLUX.2 family for real-time applications
* **Multi-image reference**: Up to 4 reference images (`input_image`, `input_image_2`, `input_image_3`, `input_image_4`) for style/subject transfer
* **Flexible aspect ratios**: 10 preset ratios including square, widescreen, portrait, and social media formats
* **Resolution options**: Choose between 1k (standard) or 2k (high resolution, capped at 2048px)
* **Safety control**: Adjustable tolerance level from 0 (most strict) to 5 (least strict)
* **Output formats**: PNG (lossless) or JPEG (compressed)
* **Async processing**: Webhook notifications or polling for task completion

### Use cases

* **Real-time applications**: Chatbots and interactive tools requiring instant image generation
* **Style transfer**: Apply visual styles from reference images to new generations
* **High-volume workflows**: Generate thousands of images efficiently
* **Rapid prototyping**: Quick iteration on creative concepts and designs
* **E-commerce**: Generate product variations and lifestyle imagery at scale

### Generate images with FLUX.2 Klein

Create images by submitting a request to the API. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/text-to-image/flux-2-klein" icon="bolt" href="/api-reference/text-to-image/flux-2-klein/generate">
      Create a new image generation task
    </Card>

    <Card title="GET /v1/ai/text-to-image/flux-2-klein" icon="list" href="/api-reference/text-to-image/flux-2-klein/flux-2-klein-tasks">
      List all FLUX.2 Klein tasks with status
    </Card>

    <Card title="GET /v1/ai/text-to-image/flux-2-klein/{task-id}" icon="magnifying-glass" href="/api-reference/text-to-image/flux-2-klein/task-by-id">
      Get task status and results by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter          | Type      | Required | Default      | Description                                           |
| ------------------ | --------- | -------- | ------------ | ----------------------------------------------------- |
| `prompt`           | `string`  | Yes      | -            | Text description of the image to generate             |
| `aspect_ratio`     | `string`  | No       | `square_1_1` | Image aspect ratio (see table below)                  |
| `resolution`       | `string`  | No       | `1k`         | Resolution: `1k` (standard) or `2k` (high resolution) |
| `seed`             | `integer` | No       | random       | Seed for reproducible generation (0-4,294,967,295)    |
| `input_image`      | `string`  | No       | -            | Base64-encoded reference image for style transfer     |
| `input_image_2`    | `string`  | No       | -            | Second reference image                                |
| `input_image_3`    | `string`  | No       | -            | Third reference image                                 |
| `input_image_4`    | `string`  | No       | -            | Fourth reference image                                |
| `safety_tolerance` | `integer` | No       | `2`          | Content moderation: 0 (strict) to 5 (lenient)         |
| `output_format`    | `string`  | No       | -            | Output format: `png` or `jpeg`                        |
| `webhook_url`      | `string`  | No       | -            | URL for completion notification                       |

### Aspect ratios

| Aspect Ratio        | Base Dimensions (1k) |
| ------------------- | -------------------- |
| `square_1_1`        | 1024 × 1024          |
| `widescreen_16_9`   | 1344 × 768           |
| `social_story_9_16` | 768 × 1344           |
| `portrait_2_3`      | 832 × 1216           |
| `traditional_3_4`   | 960 × 1280           |
| `vertical_1_2`      | 704 × 1408           |
| `horizontal_2_1`    | 1408 × 704           |
| `social_post_4_5`   | 896 × 1152           |
| `standard_3_2`      | 1216 × 832           |
| `classic_4_3`       | 1280 × 960           |

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is FLUX.2 Klein and how does it work?">
    FLUX.2 Klein is the fastest model in the FLUX.2 family by Black Forest Labs, optimized for sub-second image generation. You submit a text prompt via the API, optionally include up to 4 reference images, receive a task ID immediately, then poll for results or receive a webhook notification when processing completes.
  </Accordion>

  <Accordion title="How do reference images work in FLUX.2 Klein?">
    You can provide up to 4 Base64-encoded reference images using `input_image`, `input_image_2`, `input_image_3`, and `input_image_4` parameters. The model uses these images to guide style, composition, and subject elements in the generated output while still following your text prompt.
  </Accordion>

  <Accordion title="What image dimensions does FLUX.2 Klein support?">
    FLUX.2 Klein uses preset aspect ratios (square\_1\_1, widescreen\_16\_9, portrait\_2\_3, etc.) combined with resolution settings (1k or 2k). The 2k resolution doubles the base dimensions but caps at 2048px per side.
  </Accordion>

  <Accordion title="How fast is FLUX.2 Klein compared to other Flux models?">
    FLUX.2 Klein is the fastest model in the FLUX.2 family, achieving sub-second generation times. This makes it ideal for real-time applications where speed is critical, though FLUX.2 Pro offers higher quality for less time-sensitive use cases.
  </Accordion>

  <Accordion title="What are the rate limits for FLUX.2 Klein?">
    See [Rate Limits](/ratelimits) for current limits by subscription tier.
  </Accordion>

  <Accordion title="How much does FLUX.2 Klein cost?">
    See [Pricing](/pricing) for detailed rates and free tier credits.
  </Accordion>

  <Accordion title="What is the difference between FLUX.2 Klein and FLUX.2 Pro?">
    FLUX.2 Klein is optimized for speed with sub-second generation, ideal for real-time applications. FLUX.2 Pro offers higher quality output for premium results. Choose FLUX.2 Klein when speed is critical; choose FLUX.2 Pro when quality is the priority.
  </Accordion>
</AccordionGroup>

## Best practices

* **Reference images**: Use high-quality reference images with clear style elements for best transfer results
* **Prompt writing**: Be specific about subjects, scenes, and visual details even when using reference images
* **Aspect ratio selection**: Choose the appropriate preset aspect ratio for your use case
* **Resolution choice**: Use 1k for speed, 2k for higher detail (capped at 2048px)
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[FLUX.2 Pro](/api-reference/text-to-image/post-flux-2-pro)**: Higher quality generation for premium results
* **[FLUX.2 Turbo](/api-reference/text-to-image/post-flux-2-turbo)**: Balance of speed and quality
* **[Flux Kontext Pro](/api-reference/text-to-image/flux-kontext-pro/overview)**: Context-aware generation with image guidance


Built with [Mintlify](https://mintlify.com).