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

# ElevenLabs Music API

> Generate original music from text with ElevenLabs Music. Create 10-240 second tracks in any genre for videos, games, and ads.

<Card title="ElevenLabs Music integration" icon="music">
  Powered by ElevenLabs technology, this API generates original music tracks from text descriptions.
</Card>

ElevenLabs Music is an AI-powered music generation API that creates original music tracks from text descriptions. Describe the style, mood, instruments, and tempo you want, and receive a high-quality MP3 audio file. The API supports customizable track durations from 10 seconds to 4 minutes, with typical generation times of 30-90 seconds.

### Key capabilities

* **Text-guided generation**: Describe any music style to generate (e.g., "Upbeat jazz with piano and drums", "Cinematic orchestral soundtrack")
* **Customizable duration**: Generate tracks from 10 seconds to 240 seconds (4 minutes)
* **High-quality output**: Professional-grade MP3 audio files suitable for production use
* **Genre flexibility**: Support for any music genre, style, or mood
* **Async processing**: Webhook notifications or polling for task completion

### Use cases

* **Video production**: Create background music for videos and presentations
* **Game development**: Generate custom soundtracks for games and apps
* **Content creation**: Produce unique music for podcasts, streams, and social media
* **Advertising**: Create original jingles and background tracks for ads
* **Film production**: Generate temp tracks or production music for films

### Generate music with ElevenLabs

Submit a text description of the music you want to create along with the desired duration. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/music-generation" icon="music" href="/api-reference/music-generation/generate">
      Create a new music generation task
    </Card>

    <Card title="GET /v1/ai/music-generation" icon="list" href="/api-reference/music-generation/music-generation-tasks">
      List all music generation tasks
    </Card>

    <Card title="GET /v1/ai/music-generation/{task-id}" icon="magnifying-glass" href="/api-reference/music-generation/task-by-id">
      Get task status and results by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter              | Type      | Required | Default | Description                                                                                            |
| ---------------------- | --------- | -------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `prompt`               | `string`  | Yes      | -       | Text description of the music to generate (e.g., "Upbeat jazz with piano", "Melancholic piano ballad") |
| `music_length_seconds` | `integer` | Yes      | -       | Duration of the generated track in seconds (10-240)                                                    |
| `webhook_url`          | `string`  | No       | -       | HTTPS URL for task completion notification                                                             |

### Prompt tips

For best results, include details about:

* **Genre**: jazz, electronic, classical, rock, ambient, etc.
* **Mood**: upbeat, melancholic, energetic, peaceful, dramatic
* **Instruments**: piano, guitar, drums, synthesizer, strings, etc.
* **Tempo**: slow, moderate, fast-paced, groove

**Example prompts:**

* "A Blues guitar solo with emotional bends and slides"
* "Upbeat electronic dance music with synthesizers and heavy bass"
* "Peaceful ambient piano with gentle strings in the background"
* "Cinematic orchestral piece building to an epic climax"
* "Modern corporate background music with light piano and subtle electronic elements"

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is ElevenLabs Music and how does it work?">
    ElevenLabs Music is an AI-powered text-to-music API. You submit a text description of the music you want (genre, mood, instruments, tempo) along with the desired duration, receive a task ID immediately, then poll for results or receive a webhook notification. The output is a high-quality MP3 audio file.
  </Accordion>

  <Accordion title="What music duration range is supported?">
    You can generate music tracks from 10 seconds (minimum) to 240 seconds / 4 minutes (maximum). The duration is specified in the `music_length_seconds` parameter.
  </Accordion>

  <Accordion title="How do I write effective music prompts?">
    Be specific about genre, mood, instruments, and tempo. Good examples: "Upbeat jazz with piano and brushed drums", "Melancholic acoustic guitar ballad", "Epic orchestral soundtrack with building tension". Avoid vague prompts like just "music" or "song".
  </Accordion>

  <Accordion title="What is the output format?">
    ElevenLabs Music outputs MP3 audio files at professional quality. The generated audio is delivered via a URL that remains accessible for download after task completion.
  </Accordion>

  <Accordion title="How long does generation take?">
    Generation typically takes 30-90 seconds depending on track duration. Shorter tracks (10-30 seconds) usually complete in under a minute, while maximum-length tracks (4 minutes) may take 1-2 minutes. For production workflows, use webhooks for efficient notification.
  </Accordion>

  <Accordion title="What are the rate limits for ElevenLabs Music?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits.
  </Accordion>

  <Accordion title="How much does ElevenLabs Music cost?">
    See the [Pricing page](/pricing) for current rates and subscription options.
  </Accordion>
</AccordionGroup>

## Best practices

* **Prompt specificity**: Use detailed descriptions for better generation accuracy
* **Duration planning**: Consider your use case when selecting track length
* **Genre mixing**: Combine styles for unique results (e.g., "jazz-influenced electronic")
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[Sound Effects](/api-reference/sound-effects/post-sound-effects)**: Generate sound effects from text descriptions
* **[Audio Isolation](/api-reference/audio-isolation/overview)**: Isolate specific sounds from audio files
* **[Lip Sync](/api-reference/lip-sync/latent-sync/overview)**: Synchronize lip movements to audio tracks
* **[OmniHuman 1.5](/api-reference/video/omni-human-1-5)**: Generate human animations driven by audio

