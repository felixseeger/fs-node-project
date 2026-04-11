***

title: API Documentation
subtitle: >-
Power your creativity with LTX — an advanced model built for seamless video
generation
slug: welcome
description: >-
Power your creativity with LTX — an advanced model built for seamless video
generation. Access our AI API to create high-quality visual content at scale.
seo:
title: API Documentation | LTX Model
description: >-
Power your creativity with LTX — an advanced model built for seamless video
generation. Access our AI API to create high-quality visual content at
scale.
canonical: '[https://docs.ltx.video/welcome](https://docs.ltx.video/welcome)'
'og:title': API Documentation
'og:description': >-
Power your creativity with LTX — an advanced model built for seamless video
generation. Access our AI API to create high-quality visual content at
scale.
'twitter:title': API Documentation
'twitter:description': >-
Power your creativity with LTX — an advanced model built for seamless video
generation. Access our AI API to create high-quality visual content at
scale.
------

Generate video with synchronized audio from text, images, and audio inputs. One HTTP call, one video back — no polling, no webhooks, no infrastructure to manage.

Powered by the [most downloaded open-source video model on Hugging Face](https://huggingface.co/Lightricks). Engineered for real-world workloads with predictable performance at any volume. Stable outputs, consistent fidelity, and infrastructure-grade reliability.

## LTX API Capabilities

All endpoints return video with synchronized audio — dialogue, music, and ambient sound are generated together with the visuals.

<CardGroup cols={2}>
  <Card title="Text-to-Video" icon="text" href="/api-documentation/api-reference/video-generation/text-to-video">
    Generate video from a text description. Describe a scene, camera movement, and mood — the API returns a complete video with matching audio. Up to 4K resolution and 20 seconds per request.
  </Card>

  <Card title="Image-to-Video" icon="image" href="/api-documentation/api-reference/video-generation/image-to-video">
    Animate a still image with realistic motion, depth, and audio. Provide a reference image and a prompt describing the desired motion. The output preserves the visual identity of the source image.
  </Card>

  <Card title="Audio-to-Video" icon="music" href="/api-documentation/api-reference/video-generation/audio-to-video">
    Generate video driven by an audio track. Supply dialogue, music, or ambient sound and the API produces visuals synchronized to the audio. Optionally condition on a reference image for visual direction.
  </Card>

  <Card title="Retake" icon="rotate" href="/api-documentation/api-reference/video-generation/retake">
    Re-generate a specific section of an existing video without starting over. Select a time range and mode (replace video, audio, or both) to iterate on parts of a generation while keeping the rest intact.
  </Card>

  <Card title="Extend" icon="arrow-right" href="/api-documentation/api-reference/video-generation/extend">
    Lengthen an existing video from the beginning or end. Provide a video, a duration, and a context window — the API generates new frames that continue seamlessly from the original, preserving audio and visual continuity.
  </Card>
</CardGroup>

## Get Started

<CardGroup cols={2}>
  <Card title="Get an API Key" icon="key" href="https://console.ltx.video">
    Sign up at the developer console and generate your key.
  </Card>

  <Card title="Quick Start" icon="bolt" href="/quickstart">
    Make your first request and generate a video in minutes.
  </Card>

  <Card title="Supported Models" icon="microchip" href="/models">
    Choose between fast and pro models for speed or quality.
  </Card>

  <Card title="Pricing" icon="receipt" href="/pricing">
    Per-second pricing with no minimums or hidden fees.
  </Card>
</CardGroup>
