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

# Latent Sync – Lip Sync API

> Advanced AI-powered lip synchronization technology for realistic facial animation and speech-to-video matching with high-quality, production-ready outputs.

<Card title="Latent Sync integration" icon="microphone-lines">
  Powered by Latent Sync technology, this API provides state-of-the-art lip synchronization capabilities for creating realistic talking avatar videos from audio input.
</Card>

Latent Sync is an advanced AI-powered lip synchronization solution that creates realistic facial animations synchronized with audio input. It generates high-quality talking avatar videos by intelligently matching mouth movements to speech patterns, delivering natural and believable results suitable for production environments.

### Key capabilities

* High-quality lip synchronization with natural facial movements
* Support for multiple languages and accents
* Realistic expression preservation during speech animation
* Production-ready video outputs with consistent quality
* Fast processing times optimized for real-time applications

### Use cases

* Avatar creation for virtual presentations and digital content
* Video dubbing and localization with synchronized lip movements
* Interactive chatbots and virtual assistants with realistic speech
* Educational content with animated instructors or characters
* Marketing videos with personalized spokesperson animations

<div className="my-11">
  <Columns cols={2}>
    <Card title="POST /v1/ai/lip-sync/latent-sync" icon="video" href="/api-reference/lip-sync/latent-sync/post-latent-sync">
      Create a Latent Sync lip sync task
    </Card>

    <Card title="GET /v1/ai/lip-sync/latent-sync/{task-id}" icon="code" href="/api-reference/lip-sync/latent-sync/get-{task-id}-by-id">
      Check Latent Sync task status
    </Card>

    <Card title="GET /v1/ai/lip-sync/latent-sync" icon="list" href="/api-reference/lip-sync/latent-sync/get-latent-sync">
      List Latent Sync tasks
    </Card>
  </Columns>
</div>

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="What audio formats are supported for lip sync?">
    Latent Sync supports common audio formats including MP3, WAV, and AAC. The API automatically processes the audio to extract speech patterns for optimal lip synchronization.
  </Accordion>

  <Accordion title="How accurate is the lip synchronization?">
    Latent Sync uses advanced AI models trained specifically for speech-to-lip mapping, providing highly accurate synchronization that maintains natural facial expressions and realistic mouth movements.
  </Accordion>

  <Accordion title="Can I use custom avatar images or videos?">
    Yes, you can provide your own base images or videos that will be animated with synchronized lip movements. The system works best with clear, front-facing portraits.
  </Accordion>

  <Accordion title="What languages are supported?">
    Latent Sync supports multiple languages and can handle various accents and speech patterns. The AI model adapts to different linguistic characteristics for optimal results.
  </Accordion>

  <Accordion title="Are the outputs suitable for commercial use?">
    Yes, Latent Sync generates production-quality videos suitable for commercial applications, marketing content, and professional presentations.
  </Accordion>
</AccordionGroup>

