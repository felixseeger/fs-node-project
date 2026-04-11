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

# ElevenLabs Sound Effects - Text-to-Audio API

> Generate realistic sound effects from text with ElevenLabs Sound Effects. Create 0.5-22 second audio clips with looping support for videos, games, and multimedia.

<Card title="ElevenLabs Sound Effects integration" icon="waveform-lines">
  Powered by ElevenLabs technology, this API generates realistic sound effects from text descriptions.
</Card>

ElevenLabs Sound Effects is an AI-powered text-to-audio API that creates realistic sound effects from natural language descriptions. Describe any sound you need - from animal noises to mechanical sounds, nature ambience to UI feedback - and receive a high-quality audio file. The API supports customizable durations from 0.5 to 22 seconds, seamless looping for continuous playback, and prompt influence control for fine-tuned results.

### Key capabilities

* **Text-guided generation**: Describe any sound effect to generate (e.g., "A cat meowing", "Thunder rolling in the distance", "Keyboard typing")
* **Customizable duration**: Generate audio from 0.5 seconds to 22 seconds
* **Seamless looping**: Enable `loop` for smooth, continuous playback without audible breaks
* **Prompt influence control**: Adjust `prompt_influence` (0-1) to balance creativity vs. prompt adherence
* **High-quality output**: Professional-grade audio files suitable for production use
* **Fast generation**: Typical processing time of 5-15 seconds
* **Async processing**: Webhook notifications or polling for task completion

### Use cases

* **Video production**: Create custom sound effects for films, commercials, and social media videos
* **Game development**: Generate UI sounds, environmental ambience, and character audio
* **Podcast production**: Add sound effects and transitions to audio content
* **App development**: Create notification sounds, button clicks, and interface feedback
* **Animation**: Produce foley sounds and effects for animated content
* **Presentations**: Enhance slideshows and corporate videos with custom audio

### Generate sound effects with ElevenLabs

Submit a text description of the sound effect you want along with the desired duration. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/sound-effects" icon="waveform-lines" href="/api-reference/sound-effects/post-sound-effects">
      Create a new sound effect generation task
    </Card>

    <Card title="GET /v1/ai/sound-effects" icon="list" href="/api-reference/sound-effects/get-sound-effects">
      List all sound effects tasks
    </Card>

    <Card title="GET /v1/ai/sound-effects/{task-id}" icon="magnifying-glass" href="/api-reference/sound-effects/get-{task-id}-by-id">
      Get task status and results by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter          | Type      | Required | Default | Description                                                            |
| ------------------ | --------- | -------- | ------- | ---------------------------------------------------------------------- |
| `text`             | `string`  | Yes      | -       | Text description of the sound effect to generate (max 2500 characters) |
| `duration_seconds` | `number`  | Yes      | -       | Duration of the generated audio (0.5-22 seconds)                       |
| `loop`             | `boolean` | No       | `false` | Create a sound effect that loops smoothly without audible breaks       |
| `prompt_influence` | `number`  | No       | `0.3`   | Influence of the prompt on generation (0-1, higher = more literal)     |
| `webhook_url`      | `string`  | No       | -       | HTTPS URL for task completion notification                             |

### Prompt tips

For best results, include details about:

* **Sound type**: Specify the exact sound (cat meowing, door creaking, rain falling)
* **Intensity**: Describe loudness or energy (soft, loud, aggressive, gentle)
* **Environment**: Add context (indoor, outdoor, underwater, in a cave)
* **Duration characteristics**: For loops, describe continuous sounds (steady rain, humming motor)

**Example prompts:**

* "A cat meowing softly, indoor setting"
* "Ocean waves crashing on the beach, steady rhythm"
* "Thunder rolling in the distance during a storm"
* "Keyboard typing rapidly on a mechanical keyboard"
* "Glass shattering on a hard floor"
* "A car engine starting and idling"
* "Birds chirping in a forest at dawn"
* "Footsteps on gravel, slow walking pace"

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is ElevenLabs Sound Effects and how does it work?">
    ElevenLabs Sound Effects is an AI-powered text-to-audio API that generates realistic sound effects from natural language descriptions. You submit a text description of the sound you want (e.g., "A cat meowing") along with the duration, receive a task ID immediately, then poll for results or receive a webhook notification. The output is a high-quality audio file ready for use in production.
  </Accordion>

  <Accordion title="What duration range is supported?">
    You can generate sound effects from 0.5 seconds (minimum) to 22 seconds (maximum). The duration is specified as a decimal number in the `duration_seconds` parameter. For longer audio, consider using the loop feature and playing the clip multiple times.
  </Accordion>

  <Accordion title="How does the loop feature work?">
    When `loop` is set to `true`, the API generates audio that seamlessly connects end-to-beginning without audible breaks. This is ideal for continuous sounds like rain, wind, machinery hum, or ambient noise that need to play indefinitely. The loop feature works best with sustained, consistent sounds rather than one-time events.
  </Accordion>

  <Accordion title="What does prompt_influence control?">
    The `prompt_influence` parameter (0-1) controls how closely the generated audio matches your text description. Lower values (0-0.3) allow more creative interpretation, while higher values (0.7-1) produce more literal results. The default of 0.3 balances creativity with prompt adherence.
  </Accordion>

  <Accordion title="How do I write effective sound prompts?">
    Be specific about the sound type, intensity, and environment. Good examples: "A cat meowing softly indoors", "Heavy rain on a metal roof", "Car engine starting then idling". Avoid vague prompts like "noise" or "sound" - instead describe exactly what you want to hear.
  </Accordion>

  <Accordion title="What is the output format?">
    ElevenLabs Sound Effects outputs high-quality audio files suitable for professional production use. The generated audio is delivered via a URL that remains accessible for download after task completion.
  </Accordion>

  <Accordion title="How long does generation take?">
    Generation typically takes 5-15 seconds depending on the requested duration and complexity. Shorter clips (under 5 seconds) usually complete in under 10 seconds. For production workflows, use webhooks for efficient notification instead of polling.
  </Accordion>

  <Accordion title="What are the rate limits for Sound Effects?">
    Rate limits vary by subscription tier. See [Rate Limits](/ratelimits) for current limits.
  </Accordion>

  <Accordion title="How much does Sound Effects cost?">
    See the [Pricing page](/pricing) for current rates and subscription options.
  </Accordion>
</AccordionGroup>

## Best practices

* **Prompt specificity**: Use detailed descriptions with context for better results
* **Loop planning**: Use loop=true for ambient sounds, loop=false for one-shot effects
* **Duration matching**: Match duration to your use case - shorter for UI sounds, longer for ambience
* **Prompt influence tuning**: Start with default (0.3), increase for more literal results
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[Music Generation](/api-reference/music-generation/overview)**: Generate original music tracks from text descriptions
* **[Audio Isolation](/api-reference/audio-isolation/overview)**: Isolate specific sounds from audio or video files
* **[Lip Sync](/api-reference/lip-sync/latent-sync/overview)**: Synchronize lip movements with audio tracks

