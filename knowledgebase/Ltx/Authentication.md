***

title: Authentication
subtitle: Secure your API requests with API keys
slug: authentication
description: >-
Understand how to securely authenticate with the LTX API. Follow step-by-step
instructions for generating and managing API keys safely.
seo:
title: Authentication | LTX Model
description: >-
Understand how to securely authenticate with the LTX API. Follow
step-by-step instructions for generating and managing API keys safely.
canonical: '[https://docs.ltx.video/authentication](https://docs.ltx.video/authentication)'
noindex: false
'og:title': Authentication
'og:description': >-
Understand how to securely authenticate with the LTX API. Follow
step-by-step instructions for generating and managing API keys safely.
'twitter:title': Authentication
'twitter:description': >-
Understand how to securely authenticate with the LTX API. Follow
step-by-step instructions for generating and managing API keys safely.
'twitter:site': '@ltx\_model'
-----------------------------

All LTX API requests require authentication using API keys. API keys are associated with your account and provide access to the API endpoints.

## Getting Your API Key

Sign in to the Developer Console to create your API key.

<Button href="https://console.ltx.video" intent="primary" icon="fa-solid fa-key">
  Create API Key
</Button>

## Using Your API Key

Include your API key in the `Authorization` header of every request using the Bearer token format:

```bash
Authorization: Bearer YOUR_API_KEY
```

## Example Request

<CodeBlock title="cURL">
  ```bash
  curl -X POST https://api.ltx.video/v1/text-to-video \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "prompt": "A majestic eagle soaring through clouds",
      "model": "ltx-2-3-pro",
      "duration": 8,
      "resolution": "1920x1080"
    }'
  ```
</CodeBlock>

<CodeBlock title="Python">
  ```python
  import requests

  headers = {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
  }

  response = requests.post(
      "https://api.ltx.video/v1/text-to-video",
      headers=headers,
      json={
          "prompt": "A majestic eagle soaring through clouds",
          "model": "ltx-2-3-pro",
          "duration": 8,
          "resolution": "1920x1080"
      }
  )
  ```
</CodeBlock>

## Security Best Practices

<Callout intent="warning">
  **Keep your API key secure:**

  * Never commit API keys to version control
  * Don't expose keys in client-side code
  * Use environment variables to store keys
  * Rotate keys periodically
</Callout>

### Environment Variables

Store your API key in environment variables:

**Bash:**

```bash
export LTXV_API_KEY="your_api_key_here"
```

**Python:**

```python
import os

api_key = os.environ.get("LTXV_API_KEY")
```

**Node.js:**

```javascript
const apiKey = process.env.LTXV_API_KEY;
```

## Authentication Errors

If authentication fails, you'll receive a `401 Unauthorized` response:

```json
{
  "type": "error",
  "error": {
    "type": "authentication_error",
    "message": "Invalid API key"
  }
}
```

Common authentication issues:

| Error                        | Cause                       | Solution                         |
| ---------------------------- | --------------------------- | -------------------------------- |
| Missing authorization header | No `Authorization` header   | Add the header to your request   |
| Invalid API key              | Key is incorrect or expired | Verify your API key              |
| Malformed header             | Incorrect format            | Use `Bearer YOUR_API_KEY` format |

## Rate Limits

API keys are subject to rate limits based on your plan. If you exceed your rate limit, you'll receive a `429 Too Many Requests` response.

Contact our team to discuss rate limit increases for your use case.
