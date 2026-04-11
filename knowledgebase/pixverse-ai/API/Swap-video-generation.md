# Swap video generation

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/swap/generate:
    post:
      summary: Swap video generation
      deprecated: false
      description: >-
        source_video_id (or video_media_id), keyframe_id, and mask_id must all
        refer to the same video when performing mask generation.
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
                video_media_id:
                  type: integer
                  description: >-
                    media_id from uploaded video, one of source_video_id or
                    video_media_id should be provided
                keyframe_id:
                  type: integer
                  description: >-
                    from 1 to The position of the last video frame. If not
                    provided, the default value is 1.
                mask_id:
                  type: string
                  description: mask_id from mask generation
                img_id:
                  type: integer
                  description: img_id from upload image endpoint
                quality:
                  type: string
                  description: '"360p","540p","720p"'
                source_video_id:
                  type: integer
                  description: >-
                    video_id from generation, one of source_video_id or
                    video_media_id should be provided
              required:
                - keyframe_id
                - mask_id
                - img_id
                - quality
              x-apidog-orders:
                - source_video_id
                - video_media_id
                - keyframe_id
                - mask_id
                - img_id
                - quality
            example:
              video_media_id: 0
              keyframe_id: 1
              mask_id: '0'
              img_id: 0
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
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-24001839-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```