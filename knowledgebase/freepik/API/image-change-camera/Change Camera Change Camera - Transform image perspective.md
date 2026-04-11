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

# Change Camera - Transform image perspective

> Transform an image by changing the camera angle using AI. Adjust horizontal rotation (0-360 degrees), vertical tilt (-30 to 90 degrees), and zoom level (0-10) to generate a new image as if the camera had been repositioned around the subject.

This is an asynchronous endpoint. After submitting a request, use the task ID to poll for results or provide a `webhook_url` to receive a notification when processing completes.

**Camera controls:**
- **Horizontal angle** (`horizontal_angle`): Rotate the viewpoint 0-360 degrees around the subject. `0` = front view, `90` = right side, `180` = back view, `270` = left side.
- **Vertical angle** (`vertical_angle`): Tilt the camera from -30 (looking up) to 90 (bird's eye view). `0` = eye level.
- **Zoom** (`zoom`): Adjust from `0` (wide shot, full scene) to `10` (close-up).

**Use cases:** Product photography with multiple angle views, architectural visualization, creative image manipulation, and generating consistent multi-angle views of objects and scenes.




## OpenAPI

````yaml post /v1/ai/image-change-camera
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
  /v1/ai/image-change-camera:
    post:
      tags:
        - image-change-camera
      summary: Change Camera - Transform image perspective
      description: >
        Transform an image by changing the camera angle using AI. Adjust
        horizontal rotation (0-360 degrees), vertical tilt (-30 to 90 degrees),
        and zoom level (0-10) to generate a new image as if the camera had been
        repositioned around the subject.


        This is an asynchronous endpoint. After submitting a request, use the
        task ID to poll for results or provide a `webhook_url` to receive a
        notification when processing completes.


        **Camera controls:**

        - **Horizontal angle** (`horizontal_angle`): Rotate the viewpoint 0-360
        degrees around the subject. `0` = front view, `90` = right side, `180` =
        back view, `270` = left side.

        - **Vertical angle** (`vertical_angle`): Tilt the camera from -30
        (looking up) to 90 (bird's eye view). `0` = eye level.

        - **Zoom** (`zoom`): Adjust from `0` (wide shot, full scene) to `10`
        (close-up).


        **Use cases:** Product photography with multiple angle views,
        architectural visualization, creative image manipulation, and generating
        consistent multi-angle views of objects and scenes.
      operationId: create_change_camera_task
      requestBody:
        content:
          application/json:
            examples:
              required-params:
                $ref: '#/components/examples/request-change-camera-required-params'
              all-params:
                $ref: '#/components/examples/request-change-camera-all-params'
            schema:
              $ref: '#/components/schemas/change-camera-request'
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
  examples:
    request-change-camera-required-params:
      description: >-
        Minimal request with only the required image parameter. Uses default
        values for all other settings (horizontal_angle=0, vertical_angle=0,
        zoom=5, output_format=png).
      summary: Change Camera - Required parameters only
      value:
        image: https://example.com/product-photo.jpg
    request-change-camera-all-params:
      description: >-
        Full request with all available parameters including camera angle
        rotation, tilt, zoom, seed for reproducibility, output format, and
        webhook notification.
      summary: Change Camera - All parameters
      value:
        image: https://example.com/product-photo.jpg
        horizontal_angle: 45
        vertical_angle: 15
        zoom: 7
        seed: 42
        output_format: png
        webhook_url: https://www.example.com/webhook
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
  schemas:
    change-camera-request:
      properties:
        image:
          description: >
            Input image to transform. Provide as a publicly accessible HTTPS
            URL.

            Supported formats: JPG, PNG, WebP.
          example: https://example.com/input-image.jpg
          type: string
        horizontal_angle:
          default: 0
          description: >
            Horizontal rotation angle in degrees. Controls the left-right
            rotation of the camera around the subject.

            - `0`: Front view (no rotation)

            - `90`: Right side view

            - `180`: Back view

            - `270`: Left side view

            - `360`: Full rotation (equivalent to 0)


            Valid values: `0` to `360`. Default: `0`.
          example: 45
          maximum: 360
          minimum: 0
          type: integer
        vertical_angle:
          default: 0
          description: >
            Vertical tilt angle in degrees. Controls the up-down tilt of the
            camera relative to the subject.

            - `-30`: Looking up at the subject from below

            - `0`: Eye-level view (no tilt)

            - `45`: Moderate downward angle

            - `90`: Bird's eye view (directly above)


            Valid values: `-30` to `90`. Default: `0`.
          example: 15
          maximum: 90
          minimum: -30
          type: integer
        zoom:
          default: 5
          description: |
            Zoom level controlling how close the camera appears to the subject.
            - `0`: Wide shot (far away, full scene visible)
            - `5`: Medium shot (standard framing)
            - `10`: Close-up (very close to the subject)

            Valid values: `0` to `10`. Default: `5`.
          example: 5
          maximum: 10
          minimum: 0
          type: integer
        seed:
          description: >
            Seed for the random number generator. Using the same seed with
            identical parameters produces the same output, enabling reproducible
            results across multiple requests.
          example: 42
          minimum: 1
          type: integer
        output_format:
          $ref: '#/components/schemas/output-format'
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
    output-format:
      default: png
      description: |
        Output image format.
        - `png`: Lossless compression, best for high-quality results
        - `jpeg`: Lossy compression, smaller file size suitable for web use
      enum:
        - png
        - jpeg
      type: string
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
