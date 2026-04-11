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

# Change Camera API

> Change camera angle and perspective of any image with the Change Camera API. Adjust horizontal rotation (0-360), vertical tilt (-30 to 90), and zoom (0-10) for multi-angle views.

<Card title="AI camera angle transformation" icon="camera-rotate">
  Transform any image by repositioning the virtual camera with precise control over horizontal rotation, vertical tilt, and zoom level.
</Card>

Change Camera is an image editing API that transforms the camera perspective of any image using AI. Provide an input image and specify horizontal rotation (0-360 degrees), vertical tilt (-30 to 90 degrees), and zoom level (0-10) to generate a new image as if the camera had been physically repositioned around the subject. The API accepts JPG, PNG, and WebP images via publicly accessible HTTPS URLs and outputs in PNG or JPEG format. Processing is asynchronous with support for both polling and webhook notifications.

### Key capabilities

* **360-degree horizontal rotation**: Rotate the viewpoint around the subject from 0 (front) through 90 (right side), 180 (back), 270 (left side), to 360 degrees
* **Vertical tilt control**: Tilt the camera from -30 degrees (looking up) through 0 (eye level) to 90 degrees (bird's eye view)
* **Adjustable zoom**: Control the distance from wide shot (`0`) through standard framing (`5`) to close-up (`10`)
* **Output format options**: Choose between lossless PNG or compressed JPEG output
* **Reproducible results**: Optional seed parameter for consistent output across requests
* **Async processing**: Webhook notifications or polling for task completion

### Camera controls reference

| Control                 | Parameter          | Range     | Default | Key positions                                    |
| ----------------------- | ------------------ | --------- | ------- | ------------------------------------------------ |
| **Horizontal rotation** | `horizontal_angle` | 0-360     | 0       | `0` front, `90` right, `180` back, `270` left    |
| **Vertical tilt**       | `vertical_angle`   | -30 to 90 | 0       | `-30` looking up, `0` eye level, `90` bird's eye |
| **Zoom**                | `zoom`             | 0-10      | 5       | `0` wide shot, `5` medium, `10` close-up         |

### Use cases

* **Product photography**: Generate multiple angle views of a product from a single photo for e-commerce listings
* **Architectural visualization**: View buildings and interiors from different perspectives without reshooting
* **Creative image manipulation**: Explore alternative viewpoints of scenes, portraits, and objects
* **3D asset previewing**: Create multi-angle previews from a single reference image
* **Marketing materials**: Produce varied camera angles for advertising campaigns from one source image
* **Content creation**: Generate consistent multi-angle views of subjects for social media and editorial content

### Transform images with Change Camera

Submit an image URL with camera angle parameters to create a new transformation task. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/image-change-camera" icon="camera-rotate" href="/api-reference/image-change-camera/change-camera">
      Create a new camera angle transformation task
    </Card>

    <Card title="GET /v1/ai/image-change-camera" icon="list" href="/api-reference/image-change-camera/change-camera-tasks">
      List all Change Camera tasks
    </Card>

    <Card title="GET /v1/ai/image-change-camera/{task-id}" icon="magnifying-glass" href="/api-reference/image-change-camera/task-by-id">
      Get task status and results by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter          | Type      | Required | Default | Description                                                                    |
| ------------------ | --------- | -------- | ------- | ------------------------------------------------------------------------------ |
| `image`            | `string`  | Yes      | -       | Input image URL (publicly accessible HTTPS). Supported formats: JPG, PNG, WebP |
| `horizontal_angle` | `integer` | No       | `0`     | Horizontal rotation: `0` (front) to `360` degrees around the subject           |
| `vertical_angle`   | `integer` | No       | `0`     | Vertical tilt: `-30` (looking up) to `90` (bird's eye view) degrees            |
| `zoom`             | `integer` | No       | `5`     | Zoom level: `0` (wide shot) to `10` (close-up)                                 |
| `output_format`    | `string`  | No       | `png`   | Output format: `png` (lossless) or `jpeg` (compressed)                         |
| `seed`             | `integer` | No       | random  | Seed for reproducibility (minimum: 1)                                          |
| `webhook_url`      | `string`  | No       | -       | URL for task completion notification                                           |

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is the Change Camera API and how does it work?">
    The Change Camera API transforms the camera perspective of any image using AI. You submit an image URL with desired camera angle parameters (horizontal rotation, vertical tilt, and zoom), receive a task ID immediately, then poll for results or receive a webhook notification when processing completes. The AI generates a new image as if the camera had been repositioned around the subject.
  </Accordion>

  <Accordion title="What image formats does the Change Camera API support?">
    The Change Camera API accepts images via publicly accessible HTTPS URLs. Supported input formats are JPG, PNG, and WebP. Output is available in PNG (lossless, default) or JPEG (compressed) format, controlled by the `output_format` parameter.
  </Accordion>

  <Accordion title="How does horizontal rotation work?">
    The `horizontal_angle` parameter rotates the camera around the subject from 0 to 360 degrees. Key positions: `0` is the front view, `90` is the right side, `180` is the back view, `270` is the left side, and `360` returns to the front (equivalent to `0`). The default is `0` (front view).
  </Accordion>

  <Accordion title="How does vertical tilt work?">
    The `vertical_angle` parameter tilts the camera up or down relative to the subject. Values range from `-30` (looking up at the subject from below) through `0` (eye level, default) to `90` (bird's eye view looking straight down). A value of `45` provides a moderate downward angle.
  </Accordion>

  <Accordion title="Can I reproduce the same transformation result?">
    Yes. Use the `seed` parameter with the same value across requests. Combined with identical image URLs and camera parameters, the API produces consistent output. This is useful for fine-tuning angles iteratively.
  </Accordion>

  <Accordion title="What are the rate limits for the Change Camera API?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits.
  </Accordion>

  <Accordion title="How much does the Change Camera API cost?">
    See the [Pricing page](/pricing) for current rates and subscription options.
  </Accordion>
</AccordionGroup>

## Best practices

* **Start with defaults**: Begin with default values (`horizontal_angle=0`, `vertical_angle=0`, `zoom=5`) and adjust one parameter at a time to understand the effect
* **Subtle angle changes**: Small adjustments (15-30 degrees horizontal, 10-20 degrees vertical) often produce the most realistic results
* **Input quality**: Use high-resolution, well-lit images for best perspective transformation quality
* **Seed for iteration**: Use the `seed` parameter when fine-tuning angles to isolate the effect of each parameter change
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[Image Upscaler](/api-reference/image-upscaler-precision-v2/overview)**: Enhance image resolution before or after camera angle transformation
* **[Style Transfer](/api-reference/image-style-transfer/image-styletransfer)**: Apply artistic styles to images after changing the perspective
* **[Remove Background](/api-reference/remove-background/overview)**: Remove backgrounds for clean subject isolation before camera transformation

