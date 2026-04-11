# Swap mask generation

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/mask/selection:
    post:
      summary: Swap mask generation
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
                    video_media_id should be provided. codec should be
                    h.264/h.265
                keyframe_id:
                  type: integer
                  description: >-
                    from 1 to The position of the last video frame. If not
                    provided, the default value is 1.
                source_video_id:
                  type: integer
                  description: >-
                    video_id from generation, one of source_video_id or
                    video_media_id should be provided
              x-apidog-orders:
                - source_video_id
                - video_media_id
                - keyframe_id
            example:
              video_media_id: 0
              keyframe_id: 0
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
                      keyframe_id:
                        type: integer
                      keyframe_url:
                        type: string
                      credits:
                        type: integer
                      mask_info:
                        type: array
                        items:
                          type: object
                          properties:
                            mask_id:
                              type: string
                            mask_name:
                              type: string
                            mask_url:
                              type: string
                          required:
                            - mask_id
                            - mask_name
                            - mask_url
                          x-apidog-orders:
                            - mask_id
                            - mask_name
                            - mask_url
                    required:
                      - keyframe_id
                      - keyframe_url
                      - credits
                      - mask_info
                    x-apidog-orders:
                      - keyframe_id
                      - keyframe_url
                      - credits
                      - mask_info
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
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-24001877-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```