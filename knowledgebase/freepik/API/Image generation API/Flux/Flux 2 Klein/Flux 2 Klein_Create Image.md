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

# Create Image

> Generate images with sub-second speed using FLUX.2 [klein], the fastest model in the FLUX.2 family by Black Forest Labs.

**Key Features:**
- Sub-second generation time
- Up to 4 reference images for style/subject transfer
- 10 preset aspect ratios with 1k or 2k resolution options
- Adjustable safety tolerance (0-5)
- Multiple output formats (PNG/JPEG)

**Use Cases:**
- Real-time applications requiring fast generation
- Style transfer with reference images
- Rapid prototyping and iteration
- High-volume image generation




## OpenAPI

````yaml POST /v1/ai/text-to-image/flux-2-klein
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
  /v1/ai/text-to-image/flux-2-klein:
    post:
      tags:
        - text-to-image
      summary: Flux 2 Klein - Create image from text
      description: >
        Generate images with sub-second speed using FLUX.2 [klein], the fastest
        model in the FLUX.2 family by Black Forest Labs.


        **Key Features:**

        - Sub-second generation time

        - Up to 4 reference images for style/subject transfer

        - 10 preset aspect ratios with 1k or 2k resolution options

        - Adjustable safety tolerance (0-5)

        - Multiple output formats (PNG/JPEG)


        **Use Cases:**

        - Real-time applications requiring fast generation

        - Style transfer with reference images

        - Rapid prototyping and iteration

        - High-volume image generation
      operationId: create_image_flux_2_klein
      requestBody:
        content:
          application/json:
            examples:
              required-params:
                $ref: '#/components/examples/request-flux-2-klein-required-params'
              all-params:
                $ref: '#/components/examples/request-flux-2-klein-all-params'
            schema:
              $ref: '#/components/schemas/ttif2k-request-content'
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
    request-flux-2-klein-required-params:
      summary: Minimum required parameters
      value:
        prompt: a beautiful sunset over the ocean with dramatic clouds
    request-flux-2-klein-all-params:
      summary: Complete request with all parameters
      value:
        prompt: >-
          a futuristic cityscape at night with neon lights reflecting on wet
          streets, cyberpunk aesthetic
        aspect_ratio: widescreen_16_9
        resolution: 2k
        seed: 42
        safety_tolerance: 2
        output_format: png
        webhook_url: https://your-app.com/webhooks/flux-2-klein
  schemas:
    ttif2k-request-content:
      properties:
        prompt:
          description: >
            Text description of the image you want to generate.


            **FLUX.2 [klein]** is the fastest model in the FLUX.2 family,
            optimized for sub-second generation while maintaining high quality.
            It supports up to 4 reference images for style and subject transfer.


            **Tips for better results:**

            - Be specific about subjects, scenes, and visual details

            - Use reference images to guide style and composition

            - Combine prompt with reference images for best results


            **Examples:**

            - Simple: `"a mountain landscape at sunset"`

            - Detailed: `"portrait of a person in natural lighting, soft focus
            background"`

            - With style: `"abstract art in the style of watercolor painting"`
          example: a beautiful sunset over the ocean with dramatic clouds
          type: string
        aspect_ratio:
          default: square_1_1
          description: >
            Aspect ratio of the generated image. Determines the proportional
            relationship between width and height.


            | Aspect Ratio | Base Dimensions (1k) |

            |--------------|---------------------|

            | `square_1_1` | 1024 × 1024 |

            | `widescreen_16_9` | 1344 × 768 |

            | `social_story_9_16` | 768 × 1344 |

            | `portrait_2_3` | 832 × 1216 |

            | `traditional_3_4` | 960 × 1280 |

            | `vertical_1_2` | 704 × 1408 |

            | `horizontal_2_1` | 1408 × 704 |

            | `social_post_4_5` | 896 × 1152 |

            | `standard_3_2` | 1216 × 832 |

            | `classic_4_3` | 1280 × 960 |
          enum:
            - square_1_1
            - classic_4_3
            - traditional_3_4
            - widescreen_16_9
            - social_story_9_16
            - standard_3_2
            - portrait_2_3
            - horizontal_2_1
            - vertical_1_2
            - social_post_4_5
          example: square_1_1
          type: string
        resolution:
          default: 1k
          description: >
            Resolution multiplier for the generated image.


            - `1k`: Uses base dimensions (default)

            - `2k`: Doubles the base dimensions (capped at 2048px per side)


            Final dimensions are calculated by multiplying base dimensions by
            the resolution factor,

            then scaling proportionally if either dimension exceeds 2048px, and
            aligning to multiples of 16.
          enum:
            - 1k
            - 2k
          example: 1k
          type: string
        seed:
          description: >
            Random seed for reproducible results.


            **Use case:** Generate variations of the same image by using the
            same seed with modified prompts.


            **Valid range:** 0 to 4,294,967,295

            **Default:** Random seed (if not provided)
          example: 42
          maximum: 4294967295
          minimum: 0
          nullable: true
          type: integer
        input_image:
          description: >
            Base64-encoded reference image for **style/subject transfer**.


            **Supported formats:** JPEG, PNG

            **Use cases:**

            - Style transfer from reference images

            - Subject preservation

            - Composition guidance


            **Note:** Supports up to 4 reference images using `input_image`,
            `input_image_2`, `input_image_3`, and `input_image_4`.
          nullable: true
          type: string
        input_image_2:
          description: Second base64-encoded reference image for multi-image generation.
          nullable: true
          type: string
        input_image_3:
          description: Third base64-encoded reference image for multi-image generation.
          nullable: true
          type: string
        input_image_4:
          description: Fourth base64-encoded reference image for multi-image generation.
          nullable: true
          type: string
        safety_tolerance:
          default: 2
          description: >
            Content moderation tolerance level.


            **Range:** 0 to 5

            - **0:** Most strict filtering

            - **5:** Least strict filtering

            **Default:** 2


            **Note:** Lower values filter more content. Choose based on your
            application requirements.
          maximum: 5
          minimum: 0
          type: integer
        output_format:
          description: |
            Output image format.

            **PNG:** Lossless, supports transparency, larger file
            **JPEG:** Lossy, smaller file, no transparency
          enum:
            - jpeg
            - png
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

Built with [Mintlify](https://mintlify.com).