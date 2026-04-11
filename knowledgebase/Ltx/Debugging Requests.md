***

title: Debugging Requests
subtitle: Response headers for troubleshooting
slug: debugging
description: >-
Find out how to debug and troubleshoot API requests in LTX. Includes tips for
logging, inspecting responses, and identifying common issues.
seo:
title: Debugging Requests | LTX Model
description: >-
Find out how to debug and troubleshoot API requests in LTX. Includes tips
for logging, inspecting responses, and identifying common issues.
canonical: '[https://docs.ltx.video/debugging](https://docs.ltx.video/debugging)'
'og:title': Debugging Requests
'og:description': >-
Find out how to debug and troubleshoot API requests in LTX. Includes tips
for logging, inspecting responses, and identifying common issues.
'twitter:title': Debugging Requests
'twitter:description': >-
Find out how to debug and troubleshoot API requests in LTX. Includes tips
for logging, inspecting responses, and identifying common issues.
-----------------------------------------------------------------

## Response headers

**`x-request-id`**

Unique identifier for each API request. Include this when contacting support.

```
x-request-id: 1234567890abcdef1234567890abcdef
```

We recommend to Log request IDs in production deployments for efficient troubleshooting with support.
