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

# Upscaler Precision – High‑Fidelity Super‑Resolution (No Hallucinations)

> High‑fidelity AI upscaling that preserves original content, small text/UI, and fine details without adding new elements. Ideal for logos, UI, and product photos.

<Frame>
  <video autoPlay muted loop playsInline controls className="w-full aspect-video" width="800">
    <source src="https://cdn-front.freepik.com/images/ai/image-upscaler/hero/hero.webm" type="video/webm" />

    Your browser does not support the video tag.
  </video>
</Frame>

<Card title="Freepik API uses Magnific.ai technology, now available as a comprehensive API service." icon="circle-exclamation">
  Precision mode focuses on faithful super‑resolution without hallucinations—best choice when preserving content is critical.
</Card>

The Freepik Upscaler Precision focuses on faithful, high-fidelity upscaling. It increases resolution while preserving the original content, texture, and structure of the image. Unlike creative upscaling, Precision prioritizes clarity, sharpness, and detail recovery without inventing new elements. Looking for stylized or prompt‑guided enhancement? See <a href="/api-reference/image-upscaler-creative/image-upscaler">Upscaler Creative</a>.

With advanced super-resolution techniques, Upscaler Precision:

* Preserves edges and fine details while minimizing halos
* Reduces noise and compression artifacts
* Maintains color consistency and natural look
* Enhances readability for small text and UI elements

### Use cases (Precision)

Upscaler Precision is ideal when you need quality improvements without altering the content:

* E‑commerce product photos: sharpen edges, remove artifacts, preserve true colors
* Branding and logos: upscale raster logos and icons with crisp lines
* UI assets and screenshots: improve sharpness while keeping pixel-accurate layouts
* Photography restoration and scans: reduce noise and recover fine detail
* Technical diagrams and architectural drawings: preserve thin lines and text
* Social media and web images: upscale for higher-DPI displays without distortion

### Upscale an image with Upscaler Precision

Create a precision upscaling task for an image.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/image-upscaler-precision" icon="code" href="/api-reference/image-upscaler-precision/post-image-upscaler-precision">
      Upscale an image with Precision mode
    </Card>
  </Columns>
</div>

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="Is this the same technology as Magnific.ai?">
    Yes! Magnific.ai is part of Freepik and we are happy to offer the same technology in an API service. If you tried Magnific.ai before, you will get the same technology and its future updates.
  </Accordion>

  <Accordion title="How much does the Magnific Upscaler cost?">
    The cost per image upscale is based on the output image area in pixels. This depends on two key factors:

    * The dimensions of the input image
    * The upscale factor applied (e.g.: 2x, 4x, 8x, 16x)

    The larger the output image area, the higher the cost per upscale. Our pricing tiers are applied based on the final output size, so you have complete transparency and control over your usage.

    Some examples:

    | Input Size | Output Size | Upscale Factor | Price |
    | ---------- | ----------- | -------------- | ----- |
    | 640x480    | 1280x960    | 2x             | €0.10 |
    | 640x480    | 2560x1920   | 4x             | €0.20 |
    | 640x480    | 5120x3840   | 8x             | €0.50 |
    | 1280x720   | 2560x1440   | 2x             | €0.10 |
    | 1280x720   | 5120x2880   | 4x             | €0.40 |
    | 1920x1080  | 3840x2160   | 2x             | €0.20 |

    The pricing structure ensures that you only pay for the level of upscaling you need.
  </Accordion>

  <Accordion title="What’s the difference between Upscaler Precision and Upscaler Creative?">
    <strong>Precision</strong> preserves the original content and improves clarity, detail, and sharpness without inventing new elements. It is ideal for logos, UI assets, product photos, scans, and technical diagrams.

    <strong>Creative</strong> can introduce or infer new visual details guided by prompts or context. It is better for artistic enhancement, stylization, or imaginative detail addition.
  </Accordion>

  <Accordion title="When should I choose Precision over Creative?">
    Choose <strong>Precision</strong> when fidelity is critical: brand consistency, readable text, pixel-accurate UI, and product authenticity. Choose <strong>Creative</strong> when you want stylistic enhancements or new visual elements.
  </Accordion>

  <Accordion title="What file formats and sizes work best?">
    Prefer PNG for graphics/logos and high-quality JPEG/PNG for photos. Avoid heavily compressed sources. For best results, use inputs large enough to contain the essential detail (e.g., at least 256–512 px on the shortest edge), then upscale 2x–4x.
  </Accordion>

  <Accordion title="Does Precision fix blurry text or small UI elements?">
    Precision improves edge sharpness and micro-contrast, which can make small text and UI icons more legible. Extremely low-resolution or heavily blurred originals may still have limits.
  </Accordion>
</AccordionGroup>

## Best practices for Upscaler Precision

Follow these recommendations to get the best, most faithful results:

* Start from the highest-quality source you have (avoid heavy-compressed inputs).
* Prefer PNG or high-quality JPEG; keep artifacts minimal in the input.
* Choose moderate upscale factors first (2x–4x) to avoid amplifying noise; iterate if needed.
* Disable any creative prompts or stylization when fidelity is critical.
* For logos/UI, use crisp sources with strong contrast; avoid anti-aliased tiny originals.
* When upscaling scans, pre-trim borders and rotate/crop to the correct orientation.
* Compare results at 100% zoom to validate line sharpness and color consistency.

### Image Input Quality

How you send your image directly impacts the output quality:

| Action                                     | Quality Impact             |
| ------------------------------------------ | -------------------------- |
| Send URL of original image                 | ✅ Maximum quality          |
| Send base64 of original file read directly | ✅ Maximum quality          |
| Use `canvas.toDataURL('image/jpeg')`       | ❌ \~8% quality loss        |
| Use `canvas.toDataURL('image/jpeg', 0.8)`  | ❌ \~20% quality loss       |
| Resize image before sending                | ❌ Significant quality loss |
| Convert PNG → JPEG before sending          | ❌ Quality loss             |

<Tip>
  **Recommended:** Send the original image via URL whenever possible. This ensures the upscaler receives the highest quality input.
</Tip>

