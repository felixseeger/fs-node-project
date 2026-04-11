# Generate video from text

POST https://api.ltx.video/v1/text-to-video
Content-Type: application/json

Generate a video from a text prompt using AI models.

Reference: https://docs.ltx.video/api-documentation/api-reference/video-generation/text-to-video

## OpenAPI Specification

```yaml
openapi: 3.1.0
info:
  title: ''
  version: 1.0.0
paths:
  /v1/text-to-video:
    post:
      operationId: text-to-video
      summary: Generate video from text
      description: Generate a video from a text prompt using AI models.
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
              $ref: '#/components/schemas/TextToVideoRequest'
servers:
  - url: https://api.ltx.video
components:
  schemas:
    TextToVideoRequestModel:
      type: string
      enum:
        - ltx-2-fast
        - ltx-2-pro
        - ltx-2-3-fast
        - ltx-2-3-pro
      description: >-
        Model to use for generation. See [Supported Models](/models) for
        details.
      title: TextToVideoRequestModel
    TextToVideoRequestCameraMotion:
      type: string
      enum:
        - dolly_in
        - dolly_out
        - dolly_left
        - dolly_right
        - jib_up
        - jib_down
        - static
        - focus_shift
      description: Apply camera motion effects to the generated video.
      title: TextToVideoRequestCameraMotion
    TextToVideoRequest:
      type: object
      properties:
        prompt:
          type: string
          description: Text prompt describing the desired video content
        model:
          $ref: '#/components/schemas/TextToVideoRequestModel'
          description: >-
            Model to use for generation. See [Supported Models](/models) for
            details.
        duration:
          type: integer
          description: >-
            Video duration in seconds. See [Supported Models](/models) for
            available durations per model.
        fps:
          type: integer
          default: 24
          description: >-
            Frame rate in frames per second. See [Supported Models](/models) for
            available FPS per model and resolution.
        resolution:
          type: string
          description: >-
            Output video resolution. See [Supported Models](/models) for
            available resolutions per model.
        generate_audio:
          type: boolean
          default: true
          description: >-
            Generate audio for the video. When true, the generated video will
            include AI-generated audio matching the scene. When false, only
            silent video is generated.
        camera_motion:
          $ref: '#/components/schemas/TextToVideoRequestCameraMotion'
          description: Apply camera motion effects to the generated video.
      required:
        - prompt
        - model
        - duration
        - resolution
      title: TextToVideoRequest
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

url = "https://api.ltx.video/v1/text-to-video"

payload = {
    "prompt": "A majestic eagle soaring through clouds at sunset",
    "model": "ltx-2-3-pro",
    "duration": 8,
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
const url = "https://api.ltx.video/v1/text-to-video";

const payload = {
  prompt: "A majestic eagle soaring through clouds at sunset",
  model: "ltx-2-3-pro",
  duration: 8,
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

	url := "https://api.ltx.video/v1/text-to-video"

	payload := strings.NewReader("{\n  \"prompt\": \"A majestic eagle soaring through clouds at sunset\",\n  \"model\": \"ltx-2-3-pro\",\n  \"duration\": 8,\n  \"resolution\": \"1920x1080\"\n}")

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

HttpResponse<String> response = Unirest.post("https://api.ltx.video/v1/text-to-video")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/json")
  .body("{\n  \"prompt\": \"A majestic eagle soaring through clouds at sunset\",\n  \"model\": \"ltx-2-3-pro\",\n  \"duration\": 8,\n  \"resolution\": \"1920x1080\"\n}")
  .asString();
```