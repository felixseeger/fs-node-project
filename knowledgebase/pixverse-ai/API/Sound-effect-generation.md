# Sound effect generation

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/sound_effect/generate:
    post:
      summary: Sound effect generation
      deprecated: false
      description: ''
      tags:
        - API Reference/Video Generation
      parameters:
        - name: Ai-Trace-Id
          in: header
          description: ''
          required: true
          example: '123123'
          schema:
            type: string
        - name: API-KEY
          in: header
          description: ''
          required: true
          example: '123123'
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
                source_video_id:
                  type: integer
                  description: video_id from generation
                original_sound_switch:
                  type: boolean
                  description: Keep original video sound
                sound_effect_content:
                  type: string
                  description: >-
                    Sound effect content to generate. If not provided, a sound
                    effect will be automatically generated based on the video
                    content.
                video_media_id:
                  type: integer
                  description: 'media_id from upload '
              x-apidog-orders:
                - source_video_id
                - video_media_id
                - original_sound_switch
                - sound_effect_content
            example:
              source_video_id: 123123
              original_sound_switch: true
              sound_effect_content: ''
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apidog-name: Success
      security: []
      x-apidog-folder: API Reference/Video Generation
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-19884196-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```