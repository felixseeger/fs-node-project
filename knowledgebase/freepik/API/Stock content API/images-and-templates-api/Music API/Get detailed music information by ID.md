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

# Get detailed music information by ID

> Retrieve full details for a music item including artist biography, genre and mood metadata, popularity score, and download statistics.

Retrieve full details for a music item including artist biography, genre and mood metadata, popularity score, and download statistics. See the [Music API overview](/api-reference/music/overview) for authentication and usage guidance.


## OpenAPI

````yaml get /v1/music/{music-id}
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
  /v1/music/{music-id}:
    get:
      tags:
        - Music
      summary: Get detailed music information by ID
      description: >-
        Retrieve full details for a music item including artist biography, genre
        and mood metadata, popularity score, and download statistics.
      operationId: get_music_detail
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
                $ref: '#/components/schemas/MusicDetail'
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
    MusicDetail:
      example:
        favorites: 350
        file_url: file_url
        cover_url: cover_url
        is_active: true
        artist:
          cover_url: cover_url
          name: John Doe
          bio: bio
          id: 1
          track_count: 42
        moods:
          - cover_url: cover_url
            is_active: true
            name: Happy
            id: 1
            order: 1
          - cover_url: cover_url
            is_active: true
            name: Happy
            id: 1
            order: 1
        created_at: '2000-01-23T04:56:07.000Z'
        in_playlists: 15
        title: Summer Vibes
        seconds: 225
        is_premium: true
        downloads: 1200
        genres:
          - cover_url: cover_url
            is_active: true
            name: Electronic
            description: description
            id: 1
            order: 1
          - cover_url: cover_url
            is_active: true
            name: Electronic
            description: description
            id: 1
            order: 1
        preview_url: preview_url
        popularity: 85
        download_url: download_url
        id: 1
        time: '3:45'
      properties:
        id:
          description: Unique identifier of the music item
          example: 1
          type: integer
        title:
          description: Music title
          example: Summer Vibes
          type: string
        artist:
          $ref: '#/components/schemas/MusicDetail_artist'
        genres:
          items:
            $ref: '#/components/schemas/GenreItem'
          type: array
        moods:
          items:
            $ref: '#/components/schemas/MoodItem'
          type: array
        cover_url:
          description: URL to the music cover image
          nullable: true
          type: string
        file_url:
          description: Direct S3/CDN URL to the audio file
          nullable: true
          type: string
        preview_url:
          description: Preview URL
          nullable: true
          type: string
        download_url:
          description: URL to download the music
          nullable: true
          type: string
        seconds:
          description: Music duration in seconds
          example: 225
          type: integer
        time:
          description: Music duration formatted as minutes and seconds
          example: '3:45'
          type: string
        popularity:
          description: Popularity score
          example: 85
          type: integer
        is_premium:
          description: Whether the music is premium
          type: boolean
        is_active:
          description: Whether the music is active
          type: boolean
        created_at:
          description: Music creation timestamp
          format: date-time
          type: string
        downloads:
          description: Total number of downloads
          example: 1200
          type: integer
        favorites:
          description: Total number of favorites
          example: 350
          type: integer
        in_playlists:
          description: Number of playlists containing this music
          example: 15
          type: integer
      required:
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
    MusicDetail_artist:
      example:
        cover_url: cover_url
        name: John Doe
        bio: bio
        id: 1
        track_count: 42
      nullable: true
      properties:
        id:
          example: 1
          type: integer
        name:
          example: John Doe
          type: string
        bio:
          description: Artist biography
          type: string
        cover_url:
          description: URL to the artist cover image
          type: string
        track_count:
          description: Total number of music items by the artist
          example: 42
          type: integer
      required:
        - bio
        - cover_url
        - id
        - name
        - track_count
      type: object
    GenreItem:
      example:
        cover_url: cover_url
        is_active: true
        name: Electronic
        description: description
        id: 1
        order: 1
      properties:
        id:
          example: 1
          type: integer
        name:
          enum:
            - Acoustic
            - Afrobeat
            - Ambient
            - Blues
            - Children
            - Cinematic
            - Classical
            - Corporate
            - Country
            - Disco
            - Electronic
            - Funk
            - Hip Hop
            - Jazz
            - Latin
            - Lofi
            - Lounge
            - Pop
            - Reggae
            - RnB
            - Rock
            - Soul
            - Synthwave
            - World
          example: Electronic
          type: string
        order:
          example: 1
          type: integer
        is_active:
          type: boolean
        cover_url:
          type: string
        description:
          type: string
      required:
        - id
        - name
      type: object
    MoodItem:
      example:
        cover_url: cover_url
        is_active: true
        name: Happy
        id: 1
        order: 1
      properties:
        id:
          example: 1
          type: integer
        name:
          enum:
            - Dark
            - Dramatic
            - Elegant
            - Energetic
            - Epic
            - Exciting
            - Groovy
            - Happy
            - Hopeful
            - Laid Back
            - Melancholic
            - Peaceful
            - Playful
            - Sad
            - Sentimental
            - Soulful
            - Tension
            - Upbeat
          example: Happy
          type: string
        order:
          example: 1
          type: integer
        is_active:
          type: boolean
        cover_url:
          type: string
      required:
        - id
        - name
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
