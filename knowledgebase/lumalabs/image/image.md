# Luma AI Image Generation API Documentation

## Overview & Authentication
The Dream Machine API enables advanced image generation using Luma's Photon models. To authenticate, use your API key as a Bearer token in the request headers.

```http
Authorization: Bearer <luma_api_key>
```

## Core Parameters

### Aspect Ratio
You can specify the desired aspect ratio for your generated image using the `aspect_ratio` parameter.
- **Supported Options:** `1:1`, `3:4`, `4:3`, `9:16`, `16:9` (default), `9:21`, `21:9`

### Models
Luma offers two model versions for image generation:
- `photon-1` (default, highest quality)
- `photon-flash-1` (optimized for speed)

---

## API Endpoints & Capabilities

### 1. Text to Image
Generate an image from a text prompt.

**Endpoint:** `POST https://api.lumalabs.ai/dream-machine/v1/generations/image`

**Example Request:**
```bash
curl --request POST \
  --url https://api.lumalabs.ai/dream-machine/v1/generations/image \
  --header 'accept: application/json' \
  --header 'authorization: Bearer <luma_api_key>' \
  --header 'content-type: application/json' \
  --data '{
    "prompt": "A teddy bear in sunglasses playing electric guitar and dancing",
    "aspect_ratio": "3:4",
    "model": "photon-1"
  }'
```

### 2. Image Reference (`image_ref`)
Guide the generation using up to 4 reference images. You can use the `weight` key (ranging from `0.0` to `1.0`) to tune the influence of the reference image.

**Example Payload:**
```json
{
  "prompt": "sunglasses",
  "image_ref": [
    {
      "url": "https://your-cdn.com/image.jpg",
      "weight": 0.85
    }
  ]
}
```

### 3. Style Reference (`style_ref`)
Apply a specific aesthetic or style from a reference image to your generation.

**Example Payload:**
```json
{
  "prompt": "dog",
  "style_ref": [
    {
      "url": "https://your-cdn.com/style-image.jpg",
      "weight": 0.8
    }
  ]
}
```

### 4. Character Reference (`character_ref`)
Maintain character consistency across generations by using up to 4 images of the same person/character to build an identity.

**Example Payload:**
```json
{
  "prompt": "man as a warrior",
  "character_ref": {
    "identity0": {
      "images": ["https://your-cdn.com/character.jpg"]
    }
  }
}
```

### 5. Modify Image (`modify_image_ref`)
Refine an existing image by prompting for specific changes. 
- **Pro Tip:** For subtle color changes, a lower weight (`0.0` to `0.1`) is recommended.

**Example Payload:**
```json
{
  "prompt": "transform all the flowers to sunflowers",
  "modify_image_ref": {
    "url": "https://your-cdn.com/input.jpg",
    "weight": 1.0
  }
}
```

---

## Generation Management

Because generation is asynchronous, you must poll or use webhooks to get the final assets.

| Action | Method | Endpoint |
| :--- | :--- | :--- |
| **Get Generation** | `GET` | `/v1/generations/{id}` |
| **List All** | `GET` | `/v1/generations?limit=10&offset=0` |
| **Delete** | `DELETE` | `/v1/generations/{id}` |

---

## Callbacks (Webhooks)
You can receive real-time status updates (`dreaming`, `completed`, `failed`) via a webhook URL by including `callback_url` in your payload.

- **Retry Logic:** Max 3 retries with a 100ms delay if the status is not 200.
- **Timeout:** 5 seconds per callback attempt.

**Example Payload:**
```json
{
  "prompt": "an old lady laughing underwater",
  "callback_url": "https://your-api.com/webhook"
}
```