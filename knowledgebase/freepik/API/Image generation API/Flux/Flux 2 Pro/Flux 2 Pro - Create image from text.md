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

# Flux 2 Pro - Create image from text

> Create professional-grade images using FLUX.2 [pro], the next generation of Black Forest Labs' image models.

**Key Features:**
- Professional quality without complex tuning
- Text-to-image generation
- Image-to-image editing (up to 4 input images)
- Customizable dimensions (256-1440px)
- Optional prompt enhancement
- Reproducible results with seed

**Use Cases:**
- Marketing materials and advertisements
- Product photography variations
- Concept art and illustrations
- Image editing and enhancement




## OpenAPI

````yaml post /v1/ai/text-to-image/flux-2-pro
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
  /v1/ai/text-to-image/flux-2-pro:
    post:
      tags:
        - text-to-image
      summary: Flux 2 Pro - Create image from text
      description: >
        Create professional-grade images using FLUX.2 [pro], the next generation
        of Black Forest Labs' image models.


        **Key Features:**

        - Professional quality without complex tuning

        - Text-to-image generation

        - Image-to-image editing (up to 4 input images)

        - Customizable dimensions (256-1440px)

        - Optional prompt enhancement

        - Reproducible results with seed


        **Use Cases:**

        - Marketing materials and advertisements

        - Product photography variations

        - Concept art and illustrations

        - Image editing and enhancement
      operationId: create_image_flux_2_pro
      requestBody:
        content:
          application/json:
            examples:
              required-params:
                $ref: '#/components/examples/request-flux-2-pro-required-params'
              all-params:
                $ref: '#/components/examples/request-flux-2-pro-all-params'
            schema:
              $ref: '#/components/schemas/ttif2p-request-content'
        required: true
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/create_image_from_text_flux_200_response'
          description: OK - Task created successfully
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
  examples:
    request-flux-2-pro-required-params:
      summary: Minimal request with required parameters only
      value:
        prompt: a beautiful sunset over mountains with dramatic clouds
    request-flux-2-pro-all-params:
      summary: Complete request with all parameters
      value:
        prompt: >-
          a futuristic cityscape at night with neon lights reflecting on wet
          streets, cyberpunk aesthetic, dramatic lighting, highly detailed
        width: 1440
        height: 768
        seed: 42
        prompt_upsampling: false
        webhook_url: https://your-app.com/webhooks/flux-2-pro
  schemas:
    ttif2p-request-content:
      properties:
        prompt:
          description: >
            Text description of the image you want to generate.


            **FLUX.2 [pro]** delivers professional-grade image generation
            without requiring complex parameter tuning. The model automatically
            optimizes for quality and consistency.


            **Tips for better results:**

            - Be specific about subjects, scenes, and visual details

            - Describe lighting, atmosphere, and mood

            - Mention art style or photographic techniques if desired


            **Examples:**

            - Simple: `"a cat sitting on a windowsill"`

            - Detailed: `"a fluffy orange tabby cat sitting on a rustic wooden
            windowsill, golden hour lighting, soft focus background"`

            - Creative: `"futuristic cityscape at night with neon lights
            reflecting on wet streets, cyberpunk aesthetic, dramatic lighting"`
          example: a beautiful sunset over the ocean with dramatic clouds
          type: string
        width:
          default: 1024
          description: |
            Width of the image in pixels.

            **Valid range:** 256 to 1440 pixels
            **Default:** 1024 pixels

            **Common sizes:**
            - Square: 1024×1024
            - Landscape: 1440×768 (16:9)
            - Portrait: 768×1440 (9:16)
          example: 1024
          maximum: 1440
          minimum: 256
          type: integer
        height:
          default: 768
          description: >
            Height of the image in pixels.


            **Valid range:** 256 to 1440 pixels

            **Default:** 768 pixels


            **Tip:** Total megapixels affect generation cost. Higher resolution
            = higher cost.
          example: 768
          maximum: 1440
          minimum: 256
          type: integer
        seed:
          description: >
            Random seed for reproducible results.


            **Use case:** Generate variations of the same image by using the
            same seed with slightly modified prompts.


            **Valid range:** 0 to 4,294,967,295

            **Default:** Random seed (if not provided)
          example: 42
          maximum: 4294967295
          minimum: 0
          nullable: true
          type: integer
        prompt_upsampling:
          default: false
          description: >
            Automatically enhance and expand your prompt for better generation
            results.


            **When to enable:**

            - Using simple, short prompts

            - Want AI to add creative details

            - Experimenting with variations


            **When to disable:**

            - Using detailed, specific prompts

            - Need exact control over output

            - Following brand guidelines
          example: false
          type: boolean
        input_image:
          description: >
            Base64-encoded input image for **image-to-image generation** or
            **image editing**.


            **Supported formats:** JPEG, PNG, WebP

            **Use cases:**

            - Modify existing images

            - Style transfer

            - Composition refinement


            **Note:** Can provide up to 4 input images using `input_image`,
            `input_image_2`, `input_image_3`, and `input_image_4`.
          nullable: true
          type: string
        input_image_2:
          description: Second base64-encoded input image for multi-image generation.
          nullable: true
          type: string
        input_image_3:
          description: Third base64-encoded input image for multi-image generation.
          nullable: true
          type: string
        input_image_4:
          description: Fourth base64-encoded input image for multi-image generation.
          nullable: true
          type: string
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
        - prompt
      type: object
    create_image_from_text_flux_200_response:
      example:
        data:
          task_id: 046b6c7f-0b8a-43b9-b35d-6489e6daee91
          status: CREATED
      properties:
        data:
          $ref: '#/components/schemas/task'
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