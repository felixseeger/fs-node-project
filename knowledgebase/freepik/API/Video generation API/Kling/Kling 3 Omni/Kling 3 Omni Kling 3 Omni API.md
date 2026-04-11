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

# Kling 3 Omni API

> Generate AI videos with multi-modal capabilities using Kling 3 Omni. Supports text-to-video, image-to-video, and element consistency with Pro and Standard tiers.

<Card title="Kling 3 Omni integration" icon="video">
  Generate AI videos with multi-modal inputs: text prompts, reference images, and element consistency for characters and objects.
</Card>

Kling 3 Omni is a versatile video generation API that supports multiple input modes: text-to-video, image-to-video, and reference-to-video with elements and images. It offers advanced features like multi-shot mode for scene-by-scene control and element consistency to maintain character/object identity across frames.

<Note>
  **Looking for video-to-video?** Use the dedicated [Reference-to-Video endpoints](#video-to-video-with-reference-video) to generate videos from a reference video using `video_url`.
</Note>

### Key capabilities

* **Text-to-video**: Generate videos from text prompts up to 2500 characters
* **Image-to-video**: Use `image_url` for start frame, `end_image_url` for end frame control
* **Element consistency**: Pre-register characters/objects with `elements` and reference as `@Element1`, `@Element2` in prompts
* **Reference images**: Add style guidance with `image_urls`, reference as `@Image1`, `@Image2` in prompts
* **Multi-shot mode**: Create multi-scene videos with `multi_prompt` for shot-by-shot control
* **Duration control**: Generate videos from 3-15 seconds
* **Audio options**: Generate native audio or use voice IDs for narration
* **Async processing**: Webhook notifications or polling for task completion

### Generation modes

| Mode                   | Parameters                                | Use case                             |
| ---------------------- | ----------------------------------------- | ------------------------------------ |
| **Text-to-video**      | `prompt` (required)                       | Generate video from text description |
| **Image-to-video**     | `image_url` + `prompt`                    | Animate a starting image             |
| **Reference-to-video** | `elements` and/or `image_urls` + `prompt` | Maintain character/style consistency |

### Pro vs Standard

| Feature  | Kling 3 Omni Pro       | Kling 3 Omni Standard        |
| -------- | ---------------------- | ---------------------------- |
| Quality  | Higher fidelity output | Good quality, cost-effective |
| Speed    | Standard processing    | Faster processing            |
| Best for | Premium productions    | Testing, high-volume         |

### Use cases

* **Character animation**: Maintain consistent character identity across video with elements
* **Product visualization**: Animate product images with controlled motion
* **Storyboarding**: Create multi-scene videos with shot-by-shot prompts
* **Style transfer**: Apply visual style from reference images to generated content
* **Marketing content**: Generate promotional videos from brand imagery

### Generate videos with Kling 3 Omni

Create videos by submitting prompts with optional images and elements. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/video/kling-v3-omni-pro" icon="video" href="/api-reference/video/kling-v3-omni/generate-pro">
      Generate video with Kling 3 Omni Pro
    </Card>

    <Card title="POST /v1/ai/video/kling-v3-omni-std" icon="video" href="/api-reference/video/kling-v3-omni/generate-std">
      Generate video with Kling 3 Omni Standard
    </Card>

    <Card title="GET /v1/ai/video/kling-v3-omni" icon="list" href="/api-reference/video/kling-v3-omni/kling-v3-omni-tasks">
      List all Kling 3 Omni tasks
    </Card>

    <Card title="GET /v1/ai/video/kling-v3-omni/{task-id}" icon="magnifying-glass" href="/api-reference/video/kling-v3-omni/task-by-id">
      Get task status by ID
    </Card>
  </Columns>
</div>

### Video-to-video with reference video

For video-to-video generation using a reference video, use the dedicated Reference-to-Video endpoints. These endpoints accept `video_url` and let you reference the video in your prompt as `@Video1`.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST reference-to-video Pro" icon="video" href="/api-reference/video/kling-v3-omni/generate-pro-video-reference">
      Generate video from reference video (Pro)
    </Card>

    <Card title="POST reference-to-video Std" icon="video" href="/api-reference/video/kling-v3-omni/generate-std-video-reference">
      Generate video from reference video (Standard)
    </Card>

    <Card title="GET reference-to-video tasks" icon="list" href="/api-reference/video/kling-v3-omni/video-reference-tasks">
      List all reference-to-video tasks
    </Card>

    <Card title="GET reference-to-video task" icon="magnifying-glass" href="/api-reference/video/kling-v3-omni/video-reference-task-by-id">
      Get reference-to-video task by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter         | Type      | Required    | Default     | Description                                                       |
| ----------------- | --------- | ----------- | ----------- | ----------------------------------------------------------------- |
| `prompt`          | `string`  | Conditional | -           | Text prompt (max 2500 chars). Required for text-to-video.         |
| `image_url`       | `string`  | No          | -           | Start frame image URL for image-to-video                          |
| `start_image_url` | `string`  | No          | -           | Alternative start frame image                                     |
| `end_image_url`   | `string`  | No          | -           | End frame image URL                                               |
| `image_urls`      | `array`   | No          | -           | Reference images for style. Use `@Image1`, `@Image2` in prompt    |
| `elements`        | `array`   | No          | -           | Character/object elements. Use `@Element1`, `@Element2` in prompt |
| `multi_prompt`    | `array`   | No          | -           | Shot-by-shot prompts for multi-scene videos (max 6 shots)         |
| `shot_type`       | `string`  | No          | `customize` | Multi-shot type (only `customize` supported)                      |
| `aspect_ratio`    | `string`  | No          | `16:9`      | Video ratio: `16:9`, `9:16`, `1:1`                                |
| `duration`        | `integer` | No          | `5`         | Duration in seconds: 3-15                                         |
| `generate_audio`  | `boolean` | No          | -           | Generate native audio for the video                               |
| `voice_ids`       | `array`   | No          | -           | Voice IDs for narration. Use `<<<voice_1>>>` in prompt            |
| `webhook_url`     | `string`  | No          | -           | URL for task completion notification                              |

### Element definition

| Field                  | Type     | Description                                                           |
| ---------------------- | -------- | --------------------------------------------------------------------- |
| `reference_image_urls` | `array`  | Reference image URLs for element. Multiple angles improve consistency |
| `frontal_image_url`    | `string` | Frontal/primary reference image. Best with clear face/front view      |

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is Kling 3 Omni and what can it do?">
    Kling 3 Omni is a multi-modal video generation API that creates videos from text prompts, images, or a combination. It supports element consistency (maintaining character/object identity), reference images for style guidance, and multi-shot mode for scene-by-scene control. Video durations range from 3-15 seconds.
  </Accordion>

  <Accordion title="How do I generate video-to-video content?">
    For video-to-video generation (using a reference video), use the dedicated [Reference-to-Video endpoints](/api-reference/video/kling-v3-omni/generate-pro-video-reference). These endpoints accept a `video_url` parameter and let you reference the video in your prompt as `@Video1`.
  </Accordion>

  <Accordion title="What is the difference between elements and image_urls?">
    `elements` are for maintaining consistent identity of characters or objects across the video - use them for faces, products, or recurring subjects. `image_urls` are for general style/appearance reference. Both can be combined: elements for character consistency, images for style guidance.
  </Accordion>

  <Accordion title="How does multi-shot mode work?">
    Multi-shot mode lets you create videos with multiple scenes, each with its own prompt. Provide an array of prompts via `multi_prompt` (max 6 shots). Each shot must be at least 3 seconds. The total duration is the sum of all shots.
  </Accordion>

  <Accordion title="What image formats does Kling 3 Omni support?">
    Images must be publicly accessible URLs in JPG, JPEG, or PNG format. Requirements: minimum 300x300 pixels, maximum 10MB file size.
  </Accordion>

  <Accordion title="What are the rate limits for Kling 3 Omni?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits and quotas.
  </Accordion>

  <Accordion title="How much does Kling 3 Omni cost?">
    Pricing varies based on model tier (Pro vs Standard) and video duration. See the [Pricing](/pricing) page for current rates.
  </Accordion>
</AccordionGroup>

## Best practices

* **Element quality**: Use clear, well-lit reference images for elements. Multiple angles improve consistency.
* **Prompt structure**: Reference elements as `@Element1` and images as `@Image1` in your prompt for best results.
* **Duration planning**: Start with 5-second videos to test, then increase duration for final output.
* **Multi-shot flow**: Plan shot transitions carefully; each shot should have a coherent prompt.
* **Audio options**: Use `generate_audio: true` for ambient sound, or `voice_ids` for narration.
* **Production integration**: Use webhooks instead of polling for scalable applications.

## Related APIs

* **[Kling 3](/api-reference/video/kling-v3/overview)**: Standard Kling 3 without Omni multi-modal features
* **[Kling 2.6 Pro](/api-reference/image-to-video/kling-v2-6-pro)**: Previous generation with motion control
* **[Runway Gen 4.5](/api-reference/video/runway-gen-4-5/overview)**: Alternative video generation model
* **[VFX](/api-reference/video/vfx/overview)**: Apply visual effects to generated videos

