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

# Freepik Mystic API

> Photorealistic AI image generator with LoRA styles and characters. Generate production-ready 1K, 2K, and 4K images for marketing, e-commerce, and creative projects.

<Frame>
  <video autoPlay muted loop playsInline controls className="w-full aspect-video" width="800">
    <source src="https://mintcdn.com/fpapi-57e4335c/IWlpzMfe18kwHacc/images/FreepikMysticAIvideo.mp4?fit=max&auto=format&n=IWlpzMfe18kwHacc&q=85&s=265d0060ac80a9ac2907cbdb04d917a0" type="video/mp4" data-path="images/FreepikMysticAIvideo.mp4" />

    Your browser does not support the video tag.
  </video>
</Frame>

<div className="my-11">
  <Card title="Freepik API's Mystic is a Freepik-exclusive AI image generation tool." icon="circle-exclamation">
    Generate photorealistic images in 1K/2K/4K with LoRA styles and characters.
  </Card>
</div>

Mystic AI image generation is a cutting-edge tool that produces stunningly realistic, high-resolution images. With options for 1K, 2K and 4K resolution, Mystic delivers sharp, detailed visuals that rival professional photography. From intricate facial features to complex textures, every element is rendered with exceptional clarity and precision.

### Stunning 1K, 2K and 4K quality

Enjoy razor-sharp 1K, 2K and 4K resolution with Freepik Mystic. Generate high-definition images with zero effort—no extra steps or upscaling needed. Just describe your vision, and Mystic will create beautifully detailed visuals ready for any project, from web design to large-format printing.

### Effortless creation

Transform your text descriptions into impressive, realistic results with custom parameters. Whether you need faces, hands, or text, everything is pixel-perfect and photo-realistic. Our state-of-the-art AI technology ensures that every generated image meets professional standards without requiring additional editing.

### Versatile applications

Perfect for a wide range of uses, including:

* Marketing materials that demand visual impact
* E-commerce product showcases with lifelike detail
* High-quality illustrations for publications
* Concept art for film and game development
* And much more!

With Mystic AI, you're equipped to create visuals that captivate and convince, all at the click of a button.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/mystic" icon="wand-magic-sparkles" href="/api-reference/mystic/post-mystic">
      Generate an image using Mystic
    </Card>

    <Card title="GET /v1/ai/mystic/{task-id}" icon="code" href="/api-reference/mystic/get-mystic-task">
      Get the status of a Mystic image generation task
    </Card>

    <Card title="GET /v1/ai/mystic" icon="code" href="/api-reference/mystic/get-mystic">
      Get a list of all Mystic image generation tasks, including their statuses and details.
    </Card>

    <Card title="GET /v1/ai/loras" icon="code" href="/api-reference/mystic/get-loras">
      Returns a curated list of available LoRAs (Low-Rank Adaptation) for Mystic image generation.
    </Card>
  </Columns>
</div>

### Image Reference Best Practices

When using `structure_reference` or `style_reference` images, how you send them matters:

| Action                                     | Quality Impact             |
| ------------------------------------------ | -------------------------- |
| Send URL of original image                 | ✅ Maximum quality          |
| Send base64 of original file read directly | ✅ Maximum quality          |
| Use `canvas.toDataURL('image/jpeg')`       | ❌ \~8% quality loss        |
| Use `canvas.toDataURL('image/jpeg', 0.8)`  | ❌ \~20% quality loss       |
| Resize image before sending                | ❌ Significant quality loss |
| Convert PNG → JPEG before sending          | ❌ Quality loss             |

<Tip>
  **Recommended:** Send reference images via URL whenever possible. Higher quality reference images produce better style and structure transfers.
</Tip>

### Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What resolutions does Freepik Mystic support?">
    Freepik Mystic generates images in three resolution tiers: 1K (1024px), 2K (2048px), and 4K (4096px). Higher resolutions deliver more detail and are ideal for print or large-format displays.
  </Accordion>

  <Accordion title="What are LoRAs and how do I use them with Mystic?">
    LoRAs (Low-Rank Adaptations) are style and character presets that customize Mystic's output. Use the GET /v1/ai/loras endpoint to retrieve available LoRAs, then include the LoRA ID in your generation request to apply specific styles or characters.
  </Accordion>

  <Accordion title="How long does image generation take?">
    Generation time depends on resolution: 1K images typically complete in 10-20 seconds, 2K in 20-40 seconds, and 4K in 40-90 seconds. Use webhooks for efficient notification of task completion.
  </Accordion>

  <Accordion title="What is the output format?">
    Mystic outputs high-quality PNG images. The generated image is delivered via a URL that remains accessible for download after task completion.
  </Accordion>

  <Accordion title="What are the rate limits for Freepik Mystic?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits.
  </Accordion>

  <Accordion title="How much does Freepik Mystic cost?">
    See the [Pricing page](/pricing) for current rates and subscription options.
  </Accordion>
</AccordionGroup>


