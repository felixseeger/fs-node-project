***

title: Rate Limits
subtitle: API usage limits and restrictions
slug: rate-limits
description: >-
Review LTX API rate limits and request quotas. Learn how to optimize your
usage and avoid throttling with efficient request management.
seo:
title: Rate Limits | LTX Model
description: >-
Review LTX API rate limits and request quotas. Learn how to optimize your
usage and avoid throttling with efficient request management.
canonical: '[https://docs.ltx.video/rate-limits](https://docs.ltx.video/rate-limits)'
'og:title': Rate Limits
'og:description': >-
Review LTX API rate limits and request quotas. Learn how to optimize your
usage and avoid throttling with efficient request management.
'twitter:title': Rate Limits
'twitter:description': >-
Review LTX API rate limits and request quotas. Learn how to optimize your
usage and avoid throttling with efficient request management.
-------------------------------------------------------------

## Limit types

* **Concurrency limits**: Maximum number of simultaneous video generation requests.

* **Rate limits**: Maximum number of requests within a time window.

## Error response

When a limit is exceeded, the API returns `429 Too Many Requests` with a `Retry-After` header indicating seconds to wait.

**Error types:**

* `concurrency_limit_error`: Too many concurrent requests
* `rate_limit_error`: Too many requests in time window

**Example:**

```json
{
  "type": "error",
  "error": {
    "type": "rate_limit_error",
    "message": "Too many requests. Please try again later."
  }
}
```
