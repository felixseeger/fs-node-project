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

# SAM Audio - Audio Isolation API | Freepik API

> Isolate specific sounds from audio or video with SAM Audio. Extract vocals, speech, instruments, or sound effects using text descriptions. WAV output for production workflows.

<Card title="SAM Audio integration" icon="waveform-lines">
  Powered by SAM Audio technology, this API isolates specific sounds from audio or video files using natural language descriptions.
</Card>

SAM Audio is an AI-powered audio isolation API that extracts specific sounds from audio or video files based on text descriptions. Describe what you want to isolate - vocals, speech, instruments, or sound effects - and receive a clean WAV file containing only that sound. The API supports both audio files (WAV, MP3, FLAC, OGG, M4A) and video files (MP4, MOV, WEBM, AVI) as input.

### Key capabilities

* **Text-guided isolation**: Describe any sound to extract (e.g., "A person speaking", "Piano playing", "Dog barking")
* **Multi-format input**: Accepts audio (WAV, MP3, FLAC, OGG, M4A) or video (MP4, MOV, WEBM, AVI) files
* **Video localization**: Optional bounding box (`x1`, `y1`, `x2`, `y2`) to focus on specific areas in video
* **Quality tuning**: Adjust `reranking_candidates` (1-8) to balance quality vs. latency
* **Event detection**: Enable `predict_spans` for better isolation of non-ambient sounds
* **WAV output**: High-quality WAV audio file with the isolated sound
* **Async processing**: Webhook notifications or polling for task completion

### Use cases

* **Music production**: Extract vocals from songs for remixes or karaoke tracks
* **Podcast editing**: Isolate speech from background noise or music
* **Film post-production**: Separate dialogue from ambient sounds for audio mixing
* **Sound design**: Extract specific sound effects from video recordings
* **Transcription services**: Clean up audio by isolating speech before transcription
* **Instrument isolation**: Separate specific instruments from full band recordings

### Isolate audio with SAM Audio

Submit an audio or video file with a text description of the sound to isolate. The service returns a task ID for async polling or webhook notification.

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/audio-isolation" icon="waveform-lines" href="/api-reference/audio-isolation/isolate">
      Create a new audio isolation task
    </Card>

    <Card title="GET /v1/ai/audio-isolation" icon="list" href="/api-reference/audio-isolation/audio-isolation-tasks">
      List all audio isolation tasks
    </Card>

    <Card title="GET /v1/ai/audio-isolation/{task-id}" icon="magnifying-glass" href="/api-reference/audio-isolation/task-by-id">
      Get task status and results by ID
    </Card>
  </Columns>
</div>

### Parameters

| Parameter              | Type      | Required | Default | Description                                                                           |
| ---------------------- | --------- | -------- | ------- | ------------------------------------------------------------------------------------- |
| `description`          | `string`  | Yes      | -       | Text description of the sound to isolate (e.g., "A person speaking", "Piano playing") |
| `audio`                | `string`  | No\*     | -       | URL or base64-encoded audio file (WAV, MP3, FLAC, OGG, M4A)                           |
| `video`                | `string`  | No\*     | -       | URL or base64-encoded video file (MP4, MOV, WEBM, AVI)                                |
| `x1`                   | `integer` | No       | `0`     | Bounding box left coordinate for video localization (0 = full frame)                  |
| `y1`                   | `integer` | No       | `0`     | Bounding box top coordinate for video localization (0 = full frame)                   |
| `x2`                   | `integer` | No       | `0`     | Bounding box right coordinate for video localization (0 = full frame)                 |
| `y2`                   | `integer` | No       | `0`     | Bounding box bottom coordinate for video localization (0 = full frame)                |
| `sample_fps`           | `integer` | No       | `2`     | Frame sampling rate for video (1-5 FPS)                                               |
| `reranking_candidates` | `integer` | No       | `1`     | Quality vs. latency trade-off (1-8, higher = better quality, slower)                  |
| `predict_spans`        | `boolean` | No       | `false` | Enable for better isolation of non-ambient, event-based sounds                        |
| `webhook_url`          | `string`  | No       | -       | URL for task completion notification                                                  |

\*Either `audio` or `video` must be provided, but not both.

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What is SAM Audio and how does it work?">
    SAM Audio is an AI-powered audio isolation API that uses text descriptions to identify and extract specific sounds from audio or video files. You submit a file with a description of the target sound (e.g., "A person speaking"), receive a task ID immediately, then poll for results or receive a webhook notification. The output is a WAV file containing only the isolated sound.
  </Accordion>

  <Accordion title="What audio and video formats does SAM Audio support?">
    For audio input: WAV, MP3, FLAC, OGG, and M4A formats. For video input: MP4, MOV, WEBM, and AVI formats. Files can be provided as URLs or base64-encoded strings.
  </Accordion>

  <Accordion title="How do I write effective sound descriptions?">
    Be specific and descriptive. Good examples: "A person speaking", "Piano playing in the background", "Dog barking loudly", "Acoustic guitar strumming". Avoid vague descriptions like "music" or "noise" - instead specify what type of music or sound you want to isolate.
  </Accordion>

  <Accordion title="What is the reranking_candidates parameter for?">
    The `reranking_candidates` parameter (1-8) controls the quality vs. speed trade-off. Higher values produce better isolation quality but take longer to process. Use `1` for fastest results, `8` for highest quality. Default is `1`.
  </Accordion>

  <Accordion title="When should I enable predict_spans?">
    Enable `predict_spans` when isolating non-ambient, event-based sounds like speech, individual notes, or sound effects. Keep it disabled (default) for continuous ambient sounds like background music or environmental noise.
  </Accordion>

  <Accordion title="How does video localization work with bounding boxes?">
    For video input, you can specify a bounding box (`x1`, `y1`, `x2`, `y2`) to focus on sounds originating from a specific area of the frame. This is useful when you want to isolate audio from a particular person or object in the video. Set all values to `0` (default) to process the full frame.
  </Accordion>

  <Accordion title="What is the output format?">
    SAM Audio outputs a high-quality WAV audio file containing only the isolated sound. This uncompressed format is ideal for further editing or processing in audio production workflows.
  </Accordion>
</AccordionGroup>

## Best practices

* **Description specificity**: Use detailed descriptions for better isolation accuracy
* **Input quality**: Higher quality input audio/video produces better isolation results
* **Quality tuning**: Start with `reranking_candidates=1` for testing, increase for production
* **Event sounds**: Enable `predict_spans` for speech, music notes, or sound effects
* **Video focus**: Use bounding boxes to isolate sounds from specific video regions
* **Production integration**: Use webhooks instead of polling for scalable applications
* **Error handling**: Implement retry logic with exponential backoff for 503 errors

## Related APIs

* **[Sound Effects](/api-reference/sound-effects/post-sound-effects)**: Generate sound effects from text descriptions
* **[Lip Sync](/api-reference/lip-sync/latent-sync/overview)**: Synchronize lip movements with audio
* **[OmniHuman 1.5](/api-reference/video/omni-human-1-5)**: Generate human animations driven by audio

