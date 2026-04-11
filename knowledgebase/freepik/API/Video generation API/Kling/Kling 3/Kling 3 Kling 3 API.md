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

# Kling 3 API

> Generate AI videos from text or images with Kling 3. Multi-shot support, first/end frame control, and durations from 3-15 seconds. Pro and Standard tiers for creative video production.

<Card title="Kling 3 integration" icon="video">
  Generate high-quality videos from text prompts or images using Kling's latest V3 model with multi-shot support and advanced frame control.
</Card>

Kling 3 is a dual-mode video generation API that creates professional-grade videos from either text descriptions or source images. It supports multi-shot mode for creating complex narratives with up to 6 scenes, first and end frame image control, and flexible durations from 3 to 15 seconds. Available in Pro and Standard tiers to balance quality and cost.

### Key capabilities

* **Text-to-Video (T2V)**: Generate videos from text prompts up to 2500 characters
* **Image-to-Video (I2V)**: Use first\_frame and/or end\_frame images to control video start and end points
* **Multi-shot mode**: Create videos with up to 6 scenes, each with custom prompts and durations (max 15 seconds total)
* **Flexible durations**: 3-15 seconds with per-shot duration control in multi-shot mode
* **Element consistency**: Pre-registered element IDs for consistent characters/styles across videos
* **CFG scale control**: Adjust prompt adherence from 0 (creative) to 1 (strict), default 0.5
* **Negative prompts**: Exclude unwanted elements, styles, or artifacts
* **Async processing**: Webhook notifications or polling for task completion

### Pro vs Standard

| Feature  | Kling 3 Pro                    | Kling 3 Standard             |
| -------- | ------------------------------ | ---------------------------- |
| Quality  | Higher fidelity, richer detail | Good quality, cost-effective |
| Speed    | Standard processing            | Faster processing            |
| Best for | Premium content, marketing     | High-volume, testing         |

### Use cases

* **Marketing and advertising**: Create multi-scene product narratives with consistent branding
* **Social media content**: Generate vertical videos for TikTok, Instagram Reels, and YouTube Shorts
* **E-commerce**: Animate product images with controlled start and end frames
* **Storyboarding**: Turn scripts into multi-shot video sequences
* **Creative storytelling**: Build narratives with scene-by-scene control

### Generate videos with Kling 3

Create videos by submitting a text prompt (T2V) or images with prompt (I2V) to the API. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/video/kling-v3-pro" icon="video" href="/api-reference/video/kling-v3/generate-pro">
      Generate video with Kling 3 Pro
    </Card>

    <Card title="POST /v1/ai/video/kling-v3-std" icon="video" href="/api-reference/video/kling-v3/generate-std">
      Generate video with Kling 3 Standard
    </Card>

    <Card title="GET /v1/ai/video/kling-v3" icon="list" href="/api-reference/video/kling-v3/kling-v3-tasks">
      List all Kling 3 tasks
    </Card>

    <Card title="GET /v1/ai/video/kling-v3/{task-id}" icon="magnifying-glass" href="/api-reference/video/kling-v3/task-by-id">
      Get task status by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter         | Type      | Required | Default     | Description                                                                                       |
| ----------------- | --------- | -------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `prompt`          | `string`  | No       | -           | Text prompt describing the video (max 2500 chars). Required for T2V.                              |
| `negative_prompt` | `string`  | No       | -           | Text describing what to avoid (max 2500 chars)                                                    |
| `image_list`      | `array`   | No       | -           | Reference images with `image_url` and `type` (first\_frame/end\_frame)                            |
| `multi_shot`      | `boolean` | No       | `false`     | Enable multi-shot mode for multi-scene videos                                                     |
| `shot_type`       | `string`  | No       | `customize` | Shot segmentation: `customize` (manual per-shot prompts) or `intelligence` (AI auto-segmentation) |
| `multi_prompt`    | `array`   | No       | -           | Shot definitions: `index` (0-5), `prompt`, `duration` per scene                                   |
| `element_list`    | `array`   | No       | -           | Pre-registered element IDs for character/style consistency                                        |
| `aspect_ratio`    | `string`  | No       | `16:9`      | Video ratio: `16:9`, `9:16`, `1:1`                                                                |
| `duration`        | `integer` | No       | `5`         | Duration in seconds: 3-15 (default 5)                                                             |
| `cfg_scale`       | `number`  | No       | `0.5`       | Prompt adherence: 0 (creative) to 1 (strict)                                                      |
| `webhook_url`     | `string`  | No       | -           | URL for task completion notification                                                              |

