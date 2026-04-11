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

# Ideogram Image Edit - Edit an image using inpainting

> Edit an image using Ideogram AI's inpainting capabilities. Provide an image and a mask to specify the areas to edit, along with a prompt describing the desired changes.

**Key features:**
- Inpainting: Edit specific areas of an image using a mask
- Multiple rendering speeds: TURBO, DEFAULT, or QUALITY
- MagicPrompt: Automatically enhance your prompt for better results
- Style customization: Use style codes, style types, and reference images
- Character reference: Use reference images to maintain character consistency

**Supported formats:** JPEG, WebP, PNG (max 10MB each)




## OpenAPI

````yaml post /v1/ai/ideogram-image-edit
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
  /v1/ai/ideogram-image-edit:
    post:
      tags:
        - ideogram-image-edit
      summary: Ideogram Image Edit - Edit an image using inpainting
      description: >
        Edit an image using Ideogram AI's inpainting capabilities. Provide an
        image and a mask to specify the areas to edit, along with a prompt
        describing the desired changes.


        **Key features:**

        - Inpainting: Edit specific areas of an image using a mask

        - Multiple rendering speeds: TURBO, DEFAULT, or QUALITY

        - MagicPrompt: Automatically enhance your prompt for better results

        - Style customization: Use style codes, style types, and reference
        images

        - Character reference: Use reference images to maintain character
        consistency


        **Supported formats:** JPEG, WebP, PNG (max 10MB each)
      operationId: create_ideogram_image_edit
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/request-content_7'
        required: true
      responses:
        '200':
          content:
            application/json:
              examples:
                success - created task:
                  $ref: '#/components/examples/200-task-created'
                success - in progress task:
                  $ref: '#/components/examples/200-task-in-progress'
                success - completed task:
                  $ref: '#/components/examples/200-task-completed'
                success - failed task:
                  $ref: '#/components/examples/200-task-failed'
              schema:
                $ref: >-
                  #/components/schemas/_v1_ai_text_to_image_hyperflux_post_200_response
          description: OK - The task exists and the status is returned
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
  schemas:
    request-content_7:
      properties:
        prompt:
          description: The prompt describing the desired changes to the image.
          example: A beautiful sunset over the ocean
          type: string
        image:
          description: >
            The image to be edited. Supports HTTPS URLs or Base64 encoded
            string.

            Supported formats: JPEG, WebP, PNG (max 10MB)
          example: iVBORw0KGgoAAAANSUhEUgAA...
          type: string
        mask:
          description: |
            A black and white image of the same size as the image being edited.
            Black regions indicate where to edit the image.
            Supports HTTPS URLs or Base64 encoded string.
            Supported formats: JPEG, WebP, PNG (max 10MB)
          example: iVBORw0KGgoAAAANSUhEUgAA...
          type: string
        seed:
          description: Optional seed for reproducibility
          example: 12345
          maximum: 2147483647
          minimum: 0
          type: integer
        rendering_speed:
          default: DEFAULT
          description: |
            The rendering speed for image generation.
            - TURBO: Fastest, lower quality
            - DEFAULT: Balanced speed and quality
            - QUALITY: Slower, higher quality
          enum:
            - TURBO
            - DEFAULT
            - QUALITY
          example: DEFAULT
          type: string
        magic_prompt:
          description: |
            Determine if MagicPrompt should be used to enhance the prompt.
            - AUTO: Automatically decide
            - ON: Always use MagicPrompt
            - OFF: Never use MagicPrompt
          enum:
            - AUTO
            - 'ON'
            - 'OFF'
          example: AUTO
          type: string
        color_palette:
          $ref: '#/components/schemas/request_content_7_color_palette'
        style_codes:
          description: A list of style codes to use for image generation
          example:
            - style_code_1
            - style_code_2
          items:
            type: string
          type: array
        style_type:
          description: >
            The type of style to use. Must be specified if
            character_reference_images is provided.

            - AUTO: Automatically select style

            - GENERAL: General purpose style

            - REALISTIC: Realistic style

            - DESIGN: Design-oriented style
          enum:
            - AUTO
            - GENERAL
            - REALISTIC
            - DESIGN
          example: AUTO
          type: string
        style_reference_images:
          description: >
            Images to use as style references. Provide as Base64 strings or
            URLs.

            Maximum total size: 10MB across all references.

            Supported formats: JPEG, PNG, WebP
          example:
            - https://example.com/style-ref.jpg
          items:
            type: string
          type: array
        character_reference_images:
          description: |
            Images to use as character references for consistency.
            Provide as Base64 strings or URLs.
            Maximum total size: 10MB across all references.
            Supported formats: JPEG, PNG, WebP
          example:
            - https://example.com/character-ref.jpg
          items:
            type: string
          type: array
        webhook_url:
          description: >
            Optional callback URL that will receive asynchronous notifications
            whenever the task changes status. The payload sent to this URL is
            the same as the corresponding GET endpoint response, but without the
            data field.
          example: https://www.example.com/webhook
          format: uri
          type: string
      required:
        - image
        - mask
        - prompt
      type: object
    _v1_ai_text_to_image_hyperflux_post_200_response:
      example:
        data:
          generated:
            - https://openapi-generator.tech
            - https://openapi-generator.tech
          task_id: 046b6c7f-0b8a-43b9-b35d-6489e6daee91
          status: CREATED
      properties:
        data:
          $ref: '#/components/schemas/task-detail_1'
      required:
        - data
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
    get_all_style_transfer_tasks_503_response:
      example:
        message: Service Unavailable. Please try again later.
      properties:
        message:
          example: Service Unavailable. Please try again later.
          type: string
      type: object
    request_content_7_color_palette:
      description: >
        A color palette for generation. Specify either name (preset) or members
        (custom colors), not both.
      properties:
        name:
          description: A color palette preset value
          enum:
            - EMBER
            - FRESH
            - JUNGLE
            - MAGIC
            - MELON
            - MOSAIC
            - PASTEL
            - ULTRAMARINE
          type: string
        members:
          description: Custom color palette members
          items:
            $ref: '#/components/schemas/request_content_7_color_palette_members_inner'
          type: array
      type: object
    task-detail_1:
      allOf:
        - $ref: '#/components/schemas/task'
        - properties:
            generated:
              items:
                description: URL of the generated image
                format: uri
                type: string
              type: array
          required:
            - generated
          type: object
      example:
        generated:
          - https://openapi-generator.tech
          - https://openapi-generator.tech
        task_id: 046b6c7f-0b8a-43b9-b35d-6489e6daee91
        status: CREATED
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
    request_content_7_color_palette_members_inner:
      properties:
        color_hex:
          description: Hexadecimal color code
          example: '#FF5733'
          pattern: ^#(?:[0-9a-fA-F]{3}){1,2}$
          type: string
        color_weight:
          description: Weight of the color in the palette
          example: 0.5
          maximum: 1
          minimum: 0.05
          type: number
      required:
        - color_hex
      type: object
    task:
      example:
        task_id: 046b6c7f-0b8a-43b9-b35d-6489e6daee91
        status: CREATED
      properties:
        task_id:
          description: Task identifier
          format: uuid
          type: string
        status:
          description: Task status
          enum:
            - CREATED
            - IN_PROGRESS
            - COMPLETED
            - FAILED
          type: string
      required:
        - status
        - task_id
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
  examples:
    200-task-created:
      summary: Success - Task created
      value:
        data:
          generated: []
          task_id: 046b6c7f-0b8a-43b9-b35d-6489e6daee91
          status: CREATED
    200-task-in-progress:
      summary: Success - Task in progress
      value:
        data:
          generated: []
          task_id: 046b6c7f-0b8a-43b9-b35d-6489e6daee91
          status: IN_PROGRESS
    200-task-completed:
      summary: Success - Task completed
      value:
        data:
          generated:
            - https://ai-statics.freepik.com/completed_task_image.jpg
          task_id: 046b6c7f-0b8a-43b9-b35d-6489e6daee91
          status: COMPLETED
    200-task-failed:
      summary: Success - Task failed
      value:
        data:
          generated: []
          task_id: 046b6c7f-0b8a-43b9-b35d-6489e6daee91
          status: FAILED
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
