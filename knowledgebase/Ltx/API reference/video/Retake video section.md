# Retake video section

POST https://api.ltx.video/v1/retake
Content-Type: application/json

Edit a specific section of a video by replacing audio, video, or both using AI generation.

The edited section is defined by the `start_time` and `duration` parameters.


Reference: https://docs.ltx.video/api-documentation/api-reference/video-generation/retake

## OpenAPI Specification

```yaml
openapi: 3.1.0
info:
  title: ''
  version: 1.0.0
paths:
  /v1/retake:
    post:
      operationId: retake
      summary: Retake video section
      description: >
        Edit a specific section of a video by replacing audio, video, or both
        using AI generation.


        The edited section is defined by the `start_time` and `duration`
        parameters.
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
          description: Video edited successfully
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
              $ref: '#/components/schemas/EditVideoRequest'
servers:
  - url: https://api.ltx.video
components:
  schemas:
    EditVideoRequestMode:
      type: string
      enum:
        - replace_audio
        - replace_video
        - replace_audio_and_video
      default: replace_audio_and_video
      description: |
        Can be any of the following:
        - `replace_audio` - Replace only the audio track
        - `replace_video` - Replace only the video track
        - `replace_audio_and_video` - Replace both audio and video tracks

        The default value is `replace_audio_and_video` if not specified.
      title: EditVideoRequestMode
    EditVideoRequestResolution:
      type: string
      enum:
        - 1920x1080
        - 1080x1920
      description: >
        The resolution of the generated video in WIDTHxHEIGHT format. When
        omitted, the resolution is automatically determined based on the input
        video orientation — portrait videos produce 1080x1920 output, landscape
        videos produce 1920x1080 output.
      title: EditVideoRequestResolution
    EditVideoRequestModel:
      type: string
      enum:
        - ltx-2-pro
        - ltx-2-3-pro
      default: ltx-2-3-pro
      description: |
        Model to use for video generation.
      title: EditVideoRequestModel
    EditVideoRequest:
      type: object
      properties:
        video_uri:
          type: string
          description: >
            Input video for editing. See [Input
            Formats](/input-formats#video-input) for supported formats and
            codecs.


            - Maximum resolution: 3840x2160 (4K)

            - Minimum frame count: 73 (around 3 seconds at 24fps)
        prompt:
          type: string
          description: |
            Describing what needs to happen in the generated video in a section
            defined by `start_time` and `duration`.
        start_time:
          type: number
          format: double
          description: >
            Start time in seconds, defines the section to be edited in the input
            video.


            The section defined by `start_time` and `duration` should be within
            the duration of the input video.

            If the section extends beyond the duration of the video, it will be
            clamped to the video duration.
        duration:
          type: number
          format: double
          description: >
            Duration in seconds, defines the duration of the section to be
            edited

            in the input video. Must be at least 2 seconds.


            The section defined by `start_time` and `duration` should be within
            the duration of the input video.

            If the section extends beyond the duration of the video, it will be
            clamped to the video duration.
        mode:
          $ref: '#/components/schemas/EditVideoRequestMode'
          description: |
            Can be any of the following:
            - `replace_audio` - Replace only the audio track
            - `replace_video` - Replace only the video track
            - `replace_audio_and_video` - Replace both audio and video tracks

            The default value is `replace_audio_and_video` if not specified.
        resolution:
          $ref: '#/components/schemas/EditVideoRequestResolution'
          description: >
            The resolution of the generated video in WIDTHxHEIGHT format. When
            omitted, the resolution is automatically determined based on the
            input video orientation — portrait videos produce 1080x1920 output,
            landscape videos produce 1920x1080 output.
        model:
          $ref: '#/components/schemas/EditVideoRequestModel'
          description: |
            Model to use for video generation.
      required:
        - video_uri
        - start_time
        - duration
      title: EditVideoRequest
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

url = "https://api.ltx.video/v1/retake"

payload = {
    "video_uri": "https://example.com/input.mp4",
    "prompt": "A dramatic explosion with bright orange flames",
    "start_time": 0,
    "duration": 5,
    "mode": "replace_audio_and_video"
}

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

# Save the video file
with open("edited_video.mp4", "wb") as f:
    f.write(response.content)

```

```typescript
const url = "https://api.ltx.video/v1/retake";

const payload = {
  video_uri: "https://example.com/input.mp4",
  prompt: "A dramatic explosion with bright orange flames",
  start_time: 0,
  duration: 5,
  mode: "replace_audio_and_video"
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
fs.writeFileSync("edited_video.mp4", Buffer.from(buffer));

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

	url := "https://api.ltx.video/v1/retake"

	payload := strings.NewReader("{\n  \"video_uri\": \"https://example.com/input.mp4\",\n  \"start_time\": 0,\n  \"duration\": 5,\n  \"prompt\": \"A dramatic explosion with bright orange flames\",\n  \"mode\": \"replace_audio_and_video\"\n}")

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

HttpResponse<String> response = Unirest.post("https://api.ltx.video/v1/retake")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/json")
  .body("{\n  \"video_uri\": \"https://example.com/input.mp4\",\n  \"start_time\": 0,\n  \"duration\": 5,\n  \"prompt\": \"A dramatic explosion with bright orange flames\",\n  \"mode\": \"replace_audio_and_video\"\n}")
  .asString();
```