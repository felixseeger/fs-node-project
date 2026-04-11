# Fusion(reference to video) generation

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/fusion/generate:
    post:
      summary: Fusion(reference to video) generation
      deprecated: false
      description: ''
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
          example: your-Ai-trace-id
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
                image_references:
                  type: array
                  items:
                    type: object
                    properties:
                      type:
                        type: string
                        description: 'supports "subject", "background" '
                      img_id:
                        type: integer
                        description: img_id from image upload endpoint
                      ref_name:
                        type: string
                        description: >-
                          Assign a specific name to the image to enable writing
                          more accurate prompts.
                    required:
                      - type
                      - img_id
                      - ref_name
                    x-apidog-orders:
                      - type
                      - img_id
                      - ref_name
                  description: >-
                    Array of reference images (1–3 items), including subjects
                    and/or backgrounds

                    v4.5/v5 : up to 3 items

                    v5.5/v5.6 : up to 7 items
                prompt:
                  type: string
                  description: >-
                    To accurately describe the scene, use @ref_name in the
                    prompt.

                    1. A space must follow @ref_name, e.g., @cat plays

                    2. The @name used in the prompt must exactly match the
                    ref_name in image_references.
                model:
                  type: string
                  description: '"v4.5","v5","v5.5","v5.6","c1"'
                duration:
                  type: integer
                  description: |-
                    Video duration
                    v4.5 : 5/8
                    v5 : 5/8
                    v5.5/v5.6 : 5/8/10 (1080p cannot use 10)
                    c1 : 1~15
                quality:
                  type: string
                  description: '"360p","540p","720p","1080p"'
                aspect_ratio:
                  type: string
                  description: |-
                    Aspect ratio
                    other model : 16:9, 4:3, 1:1, 3:4, 9:16
                    c1 model : 16:9, 4:3, 1:1, 3:4, 9:16, 2:3, 3:2, 21:9
                seed:
                  type: integer
                generate_audio_switch:
                  type: boolean
                  description: >-
                    supports v5.6/c1, Audio switch. Controls whether the video
                    has multiple clips or a single clip. **true**: Audio on ,
                    **false**: Audio off 
              required:
                - image_references
                - prompt
                - model
                - duration
                - quality
                - aspect_ratio
              x-apidog-orders:
                - image_references
                - prompt
                - model
                - duration
                - quality
                - aspect_ratio
                - generate_audio_switch
                - seed
            example:
              image_references:
                - type: subject
                  img_id: 0
                  ref_name: dog
                - type: background
                  img_id: 0
                  ref_name: room
              prompt: '@dog plays at @room'
              model: v4.5
              duration: 5
              quality: 540p
              aspect_ratio: '16:9'
              seed: 123456789
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
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-19884194-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```