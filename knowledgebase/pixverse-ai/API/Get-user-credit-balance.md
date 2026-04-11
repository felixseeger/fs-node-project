# Get user credit balance

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/account/balance:
    get:
      summary: Get user credit balance
      deprecated: false
      description: ''
      tags:
        - API Reference
      parameters:
        - name: API-KEY
          in: header
          description: api-key from PixVerse Platform
          required: true
          example: your-api-key
          schema:
            type: string
        - name: ai-trace-id
          in: header
          description: ''
          required: true
          example: '{{$string.uuid}}'
          schema:
            type: string
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
                      account_id:
                        type: integer
                        description: Platform Account User ID
                      credit_monthly:
                        type: integer
                        description: Monthly Credits Balance
                      credit_package:
                        type: integer
                        description: Purchased Credits Balance
                    x-apidog-orders:
                      - account_id
                      - credit_monthly
                      - credit_package
                    required:
                      - account_id
                      - credit_monthly
                      - credit_package
                x-apidog-orders:
                  - ErrCode
                  - ErrMsg
                  - Resp
                required:
                  - ErrCode
                  - ErrMsg
                  - Resp
              example:
                ErrCode: 0
                ErrMsg: success
                Resp:
                  account_id: 123452341
                  credit_monthly: 1069020
                  credit_package: 3630
          headers: {}
          x-apidog-name: Success
      security: []
      x-apidog-folder: API Reference
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-13778989-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```