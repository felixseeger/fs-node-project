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

# Get loras



## OpenAPI

````yaml get /v1/ai/loras
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
  /v1/ai/loras:
    get:
      tags:
        - loras
      operationId: get_available_loras_list
      responses:
        '200':
          content:
            application/json:
              examples:
                success:
                  $ref: '#/components/examples/200-loras'
              schema:
                $ref: '#/components/schemas/get_available_loras_list_200_response'
          description: OK
        '500':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/get_all_style_transfer_tasks_500_response'
          description: >-
            Internal Server Error - The server has encountered a situation it
            doesn't know how to handle.
        '503':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/get_all_style_transfer_tasks_503_response'
          description: Service Unavailable
components:
  examples:
    200-loras:
      summary: Loras response
      value:
        data:
          default:
            - id: 1
              name: vintage-japanese
              description: >-
                Expect bold red colors and a sense of nostalgia, bringing to
                life classic Japanese elements.
              category: illustration
              type: style
              preview: https://example.com/vintage-japanese-preview.jpg
              training:
                status: completed
                defaultScale: 1.2
            - id: 2
              name: sara
              description: sara
              category: people
              type: character
              preview: https://example.com/sara-preview.jpg
              training:
                status: completed
                defaultScale: 1.2
            - id: 3
              name: glasses
              description: glasses
              category: glasses
              type: product
              preview: https://example.com/glasses-preview.jpg
              training:
                status: completed
                defaultScale: 1.2
          customs:
            - id: 110
              name: sara
              description: ''
              category: photography
              type: character
              preview: https://example.com/sara-preview.jpg
              training:
                status: completed
                defaultScale: 1
                quality: null
  schemas:
    get_available_loras_list_200_response:
      example:
        data:
          - default:
              - preview: >-
                  https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
                name: vintage-japanese
                description: >-
                  Expect bold red colors and a sense of nostalgia, bringing to
                  life classic Japanese elements.
                training:
                  defaultScale: 1.2
                  status: status
                  quality: quality
                id: 1
                category: illustration
                type: character
              - preview: >-
                  https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
                name: vintage-japanese
                description: >-
                  Expect bold red colors and a sense of nostalgia, bringing to
                  life classic Japanese elements.
                training:
                  defaultScale: 1.2
                  status: status
                  quality: quality
                id: 1
                category: illustration
                type: character
            customs:
              - preview: >-
                  https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
                name: vintage-japanese
                description: >-
                  Expect bold red colors and a sense of nostalgia, bringing to
                  life classic Japanese elements.
                training:
                  defaultScale: 1.2
                  status: status
                  quality: quality
                id: 1
                category: illustration
                type: character
              - preview: >-
                  https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
                name: vintage-japanese
                description: >-
                  Expect bold red colors and a sense of nostalgia, bringing to
                  life classic Japanese elements.
                training:
                  defaultScale: 1.2
                  status: status
                  quality: quality
                id: 1
                category: illustration
                type: character
          - default:
              - preview: >-
                  https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
                name: vintage-japanese
                description: >-
                  Expect bold red colors and a sense of nostalgia, bringing to
                  life classic Japanese elements.
                training:
                  defaultScale: 1.2
                  status: status
                  quality: quality
                id: 1
                category: illustration
                type: character
              - preview: >-
                  https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
                name: vintage-japanese
                description: >-
                  Expect bold red colors and a sense of nostalgia, bringing to
                  life classic Japanese elements.
                training:
                  defaultScale: 1.2
                  status: status
                  quality: quality
                id: 1
                category: illustration
                type: character
            customs:
              - preview: >-
                  https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
                name: vintage-japanese
                description: >-
                  Expect bold red colors and a sense of nostalgia, bringing to
                  life classic Japanese elements.
                training:
                  defaultScale: 1.2
                  status: status
                  quality: quality
                id: 1
                category: illustration
                type: character
              - preview: >-
                  https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
                name: vintage-japanese
                description: >-
                  Expect bold red colors and a sense of nostalgia, bringing to
                  life classic Japanese elements.
                training:
                  defaultScale: 1.2
                  status: status
                  quality: quality
                id: 1
                category: illustration
                type: character
      properties:
        data:
          items:
            $ref: '#/components/schemas/loras-list'
          type: array
      type: object
    get_all_style_transfer_tasks_500_response:
      example:
        message: Internal Server Error
      properties:
        message:
          example: Internal Server Error
          type: string
      type: object
    get_all_style_transfer_tasks_503_response:
      example:
        message: Service Unavailable. Please try again later.
      properties:
        message:
          example: Service Unavailable. Please try again later.
          type: string
      type: object
    loras-list:
      example:
        default:
          - preview: https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
            name: vintage-japanese
            description: >-
              Expect bold red colors and a sense of nostalgia, bringing to life
              classic Japanese elements.
            training:
              defaultScale: 1.2
              status: status
              quality: quality
            id: 1
            category: illustration
            type: character
          - preview: https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
            name: vintage-japanese
            description: >-
              Expect bold red colors and a sense of nostalgia, bringing to life
              classic Japanese elements.
            training:
              defaultScale: 1.2
              status: status
              quality: quality
            id: 1
            category: illustration
            type: character
        customs:
          - preview: https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
            name: vintage-japanese
            description: >-
              Expect bold red colors and a sense of nostalgia, bringing to life
              classic Japanese elements.
            training:
              defaultScale: 1.2
              status: status
              quality: quality
            id: 1
            category: illustration
            type: character
          - preview: https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
            name: vintage-japanese
            description: >-
              Expect bold red colors and a sense of nostalgia, bringing to life
              classic Japanese elements.
            training:
              defaultScale: 1.2
              status: status
              quality: quality
            id: 1
            category: illustration
            type: character
      properties:
        default:
          description: List of default Loras
          items:
            $ref: '#/components/schemas/lora-item'
          type: array
        customs:
          description: List of custom Loras
          items:
            $ref: '#/components/schemas/lora-item'
          type: array
      type: object
    lora-item:
      example:
        preview: https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
        name: vintage-japanese
        description: >-
          Expect bold red colors and a sense of nostalgia, bringing to life
          classic Japanese elements.
        training:
          defaultScale: 1.2
          status: status
          quality: quality
        id: 1
        category: illustration
        type: character
      properties:
        id:
          description: Lora ID
          example: 1
          minimum: 1
          type: integer
        name:
          description: Lora name
          example: vintage-japanese
          type: string
        description:
          description: Lora description
          example: >-
            Expect bold red colors and a sense of nostalgia, bringing to life
            classic Japanese elements.
          nullable: true
          type: string
        category:
          description: Lora category
          example: illustration
          type: string
        type:
          description: Lora type
          example: character
          type: string
        preview:
          description: Preview image URL for the Lora
          example: https://www.example.com/4fef9987-75d0-44d1-b336-65f42f883bff.png
          format: uri
          type: string
        training:
          $ref: '#/components/schemas/lora_item_training'
      required:
        - category
        - description
        - id
        - name
        - preview
        - training
        - type
      type: object
    lora_item_training:
      example:
        defaultScale: 1.2
        status: status
        quality: quality
      properties:
        status:
          description: Training status
          type: string
        defaultScale:
          description: Default scale
          example: 1.2
          type: number
        quality:
          description: Training quality
          nullable: true
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

