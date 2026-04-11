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

# Veed Fabric 1.0 API

> Generate realistic talking videos from a portrait image and audio file with Veed Fabric 1.0. Lip-synced MP4 output at 720p or 480p resolution for marketing, e-learning, and content creation.

<Card title="Veed Fabric 1.0 integration" icon="microphone-lines">
  Powered by Veed Fabric 1.0 technology, this API generates realistic talking head videos by synchronizing lip movements to audio input.
</Card>

Veed Fabric 1.0 is an AI-powered lip synchronization API that creates realistic talking videos from a static portrait image and an audio file. The model analyzes the speech patterns in the audio and animates the person in the image with natural lip movements, producing an MP4 video where the subject appears to speak in sync with the provided audio. Output resolution is configurable at 720p (1280x720) or 480p (854x480).

### Key capabilities

* **Image + audio input**: Combine a portrait photo with an audio file (MP3, WAV, M4A) to generate a talking video
* **Resolution options**: Output at `720p` (1280x720) for production use or `480p` (854x480) for drafts and faster processing
* **Natural lip sync**: AI-driven mouth movement generation that matches speech patterns accurately
* **MP4 video output**: Generates a downloadable MP4 video file with the animated portrait
* **Async processing**: Webhook notifications or polling for task completion

### Use cases

* **Marketing videos**: Create personalized spokesperson videos from a single photo
* **E-learning**: Animate instructors for training materials and educational content
* **Social media**: Generate talking head content at scale for multiple platforms
* **Customer support**: Build video responses with consistent brand representatives
* **Localization**: Produce dubbed videos with lip-synced speech in different languages

### Generate talking video with Veed Fabric 1.0

Submit a portrait image URL and audio file URL along with the desired resolution. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/lip-sync/veed-fabric-1-0" icon="microphone-lines" href="/api-reference/lip-sync/veed-fabric-1-0/generate">
      Create a new lip-sync video generation task
    </Card>

    <Card title="GET /v1/ai/lip-sync/veed-fabric-1-0" icon="list" href="/api-reference/lip-sync/veed-fabric-1-0/veed-fabric-1-0-tasks">
      List all Veed Fabric 1.0 tasks
    </Card>

    <Card title="GET /v1/ai/lip-sync/veed-fabric-1-0/{task-id}" icon="magnifying-glass" href="/api-reference/lip-sync/veed-fabric-1-0/task-by-id">
      Get task status and results by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter     | Type     | Required | Default | Description                                                                                                         |
| ------------- | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| `image_url`   | `string` | Yes      | -       | URL of the portrait image to animate. Must be publicly accessible. Use a clear, front-facing photo for best results |
| `audio_url`   | `string` | Yes      | -       | URL of the audio file for lip synchronization. Supported formats: MP3, WAV, M4A. Must be publicly accessible        |
| `resolution`  | `string` | Yes      | -       | Output video resolution: `"720p"` (1280x720) or `"480p"` (854x480)                                                  |
| `webhook_url` | `string` | No       | -       | HTTPS URL for task completion notification                                                                          |

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is Veed Fabric 1.0 and how does it work?">
    Veed Fabric 1.0 is an AI lip-sync API that generates realistic talking videos from a static portrait image and an audio file. You submit an image URL and audio URL via the API, receive a task ID immediately, then poll for results or receive a webhook notification when processing completes. The output is an MP4 video where the person in the image speaks in sync with the provided audio.
  </Accordion>

  <Accordion title="What image formats does Veed Fabric 1.0 accept?">
    Veed Fabric 1.0 accepts common image formats via a publicly accessible URL. For best lip-sync results, use a clear, front-facing portrait photo where the face is fully visible and well-lit.
  </Accordion>

  <Accordion title="What audio formats are supported?">
    Veed Fabric 1.0 supports MP3, WAV, and M4A audio formats. The audio file must be hosted at a publicly accessible URL. The model analyzes speech patterns in the audio to generate matching lip movements.
  </Accordion>

  <Accordion title="What output resolutions are available?">
    Two resolutions are available: `720p` (1280x720) for production-quality output and `480p` (854x480) for drafts or faster processing. The resolution is set via the required `resolution` parameter.
  </Accordion>

  <Accordion title="What is the difference between Veed Fabric 1.0 and Veed Fabric 1.0 Fast?">
    Veed Fabric 1.0 prioritizes generation quality with higher fidelity lip synchronization. Veed Fabric 1.0 Fast is optimized for reduced generation time while maintaining quality lip-sync results. Choose Veed Fabric 1.0 when output quality is the priority, or Veed Fabric 1.0 Fast when speed is more important.
  </Accordion>

  <Accordion title="What are the rate limits for Veed Fabric 1.0?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits.
  </Accordion>

  <Accordion title="How much does Veed Fabric 1.0 cost?">
    See the [Pricing page](/pricing) for current rates and subscription options.
  </Accordion>
</AccordionGroup>

## Best practices

* **Image quality**: Use well-lit, front-facing portrait photos with a clearly visible face for the most accurate lip sync
* **Audio clarity**: Clean audio with minimal background noise produces better lip-sync accuracy
* **Resolution choice**: Use `720p` for final production videos and `480p` for quick previews or prototyping
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[Veed Fabric 1.0 Fast](/api-reference/lip-sync/veed-fabric-1-0-fast/overview)**: Faster lip-sync generation with optimized processing time
* **[Latent Sync](/api-reference/lip-sync/latent-sync/overview)**: Alternative lip synchronization technology
* **[Voiceover](/api-reference/voiceover/overview)**: Generate speech audio from text to use as lip-sync input
* **[Sound Effects](/api-reference/sound-effects/overview)**: Generate sound effects from text descriptions

  