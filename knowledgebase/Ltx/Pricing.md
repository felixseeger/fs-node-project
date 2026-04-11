***

title: Pricing
subtitle: API pricing for video generation
slug: pricing
description: >-
Detailed pricing for LTX API video generation endpoints. Understand cost per
second based on model, resolution, and endpoint type.
seo:
title: Pricing | LTX Model
description: >-
Detailed pricing for LTX API video generation endpoints. Understand cost per
second based on model, resolution, and endpoint type.
canonical: '[https://docs.ltx.video/pricing](https://docs.ltx.video/pricing)'
'og:title': Pricing
'og:description': >-
Detailed pricing for LTX API video generation endpoints. Understand cost per
second based on model, resolution, and endpoint type.
'twitter:title': Pricing
'twitter:description': >-
Detailed pricing for LTX API video generation endpoints. Understand cost per
second based on model, resolution, and endpoint type.
-----------------------------------------------------

Video generation is billed per second of output video. Higher resolution and premium models have proportionally higher costs.

<Callout intent="warning">
  **Pricing update:** Starting April 1, 2026, pricing for **LTX 2.3** Text-to-Video and Image-to-Video endpoints will be updated. See the updated rates in the tables below.
</Callout>

## Text-to-Video

Generate videos from text prompts. Pricing is based on the **duration of the generated video** in seconds.

| Endpoint                                                                                | Model            | Resolution                | Cost per second     |
| --------------------------------------------------------------------------------------- | ---------------- | ------------------------- | ------------------- |
| [**v1/text-to-video**](/api-documentation/api-reference/video-generation/text-to-video) | **ltx-2-fast**   | `1920x1080`               | \$0.04              |
|                                                                                         |                  | `2560x1440`               | \$0.08              |
|                                                                                         |                  | `3840x2160`               | \$0.16              |
|                                                                                         | **ltx-2-pro**    | `1920x1080`               | \$0.06              |
|                                                                                         |                  | `2560x1440`               | \$0.12              |
|                                                                                         |                  | `3840x2160`               | \$0.24              |
|                                                                                         | **ltx-2-3-fast** | `1920x1080` / `1080x1920` | ~~\$0.04~~ → \$0.06 |
|                                                                                         |                  | `2560x1440` / `1440x2560` | ~~\$0.08~~ → \$0.12 |
|                                                                                         |                  | `3840x2160` / `2160x3840` | ~~\$0.16~~ → \$0.24 |
|                                                                                         | **ltx-2-3-pro**  | `1920x1080` / `1080x1920` | ~~\$0.06~~ → \$0.08 |
|                                                                                         |                  | `2560x1440` / `1440x2560` | ~~\$0.12~~ → \$0.16 |
|                                                                                         |                  | `3840x2160` / `2160x3840` | ~~\$0.24~~ → \$0.32 |

## Image-to-Video

Generate videos from an input image. Pricing is based on the **duration of the generated video** in seconds.

| Endpoint                                                                                  | Model            | Resolution                | Cost per second     |
| ----------------------------------------------------------------------------------------- | ---------------- | ------------------------- | ------------------- |
| [**v1/image-to-video**](/api-documentation/api-reference/video-generation/image-to-video) | **ltx-2-fast**   | `1920x1080`               | \$0.04              |
|                                                                                           |                  | `2560x1440`               | \$0.08              |
|                                                                                           |                  | `3840x2160`               | \$0.16              |
|                                                                                           | **ltx-2-pro**    | `1920x1080`               | \$0.06              |
|                                                                                           |                  | `2560x1440`               | \$0.12              |
|                                                                                           |                  | `3840x2160`               | \$0.24              |
|                                                                                           | **ltx-2-3-fast** | `1920x1080` / `1080x1920` | ~~\$0.04~~ → \$0.06 |
|                                                                                           |                  | `2560x1440` / `1440x2560` | ~~\$0.08~~ → \$0.12 |
|                                                                                           |                  | `3840x2160` / `2160x3840` | ~~\$0.16~~ → \$0.24 |
|                                                                                           | **ltx-2-3-pro**  | `1920x1080` / `1080x1920` | ~~\$0.06~~ → \$0.08 |
|                                                                                           |                  | `2560x1440` / `1440x2560` | ~~\$0.12~~ → \$0.16 |
|                                                                                           |                  | `3840x2160` / `2160x3840` | ~~\$0.24~~ → \$0.32 |

## Audio-to-Video

Generate videos synchronized to audio input. Pricing is based on the **duration of the input audio** in seconds.

| Endpoint                                                                                  | Model           | Resolution  | Cost per second |
| ----------------------------------------------------------------------------------------- | --------------- | ----------- | --------------- |
| [**v1/audio-to-video**](/api-documentation/api-reference/video-generation/audio-to-video) | **ltx-2-pro**   | `1920x1080` | \$0.10          |
|                                                                                           | **ltx-2-3-pro** | `1920x1080` | \$0.10          |

## Retake (Video Editing)

Edit and regenerate portions of an existing video. Pricing is based on the **duration of the input video**.

| Endpoint                                                                  | Model           | Resolution  | Cost per second |
| ------------------------------------------------------------------------- | --------------- | ----------- | --------------- |
| [**v1/retake**](/api-documentation/api-reference/video-generation/retake) | **ltx-2-pro**   | `1920x1080` | \$0.10          |
|                                                                           | **ltx-2-3-pro** | `1920x1080` | \$0.10          |

## Extend (Video Extension)

Extend a video by generating additional frames at the beginning or end.
Pricing is based on the **duration of the extended portion** plus **context frames** from the input video, capped at a total of 505 billed frames. The resulting billed seconds depend on the input video's frame rate (\~21 seconds at 24fps).

| Endpoint                                                                  | Model           | Resolution  | Cost per second |
| ------------------------------------------------------------------------- | --------------- | ----------- | --------------- |
| [**v1/extend**](/api-documentation/api-reference/video-generation/extend) | **ltx-2-pro**   | `1920x1080` | \$0.10          |
|                                                                           | **ltx-2-3-pro** | `1920x1080` | \$0.10          |
