# Luma AI Video Generation API Documentation

## Overview & Authentication
The Dream Machine API enables advanced video generation using Luma's Ray models. To authenticate, use your API key as a Bearer token in the request headers.

```http
Authorization: Bearer <luma_api_key>
```

## Core Parameters

### Models
Luma offers two model versions for video generation:
- `ray-2` (High quality)
- `ray-flash-2` (Optimized for speed)

### Resolution & Aspect Ratio
- **Resolution:** `540p`, `720p`, `1080p`, `4k`
- **Aspect Ratio:** `1:1`, `3:4`, `4:3`, `9:16`, `16:9` (default), `9:21`, `21:9`
- **Duration:** Defines the video length, e.g., `"5s"`.
- **Loop:** Boolean flag (`true`/`false`) to create a seamless looping video.

---

## 1. Text-to-Video Generation

Generate a video purely from a text description.

**Endpoint:** `POST https://api.lumalabs.ai/dream-machine/v1/generations`

**Example Request:**
```bash
curl --request POST \
  --url https://api.lumalabs.ai/dream-machine/v1/generations \
  --header 'accept: application/json' \
  --header 'authorization: Bearer <luma_api_key>' \
  --header 'content-type: application/json' \
  --data '{
    "prompt": "an old lady laughing underwater, wearing a scuba diving suit",
    "model": "ray-2",
    "resolution": "720p",
    "duration": "5s"
  }'
```

---

## 2. Image-to-Video Generation

Generate a video using an image as a reference for the starting frame. Images must be provided via public CDN URLs.

**Keyframes Object:**
- `frame0`: Start frame. Type must be `"image"` and requires a `url`.

**Example Request:**
```bash
curl --request POST \
  --url https://api.lumalabs.ai/dream-machine/v1/generations \
  --header 'authorization: Bearer <luma_api_key>' \
  --header 'content-type: application/json' \
  --data '{
    "prompt": "A tiger walking in snow",
    "model": "ray-2",
    "keyframes": {
      "frame0": {
        "type": "image",
        "url": "https://example.com/image.jpg"
      }
    }
  }'
```

---

## 3. Video-to-Video (Extend, Reverse Extend, Interpolate)

You can use the ID of previously generated videos to extend them or create transitions.

*   **Extend Video:** Generates a continuation of a completed video.
    *   Set `frame0` to `{ "type": "generation", "id": "<UUID>" }`.
*   **Reverse Extend:** Generates video leading up to a provided video.
    *   Set `frame1` to `{ "type": "generation", "id": "<UUID>" }`.
*   **Interpolate:** Generates a smooth transition between two videos.
    *   Set both `frame0` and `frame1` to `{ "type": "generation", "id": "<UUID>" }`.

---

## 4. Camera Motions

Camera movement is natively controlled via natural language within the text `prompt` (e.g., "camera orbit left", "pan right"). 

To fetch a list of officially supported camera motion strings, you can use:
`GET https://api.lumalabs.ai/dream-machine/v1/generations/camera_motion/list`

---

## 5. Modify Video (Restyle & Retexture)

Modify Video allows you to restyle, retexture, or fundamentally change existing videos using text prompts and optional image guidance.

*   **Max Duration:** `ray-2` (10s), `ray-flash-2` (15s).
*   **Max File Size:** 100 MB.

### Parameters
*   `prompt`: A text value guiding how the video should be modified.
*   `media.url`: The URL of the source video file to be modified.
*   `first_frame.url` *(Optional, but preferred)*: An image URL to guide the first frame of the modified video.
*   `mode`: Determines how closely the output follows the source.
    *   **Adhere (`adhere_1`, `adhere_2`, `adhere_3`):** Stays very close to the source video. Ideal for subtle enhancements, minor retexturing, or light stylistic filters.
    *   **Flex (`flex_1`, `flex_2`, `flex_3`):** Flexibly follows shapes and characters. Allows for significant stylistic changes while keeping elements recognizable.
    *   **Reimagine (`reimagine_1`, `reimagine_2`, `reimagine_3`):** Adheres loosely to the source. Best for fundamentally changing the world/style or transforming characters/objects into new forms.
*   `model`: `ray-2` or `ray-flash-2`.

### Example Request (JSON Body)
```json
{
  "prompt": "change the environment to a cyberpunk city at night with neon lights",
  "media": {
    "url": "https://example.com/source-video.mp4"
  },
  "first_frame": {
    "url": "https://example.com/reference-image.png"
  },
  "mode": "flex_2",
  "model": "ray-2"
}
```

### Key Capabilities of Modify Video
*   Preserve full-body motion and facial performances (choreography, lip sync, expressions).
*   Restyle live-action into CG or stylized animation.
*   Change wardrobe, props, environments, or weather.
*   Add generative FX (smoke, fire, water).

---

## Generation Lifecycle & Management

Because video generation is asynchronous, you must poll the API or use a webhook to retrieve the final mp4 assets.

| Action | Method | Endpoint |
| :--- | :--- | :--- |
| **Get Generation** | `GET` | `/v1/generations/{id}` |
| **List All** | `GET` | `/v1/generations?limit=10&offset=0` |
| **Delete** | `DELETE` | `/v1/generations/{id}` |

### Callbacks (Webhooks)
Include a `callback_url` in your payload to receive real-time updates when the state changes (`dreaming`, `completed`, `failed`). The API will attempt to deliver the payload up to 3 times with a 100ms delay on non-200 responses, timing out after 5 seconds per request.

```json
{
  "prompt": "a futuristic drone flying through a canyon",
  "callback_url": "https://your-api.com/webhook/luma"
}
```