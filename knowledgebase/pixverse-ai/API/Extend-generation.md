# Extend generation

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/extend/generate:
    post:
      summary: Extend generation
      deprecated: false
      description: Extend generation
      tags:
        - API Reference/Video Generation
      parameters:
        - name: Ai-Trace-Id
          in: header
          description: 'traceID format: UUID, must be unique for each request'
          required: true
          example: '{{$string.uuid}}'
          schema:
            type: string
        - name: API-KEY
          in: header
          description: api-key from PixVerse platform
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
                source_video_id:
                  type: integer
                  description: >-
                    'video_id' returned from the generation API / either
                    source_video_id or video_media_id, not both.
                prompt:
                  type: string
                  description: <= 2048 characters
                seed:
                  type: integer
                  description: 'Random seed, range: 0 - 2147483647'
                quality:
                  type: string
                  description: Video quality ("360p"(Turbo), "540p", "720p", "1080p")
                duration:
                  type: integer
                  description: |-
                    Video duration
                    v.3.5/v4/v4.5 : 5/8 (v3.5 1080p cannot use 8)
                    v5 : 5/8
                    v5.5 : 5/8/10 (1080p cannot use 10)
                model:
                  type: string
                  description: (now supports v3.5/v4/v4.5/v5/v5.5/v6)
                motion_mode:
                  type: string
                  description: >-
                    Motion mode (normal, fast, --fast only available when
                    duration=5; --quality=1080p does not support fast) , not
                    supports on v5
                style:
                  type: string
                video_media_id:
                  type: integer
                  description: >-
                    'media_id' from the upload API with 'media_type = video' /
                    either source_video_id or video_media_id, not both.
              required:
                - prompt
                - seed
                - quality
                - duration
                - model
              x-apidog-orders:
                - source_video_id
                - video_media_id
                - prompt
                - seed
                - quality
                - duration
                - model
                - motion_mode
                - style
            example: |-
              {
                "source_video_id": 0,
                //"video_media_id":0, //'video_id' returned from the generation API
                "prompt": "across the universe",
                "seed": 123123,
                "quality": "540p",
                "duration": 5,
                "model": "v4.5",
                "motion_mode": "normal",
                //"style": "clay"
              }
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
                    required:
                      - video_id
                    x-apidog-orders:
                      - video_id
                required:
                  - ErrCode
                  - ErrMsg
                  - Resp
                x-apidog-orders:
                  - ErrCode
                  - ErrMsg
                  - Resp
              example: |-
                {
                    "ErrCode": 0,
                    "ErrMsg": "Success",
                    "Resp": {
                        "video_id": 0
                }
          headers: {}
          x-apidog-name: Success
      security: []
      x-apidog-folder: API Reference/Video Generation
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-19094393-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```