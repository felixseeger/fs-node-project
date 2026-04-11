***

title: Supported Models
subtitle: Choose the right model for your use case
slug: models
description: >-
Explore all supported LTX models for text-to-video, image-to-video, and other
generation tasks. Learn their capabilities and best use cases.
seo:
title: Supported Models | LTX Model
description: >-
Explore all supported LTX models for text-to-video, image-to-video, and
other generation tasks. Learn their capabilities and best use cases.
canonical: '[https://docs.ltx.video/models](https://docs.ltx.video/models)'
'og:title': Supported Models
'og:description': >-
Explore all supported LTX models for text-to-video, image-to-video, and
other generation tasks. Learn their capabilities and best use cases.
'twitter:title': Supported Models
'twitter:description': >-
Explore all supported LTX models for text-to-video, image-to-video, and
other generation tasks. Learn their capabilities and best use cases.
--------------------------------------------------------------------

The LTX API offers video generation powered by **LTX-2.3** — portrait and landscape up to 4K, cinematic frame rates, and first-to-last frame control. Models are available in **Fast** and **Pro** variants.

## Featured models

<CardGroup cols={2}>
  <Card title="LTX-2.3" icon="fa-regular fa-sparkles">
    Portrait and landscape video up to 4K. Cinematic frame rates (24/48 fps), first-to-last frame control for [image-to-video](/api-documentation/api-reference/video-generation/image-to-video), and sharp detail with accurate prompt handling.
  </Card>

  <Card title="LTX-2" icon="fa-regular fa-cube">
    Landscape video up to 4K at 25/50 fps with synchronized audio generation.
  </Card>
</CardGroup>

## Model variants

<CardGroup cols={2}>
  <Card title="Fast" icon="fa-regular fa-bolt">
    Optimized for speed and low cost. Best for rapid prototyping, brainstorming, storyboarding, and quick iteration. Supports longer durations (up to 20s at 1080p/25fps).
  </Card>

  <Card title="Pro" icon="fa-regular fa-gem">
    Higher fidelity with better motion stability and visual detail. Best for final renders and commercial-grade output. Required for audio-to-video, retake, and extend endpoints.
  </Card>
</CardGroup>

<Callout intent="tip">
  Start with Fast to explore compositions quickly, then switch to Pro for the final render.
</Callout>

## Endpoint compatibility

Not every endpoint supports every model. Audio-to-video, retake, and extend require a Pro model.

| Endpoint                                                                           | Fast | Pro |
| ---------------------------------------------------------------------------------- | ---- | --- |
| [text-to-video](/api-documentation/api-reference/video-generation/text-to-video)   | ✓    | ✓   |
| [image-to-video](/api-documentation/api-reference/video-generation/image-to-video) | ✓    | ✓   |
| [audio-to-video](/api-documentation/api-reference/video-generation/audio-to-video) | —    | ✓   |
| [retake](/api-documentation/api-reference/video-generation/retake)                 | —    | ✓   |
| [extend](/api-documentation/api-reference/video-generation/extend)                 | —    | ✓   |

## Model support matrix

Resolutions, FPS values, and duration options supported by each model.

<Tabs>
  <Tab title="LTX-2.3">
    | Model            | Resolution | FPS            | Duration (seconds)           |
    | ---------------- | ---------- | -------------- | ---------------------------- |
    | **ltx-2-3-fast** | 1080p      | 24, 25         | 6, 8, 10, 12, 14, 16, 18, 20 |
    |                  | 1080p      | 48, 50         | 6, 8, 10                     |
    |                  | 1440p      | 24, 25, 48, 50 | 6, 8, 10                     |
    |                  | 4K         | 24, 25, 48, 50 | 6, 8, 10                     |
    | **ltx-2-3-pro**  | 1080p      | 24, 25, 48, 50 | 6, 8, 10                     |
    |                  | 1440p      | 24, 25, 48, 50 | 6, 8, 10                     |
    |                  | 4K         | 24, 25, 48, 50 | 6, 8, 10                     |

    <Callout intent="info">
      **Aspect ratios:** 16:9 (landscape) and 9:16 (portrait).
    </Callout>

    | Resolution | 16:9 (landscape) | 9:16 (portrait) |
    | ---------- | ---------------- | --------------- |
    | 1080p      | `1920x1080`      | `1080x1920`     |
    | 1440p      | `2560x1440`      | `1440x2560`     |
    | 4K         | `3840x2160`      | `2160x3840`     |
  </Tab>

  <Tab title="LTX-2">
    | Model          | Resolution | FPS    | Duration (seconds)           |
    | -------------- | ---------- | ------ | ---------------------------- |
    | **ltx-2-fast** | 1080p      | 25     | 6, 8, 10, 12, 14, 16, 18, 20 |
    |                | 1080p      | 50     | 6, 8, 10                     |
    |                | 1440p      | 25, 50 | 6, 8, 10                     |
    |                | 4K         | 25, 50 | 6, 8, 10                     |
    | **ltx-2-pro**  | 1080p      | 25, 50 | 6, 8, 10                     |
    |                | 1440p      | 25, 50 | 6, 8, 10                     |
    |                | 4K         | 25, 50 | 6, 8, 10                     |

    <Callout intent="info">
      **Aspect ratio:** 16:9 (landscape) only.
    </Callout>

    | Resolution | API value   |
    | ---------- | ----------- |
    | 1080p      | `1920x1080` |
    | 1440p      | `2560x1440` |
    | 4K         | `3840x2160` |
  </Tab>
</Tabs>

## Pricing

For per-second pricing by model and resolution, see the [Pricing](/pricing) page.
