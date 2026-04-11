# How to use Webhook

# What is a Webhook?

A Webhook is used to notify your system when the status of a video generation task changes.  
When the task status changes, the PixVerse AI API platform will automatically send the result back to your server.

---

## Supported Features

Below is the list of features currently supported by Webhooks. More PixVerse AI API features will be supported in the future.

| Feature (Endpoint) | Supported |
|------------|------|
| `text-to-video video/text/generate` | ✅ |
| `image-to-video video/image/generate` | ✅ |


## How to Use

<AccordionGroup>
  <Accordion title="Step 1: Create a webhook_id" defaultOpen>

Create a `webhook_id` by visiting the [Webhook Management Page](https://platform.pixverse.ai/webhook).


![image.png](https://api.apidog.com/api/v1/projects/772214/resources/369579/image-preview)

  </Accordion>

  <Accordion title="Step 2: Add webhook_id to the generation request">


![image.png](https://api.apidog.com/api/v1/projects/772214/resources/369583/image-preview)
Add the created `webhook_id` to the generation API request.  
The example below shows a text-to-video request.

```json
{
  "aspect_ratio": "16:9",
  "duration":5,
  "model": "v5.5",
  "prompt": "string",
  "quality": "720p",
  "webhook_id":"1234"
}
```

  </Accordion>

  <Accordion title="Step 3: Verify the webhook request and return ok">

You will receive the following request payload. Please validate the request headers and body.

**Request Headers**

| Header Name | Type | Description |
|------------|------|------|
| `Webhook-Timestamp` | string | Unix timestamp (seconds) |
| `Webhook-Nonce` | string | 32-character random string (letters and numbers) |
| `Webhook-Signature` | string | Request signature (Base64-encoded HMAC-SHA256) |
| `Ai-Trace-Id` | string | Request trace ID for debugging |
| `Content-Type` | string | Fixed value `application/json` |

**Request Body**

```json
{
  "id": "123456789",
  "status": 1,
  "url": "https://example.com/video.mp4",
  "has_audio": true
}
```

**Note:**  
After receiving the webhook request, you must return `ok`; otherwise, the webhook will be resent.  
Please refer to the signature guide below for details.

  </Accordion>
</AccordionGroup>

---

## Webhook Signature Guide

### Overview

To ensure the security and integrity of Webhook requests, all Webhook deliveries include signature information.  
Clients should verify each request signature to prevent request forgery and data tampering.

---

## Request Format

### HTTP Method

```
POST
```

### Content-Type

```
application/json
```

### Request Headers

| Header Name | Type | Description |
|------------|------|------|
| `Webhook-Timestamp` | string | Unix timestamp (seconds) |
| `Webhook-Nonce` | string | 32-character random string |
| `Webhook-Signature` | string | Request signature (Base64-encoded HMAC-SHA256) |
| `Ai-Trace-Id` | string | Request trace ID |
| `Content-Type` | string | Fixed value `application/json` |

### Request Body

Business data in JSON format. Example:

```json
{
  "id": "123456789",
  "status": 1,
  "url": "https://example.com/video.mp4",
  "size": 10.5,
  "has_audio": true,
  "credits": 100
}
```

---

## Signature Verification Algorithm

### Step 1: Build the string to sign

The string to sign consists of three parts, joined by newline characters (`\n`):

```
{timestamp}\n{nonce}\n{url_encoded_payload}
```

**Description:**

- `timestamp`: obtained from the `Webhook-Timestamp` header  
- `nonce`: obtained from the `Webhook-Nonce` header  
- `url_encoded_payload`: JSON body encoded as a URL query string  

### Step 2: URL-encode the payload

Convert each field in the JSON body into `key=value` format and join them with `&`.

### Step 3: Generate the signature

Use **HMAC-SHA256** with your `Secret Key`, then encode the result using **Base64**.

```
signature = Base64(HMAC-SHA256(secret_key, sign_string))
```

### Step 4: Compare signatures

Compare the calculated signature with `Webhook-Signature` from the request headers.

---
## Code Examples

### Python

```python
import hmac
import hashlib
import base64
from urllib.parse import urlencode

def verify_webhook_signature(
    secret_key: str,
    timestamp: str,
    nonce: str,
    payload: dict,
    signature: str
) -> bool:
    """
    Verify Webhook signature
    
    :param secret_key: Configured Secret Key
    :param timestamp: Webhook-Timestamp header
    :param nonce: Webhook-Nonce header
    :param payload: Parsed JSON body as a dictionary
    :param signature: Webhook-Signature header
    :return: Whether the signature is valid
    """
    # Build URL-encoded payload
    url_encoded_payload = urlencode(
        {k: str(v).lower() if isinstance(v, bool) else str(v) for k, v in payload.items()},
        safe=''
    )
    
    # Build the string to sign
    sign_string = f"{timestamp}\n{nonce}\n{url_encoded_payload}"
    
    # Generate HMAC-SHA256 signature
    expected_signature = base64.b64encode(
        hmac.new(
            secret_key.encode('utf-8'),
            sign_string.encode('utf-8'),
            hashlib.sha256
        ).digest()
    ).decode('utf-8')
    
    # Secure comparison
    return hmac.compare_digest(expected_signature, signature)


# Example usage - Flask
from flask import Flask, request, jsonify

app = Flask(__name__)
SECRET_KEY = "your_secret_key_here"

@app.route('/webhook', methods=['POST'])
def webhook_handler():
    # Get request headers
    timestamp = request.headers.get('Webhook-Timestamp')
    nonce = request.headers.get('Webhook-Nonce')
    signature = request.headers.get('Webhook-Signature')
    
    # Get request body
    payload = request.get_json()
    
    # Verify signature
    if not verify_webhook_signature(SECRET_KEY, timestamp, nonce, payload, signature):
        return "invalid signature", 401
    
    # Handle business logic
    print(f"Received webhook: {payload}")
    
    # Must return "ok"
    return "ok", 200
```

### Go

```go
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

func verifyWebhookSignature(secretKey, timestamp, nonce string, payload map[string]interface{}, signature string) bool {
	// Build URL-encoded payload
	values := url.Values{}
	for k, v := range payload {
		values.Set(k, fmt.Sprintf("%v", v))
	}
	urlEncodedPayload := values.Encode()

	// Build the string to sign
	signString := fmt.Sprintf("%s\n%s\n%s", timestamp, nonce, urlEncodedPayload)

	// Generate HMAC-SHA256 signature
	h := hmac.New(sha256.New, []byte(secretKey))
	h.Write([]byte(signString))
	expectedSignature := base64.StdEncoding.EncodeToString(h.Sum(nil))

	// Secure comparison
	return hmac.Equal([]byte(expectedSignature), []byte(signature))
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
	secretKey := "your_secret_key_here"

	// Get request headers
	timestamp := r.Header.Get("Webhook-Timestamp")
	nonce := r.Header.Get("Webhook-Nonce")
	signature := r.Header.Get("Webhook-Signature")

	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	// Parse JSON
	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	// Verify signature
	if !verifyWebhookSignature(secretKey, timestamp, nonce, payload, signature) {
		http.Error(w, "invalid signature", http.StatusUnauthorized)
		return
	}

	// Handle business logic
	fmt.Printf("Received webhook: %v\n", payload)

	// Must return "ok"
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}

func main() {
	http.HandleFunc("/webhook", webhookHandler)
	http.ListenAndServe(":8080", nil)
}
```

### Node.js

```javascript
const crypto = require('crypto');
const express = require('express');

function verifyWebhookSignature(secretKey, timestamp, nonce, payload, signature) {
    // Build URL-encoded payload
    const urlEncodedPayload = new URLSearchParams(
        Object.entries(payload).map(([k, v]) => [k, String(v)])
    ).toString();
    
    // Build the string to sign
    const signString = `${timestamp}\n${nonce}\n${urlEncodedPayload}`;
    
    // Generate HMAC-SHA256 signature
    const expectedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(signString)
        .digest('base64');
    
    // Secure comparison
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    );
}

const app = express();
app.use(express.json());

const SECRET_KEY = 'your_secret_key_here';

app.post('/webhook', (req, res) => {
    // Get request headers
    const timestamp = req.headers['webhook-timestamp'];
    const nonce = req.headers['webhook-nonce'];
    const signature = req.headers['webhook-signature'];
    
    // Get request body
    const payload = req.body;
    
    // Verify signature
    try {
        if (!verifyWebhookSignature(SECRET_KEY, timestamp, nonce, payload, signature)) {
            return res.status(401).send('invalid signature');
        }
    } catch (e) {
        return res.status(401).send('invalid signature');
    }
    
    // Handle business logic
    console.log('Received webhook:', payload);
    
    // Must return "ok"
    res.status(200).send('ok');
});

app.listen(8080, () => {
    console.log('Server listening on port 8080');
});
```

### Java

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Map;
import java.util.TreeMap;

public class WebhookVerifier {
    
    public static boolean verifyWebhookSignature(
            String secretKey,
            String timestamp,
            String nonce,
            Map<String, Object> payload,
            String signature
    ) {
        try {
            // Build URL-encoded payload (use TreeMap to ensure consistent ordering)
            TreeMap<String, Object> sortedPayload = new TreeMap<>(payload);
            StringBuilder urlEncodedPayload = new StringBuilder();
            for (Map.Entry<String, Object> entry : sortedPayload.entrySet()) {
                if (urlEncodedPayload.length() > 0) {
                    urlEncodedPayload.append("&");
                }
                urlEncodedPayload.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
                urlEncodedPayload.append("=");
                urlEncodedPayload.append(URLEncoder.encode(String.valueOf(entry.getValue()), StandardCharsets.UTF_8));
            }
            
            // Build the string to sign
            String signString = timestamp + "\n" + nonce + "\n" + urlEncodedPayload;
            
            // Generate HMAC-SHA256 signature
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                secretKey.getBytes(StandardCharsets.UTF_8), 
                "HmacSHA256"
            );
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(signString.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = Base64.getEncoder().encodeToString(hmacBytes);
            
            // Secure comparison
            return MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            return false;
        }
    }
}
```



## Response Requirements

### Successful Response

When the webhook is successfully received, you **must** return:

| Item | Requirement |
|------|------|
| HTTP Status Code | `200` |
| Response Body | `ok` (lowercase, no extra characters) |

**Example**
```
HTTP/1.1 200 OK
Content-Type: text/plain

ok
```

### Failed Response

If the status code is not `200` or the body is not `ok`, the system will retry the webhook.

---

## Retry Mechanism

If delivery fails, retries will be attempted with the following intervals:

| Attempt | Interval |
|------|------|
| 1 | 2 seconds |
| 2 | 10 seconds |
| 3 | 30 seconds |
| 4 | 1 minute |
| 5 | 5 minutes |
| 6 | 15 minutes |
| 7 | 1 hour |
| 8 | 4 hours |

---

## Security Recommendations

1. Always verify the signature before processing logic.  
2. Validate timestamps to prevent replay attacks.  
3. Use HTTPS for webhook endpoints.  
4. Store the Secret Key securely.  
5. Use time-safe comparison functions.  
6. Ensure idempotency by deduplicating events using `id`.

---

## FAQ

### Q: What should I do if signature verification fails?

1. Verify the Secret Key  
2. Check URL encoding consistency  
3. Confirm the string-to-sign format  
4. Verify boolean value formatting (`true` / `false`)

---

If you have any other questions, please contact technical support.
