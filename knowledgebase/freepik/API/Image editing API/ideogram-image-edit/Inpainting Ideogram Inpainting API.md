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

# Ideogram Inpainting API

> Edit specific areas of an image using Ideogram AI inpainting. Mask-based editing with multiple rendering speeds, MagicPrompt enhancement, style and character references.

<Card title="Ideogram Inpainting" icon="paintbrush">
  Powered by Ideogram AI, this API edits specific areas of an image using mask-based inpainting with prompt-guided generation.
</Card>

Ideogram Inpainting is an AI-powered image editing API that lets you modify specific regions of an image using a mask and a text prompt. Provide a black-and-white mask where black regions indicate the areas to edit, along with a prompt describing the desired changes. The API supports multiple rendering speeds (TURBO, DEFAULT, QUALITY), automatic prompt enhancement via MagicPrompt, and style/character reference images for consistent results.

### Key capabilities

* **Mask-based editing**: Use a black-and-white mask to precisely define which areas of the image to modify
* **Multiple rendering speeds**: Choose between TURBO (fastest), DEFAULT (balanced), or QUALITY (highest quality)
* **MagicPrompt**: Automatically enhance your prompt for better results (AUTO, ON, or OFF)
* **Style customization**: Apply style codes, style types (AUTO, GENERAL, REALISTIC, DESIGN), and style reference images
* **Character consistency**: Use character reference images to maintain consistent characters across edits
* **Color palette control**: Guide the color palette of generated content
* **Reproducible results**: Optional seed parameter (0-2147483647) for consistent output across requests
* **Flexible input**: Accepts HTTPS URLs or base64-encoded images (max 10MB per image)
* **Async processing**: Webhook notifications or polling for task completion

### Use cases

* **Object replacement**: Replace objects in a scene with AI-generated alternatives
* **Background editing**: Modify or replace backgrounds while preserving subjects
* **Content removal**: Remove unwanted elements from images seamlessly
* **Creative retouching**: Edit specific areas with creative prompts for artistic effects
* **Product photography**: Modify product backgrounds or surroundings for e-commerce
* **Character editing**: Maintain character consistency across multiple edited images

### Edit images with Ideogram Inpainting

Submit an image with a mask and prompt to edit specific regions. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/ideogram-image-edit" icon="paintbrush" href="/api-reference/ideogram-image-edit/post-ideogram-image-edit">
      Create a new inpainting task
    </Card>

    <Card title="GET /v1/ai/ideogram-image-edit" icon="list" href="/api-reference/ideogram-image-edit/get-ideogram-image-edit">
      List all inpainting tasks
    </Card>

    <Card title="GET /v1/ai/ideogram-image-edit/{task-id}" icon="magnifying-glass" href="/api-reference/ideogram-image-edit/get-{task-id}-by-id">
      Get task status and results by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter                    | Type      | Required | Default   | Description                                                                                                                   |
| ---------------------------- | --------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `image`                      | `string`  | Yes      | -         | Image to edit. HTTPS URL or base64-encoded (JPEG, WebP, PNG, max 10MB)                                                        |
| `mask`                       | `string`  | Yes      | -         | Black-and-white mask image (same size as input). Black regions indicate areas to edit. HTTPS URL or base64-encoded (max 10MB) |
| `prompt`                     | `string`  | Yes      | -         | Text describing the desired changes to the image                                                                              |
| `rendering_speed`            | `string`  | No       | `DEFAULT` | Rendering speed: `TURBO`, `DEFAULT`, or `QUALITY`                                                                             |
| `magic_prompt`               | `string`  | No       | -         | MagicPrompt enhancement: `AUTO`, `ON`, or `OFF`                                                                               |
| `style_type`                 | `string`  | No       | -         | Style type: `AUTO`, `GENERAL`, `REALISTIC`, or `DESIGN`                                                                       |
| `style_codes`                | `array`   | No       | -         | List of style codes for image generation                                                                                      |
| `style_reference_images`     | `array`   | No       | -         | Images to use as style references (URLs or base64)                                                                            |
| `character_reference_images` | `array`   | No       | -         | Images for character consistency (URLs or base64)                                                                             |
| `color_palette`              | `object`  | No       | -         | Color palette to guide generated content                                                                                      |
| `seed`                       | `integer` | No       | random    | Seed for reproducibility (0-2147483647)                                                                                       |
| `webhook_url`                | `string`  | No       | -         | URL for task completion notification                                                                                          |

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is Ideogram Inpainting and how does it work?">
    Ideogram Inpainting is an AI-powered image editing API. You provide an image, a black-and-white mask indicating which areas to edit, and a text prompt describing the desired changes. The API generates new content in the masked regions that blends seamlessly with the rest of the image. You receive a task ID immediately, then poll for results or receive a webhook notification.
  </Accordion>

  <Accordion title="How does the mask work?">
    The mask must be the same size as the input image. It should be a black-and-white image where black regions indicate the areas you want to edit. White regions will remain unchanged. Supported formats are JPEG, WebP, and PNG (max 10MB).
  </Accordion>

  <Accordion title="What are the rendering speed options?">
    There are three rendering speeds: **TURBO** is the fastest with lower quality, **DEFAULT** provides balanced speed and quality, and **QUALITY** is slower but produces the highest quality results. The default is DEFAULT.
  </Accordion>

  <Accordion title="What is MagicPrompt?">
    MagicPrompt automatically enhances your text prompt for better generation results. Set it to `AUTO` to let the model decide, `ON` to always use it, or `OFF` to disable it. This can significantly improve output quality with minimal effort.
  </Accordion>

  <Accordion title="Can I maintain character consistency across edits?">
    Yes. Use the `character_reference_images` parameter to provide reference images of the character you want to maintain. Combined with `style_type`, this helps ensure consistent characters across multiple edits.
  </Accordion>

  <Accordion title="What image formats are supported?">
    The API accepts JPEG, WebP, and PNG images up to 10MB each. Both HTTPS URLs and base64-encoded strings are supported for images, masks, and reference images. The output is returned as a downloadable image URL.
  </Accordion>

  <Accordion title="What are the rate limits for Ideogram Inpainting?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits.
  </Accordion>

  <Accordion title="How much does Ideogram Inpainting cost?">
    See the [Pricing page](/pricing) for current rates and subscription options.
  </Accordion>
</AccordionGroup>

## Best practices

* **Precise masks**: Create clean, well-defined masks for the best results. Avoid feathered or blurry edges
* **Descriptive prompts**: Be specific about what you want in the edited region (e.g., "red roses in a garden" instead of just "flowers")
* **MagicPrompt for quick results**: Use `magic_prompt: "AUTO"` to let the model enhance your prompt automatically
* **Rendering speed tradeoffs**: Use TURBO for quick previews, DEFAULT for production, and QUALITY for final outputs
* **Style references**: Provide style reference images when you need a specific visual style across edits
* **Seed for consistency**: Use the same seed value when you need reproducible results across multiple API calls
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[Ideogram Image Expand](/api-reference/image-expand/ideogram/overview)**: Expand images beyond their boundaries with Ideogram
* **[Image Upscaler](/api-reference/image-upscaler-creative/post-image-upscaler)**: Enhance image resolution and quality
* **[Remove Background](/api-reference/remove-background/post-beta-remove-background)**: Remove image backgrounds for compositing
* **[Reimagine Flux](/api-reference/text-to-image/reimagine-flux/post-reimagine-flux)**: Reimagine images with Flux

