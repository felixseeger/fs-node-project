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

<Frame caption="Relight examples (from top left to bottom right): Original image, Night scene, Snowy landscape, and Hell scene.">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    <img src="https://mintcdn.com/fpapi-57e4335c/IWlpzMfe18kwHacc/images/relight1.jpeg?fit=max&auto=format&n=IWlpzMfe18kwHacc&q=85&s=a32cf7b1f97c0df1fb97649cad718bca" alt="Original scene" loading="lazy" width="1200" height="720" data-path="images/relight1.jpeg" />

    <img src="https://mintcdn.com/fpapi-57e4335c/IWlpzMfe18kwHacc/images/relight2.jpeg?fit=max&auto=format&n=IWlpzMfe18kwHacc&q=85&s=dbbcd70f055596f32168b1175fee8de2" alt="Night scene" loading="lazy" width="1024" height="608" data-path="images/relight2.jpeg" />

    <img src="https://mintcdn.com/fpapi-57e4335c/IWlpzMfe18kwHacc/images/relight3.jpeg?fit=max&auto=format&n=IWlpzMfe18kwHacc&q=85&s=51f1f36e72ea6c53b6e54fbeac94f278" alt="Snowy landscape" loading="lazy" width="1024" height="608" data-path="images/relight3.jpeg" />

    <img src="https://mintcdn.com/fpapi-57e4335c/IWlpzMfe18kwHacc/images/relight4.jpeg?fit=max&auto=format&n=IWlpzMfe18kwHacc&q=85&s=634ff9f89c291cbc97af1ffaf53f1184" alt="Hell scene" loading="lazy" width="1024" height="608" data-path="images/relight4.jpeg" />
  </div>
</Frame>

<div className="my-11">
  <Card title="Freepik API uses Magnific.ai technology, now available as a comprehensive API service." icon="circle-exclamation" />
</div>

Image Relight allows you to change the entire lighting of a scene and, optionally, the background using:

1. A prompt
2. A reference image
3. A light map

This tool can simulate different lighting scenarios, enhance details, and create artistic effects. Our API lets you transform your images with custom prompts and fine-tuned parameters for impressive results.

Image Relight uses Magnific.ai technology, now available as a comprehensive API service.

### Use Cases

The Image Relight can be applied to a wide range of image types and industries, including:

* Portraits: Change lighting to enhance facial features
* Product photography: Adjust lighting for better presentation
* Architectural renderings: Simulate different times of day
* Film stills: Create dramatic lighting effects
* Graphic design: Add creative lighting to designs
* Nature photography: Enhance natural light conditions

### Selecting Light Transfer Method

Choose one of these three ways to transfer light in Image Relight:

1. **Prompt** Describe the desired lighting using text. Specify characteristics like color, time of day, type and shape of light.
   Example: "A sunlit forest clearing at golden hour" or "Under the water"

2. **Reference Image** Provide an image to transfer lighting from. Image Relight will replicate the light, colors, and shadows from this reference.

3. **Lightmap** Create custom lighting with your own lightmap image:
   * Black represents absence of light
   * Lighter colors (including white) indicate presence, color, and shape of light sources

<div className="my-11">
  <Columns>
    <Card title="POST /v1/ai/image-relight" icon="wand-magic-sparkles" href="/api-reference/image-relight/post-image-relight">
      Relight an image using AI
    </Card>

    <Card title="GET /v1/ai/image-relight/{task-id}" icon="code" href="/api-reference/image-relight/get-image-relight">
      Get the status of a relighting task
    </Card>

    <Card title="GET /v1/ai/image-relight" icon="code" href="/api-reference/image-relight/get-image-relight-task">
      Get the status of all relighting tasks
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

  <Accordion title="How much does the image relight cost?">
    The cost per image relight is a fixed cost of €0.10 per operation. This ensures that you have complete transparency and control over your usage.
  </Accordion>
</AccordionGroup>

