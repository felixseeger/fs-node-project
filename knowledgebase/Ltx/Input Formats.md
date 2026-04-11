***

title: Input Formats
subtitle: Media input specification for the API
slug: input-formats
description: >-
Complete guide to providing image and video inputs to the LTX API. Learn about
upload methods, supported formats, codecs, and constraints.
seo:
title: Input Formats | LTX Model
description: >-
Complete guide to providing image and video inputs to the LTX API. Learn
about upload methods, supported formats, codecs, and constraints.
canonical: '[https://docs.ltx.video/input-formats](https://docs.ltx.video/input-formats)'
'og:title': Input Formats
'og:description': >-
Complete guide to providing image and video inputs to the LTX API. Learn
about upload methods, supported formats, codecs, and constraints.
'twitter:title': Input Formats
'twitter:description': >-
Complete guide to providing image and video inputs to the LTX API. Learn
about upload methods, supported formats, codecs, and constraints.
-----------------------------------------------------------------

## Input Methods

The API accepts media through `image_uri`, `video_uri`, and `audio_uri` parameters using three methods:

| Method                                     | Max Size                             |
| ------------------------------------------ | ------------------------------------ |
| [**Cloud Storage**](#cloud-storage-upload) | 100 MB                               |
| [**HTTPS URL**](#https-url)                | 15 MB (images), 32 MB (videos/audio) |
| [**Data URI**](#data-uri-base64)           | 7 MB (images), 15 MB (videos/audio)  |

***

### Cloud Storage Upload

Upload via [`v1/upload`](/api-documentation/api-reference/upload/create-upload) endpoint. Returns a `storage_uri` for use in generation requests.

```json
{
  "image_uri": "ltx://uploads/abc-123"
}
```

| Max file size | Upload URL expires | File available | Authentication |
| ------------- | ------------------ | -------------- | -------------- |
| 100 MB        | 1 hour             | 24 hours       | API key        |

***

### HTTPS URL

Direct link to publicly accessible files. API fetches during request.

```json
{
  "image_uri": "https://example.com/sunset.jpg"
}
```

| Property | Images | Videos | Audio |
| -------- | ------ | ------ | ----- |
| Max size | 15 MB  | 32 MB  | 32 MB |
| Timeout  | 10s    | 30s    | 30s   |

**Requirements:**

* HTTPS only
* Domain names (no IPs)
* Publicly accessible
* No redirects

***

### Data URI (Base64)

Inline base64-encoded data. Format: `data:{mime-type};base64,{encoded-data}`

```json
{
  "image_uri": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
}
```

| Property         | Images | Videos | Audio |
| ---------------- | ------ | ------ | ----- |
| Max encoded size | 7 MB   | 15 MB  | 15 MB |

<Note>
  Base64 encoding increases file size by ~33%.
</Note>

***

## Supported Formats

### Images

| Format     | MIME Type    |
| ---------- | ------------ |
| PNG        | `image/png`  |
| JPEG / JPG | `image/jpeg` |
| WEBP       | `image/webp` |

### Videos

| Format | MIME Type          | Codecs       |
| ------ | ------------------ | ------------ |
| MP4    | `video/mp4`        | H.264, H.265 |
| MOV    | `video/quicktime`  | H.264, H.265 |
| MKV    | `video/x-matroska` | H.264, H.265 |

### Audio

| Format | MIME Type    | Codecs                    |
| ------ | ------------ | ------------------------- |
| WAV    | `audio/wav`  | AAC-LC, MP3, Vorbis, FLAC |
| MP3    | `audio/mpeg` | MP3                       |
| M4A    | `audio/mp4`  | AAC-LC                    |
| OGG    | `audio/ogg`  | Opus, Vorbis              |

<Note>
  AAC audio must use AAC-LC profile (1024 samples/frame). HE-AAC and HE-AACv2 (2048 samples/frame) are not supported. PCM audio is not supported.
</Note>