### Image list item

| Field       | Type     | Description                                                         |
| ----------- | -------- | ------------------------------------------------------------------- |
| `image_url` | `string` | Publicly accessible image URL (300x300 min, 10MB max, JPG/JPEG/PNG) |
| `type`      | `string` | Image role: `first_frame` or `end_frame`                            |

### Multi-prompt item

| Field      | Type      | Description                                |
| ---------- | --------- | ------------------------------------------ |
| `index`    | `integer` | Shot order (0-5)                           |
| `prompt`   | `string`  | Text prompt for this shot (max 2500 chars) |
| `duration` | `number`  | Shot duration in seconds                   |

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is Kling 3 and how does it work?">
    Kling 3 is an AI video generation model that creates videos from text prompts (T2V) or images (I2V). You submit your request via the API, receive a task ID immediately, then poll for results or receive a webhook notification when processing completes. Typical generation takes 30-120 seconds depending on duration and complexity.
  </Accordion>

  <Accordion title="What is multi-shot mode?">
    Multi-shot mode lets you create videos with up to 6 distinct scenes. Each scene can have its own prompt and duration. The total duration across all shots cannot exceed 15 seconds, and each shot must be at least 3 seconds. Enable with `multi_shot: true` and define scenes in `multi_prompt`.
  </Accordion>

  <Accordion title="How do first_frame and end_frame work?">
    Use the `image_list` parameter to provide reference images. Set `type: "first_frame"` to use an image as the video's starting point, or `type: "end_frame"` for the ending point. You can use both to create a transition from one image to another.
  </Accordion>

  <Accordion title="What image formats does Kling 3 support?">
    Kling 3 accepts JPG, JPEG, and PNG images via publicly accessible URLs. Requirements: minimum 300x300 pixels, maximum 10MB file size, aspect ratio between 1:2.5 and 2.5:1.
  </Accordion>

  <Accordion title="What is cfg_scale and how should I set it?">
    CFG scale controls how closely the model follows your prompt. Use 0 for maximum creativity and artistic interpretation, 0.5 (default) for balanced results, or 1 for strict adherence to your prompt with less creative variation.
  </Accordion>

  <Accordion title="What is the difference between Pro and Standard?">
    Pro delivers higher fidelity with richer detail, ideal for premium content and marketing. Standard offers good quality with faster processing, suitable for high-volume generation and testing. Both share the same parameters and capabilities.
  </Accordion>

  <Accordion title="What are the rate limits for Kling 3?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits and quotas.
  </Accordion>

  <Accordion title="How much does Kling 3 cost?">
    Pricing varies based on model tier (Pro vs Standard) and video duration. See the [Pricing](/pricing) page for current rates.
  </Accordion>
</AccordionGroup>

## Best practices

* **Prompt clarity**: Write detailed prompts specifying subject, action, camera movement, and atmosphere
* **Start simple**: Begin with single-shot mode before attempting multi-shot sequences
* **Image quality**: For I2V, use high-resolution source images with clear subjects (min 300x300)
* **Duration planning**: For multi-shot, plan scene durations to stay within 15-second total limit
* **Element consistency**: Use pre-registered elements for recurring characters across multiple videos
* **CFG tuning**: Start with 0.5, decrease for more creativity, increase for prompt precision
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[Kling 3 Omni](/api-reference/video/kling-v3-omni/overview)**: Kling 3 with video reference support for motion/style guidance
* **[Kling 2.6 Pro](/api-reference/image-to-video/kling-v2-6-pro)**: Previous generation with motion control capabilities
* **[Kling O1](/api-reference/image-to-video/kling-o1/overview)**: High-performance video generation
* **[Runway Gen 4.5](/api-reference/video/runway-gen-4-5/overview)**: Alternative video generation model

