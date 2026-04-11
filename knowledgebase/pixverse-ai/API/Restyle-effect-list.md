# Restyle effect list

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /openapi/v2/video/restyle/list:
    get:
      summary: Restyle effect list
      deprecated: false
      description: ''
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
                page_num:
                  type: string
                page_size:
                  type: string
              required:
                - page_num
                - page_size
            example:
              page_num: string
              page_size: string
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
      x-run-in-apidog: https://app.apidog.com/web/project/772214/apis/api-21992862-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://app-api.pixverse.ai
    description: Prod Env
security: []

```