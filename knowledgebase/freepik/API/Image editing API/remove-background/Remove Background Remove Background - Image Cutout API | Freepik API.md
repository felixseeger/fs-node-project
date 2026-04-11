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

# Remove Background - Image Cutout API | Freepik API

> Remove image backgrounds with AI. Get transparent PNG up to 25 megapixels. Supports JPG/PNG input up to 20 MB. Instant synchronous results.

<Note>
  This API is currently in **beta**. Features and endpoints may change as we continue to improve the service.
</Note>

<Card title="AI Background Removal" icon="eraser">
  Automatically remove backgrounds from images using AI-powered segmentation. Get clean cutouts with transparent backgrounds in seconds.
</Card>

Remove Background is an AI-powered background removal API that instantly separates subjects from their backgrounds. Upload any JPG or PNG image via URL and receive a transparent PNG with the background removed. The API supports images up to 20 MB and outputs high-resolution results up to 25 megapixels. This is a synchronous API that returns results immediately without polling.

### Key capabilities

* **Instant processing**: Synchronous API returns results immediately without task polling
* **High resolution output**: Full resolution up to 25 megapixels, preview up to 0.25 megapixels
* **Transparent PNG output**: Clean cutouts with alpha channel transparency
* **Multiple output URLs**: Get original, high-resolution, and preview versions in one response
* **Large file support**: Accepts images up to 20 MB in size
* **Format support**: Works with JPG and PNG input images
* **URL-based input**: Submit images via public URL for easy integration
* **Temporary URLs**: Response URLs valid for 5 minutes for secure access

### Use cases

* **E-commerce product photos**: Remove backgrounds for consistent product catalogs and marketplace listings
* **Graphic design workflows**: Create transparent assets for compositions and marketing materials
* **Social media content**: Isolate subjects for custom backgrounds and branded visuals
* **Photo editing apps**: Integrate background removal into mobile and web editing tools
* **Print-on-demand services**: Prepare artwork for merchandise and custom products
* **Real estate photography**: Isolate property elements for virtual staging

### Remove background from images

Submit an image URL to remove its background. The API returns multiple URLs for different resolution outputs.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/beta/remove-background" icon="eraser" href="/api-reference/remove-background/post-beta-remove-background">
      Remove background from an image
    </Card>
  </Columns>
</div>

### Parameters

| Parameter   | Type     | Required | Default | Description                                                                     |
| ----------- | -------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `image_url` | `string` | Yes      | -       | URL of the image whose background needs to be removed (JPG or PNG, up to 20 MB) |

### Response

| Field             | Type     | Description                                                            |
| ----------------- | -------- | ---------------------------------------------------------------------- |
| `original`        | `string` | URL of the original input image                                        |
| `high_resolution` | `string` | URL of the high-resolution image with background removed (up to 25 MP) |
| `preview`         | `string` | URL of the preview version (up to 0.25 MP)                             |
| `url`             | `string` | Direct download URL for the high-resolution result                     |

<Warning>
  Response URLs are temporary and expire after **5 minutes**. Download or process the images promptly after receiving the response.
</Warning>

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is the Remove Background API and how does it work?">
    The Remove Background API is an AI-powered service that automatically detects and removes backgrounds from images. You submit an image URL, and the API uses advanced segmentation models to separate the subject from the background, returning a transparent PNG. Unlike async APIs, this endpoint processes requests synchronously and returns results immediately.
  </Accordion>

  <Accordion title="What image formats and sizes are supported?">
    The API accepts JPG and PNG images up to 20 MB in file size. Output is always a PNG with transparency. The high-resolution output supports images up to 25 megapixels, while the preview output is limited to 0.25 megapixels.
  </Accordion>

  <Accordion title="How long do the response URLs remain valid?">
    All URLs in the response (original, high\_resolution, preview, url) are temporary and valid for **5 minutes** only. Make sure to download or process the images immediately after receiving the response.
  </Accordion>

  <Accordion title="Is this a synchronous or asynchronous API?">
    The Remove Background API is **synchronous**. Unlike other AI endpoints that return task IDs for polling, this API processes your request and returns the result immediately in the response. No task polling or webhooks are needed.
  </Accordion>

  <Accordion title="What are the rate limits for the Remove Background API?">
    Rate limits depend on your subscription tier. Visit the [Rate Limits](/ratelimits) page for details on request limits and quotas.
  </Accordion>

  <Accordion title="How much does the Remove Background API cost?">
    Pricing varies by subscription plan. Check the [Pricing](/pricing) page for current rates and available plans.
  </Accordion>

  <Accordion title="Why is this API in beta?">
    The beta designation indicates the API is production-ready but may receive updates to improve accuracy, performance, or add new features. We recommend monitoring the changelog for any changes that might affect your integration.
  </Accordion>
</AccordionGroup>

## Best practices

* **Image quality**: Use high-resolution input images for best cutout quality
* **Clear subjects**: Images with well-defined subjects produce cleaner results
* **Contrast**: Higher contrast between subject and background improves accuracy
* **Download promptly**: Save results immediately as URLs expire in 5 minutes
* **Error handling**: Implement retry logic with exponential backoff for 5xx errors
* **URL validation**: Ensure image URLs are publicly accessible before submission

## Related APIs

* **[Image Upscaler](/api-reference/image-upscaler-creative/image-upscaler)**: Enhance image resolution after background removal
* **[Reimagine](/api-reference/text-to-image/reimagine-flux/post-reimagine-flux)**: Transform images with AI-powered style changes
* **[Image Style Transfer](/api-reference/image-style-transfer/image-styletransfer)**: Apply artistic styles to your cutout images

