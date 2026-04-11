
# Get Speech(Lipsync) tts list

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/lip_sync/tts_list:
    get:
      summary: Get Speech(Lipsync) tts list
      deprecated: false
      description: ''
      tags:
        - API Reference/Video Generation
      parameters:
        - name: page_num
          in: query
          description: ''
          required: true
          example: '1'
          schema:
            type: string
        - name: page_size
          in: query
          description: ''
          required: true
          example: '2'
          schema:
            type: string
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
          text/plain:
            schema:
              type: string
            examples: {}
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
                      total:
                        type: integer
                      data:
                        type: array
                        items:
                          type: object
                          properties:
                            speaker_id:
                              type: string
                            name:
                              type: string
                          required:
                            - speaker_id
                            - name
                          x-apidog-orders:
                            - speaker_id
                            - name
                    required:
                      - total
                      - data
                    x-apidog-orders:
                      - total
                      - data
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
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-19094355-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```