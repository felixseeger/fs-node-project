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

# ElevenLabs Voiceover - Text-to-Speech API

> Generate natural-sounding voiceovers from text with ElevenLabs AI. Professional speech synthesis with voice customization, multi-language support, and high-quality audio output.

<Card title="ElevenLabs integration" icon="microphone-lines">
  Powered by ElevenLabs technology, this API generates natural-sounding speech from text with customizable voice settings and multi-language support.
</Card>

ElevenLabs Voiceover is a text-to-speech API that converts text into natural-sounding audio using AI voice synthesis. Generate professional voiceovers for videos, podcasts, presentations, e-learning content, and accessibility applications. The API supports up to 40,000 characters per request with the Turbo model and delivers high-quality audio output suitable for production use.

### Key capabilities

* **AI model**: `eleven_turbo_v2_5` optimized for fast, high-quality generation (up to 10,000 characters)
* **Voice customization**: Control stability (0-1), similarity boost (0-1), and speech speed (0.7-1.2x)
* **Speaker boost**: Enhanced voice clarity and presence in generated audio
* **Multi-language support**: UTF-8 text including accented letters and non-Latin scripts
* **Maximum text length**: Up to 40,000 characters per request
* **Async processing**: Webhook notifications or polling for task completion

### Use cases

* **Video production**: Create voiceovers for marketing videos, tutorials, and social media content
* **Podcast production**: Generate intro/outro narration or read content aloud
* **E-learning**: Convert educational materials to audio for accessibility and engagement
* **Accessibility**: Provide audio versions of written content for visually impaired users
* **IVR systems**: Generate professional voice prompts for phone systems
* **Audiobook creation**: Convert written content into natural-sounding audio narration

### Generate voiceover with ElevenLabs

Create voiceovers by submitting text to the API with a voice ID. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/voiceover" icon="microphone-lines" href="/api-reference/voiceover/generate">
      Create a new voiceover generation task
    </Card>

    <Card title="GET /v1/ai/voiceover" icon="list" href="/api-reference/voiceover/voiceover-tasks">
      List all voiceover tasks with status
    </Card>

    <Card title="GET /v1/ai/voiceover/{task-id}" icon="magnifying-glass" href="/api-reference/voiceover/task-by-id">
      Get task status and results by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter           | Type      | Required | Default               | Description                                                           |
| ------------------- | --------- | -------- | --------------------- | --------------------------------------------------------------------- |
| `text`              | `string`  | Yes      | -                     | Text to convert to speech. UTF-8 supported, 1-40,000 characters       |
| `voice_id`          | `string`  | Yes      | -                     | ElevenLabs voice ID from the voice library                            |
| `model`             | `string`  | No       | `"eleven_turbo_v2_5"` | AI model for speech synthesis                                         |
| `stability`         | `number`  | No       | `0.5`                 | Voice consistency: 0.0 (expressive) to 1.0 (stable)                   |
| `similarity_boost`  | `number`  | No       | `0.2`                 | Voice matching: 0.0 (varied) to 1.0 (close match, may have artifacts) |
| `speed`             | `number`  | No       | `1.0`                 | Speech rate: 0.7 (30% slower) to 1.2 (20% faster)                     |
| `use_speaker_boost` | `boolean` | No       | `true`                | Enable enhanced voice clarity and presence                            |
| `webhook_url`       | `string`  | No       | -                     | URL for task completion notification                                  |

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is ElevenLabs Voiceover and how does it work?">
    ElevenLabs Voiceover is a text-to-speech API that converts text into natural-sounding audio using AI voice synthesis. You submit text with a voice ID, receive a task ID immediately, then poll for results or receive a webhook notification when processing completes. The output is a high-quality audio file containing the synthesized speech.
  </Accordion>

  <Accordion title="What model is used for voiceover generation?">
    The `eleven_turbo_v2_5` model is used, optimized for fast, high-quality speech synthesis. It supports up to 10,000 characters per request and is ideal for both real-time applications and production use.
  </Accordion>

  <Accordion title="How do I find voice IDs for ElevenLabs voices?">
    Voice IDs are unique identifiers for each voice in the ElevenLabs voice library. You can find voice IDs in the ElevenLabs Voice Library. A common example voice ID is `21m00Tcm4TlvDq8ikWAM` (Rachel - a calm, professional female voice).
  </Accordion>

  <Accordion title="What do the stability and similarity_boost parameters control?">
    `stability` (0-1) controls voice consistency: lower values produce more expressive, varied speech; higher values produce more consistent, stable output. `similarity_boost` (0-1) controls how closely the output matches the original voice sample: higher values match more closely but may introduce artifacts.
  </Accordion>

  <Accordion title="What languages does ElevenLabs Voiceover support?">
    ElevenLabs Voiceover supports multiple languages through UTF-8 text encoding, including accented letters (e.g., e, n, u) and non-Latin scripts. The specific languages available depend on the voice selected - many voices support multiple languages natively.
  </Accordion>

  <Accordion title="How long does voiceover generation take?">
    Processing time depends on text length and model selection. The `eleven_turbo_v2_5` model is optimized for speed and generates audio faster. For production workflows with longer texts, use webhooks instead of polling to receive completion notifications.
  </Accordion>

  <Accordion title="What are the rate limits for voiceover generation?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits by tier. For high-volume production use, consider using webhooks for efficient task management.
  </Accordion>
</AccordionGroup>

## Best practices

* **Voice selection**: Choose a voice appropriate for your content and audience
* **Model**: The `eleven_turbo_v2_5` model provides fast, high-quality results for all use cases
* **Stability tuning**: Start with 0.5, decrease for more expressive reads, increase for more consistent output
* **Speed adjustment**: Use 0.7-0.9 for slower, clearer speech; 1.0-1.2 for faster narration
* **Text preparation**: Use proper punctuation for natural pauses; avoid very long sentences
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[Sound Effects](/api-reference/sound-effects/post-sound-effects)**: Generate sound effects from text descriptions
* **[Audio Isolation](/api-reference/audio-isolation/overview)**: Extract specific sounds from audio or video files
* **[Lip Sync](/api-reference/lip-sync/latent-sync/overview)**: Synchronize lip movements with audio
* **[OmniHuman 1.5](/api-reference/video/omni-human-1-5)**: Generate human animations driven by audio

