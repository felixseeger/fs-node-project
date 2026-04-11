# Extend video duration

POST https://api.ltx.video/v1/extend
Content-Type: application/json

Extend a video by generating additional frames at the beginning or end using AI generation.
> Audio is generated for the extended portion if the input video has audio


Reference: https://docs.ltx.video/api-documentation/api-reference/video-generation/extend

## OpenAPI Specification

```yaml
openapi: 3.1.0
info:
  title: ''
  version: 1.0.0
paths:
  /v1/extend:
    post:
      operationId: extend
      summary: Extend video duration
      description: >
        Extend a video by generating additional frames at the beginning or end
        using AI generation.

        > Audio is generated for the extended portion if the input video has
        audio
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
          description: Video extended successfully
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
              $ref: '#/components/schemas/ExtendVideoRequest'
servers:
  - url: https://api.ltx.video
components:
  schemas:
    ExtendVideoRequestMode:
      type: string
      enum:
        - start
        - end
      default: end
      description: |
        Where to extend the video:
        - `end` (default): Extends the video at the end.
        - `start`: Extends the video at the beginning.
      title: ExtendVideoRequestMode
    ExtendVideoRequestModel:
      type: string
      enum:
        - ltx-2-pro
        - ltx-2-3-pro
      default: ltx-2-3-pro
      description: |
        Model to use for video generation.
      title: ExtendVideoRequestModel
    ExtendVideoRequest:
      type: object
      properties:
        video_uri:
          type: string
          description: >
            Input video for extending. See [Input
            Formats](/input-formats#video-input) for supported formats and
            codecs.


            - Supported aspect ratios: 16:9 and 9:16

            - Maximum resolution: 3840x2160 (4K)

            - Minimum frame count: 73 (around 3 seconds at 24fps)


            The output video preserves the input video's resolution.
        prompt:
          type: string
          description: >
            Description of what should happen in the extended portion of the
            video.
        duration:
          type: number
          format: double
          description: >
            Duration in seconds to extend the video. Minimum 2 seconds, maximum
            20 seconds (480 frames at 24fps).
        mode:
          $ref: '#/components/schemas/ExtendVideoRequestMode'
          description: |
            Where to extend the video:
            - `end` (default): Extends the video at the end.
            - `start`: Extends the video at the beginning.
        model:
          $ref: '#/components/schemas/ExtendVideoRequestModel'
          description: |
            Model to use for video generation.
        context:
          type: number
          format: double
          description: >
            **Advanced parameter:** Number of seconds from the input video to
            use as context for the extension (maximum 20 seconds).


            The model uses context frames from the input video to generate a
            more coherent extension.

            The sum of `context` + `duration` (converted to frames using the
            input video's FPS) cannot exceed 505 frames (~21 seconds at 24fps).
            For higher-FPS inputs, the maximum total duration in seconds will be
            proportionally lower; for lower-FPS inputs, it will be
            proportionally higher.


            If not provided, defaults to maximize available context within the
            505 frame limit while respecting the 20-second cap.
      required:
        - video_uri
        - duration
      title: ExtendVideoRequest
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

url = "https://api.ltx.video/v1/extend"

payload = {
    "video_uri": "https://example.com/input.mp4",
    "prompt": "Continue the motion smoothly",
    "duration": 5,
    "mode": "end",
    "model": "ltx-2-3-pro"
}

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

# Save the video file
with open("extended_video.mp4", "wb") as f:
    f.write(response.content)

```

```typescript
const url = "https://api.ltx.video/v1/extend";

const payload = {
  video_uri: "https://example.com/input.mp4",
  prompt: "Continue the motion smoothly",
  duration: 5,
  mode: "end",
  model: "ltx-2-3-pro"
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
fs.writeFileSync("extended_video.mp4", Buffer.from(buffer));

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

	url := "https://api.ltx.video/v1/extend"

	payload := strings.NewReader("{\n  \"video_uri\": \"https://example.com/input.mp4\",\n  \"duration\": 5,\n  \"prompt\": \"Continue the motion smoothly\",\n  \"mode\": \"end\",\n  \"model\": \"ltx-2-3-pro\"\n}")

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

HttpResponse<String> response = Unirest.post("https://api.ltx.video/v1/extend")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/json")
  .body("{\n  \"video_uri\": \"https://example.com/input.mp4\",\n  \"duration\": 5,\n  \"prompt\": \"Continue the motion smoothly\",\n  \"mode\": \"end\",\n  \"model\": \"ltx-2-3-pro\"\n}")
  .asString();
```