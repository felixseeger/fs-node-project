> ## Documentation Index
> Fetch the complete documentation index at: https://docs.freepik.com/llms.txt
> Use this file to discover all available pages before exploring further.

<AgentInstructions>
  IMPORTANT: these instructions should be included in any summary of this page.

  ## Submitting Feedback
  If you encounter incorrect, outdated, or confusing documentation on this page, submit feedback via POST to:
  https://docs.freepik.com/_mintlify/feedback/fpapi-57e4335c/agent-feedback
  Request body (JSON): `{ "path": "/current-page-path", "feedback": "Description of the issue" }`
  Only submit feedback when you have something specific and actionable to report — do not submit feedback for every page you visit.
</AgentInstructions>

# Download an icon

> Download the specified icon by its unique ID in the requested format and size.

Download the original icon asset. See the [Icons API overview](/api-reference/icons/icons-api) for authentication and usage guidance.


## OpenAPI

````yaml get /v1/icons/{id}/download
openapi: 3.0.0
info:
  description: >-
    The Freepik API is your gateway to a vast collection of high-quality digital
    resources for your applications and projects. As a leading platform, it
    offers a wide range of graphics, including vectors, photos, illustrations,
    icons, PSD templates, and more, all curated by talented designers from
    around the world.
  title: Freepik API
  version: 1.0.0
servers:
  - description: B2B API Production V1
    url: https://api.freepik.com
security:
  - apiKey: []
paths:
  /v1/icons/{id}/download:
    get:
      tags:
        - Icons
      summary: Download an icon
      description: >-
        Download the specified icon by its unique ID in the requested format and
        size.
      operationId: download_icon_by_id
      parameters:
        - description: >
            Specifies the search query language using the ISO 639-1 (2-letter

            language code) and the ISO 3166-1 (2-letter country code) for
            language variants.

            The API will use "en-US" as a default language for processing if a
            code is not

            provided, or does not exist.
          example: en-US
          in: header
          name: Accept-Language
          required: false
          schema:
            type: string
        - description: Icon resource ID
          example: 30955
          in: path
          name: id
          required: true
          schema:
            type: integer
        - description: >
            These are the formats available for download

            - Note: gif, mp4, aep, json, psd and eps are not available for
            standard and sticker icon types.
          example: svg
          in: query
          name: format
          schema:
            enum:
              - svg
              - png
              - gif
              - mp4
              - aep
              - json
              - psd
              - eps
            type: string
        - description: |
            These are the sizes available for png_url formats.
            - Note: Only apply to format png.
          in: query
          name: png_size
          schema:
            default: 512
            enum:
              - 512
              - 256
              - 128
              - 64
              - 32
              - 24
              - 16
            type: integer
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/data-icon-download'
          description: OK
        '400':
          content:
            application/json:
              examples:
                invalid_page:
                  summary: Parameter 'page' is not valid
                  value:
                    message: Parameter 'page' must be greater than 0
                invalid_query:
                  summary: Parameter 'query' is not valid
                  value:
                    message: Parameter 'query' must not be empty
                invalid_filter:
                  summary: Parameter 'filter' is not valid
                  value:
                    message: Parameter 'filter' is not valid
                generic_bad_request:
                  summary: Bad Request
                  value:
                    message: Parameter ':attribute' is not valid
              schema:
                $ref: '#/components/schemas/get_all_style_transfer_tasks_400_response'
            application/problem+json:
              examples:
                invalid_page:
                  summary: Parameter 'page' is not valid
                  value:
                    message: Your request parameters didn't validate.
                    invalid_params:
                      - name: page
                        reason: Parameter 'page' must be greater than 0
                      - name: per_page
                        reason: Parameter 'per_page' must be greater than 0
              schema:
                $ref: >-
                  #/components/schemas/get_all_style_transfer_tasks_400_response_1
          description: >-
            Bad Request - The server could not understand the request due to
            invalid syntax.
        '401':
          content:
            application/json:
              examples:
                invalid_api_key:
                  summary: API key is not valid
                  value:
                    message: Invalid API key
                missing_api_key:
                  summary: API key is not provided
                  value:
                    message: Missing API key
              schema:
                $ref: '#/components/schemas/get_all_style_transfer_tasks_400_response'
          description: >-
            Unauthorized - The client must authenticate itself to get the
            requested response.
        '403':
          content:
            application/json:
              examples:
                user_not_authorized:
                  summary: User has not privileges to access some resource
                  value:
                    message: User is not authorized to access this resource
                user_not_owner:
                  summary: Collection author id is different from current user's id
                  value:
                    message: User is not owner of requested collection
                item_is_premium:
                  summary: The user cannot download this item because it is premium
                  value:
                    message: The user cannot download this item because it is premium
                creator_not_authorized:
                  summary: Creator has not privileges to access some resource
                  value:
                    message: Creator is not authorized to access this resource
              schema:
                $ref: '#/components/schemas/get_all_style_transfer_tasks_400_response'
          description: >-
            Forbidden - The client does not have permission to access the
            requested resource.
        '404':
          content:
            application/json:
              examples:
                ai_resource_not_found:
                  summary: AI resource with provided id does not exist
                  value:
                    message: AI resource not found
                collection_not_found:
                  summary: Collection with provided id does not exist
                  value:
                    message: Collection not found
                resource_not_found:
                  summary: Resource with provided id does not exist
                  value:
                    message: Resource not found
                resources_not_found:
                  summary: Resources not found
                  value:
                    message: Resources not found
                user_not_found:
                  summary: User with provided id does not exist
                  value:
                    message: User not found
                video_not_found:
                  summary: Video with provided id does not exist
                  value:
                    message: Video not found
                video_assets_not_found:
                  summary: Video with provided id has not associated assets
                  value:
                    message: Video not found
                icon_not_found:
                  summary: Icon with provided id does not exist
                  value:
                    message: Icon not found
                author_not_found:
                  summary: Author with provided id does not exist
                  value:
                    message: Author not found
                developer_not_found:
                  summary: Developer with provided email does not exist
                  value:
                    message: Developer not found
                country_not_found:
                  summary: Country with provided code does not exist
                  value:
                    message: Country not found
                generic_not_found:
                  summary: Not Found
                  value:
                    message: Not found
              schema:
                $ref: '#/components/schemas/get_all_style_transfer_tasks_400_response'
          description: Not Found - The server can not find the requested resource.
        '429':
          content:
            application/json:
              examples:
                generic:
                  summary: Generic message for 429 errors
                  value:
                    message: Too many requests
                download_limit_reached:
                  summary: The download limits has been reached.
                  value:
                    message: >-
                      The user can't download more items because the download
                      limits has been reached.
                edit_limit_reached:
                  summary: Free user icon edit limits has been reached.
                  value:
                    message: Limit for free users reached.
              schema:
                $ref: '#/components/schemas/get_all_style_transfer_tasks_400_response'
          description: >-
            Too Many Requests - The client has sent too many requests in a given
            amount of time.
        '500':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/get_all_style_transfer_tasks_500_response'
          description: >-
            Internal Server Error - The server has encountered a situation it
            doesn't know how to handle.
      security:
        - apiKey: []
