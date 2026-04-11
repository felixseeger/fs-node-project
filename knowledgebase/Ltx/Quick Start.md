***

title: Quick Start
subtitle: Get started with the LTX API in minutes
slug: quickstart
description: >-
Learn how to get started with the LTX API in minutes. This quick start guide
walks you through setup, authentication, and your first video generation
request.
seo:
title: Quick Start | LTX Model
description: >-
Learn how to get started with the LTX API in minutes. This quick start guide
walks you through setup, authentication, and your first video generation
request.
canonical: '[https://docs.ltx.video/quickstart](https://docs.ltx.video/quickstart)'
'og:title': Quick Start
'og:description': >-
Learn how to get started with the LTX API in minutes. This quick start guide
walks you through setup, authentication, and your first video generation
request.
'twitter:title': Quick Start
'twitter:description': >-
Learn how to get started with the LTX API in minutes. This quick start guide
walks you through setup, authentication, and your first video generation
request.
--------

## Get your API Key

Sign in to the Developer Console to create your API key.

<Button href="https://console.ltx.video" intent="primary" icon="fa-solid fa-key">
  Create API Key
</Button>

## Make your first request

### Text-to-Video

Generate a video from a text prompt:

<CodeBlock title="Request">
  ```bash
  curl -X POST https://api.ltx.video/v1/text-to-video \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "prompt": "A majestic eagle soaring through clouds at sunset",
      "model": "ltx-2-3-pro",
      "duration": 8,
      "resolution": "1920x1080"
    }' \
    -o video.mp4
  ```
</CodeBlock>

The API returns the generated video file directly as an MP4.

### Image-to-Video

Transform a static image into a dynamic video:

<CodeBlock title="Request">
  ```bash
  curl -X POST https://api.ltx.video/v1/image-to-video \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "image_uri": "https://example.com/sunset.jpg",
      "prompt": "Clouds drifting across the sky as the sun sets slowly",
      "model": "ltx-2-3-pro",
      "duration": 8,
      "resolution": "1920x1080"
    }' \
    -o video.mp4
  ```
</CodeBlock>

## Response

Successful requests return:

* **Body**: The generated video file (MP4 format)
* **Headers**:
  * `Content-Type: video/mp4`
  * `x-request-id`: Unique identifier for tracking

## Next Steps

<CardGroup cols={3}>
  <Card title="Supported Models" icon="fa-solid fa-microchip" href="/models">
    Learn about available models and their capabilities
  </Card>

  <Card title="API Reference" icon="fa-solid fa-code" href="/api-documentation/api-reference">
    Explore all endpoints and parameters
  </Card>
</CardGroup>
