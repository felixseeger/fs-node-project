***

title: Error Handling
subtitle: API error responses and status codes
slug: errors
description: >-
Learn how LTX communicates errors and how to handle them gracefully. Includes
error codes, response examples, and best practices.
seo:
title: Error Handling | LTX Model
description: >-
Learn how LTX communicates errors and how to handle them gracefully.
Includes error codes, response examples, and best practices.
canonical: '[https://docs.ltx.video/errors](https://docs.ltx.video/errors)'
noindex: false
'og:site\_name': LTX
'og:title': Error Handling
'og:description': >-
Learn how LTX communicates errors and how to handle them gracefully.
Includes error codes, response examples, and best practices.
'twitter:card': summary\_large\_image
'twitter:title': Error Handling
'twitter:description': >-
Learn how LTX communicates errors and how to handle them gracefully.
Includes error codes, response examples, and best practices.
------------------------------------------------------------

## Error Response Format

All error responses use this structure:

```json
{
  "type": "error",
  "error": {
    "type": "error_type",
    "message": "Human-readable error message"
  }
}
```

## HTTP Status Codes

### 400 - Bad Request

**Error Type:** `invalid_request_error`

Invalid request parameters or validation errors.

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "prompt is required"
  }
}
```

### 401 - Unauthorized

**Error Type:** `authentication_error`

Missing or invalid API key.

```json
{
  "type": "error",
  "error": {
    "type": "authentication_error",
    "message": "Missing authorization header"
  }
}
```

### 402 - Payment Required

**Error Type:** `insufficient_funds_error`

Your account does not have enough credits to complete this request. This occurs when the estimated cost of the video generation exceeds your available balance.

```json
{
  "type": "error",
  "error": {
    "type": "insufficient_funds_error",
    "message": "Insufficient funds. Required: 120 credits"
  }
}
```

**Resolution:**

* Check your current balance in your account dashboard
* Add credits to your account before retrying the request
* Consider generating a shorter video or using a lower resolution to reduce cost

See [Pricing](/pricing) for details on video generation costs.

### 413 - Payload Too Large

**Error Type:** `request_too_large`

Request exceeds the maximum allowed number of bytes. This error is returned from the infrastructure layer before the request reaches the API. See [Input Formats](/input-formats) for size limits.

### 422 - Content Filtered

**Error Type:** `content_filtered_error`

Content rejected by safety filters.

```json
{
  "type": "error",
  "error": {
    "type": "content_filtered_error",
    "message": "Content is filtered due to policy restrictions"
  }
}
```

### 429 - Too Many Requests

**Error Types:** `rate_limit_error`, `concurrency_limit_error`

Rate limit or concurrency limit exceeded. See [Rate Limits](/rate-limits) for details.

### 500 - Internal Server Error

**Error Type:** `api_error`

Unexpected server error.

```json
{
  "type": "error",
  "error": {
    "type": "api_error",
    "message": "Internal server error"
  }
}
```

### 503 - Service Unavailable

**Error Type:** `service_unavailable`

Service temporarily unavailable.

```json
{
  "type": "error",
  "error": {
    "type": "service_unavailable",
    "message": "Service temporarily unavailable"
  }
}
```
