# Luma Labs API Knowledge Base

This knowledge base provides a comprehensive overview of the Luma Labs API (Dream Machine and Photon models), based on the official documentation.

## Overview & Authentication

The Luma Labs API allows developers to integrate advanced, high-quality image and video generation capabilities into their products. It follows a standard RESTful pattern with asynchronous generation (Submit -> Poll/Webhook -> Complete).

*   **Base URL:** `https://api.lumalabs.ai/dream-machine/v1`
*   **Authentication:** API calls require a Bearer token in the `Authorization` header.
    *   **Header Format:** `Authorization: Bearer <luma_api_key>`
    *   **Key Management:** Keys can be obtained from the [Luma Dashboard](https://lumalabs.ai/dream-machine/api/keys).
*   **Billing Dashboard:** [Billing Overview](https://lumalabs.ai/dream-machine/api/billing/overview)

---

## Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/generations` | Create a video generation request. |
| `POST` | `/generations/image` | Create an image generation request. |
| `GET` | `/generations/{id}` | Retrieve the status and assets of a specific generation. |
| `GET` | `/generations` | List all generations (supports `limit` and `offset` pagination). |
| `DELETE` | `/generations/{id}` | Delete a specific generation. |
| `GET` | `/generations/concepts/list` | List available creative concepts (e.g., "dolly_zoom"). |
| `GET` | `/generations/camera_motion/list` | List supported camera motion strings. |
| `GET` | `/ping` | Check if the API service is operational. |

---

## Video Generation (Dream Machine)

The Dream Machine API supports Text-to-Video, Image-to-Video, and Video-to-Video (Extension/Interpolation).

*   **Models:** 
    *   `ray-2` (High quality)
    *   `ray-flash-2` (Fast)
*   **Key Request Parameters:**
    *   `prompt` (string): Text description of the video. Required if no image keyframes are provided.
    *   `keyframes` (object): Define start (`frame0`) and end (`frame1`) frames.
        *   `type`: "image" (requires `url`) or "generation" (requires `id`).
    *   `aspect_ratio` (string): `1:1`, `3:4`, `4:3`, `9:16`, `16:9` (default), `9:21`, `21:9`.
    *   `resolution` (string): `540p`, `720p`, `1080p`, `4k`.
    *   `duration` (string): e.g., `5s`.
    *   `loop` (boolean): Set to `true` to create a seamless loop.
    *   `callback_url` (string): Webhook URL for status updates upon completion or failure.

### Example Request (Image-to-Video)
```bash
curl --request POST \
  --url https://api.lumalabs.ai/dream-machine/v1/generations \
  --header 'authorization: Bearer <your_api_key>' \
  --data '{
    "prompt": "A tiger walking in snow",
    "model": "ray-2",
    "keyframes": {
      "frame0": { "type": "image", "url": "https://example.com/image.jpg" }
    }
  }'
```

---

## Image Generation (Photon)

Photon provides advanced control over character consistency, style referencing, and image modification.

*   **Models:** 
    *   `photon-1` (Default, high quality)
    *   `photon-flash-1` (Fast)
*   **Advanced Features (References):**
    *   **Image Reference (`image_ref`):** Guide generation using up to 4 images. Supports `weight` (0.0 to 1.0).
    *   **Style Reference (`style_ref`):** Apply a specific aesthetic/style from a reference image.
    *   **Character Reference (`character_ref`):** Maintain character consistency across generations using identity images.
    *   **Modify Image (`modify_image_ref`):** Refine an existing image by prompting for specific changes.

### Example Request (Text-to-Image)
```bash
curl --request POST \
  --url https://api.lumalabs.ai/dream-machine/v1/generations/image \
  --header 'authorization: Bearer <your_api_key>' \
  --data '{
    "prompt": "A teddy bear in sunglasses playing electric guitar",
    "aspect_ratio": "3:4",
    "model": "photon-1"
  }'
```

---

## Response Format & Lifecycle

The API is asynchronous. Generating an image or video returns a generation object indicating its current state. You must poll the `GET /generations/{id}` endpoint or use a webhook to get the final result.

*   **States:** 
    *   `dreaming` (Processing in progress)
    *   `completed` (Finished successfully)
    *   `failed` (Encountered an error)

### Example Completed Response
```json
{
  "id": "uuid-string-here",
  "state": "completed",
  "assets": {
    "video": "https://storage.cdn-luma.com/path/video.mp4",
    "image": "https://storage.cdn-luma.com/path/image.jpg"
  },
  "failure_reason": null,
  "created_at": "2024-12-02T15:34:40Z"
}
```

---

## Official SDKs

Luma provides official SDKs to simplify integration by wrapping the REST API and handling polling automatically.

### Python SDK (`lumaai`)
**Installation:** `pip install lumaai`

```python
from lumaai import LumaAI

client = LumaAI(auth_token="YOUR_API_KEY")

# Create a generation
generation = client.generations.create(
    prompt="A futuristic city",
    model="ray-2"
)
```

### JavaScript / TypeScript SDK (`lumaai`)
**Installation:** `npm install lumaai`

```javascript
import LumaAI from 'lumaai';

const client = new LumaAI({ authToken: 'YOUR_API_KEY' });

// Create a generation
const generation = await client.generations.create({
    prompt: 'A futuristic city',
    model: 'ray-2'
});
```

---

## Rate Limits & Errors

### Rate Limits (Build Tier)
*   **Video Generation (Ray models):** 10 concurrent generations, 20 requests per minute.
*   **Image Generation (Photon models):** 40 concurrent generations, 80 requests per minute.
*   **Usage Limit:** Soft cap of $5,000/month (Scale/Enterprise plans are available for higher limits).

### Common Errors & Troubleshooting
*   **`Prompt is required`:** Occurs if a prompt is omitted when no image keyframes are provided.
*   **`Moderation failed`:** The prompt or reference image contains content that violates Luma's safety and moderation guidelines.
*   **`Failed to read user input frames`:** The provided URL for reference images is inaccessible (ensure URLs are public and direct image links).
*   **`Loop is not supported`:** Occurs when using incompatible keyframe combinations (e.g., setting `loop: true` while trying to interpolate between two different frames).
