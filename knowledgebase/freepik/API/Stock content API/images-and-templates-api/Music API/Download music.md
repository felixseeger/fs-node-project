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

# Download music

> Get a direct download URL for a music audio file. Returns the music ID, title, and a CDN-hosted download link.

Get a direct download URL for a music audio file. See the [Music API overview](/api-reference/music/overview) for authentication and usage guidance.


## OpenAPI

````yaml get /v1/music/{music-id}/download
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
  /v1/music/{music-id}/download:
    get:
      tags:
        - Music
      summary: Download music
      description: >-
        Get a direct download URL for a music audio file. Returns the music ID,
        title, and a CDN-hosted download link.
      operationId: download_music
      parameters:
        - description: Unique numeric identifier of the music item
          example: 1
          in: path
          name: music-id
          required: true
          schema:
            type: integer
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MusicDownloadResponse'
          description: OK
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
        '500':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/get_all_style_transfer_tasks_500_response'
          description: >-
            Internal Server Error - The server has encountered a situation it
            doesn't know how to handle.
components:
  schemas:
    MusicDownloadResponse:
      example:
        download_url: https://cdn.freepik.com/music/track.mp3
        id: 1
        title: Summer Vibes
      properties:
        id:
          description: Unique identifier of the music item
          example: 1
          type: integer
        title:
          description: Music title
          example: Summer Vibes
          type: string
        download_url:
          description: Direct URL to download the music file
          example: https://cdn.freepik.com/music/track.mp3
          type: string
      required:
        - download_url
        - id
        - title
      type: object
    get_all_style_transfer_tasks_400_response:
      example:
        message: message
      properties:
        message:
          type: string
      type: object
    get_all_style_transfer_tasks_500_response:
      example:
        message: Internal Server Error
      properties:
        message:
          example: Internal Server Error
          type: string
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
