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

# Flux Pro Image Expand - Outpainting API | Freepik API

> Expand images beyond their original boundaries with Flux Pro Image Expand. AI-powered outpainting with directional control up to 2048 pixels per side. Perfect for social media, print, and design workflows.

<Card title="Flux Pro integration" icon="expand">
  Powered by Flux Pro, this API expands images beyond their original boundaries using AI-generated content that seamlessly blends with the original.
</Card>

Flux Pro Image Expand is an AI-powered outpainting API that extends images beyond their original boundaries. Specify how many pixels to add on each side (left, right, top, bottom) up to 2048 pixels, and optionally provide a text prompt to guide the generated content. The API produces seamless expansions that maintain visual consistency with the original image, making it ideal for adapting images to different aspect ratios or adding creative space around subjects.

### Key capabilities

* **Directional expansion**: Independently control expansion on each edge (left, right, top, bottom) from 0 to 2048 pixels
* **Prompt-guided generation**: Optional text descriptions to guide what appears in expanded areas
* **Seamless blending**: AI-generated content matches the style, lighting, and composition of the original image
* **Flexible input**: Accept base64-encoded images for easy integration
* **High-resolution output**: Support for substantial canvas extensions while maintaining quality
* **Async processing**: Webhook notifications or polling for task completion

### Use cases

* **Social media adaptation**: Convert landscape images to portrait format (or vice versa) for different platforms
* **Print production**: Add bleed area or extend backgrounds for large-format printing
* **Design workflows**: Create additional canvas space for text overlays, logos, or design elements
* **Photography enhancement**: Extend cropped photos to recover lost composition
* **E-commerce**: Expand product images to fit standardized dimensions
* **Marketing materials**: Adapt hero images to various banner sizes and aspect ratios

### Expand images with Flux Pro

Submit an image with expansion parameters to extend it in any direction. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/image-expand/flux-pro" icon="expand" href="/api-reference/image-expand/post-flux-pro">
      Create a new image expansion task
    </Card>

    <Card title="GET /v1/ai/image-expand/flux-pro" icon="list" href="/api-reference/image-expand/get-flux-pro">
      List all image expansion tasks
    </Card>

    <Card title="GET /v1/ai/image-expand/flux-pro/{task-id}" icon="magnifying-glass" href="/api-reference/image-expand/get-{task-id}-by-id">
      Get task status and results by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter     | Type      | Required | Default | Description                                                                            |
| ------------- | --------- | -------- | ------- | -------------------------------------------------------------------------------------- |
| `image`       | `string`  | Yes      | -       | Base64-encoded image to expand                                                         |
| `prompt`      | `string`  | No       | -       | Text description to guide the expanded areas (e.g., "sunset sky", "forest background") |
| `left`        | `integer` | No       | `0`     | Pixels to expand on the left edge (0-2048)                                             |
| `right`       | `integer` | No       | `0`     | Pixels to expand on the right edge (0-2048)                                            |
| `top`         | `integer` | No       | `0`     | Pixels to expand on the top edge (0-2048)                                              |
| `bottom`      | `integer` | No       | `0`     | Pixels to expand on the bottom edge (0-2048)                                           |
| `webhook_url` | `string`  | No       | -       | URL for task completion notification                                                   |

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is Flux Pro Image Expand and how does it work?">
    Flux Pro Image Expand is an AI-powered outpainting API that extends images beyond their original boundaries. You submit a base64-encoded image with expansion values for each edge (left, right, top, bottom), receive a task ID immediately, then poll for results or receive a webhook notification. The API generates new content that seamlessly blends with the original image.
  </Accordion>

  <Accordion title="How much can I expand an image?">
    You can expand up to 2048 pixels on each edge (left, right, top, bottom) independently. Set any edge to 0 if you do not want to expand in that direction. For example, to only extend the width, set `left` and `right` values while keeping `top` and `bottom` at 0.
  </Accordion>

  <Accordion title="What image formats are supported?">
    The API accepts base64-encoded images. Common formats like JPEG, PNG, and WebP can be encoded and submitted. The output is returned as a downloadable image URL.
  </Accordion>

  <Accordion title="How does the prompt parameter work?">
    The optional `prompt` parameter guides what the AI generates in the expanded areas. For example, "blue sky with clouds" will generate sky content, while "brick wall" will generate a wall background. If omitted, the AI infers appropriate content from the existing image context.
  </Accordion>

  <Accordion title="Will the expanded areas match my original image?">
    Yes, Flux Pro analyzes your image's style, lighting, color palette, and composition to generate expansions that blend seamlessly. The AI maintains visual consistency so the final image appears natural and cohesive.
  </Accordion>

  <Accordion title="What are the rate limits for Image Expand?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits.
  </Accordion>

  <Accordion title="How much does Image Expand cost?">
    See the [Pricing page](/pricing) for current rates and subscription options.
  </Accordion>
</AccordionGroup>

## Best practices

* **Balanced expansion**: For best results, avoid extreme asymmetric expansions; gradual extensions maintain better visual coherence
* **Prompt specificity**: Use descriptive prompts when you need specific content in expanded areas (e.g., "ocean waves" instead of just "water")
* **Image quality**: Higher resolution input images produce better expansion results
* **Edge content**: Ensure the edges of your original image have enough context for the AI to continue naturally
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[Flux 2 Pro](/api-reference/text-to-image/post-flux-2-pro)**: Generate images from text descriptions
* **[Flux Kontext Pro](/api-reference/text-to-image/flux-kontext-pro/overview)**: Text-to-image with context understanding and image guidance
* **[Image Upscaler](/api-reference/image-upscaler-creative/post-image-upscaler)**: Enhance image resolution and quality
* **[Remove Background](/api-reference/remove-background/post-beta-remove-background)**: Remove image backgrounds for compositing

