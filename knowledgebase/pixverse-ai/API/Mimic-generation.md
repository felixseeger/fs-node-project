# Mimic generation

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/mimic/generate:
    post:
      summary: Mimic generation
      deprecated: false
      description: |-
        **Requirements & Validation Rules**
        - To ensure successful generation, please follow these guidelines:
            - The uploaded image must contain a clear and identifiable subject (e.g., a person or an animal).
            - The reference video must include a person as the primary focus performing the motion.

        - Error Codes
            - 701002: Upload a photo with a clear subject such as a person or an animal.
            - 701003: Ensure your reference video includes a person as the primary focus.
      tags:
        - API Reference/Video Generation
      parameters:
        - name: Ai-Trace-Id
          in: header
          description: ''
          required: true
          example: your-ai-trace-id
          schema:
            type: string
        - name: API-KEY
          in: header
          description: ''
          required: true
          example: your-api-key
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
                video_media_id:
                  type: integer
                  description: >-
                    'media_id' from the upload API with 'media_type = video' /
                    either source_video_id or video_media_id, not both.
                img_id:
                  type: integer
                  description: >-
                    Image ID from Upload image API. single image or single-image
                    templates
                quality:
                  type: string
                  description: Video quality ("360p"(Turbo), "540p", "720p", "1080p")
                source_video_id:
                  type: integer
                  description: >-
                    'video_id' returned from the generation API / either
                    source_video_id or video_media_id, not both.
              required:
                - img_id
                - quality
                - source_video_id
                - video_media_id
              x-apidog-orders:
                - video_media_id
                - source_video_id
                - img_id
                - quality
            example:
              video_media_id: 0
              img_id: 0
              quality: 360p
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
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-28748523-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```