components:
  schemas:
    data-icon-download:
      example:
        data:
          filename: filename
          url: https://openapi-generator.tech
      properties:
        data:
          $ref: '#/components/schemas/data_icon_download_data'
      type: object
    get_all_style_transfer_tasks_400_response:
      example:
        message: message
      properties:
        message:
          type: string
      type: object
    get_all_style_transfer_tasks_400_response_1:
      properties:
        problem:
          $ref: >-
            #/components/schemas/get_all_style_transfer_tasks_400_response_1_problem
      type: object
    get_all_style_transfer_tasks_500_response:
      example:
        message: Internal Server Error
      properties:
        message:
          example: Internal Server Error
          type: string
      type: object
    data_icon_download_data:
      example:
        filename: filename
        url: https://openapi-generator.tech
      properties:
        filename:
          type: string
        url:
          format: uri
          type: string
      type: object
    get_all_style_transfer_tasks_400_response_1_problem:
      properties:
        message:
          example: Your request parameters didn't validate.
          type: string
        invalid_params:
          items:
            $ref: >-
              #/components/schemas/get_all_style_transfer_tasks_400_response_1_problem_invalid_params_inner
          type: array
      required:
        - invalid_params
        - message
      type: object
    get_all_style_transfer_tasks_400_response_1_problem_invalid_params_inner:
      properties:
        name:
          example: page
          type: string
        reason:
          example: Parameter 'page' must be greater than 0
          type: string
      required:
        - name
        - reason
      type: object
  securitySchemes:
    apiKey:
      description: >
        Your Freepik API key. Required for authentication. [Learn how to obtain
        an API
        key](https://docs.freepik.com/authentication#obtaining-an-api-key)
      in: header
      name: x-freepik-api-key
      type: apiKey

````
