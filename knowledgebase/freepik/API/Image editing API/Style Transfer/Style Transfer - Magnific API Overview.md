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

# Overview

<Frame caption="Style transfer examples (from left top to right bottom): Original image, then apply black and white, wild nature, wood and brick styles via prompts.">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    <img src="https://mintcdn.com/fpapi-57e4335c/IWlpzMfe18kwHacc/images/styletransfer1.jpeg?fit=max&auto=format&n=IWlpzMfe18kwHacc&q=85&s=f62aa506d4e6435058177ca2cf15325e" alt="Original image" loading="lazy" width="2560" height="1707" data-path="images/styletransfer1.jpeg" />

    <img src="https://mintcdn.com/fpapi-57e4335c/IWlpzMfe18kwHacc/images/styletransfer2.jpeg?fit=max&auto=format&n=IWlpzMfe18kwHacc&q=85&s=79e28fcc6f333d207f286f4dc3922d9e" alt="Black and white" loading="lazy" width="4096" height="2731" data-path="images/styletransfer2.jpeg" />

    <img src="https://mintcdn.com/fpapi-57e4335c/IWlpzMfe18kwHacc/images/styletransfer3.jpeg?fit=max&auto=format&n=IWlpzMfe18kwHacc&q=85&s=1c0b0c37c0eb0ca1cae1e26cbc524d71" alt="Wild nature" loading="lazy" width="4096" height="2731" data-path="images/styletransfer3.jpeg" />

    <img src="https://mintcdn.com/fpapi-57e4335c/IWlpzMfe18kwHacc/images/styletransfer4.jpeg?fit=max&auto=format&n=IWlpzMfe18kwHacc&q=85&s=921e019a96aabe1e7dceee5aee306c2c" alt="Wood and brick" loading="lazy" width="4096" height="2731" data-path="images/styletransfer4.jpeg" />
  </div>
</Frame>

<div className="my-11">
  <Card title="Freepik API uses Magnific.ai technology, now available as a comprehensive API service." icon="circle-exclamation" />
</div>

Image Style Transfer is a powerful AI-driven tool that allows you to transform any image by applying various artistic styles. This technology goes beyond simple filters, enabling you to control the amount of style transferred and maintain structural integrity. With our API, you can:

1. Apply predefined artistic styles
2. Use custom images as style references
3. Fine-tune the style transfer process with advanced parameters
4. Transform images while preserving important details
5. Combine style transfer with upscaling for high-resolution results

Whether you're a professional artist, game developer, or just looking to have fun with your photos, Image Style Transfer opens up a world of creative possibilities.

### Use Cases

Image Style Transfer can be applied to various industries and creative projects, some examples are:

* **Video Game Development**: Transform concept art and create stylized game assets
* **Film and VFX**: Create dramatic lighting effects and stylized scenes
* **Interior Design**: Visualize room makeovers with different design styles
* **3D Rendering**: Texturize and light 3D renders using reference images
* **Sketch Transformation**: Convert sketches into detailed, styled artwork

### Key Features

* **Control Over Style Intensity**: Adjust the strength of the style transfer to find the perfect balance between the original image and the new style.
* **Structure Preservation**: Maintain important details and structural elements of the original image while applying new styles.
* **Prompt-Guided Transformations**: Use text prompts to further refine and direct the style transfer process.
* **Multiple Style Engines**: Choose from various AI engines optimized for different types of style transfers.

By leveraging the power of AI, Image Style Transfer enables creators to push the boundaries of visual art and design, saving hours of manual work and opening up new realms of creative possibility.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/image-style-transfer" icon="code" href="/api-reference/image-style-transfer/post-image-style-transfer">
      API Reference: Image Style Transfer
    </Card>
  </Columns>
</div>

### Image Input Best Practices

For maximum quality results, how you send your image matters:

| Action                                     | Quality Impact             |
| ------------------------------------------ | -------------------------- |
| Send URL of original image                 | ✅ Maximum quality          |
| Send base64 of original file read directly | ✅ Maximum quality          |
| Use `canvas.toDataURL('image/jpeg')`       | ❌ \~8% quality loss        |
| Use `canvas.toDataURL('image/jpeg', 0.8)`  | ❌ \~20% quality loss       |
| Resize image before sending                | ❌ Significant quality loss |
| Convert PNG → JPEG before sending          | ❌ Quality loss             |

<Tip>
  **Recommended:** Send the original image via URL whenever possible. This ensures the AI receives the highest quality input, which directly impacts output quality.
</Tip>

### Frequently Asked Questions

<AccordionGroup>
  <Accordion title="Is this the same technology as Magnific.ai?">
    Yes! Magnific.ai is part of Freepik and we are happy to offer the same technology in an API service. If you tried Magnific.ai before, you will get the same technology and its future updates.
  </Accordion>

  <Accordion title="How much does the image style transfer cost?">
    The cost per image style transfer is a fixed cost of €0.10 per operation. This ensures that you have complete transparency and control over your usage.
  </Accordion>
</AccordionGroup>

