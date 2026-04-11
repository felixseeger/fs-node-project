# Multi-transition video generation

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/multi_transition/generate:
    post:
      summary: Multi-transition video generation
      deprecated: false
      description: >-
        The Multi-transition(Multi-frame) feature allows you to generate a 1–30
        second video with consistent style and smooth transitions by providing
        2–7 keyframes.It is designed for professional creators, offering more
        fine-grained control over the video to ensure characters and actions
        remain coherent and controllable throughout the sequence.
      tags:
        - API Reference/Video Generation
      parameters:
        - name: API-KEY
          in: header
          description: ''
          required: true
          example: your-api-key
          schema:
            type: string
        - name: Ai-trace-id
          in: header
          description: ''
          required: true
          example: your-ai-trace-id
          schema:
            type: string
        - name: Content-Type
          in: header
          description: ''
          required: true
          example: application/json
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                multi_transition:
                  type: array
                  items:
                    type: object
                    properties:
                      img_id:
                        type: integer
                      duration:
                        type: integer
                        description: ' not required for the last item'
                      prompt:
                        type: string
                    required:
                      - img_id
                      - duration
                    x-apidog-orders:
                      - img_id
                      - duration
                      - prompt
                  description: >-
                    1.multi_transition must be an array containing 2 to 7 items.

                    2.Each item in multi_transition should include: img_id
                    (required, integer), duration (required, integer, not
                    required for the last item), prompt (optional, string)
                model:
                  type: string
                  description: '"v3.5","v4","v4.5","v5"'
                quality:
                  type: string
                  description: '"360p","540p","720p","1080p"'
              required:
                - multi_transition
                - model
                - quality
              x-apidog-orders:
                - multi_transition
                - model
                - quality
            example:
              multi_transition:
                - img_id: 0
                  duration: 3
                  prompt: ''
                - img_id: 0
                  duration: 3
                  prompt: ''
                - img_id: 0
                  duration: 3
                  prompt: ''
                - img_id: 0
                  duration: 3
                  prompt: ''
                - img_id: 0
                  duration: 0
                  prompt: ''
              model: v5
              quality: 360p
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  ErrCode:
                    type: integer
                  ErrMsg:
                    type: string
                  Resp:
                    type: object
                    properties:
                      video_id:
                        type: integer
                      credits:
                        type: integer
                    required:
                      - video_id
                      - credits
                    x-apidog-orders:
                      - video_id
                      - credits
                required:
                  - ErrCode
                  - ErrMsg
                  - Resp
                x-apidog-orders:
                  - ErrCode
                  - ErrMsg
                  - Resp
          headers: {}
          x-apidog-name: Success
      security: []
      x-apidog-folder: API Reference/Video Generation
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-24001841-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```