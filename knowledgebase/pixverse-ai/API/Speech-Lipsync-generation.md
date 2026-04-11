# Speech(Lipsync) generation

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/lip_sync/generate:
    post:
      summary: Speech(Lipsync) generation
      deprecated: false
      description: |-
        Speech/Lipsync Generation
        4 casese for geneartion task
        1. source_video_id + audio_media_id
        2. source_video_id + lip_sync_tts_speaker_id + lip_sync_tts_conen
        3. video_media_id + audio_media_id
        4. video_media_id + lip_sync_tts_speaker_id + lip_sync_tts_conen
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
                video_media_id:
                  type: integer
                  description: >-
                    'media_id' from the upload API with 'media_type = video' /
                    either source_video_id or video_media_id, not both.
                lip_sync_tts_speaker_id:
                  type: string
                  description: >-
                    id from Get speech tts list / either audio_media_id or
                    lip_sync_tts_speaker_id + lip_sync_tts_content, not both
                lip_sync_tts_content:
                  type: string
                  description: >-
                    lip sync content what you want / either audio_media_id or
                    lip_sync_tts_speaker_id + lip_sync_tts_content, not both
                source_video_id:
                  type: integer
                  description: >-
                    'video_id' returned from the generation API / either
                    source_video_id or video_media_id, not both.
                audio_media_id:
                  type: integer
                  description: >-
                    'media_id' from the upload API with 'media_type = audio' /
                    either audio_media_id or lip_sync_tts_speaker_id +
                    lip_sync_tts_content, not both
              x-apidog-orders:
                - video_media_id
                - source_video_id
                - audio_media_id
                - lip_sync_tts_speaker_id
                - lip_sync_tts_content
            example: |-
              {
                "video_media_id": 0,
                "source_video_id":0, //'video_id' returned from the generation API
                "audio_media_id":0, //'media_id' from the upload API with 'media_type = audio'
                "lip_sync_tts_speaker_id": "auto",
                "lip_sync_tts_content": "hello this is harry, where are you from?"
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
          headers: {}
          x-apidog-name: Success
      security: []
      x-apidog-folder: API Reference/Video Generation
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-19094278-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```