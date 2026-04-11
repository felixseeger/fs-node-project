# Upload file

POST https://api.ltx.video/v1/upload

Generate a signed URL for uploading media files to use as input for video generation.

Returns a pre-signed URL that can be used to upload files directly to cloud storage.
Use the returned `storage_uri` in subsequent video generation requests (e.g., `image_uri` or `video_uri` parameters).
The URL expires after 1 hour.


Reference: https://docs.ltx.video/api-documentation/api-reference/upload/create-upload

## OpenAPI Specification

```yaml
openapi: 3.1.0
info:
  title: ''
  version: 1.0.0
paths:
  /v1/upload:
    post:
      operationId: create-upload
      summary: Upload file
      description: >
        Generate a signed URL for uploading media files to use as input for
        video generation.


        Returns a pre-signed URL that can be used to upload files directly to
        cloud storage.

        Use the returned `storage_uri` in subsequent video generation requests
        (e.g., `image_uri` or `video_uri` parameters).

        The URL expires after 1 hour.
      tags:
        - subpackage_upload
      parameters:
        - name: Authorization
          in: header
          description: API key authentication
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Upload URL generated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UploadResponse'
        '401':
          description: Authentication failed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: An unexpected error occurred
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '503':
          description: Service temporarily unavailable
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
servers:
  - url: https://api.ltx.video
components:
  schemas:
    UploadResponse:
      type: object
      properties:
        upload_url:
          type: string
          description: >
            Pre-signed URL for uploading the file. Use PUT request to upload
            your file to this URL.

            The URL includes all necessary authentication and expires after 1
            hour.
        storage_uri:
          type: string
          description: >
            Storage URI that can be used to reference the uploaded file in
            subsequent API requests.

            Use this value in image_uri or video_uri parameters.

            The uploaded file will be available for 24 hours.
        expires_at:
          type: string
          format: date-time
          description: >
            ISO 8601 timestamp indicating when the signed URL expires (1 hour
            from creation).
        required_headers:
          type: object
          additionalProperties:
            type: string
          description: >
            Headers that must be included in the upload request to cloud
            storage.

            These headers enforce upload constraints like file size limits.
      required:
        - upload_url
        - storage_uri
        - expires_at
        - required_headers
      title: UploadResponse
    ErrorType:
      type: string
      enum:
        - error
      description: Response type indicator
      title: ErrorType
    ErrorError:
      type: object
      properties:
        type:
          type: string
          description: Error type for programmatic handling
        message:
          type: string
          description: Human-readable error description
      required:
        - type
        - message
      title: ErrorError
    Error:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/ErrorType'
          description: Response type indicator
        error:
          $ref: '#/components/schemas/ErrorError'
      required:
        - type
        - error
      title: Error
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      description: API key authentication

```

## SDK Code Examples

```python
import requests

url = "https://api.ltx.video/v1/upload"

headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.post(url, headers=headers)
upload_info = response.json()

# Use the signed URL to upload your file
upload_url = upload_info["upload_url"]
storage_uri = upload_info["storage_uri"]  # Use this in subsequent API requests
required_headers = upload_info["required_headers"]

with open("my-video.mp4", "rb") as f:
    requests.put(
        upload_url,
        data=f,
        headers={
            "Content-Type": "video/mp4",
            **required_headers
        }
    )

```

```typescript
const url = "https://api.ltx.video/v1/upload";

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
});

const uploadInfo = await response.json();

// Use the signed URL to upload your file
const uploadUrl = uploadInfo.upload_url;
const storageUri = uploadInfo.storage_uri; // Use this in subsequent API requests
const requiredHeaders = uploadInfo.required_headers;

const fileBuffer = await fs.promises.readFile("my-video.mp4");
await fetch(uploadUrl, {
  method: "PUT",
  body: fileBuffer,
  headers: {
    "Content-Type": "video/mp4",
    ...requiredHeaders
  }
});

```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.ltx.video/v1/upload"

	req, _ := http.NewRequest("POST", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.ltx.video/v1/upload")
  .header("Authorization", "Bearer <token>")
  .asString();
```