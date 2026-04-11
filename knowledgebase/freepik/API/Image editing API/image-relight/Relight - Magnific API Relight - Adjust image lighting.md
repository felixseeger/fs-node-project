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

# Relight - Adjust image lighting

> Relight an image using AI. This endpoint accepts a variety of parameters to customize the generated images.

## Important

Upscaler endpoints are only available for premium API users. You can upgrade your account [here](https://www.freepik.com/developers/dashboard/billing).

## Request


## OpenAPI

````yaml post /v1/ai/image-relight
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
  /v1/ai/image-relight:
    post:
      tags:
        - image-relight
      summary: Relight - Adjust image lighting
      description: >-
        Relight an image using AI. This endpoint accepts a variety of parameters
        to customize the generated images.
      requestBody:
        content:
          application/json:
            examples:
              all-params:
                $ref: '#/components/examples/request-image-relight-all-params'
              required-params:
                $ref: '#/components/examples/request-image-relight-required-params'
            schema:
              $ref: '#/components/schemas/relight-request'
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: >-
                  #/components/schemas/get_style_transfer_task_status_200_response
          description: OK - The request has succeeded and the relight process has started.
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
    request-image-relight-all-params:
      summary: Example - Relight request with all params
      value:
        image: >-
          iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQAAAABRBrPYAAABrElEQVR4nO3BMQEAAADCoPVPbQ0Po...
        prompt: A sunlit forest clearing at golden hour
        transfer_light_from_reference_image: >-
          iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQAAAABRBrPYAAABrElEQVR4nO3BMQEAAADCoPVPbQ0Po...
        light_transfer_strength: 100
        interpolate_from_original: false
        change_background: true
        style: smooth
        advanced_settings:
          whites: 60
          blacks: 60
          brightness: 30
          contrast: 40
          saturation: 50
          engine: illusio
          transfer_light_a: low
          transfer_light_b: soft_in
          fixed_generation: true
    request-image-relight-required-params:
      summary: Example - Relight only required params
      value:
        image: >-
          iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQAAAABRBrPYAAABrElEQVR4nO3BMQEAAADCoPVPbQ0Po...
  schemas:
    relight-request:
      properties:
        webhook_url:
          description: >
            Optional callback URL that will receive asynchronous notifications
            whenever the task changes status. The payload sent to this URL is
            the same as the corresponding GET endpoint response, but without the
            data field.
          example: https://www.example.com/webhook
          format: uri
          type: string
        image:
          description: Base64 or URL of the image to do the relight
          type: string
        prompt:
          description: >
            You can guide the generation process and influence the light
            transfer with a descriptive prompt. For example, if the reference
            image is a brightly lit scene, adding something like "A sunlit
            forest clearing at golden hour" will be helpful.


            You can also use your imagination to alter lighting conditions in
            images: transforming a daytime scene into a moonlit night, enhancing
            the warmth of a sunset, or even dramatic changes like casting
            shadows of towering structures across a cityscape.


            IMPORTANT: You can emphasize specific aspects of the light in your
            prompt by using a number in parentheses, ranging from 1 to 1.4, like
            "(dark scene:1.3)".
          type: string
        transfer_light_from_reference_image:
          description: >-
            Base64 or URL of the reference image for light transfer.
            Incompatible with 'transfer_light_from_lightmap'
          type: string
        transfer_light_from_lightmap:
          description: >-
            Base64 or URL of the lightmap for light transfer. Icompatible with
            'transfer_light_from_reference_image'
          type: string
        light_transfer_strength:
          default: 100
          description: >
            It allows you to specify the level of light transfer, meaning the
            intensity that your prompt, reference image, or lightmap will have.
            A value of 0% will keep your image closest to the original, while
            100% represents the maximum possible light transfer.


            If you enable "Interpolate from original", lower values on this
            slider will make the result even more similar to your original
            image.

            Valid values range `[0, 100]`, default `100`
          maximum: 100
          minimum: 0
          type: integer
        interpolate_from_original:
          default: false
          description: >
            When enabled, this feature will make your final image interpolate
            from the original using the "Light transfer strength" slider, at the
            cost of sometimes restricting the generation's freedom.


            If disabled, the generation will be freer and will generally produce
            better results. However, for example, if you want to generate all
            the frames of a video where a room transitions from having the
            lights off and very dim lighting to gradually becoming fully
            illuminated as a new day begins, activating this option might be
            useful (together with gradually ingreasing the "Light transfer
            strength" slider).
          type: boolean
        change_background:
          default: true
          description: >
            When enabled, it will change the background based on your prompt
            and/or reference image. This is super useful for product placement
            and portraits. However, don't forget to disable it if your scene is
            something like a landscape or an interior.
          type: boolean
        style:
          default: standard
          enum:
            - standard
            - darker_but_realistic
            - clean
            - smooth
            - brighter
            - contrasted_n_hdr
            - just_composition
          type: string
        preserve_details:
          default: true
          description: >
            It will try to maintain the texture and small details of the
            original image. Especially good for product photography, texts, etc.
            Disable it if you prefer a smoother result.
          type: boolean
        advanced_settings:
          $ref: '#/components/schemas/relight-request-advanced-settings'
      required:
        - image
      type: object
    get_style_transfer_task_status_200_response:
      example:
        data:
          generated:
            - https://openapi-generator.tech
            - https://openapi-generator.tech
          task_id: 046b6c7f-0b8a-43b9-b35d-6489e6daee91
          status: CREATED
      properties:
        data:
          $ref: '#/components/schemas/task-detail'
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
    relight-request-advanced-settings:
      properties:
        whites:
          default: 50
          description: |
            Adjust the level of white color in the image.
            Valid values range `[0, 100]`, default `50`.
          maximum: 100
          minimum: 0
          type: integer
        blacks:
          default: 50
          description: |
            Adjust the level of black color in the image.
            Valid values range `[0, 100]`, default `50`.
          maximum: 100
          minimum: 0
          type: integer
        brightness:
          default: 50
          description: |
            Adjust the level of brightness in the image.
            Valid values range `[0, 100]`, default `50`.
          maximum: 100
          minimum: 0
          type: integer
        contrast:
          default: 50
          description: |
            Adjust the level of contrast in the image.
            Valid values range `[0, 100]`, default `50`.
          maximum: 100
          minimum: 0
          type: integer
        saturation:
          default: 50
          description: |
            Adjust the level of saturation in the image.
            Valid values range `[0, 100]`, default `50`.
          maximum: 100
          minimum: 0
          type: integer
        engine:
          default: automatic
          description: |
            Balanced: Well-rounded, general-purpose option.
            Cool: Brighter with cooler tones.
            Real: Aims to enhance photographic quality. Experimental.
            Illusio: Optimized for illustrations and drawings.
            Fairy: Suited for fantasy-themed images.
            Colorful Anime: Ideal for anime, cartoons, and vibrant colors.
            Hard Transform: Significantly alters the original image.
            Softy: Slightly softer effect, suitable for graphic designs.
          enum:
            - automatic
            - balanced
            - cool
            - real
            - illusio
            - fairy
            - colorful_anime
            - hard_transform
            - softy
          type: string
        transfer_light_a:
          default: automatic
          description: >-
            Adjusts the intensity of light transfer. Advanced feature requiring
            practice to use effectively.
          enum:
            - automatic
            - low
            - medium
            - normal
            - high
            - high_on_faces
          type: string
        transfer_light_b:
          default: automatic
          description: >-
            Also modifies light transfer intensity. Can be combined with the
            previous control for varied effects. Complex to master but offers
            more control
          enum:
            - automatic
            - composition
            - straight
            - smooth_in
            - smooth_out
            - smooth_both
            - reverse_both
            - soft_in
            - soft_out
            - soft_mid
            - strong_mid
            - style_shift
            - strong_shift
          type: string
        fixed_generation:
          default: false
          description: >
            When this option is enabled, using the same settings will
            consistently produce the same image. Fixed generations are ideal for
            fine-tuning, as it allows for incremental changes to parameters
            (such as the prompt) to see subtle variations in the output. When
            disabled, expect each generation to introduce a degree of
            randomness, leading to more diverse outcomes.
          type: boolean
      type: object
    task-detail:
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
