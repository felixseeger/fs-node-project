# Generate video from audio

POST https://api.ltx.video/v1/audio-to-video
Content-Type: application/json

Generate a video from an audio file, optionally with an image and prompt using AI models. Output video is 25 fps.

Reference: https://docs.ltx.video/api-documentation/api-reference/video-generation/audio-to-video

## OpenAPI Specification

```yaml
openapi: 3.1.0
info:
  title: ''
  version: 1.0.0
paths:
  /v1/audio-to-video:
    post:
      operationId: audio-to-video
      summary: Generate video from audio
      description: >-
        Generate a video from an audio file, optionally with an image and prompt
        using AI models. Output video is 25 fps.
      tags:
        - subpackage_videoGeneration
      parameters:
        - name: Authorization
          in: header
          description: API key authentication
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Video generated successfully
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
        '400':
          description: The request is invalid or malformed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Authentication failed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '422':
          description: Content rejected by safety filters
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '429':
          description: Rate limit exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: An unexpected error occurred
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '503':
          description: Service temporarily unavailable
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '504':
          description: Request timeout
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AudioToVideoRequest'
servers:
  - url: https://api.ltx.video
components:
  schemas:
    AudioToVideoRequestResolution:
      type: string
      enum:
        - 1920x1080
        - 1080x1920
      description: >
        The resolution of the generated video in WIDTHxHEIGHT format. When
        omitted, the resolution is automatically determined based on the input
        image orientation — portrait images produce 1080x1920 video, landscape
        images produce 1920x1080 video. If no image is provided, defaults to
        1920x1080.
      title: AudioToVideoRequestResolution
    AudioToVideoRequestModel:
      type: string
      enum:
        - ltx-2-pro
        - ltx-2-3-pro
      default: ltx-2-3-pro
      description: |
        Model to use for video generation.
      title: AudioToVideoRequestModel
    AudioToVideoRequest:
      type: object
      properties:
        audio_uri:
          type: string
          description: >
            Audio file to be used as the soundtrack for the video. Duration must
            be between 2 and 20 seconds.

            See [Input Formats](/input-formats#audio-input) for supported
            formats and size limits.
        image_uri:
          type: string
          description: >-
            Input image to be used as the first frame of the video. Required if
            prompt is not provided. See [Input
            Formats](/input-formats#image-input) for supported formats and size
            limits.
        prompt:
          type: string
          description: >-
            Text description of how the video should be generated. Required if
            image_uri is not provided. Can be empty string when image_uri is
            provided. If image_uri is provided, this describes how the image
            should be animated. If no image_uri is provided, this describes the
            video content.
        resolution:
          $ref: '#/components/schemas/AudioToVideoRequestResolution'
          description: >
            The resolution of the generated video in WIDTHxHEIGHT format. When
            omitted, the resolution is automatically determined based on the
            input image orientation — portrait images produce 1080x1920 video,
            landscape images produce 1920x1080 video. If no image is provided,
            defaults to 1920x1080.
        guidance_scale:
          type: number
          format: double
          description: >-
            Optional guidance scale (also known as CFG) for video generation.
            Higher values make the output more closely follow the prompt but may
            reduce quality. Defaults to 5 for text-to-video, or 9 when providing
            an image.
        model:
          $ref: '#/components/schemas/AudioToVideoRequestModel'
          description: |
            Model to use for video generation.
      required:
        - audio_uri
      title: AudioToVideoRequest
    ErrorType:
      type: string
      enum:
        - error
      description: Response type indicator
      title: ErrorType
    ErrorError:
      type: object
      properties:
        type:
          type: string
          description: Error type for programmatic handling
        message:
          type: string
          description: Human-readable error description
      required:
        - type
        - message
      title: ErrorError
    Error:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/ErrorType'
          description: Response type indicator
        error:
          $ref: '#/components/schemas/ErrorError'
      required:
        - type
        - error
      title: Error
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      description: API key authentication

```

## SDK Code Examples

```python
import requests

url = "https://api.ltx.video/v1/audio-to-video"

payload = {
    "audio_uri": "https://example.com/audio.wav",
    "image_uri": "https://example.com/image.jpg",
    "prompt": "A beautiful sunset over mountains",
    "resolution": "1920x1080"
}

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

# Save the video file
with open("generated_video.mp4", "wb") as f:
    f.write(response.content)

```

```typescript
const url = "https://api.ltx.video/v1/audio-to-video";

const payload = {
  audio_uri: "https://example.com/audio.wav",
  image_uri: "https://example.com/image.jpg",
  prompt: "A beautiful sunset over mountains",
  resolution: "1920x1080"
};

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});

// Save the video file
const buffer = await response.arrayBuffer();
const fs = require('fs');
fs.writeFileSync("generated_video.mp4", Buffer.from(buffer));

```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.ltx.video/v1/audio-to-video"

	payload := strings.NewReader("{\n  \"audio_uri\": \"https://example.com/audio.wav\",\n  \"image_uri\": \"https://example.com/image.jpg\",\n  \"prompt\": \"A beautiful sunset over mountains\",\n  \"resolution\": \"1920x1080\"\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Authorization", "Bearer <token>")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.ltx.video/v1/audio-to-video")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/json")
  .body("{\n  \"audio_uri\": \"https://example.com/audio.wav\",\n  \"image_uri\": \"https://example.com/image.jpg\",\n  \"prompt\": \"A beautiful sunset over mountains\",\n  \"resolution\": \"1920x1080\"\n}")
  .asString();
```