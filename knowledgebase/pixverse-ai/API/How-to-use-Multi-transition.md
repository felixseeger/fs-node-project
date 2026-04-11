# How to use Multi-transition?

## Overview

The Multi-transition(Multi-frame) feature allows you to generate a 1–30 second video with consistent style and smooth transitions by providing 2–7 keyframes.It is designed for professional creators, offering more fine-grained control over the video to ensure characters and actions remain coherent and controllable throughout the sequence.

**Generation Endpoint:** ``
        
        
## Prerequisites
Before you begin, make sure you have:
- A valid PixVerse API key
- A unique Ai-trace-id for each API request
- An active subscription with available or purchased API credits
- The img_id(s) of the reference images you want to use in Fusion
    
    
## Quick Start

<AccordionGroup>
  <Accordion title="1: Prepare Your Images">
### Upload images with API:

```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/image/upload' \
--header 'API-KEY:your-api-key' \
--header 'Ai-trace-id: your-Ai-trace-id' \
--form 'image=@""'
```

Responses
```
{
    "ErrCode": 0,
    "ErrMsg": "success",
    "Resp": {
        "img_id": 0,
        "url": "https://media.pixverse.ai/111111.jpg"
    }
}
```
  </Accordion>
  
    <Accordion title="2. Multi-transition API Request">
Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/multi_transition/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: your-ai-trace-id' \
--header 'Content-Type: application/json' \
--data-raw '{
   "multi_transition": [
{"img_id":0, "duration":3, "prompt":""},
{"img_id":0, "duration":3, "prompt":""},
{"img_id":0, "duration":3, "prompt":""},
{"img_id":0, "duration":3, "prompt":""},
{"img_id":0, "duration":0, "prompt":""}
  ],
  "model": "v5",
  "quality": "360p"
}'
```
Responses
```
{
  "ErrCode": 0,
  "ErrMsg": "string",
  "Resp": {
    "video_id": 0,
    "credit":10
  }
}
```
  </Accordion>
    <Accordion title="3. Check generation status & download">
Request
```
curl --location --request GET 'https://app-api.pixverse.ai/openapi/v2/video/result/{video_id}' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request'
```
Responses
```
  {
 "ErrCode": 0,
 "ErrMsg": "string",
 "Resp": {
   "create_time": "string",
   "id": 0,
   "modify_time": "string",
   "negative_prompt": "string",
   "outputHeight": 0,
   "outputWidth": 0,
   "prompt": "string",
   "resolution_ratio": 0,
   "seed": 0,
   "size": 0,
   "status": 1, // 1: Generation successful, 5: In progress, 7: Moderation failed, 8: Generation failed.
   "style": "string",
   "url": "string" // The url is accessible when status is 1.
 }
}
```
  </Accordion>
</AccordionGroup>
              
## Step-by-Step Guide
You can input your video in two ways:
## Step 1. Prepare Your Image
- Use high-quality and clear images. Higher resolution is recommended for better results.
- For subject images, choose images where the main subject is clearly isolated and prominent.
- For background images, select images with a clean and well-defined background.



## Step 2. Prepare Your upload image API Request and uplaod image to get img_id
Construct your API request with the appropriate parameters:

```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/image/upload' \
--header 'API-KEY:your-api-key' \
--header 'Ai-trace-id: your-Ai-trace-id' \
--form 'image=@""'

```

### Step 3: Send Multi-transition API Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/multi_transition/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: your-ai-trace-id' \
--header 'Content-Type: application/json' \
--data-raw '{
   "multi_transition": [
{"img_id":0, "duration":3, "prompt":""},
{"img_id":0, "duration":3, "prompt":""},
{"img_id":0, "duration":3, "prompt":""},
{"img_id":0, "duration":3, "prompt":""},
{"img_id":0, "duration":0, "prompt":""}
  ],
  "model": "v5",
  "quality": "360p"
}'
```


🔧 Parameter Details
| Parameter Name | Required | Type | Description |
|:--------:|:--------:|:--------:|:------:|
| multi_transition | required | array | 1.multi_transition must be an array containing 2 to 7 items.<br>2.Each item in multi_transition should include: img_id (required, integer), duration (required, integer, not required for the last item), prompt (optional, string) |
| model | Required | string | v3.5,v4,v4.5,v5 |
| quality | Required| string | 360p,540p,720p,1080p |
| motion_mode | Optional | string | "normal","fast" On models v4.5 or earlier, fast_mode: fast only supports durations up to 5 seconds. |
| seed | Optional | integer | Random seed, int32 random number between 0 - 2147483647 |



### Step 3. Handle the API Response
The API returns a JSON response with a video_id:

```
{
  "ErrCode": 0,
  "ErrMsg": "success",
  "Resp": {
    "video_id": 0
  }
}
```


### Step 4 Check Generation Status
- After creating the task, you will receive a video_id
- Query periodically Get Video Generation Status API using this video_id
```
curl --location --request GET 'https://app-api.pixverse.ai/openapi/v2/video/result/{video_id}' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request'
```
- The status will change from 5 to 1 when processing is complete

```
  {
 "ErrCode": 0,
 "ErrMsg": "string",
 "Resp": {
   "create_time": "string",
   "id": 0,
   "modify_time": "string",
   "negative_prompt": "string",
   "outputHeight": 0,
   "outputWidth": 0,
   "prompt": "string",
   "resolution_ratio": 0,
   "seed": 0,
   "size": 0,
   "status": 5,
   "style": "string",
   "url": "string"
 }
}
```

### Step 5 Download the Generated Video
- You can access a generated video with "url"
```
  {
 "ErrCode": 0,
 "ErrMsg": "string",
 "Resp": {
   "create_time": "string",
   "id": 0,
   "modify_time": "string",
   "negative_prompt": "string",
   "outputHeight": 0,
   "outputWidth": 0,
   "prompt": "string",
   "resolution_ratio": 0,
   "seed": 0,
   "size": 0,
   "status": 1,
   "style": "string",
   "url": "string"
 }
}
```


## Troubleshooting
### Common issue
1. Your video is stuck in "Generating" status and hasn't completed after a long wait.
    - Please check if you're using the same AI-trace-ID for every request. This is the most common cause of this issue.
2. Status codes: 1: Generation successful; 5: Waiting for generation; 7: Content moderation failure; 8: Generation failed;
    - If you encounter status code 7, it means your generated video was filtered by our content moderation system. Please modify your parameters and try again. Any credits used for filtered videos will be automatically refunded to your account.


### Common error codes
- 400/500 status : Incorrect code
- 400013 :	Invalid binding request: incorrect parameter type or value
- 400017 :	Invalid parameter
    - multi_transition's duration in each item must be between 1–8.
    - multi_transition with 3 or more items, each duration must be between 1 and 5 seconds.
    - On models v4.5 or earlier, fast_mode: fast only supports durations up to 5 seconds.
    - multi_transition must be an array containing 2 to 7 items.
    - Each item in multi_transition should include: img_id (required, integer), duration (required, integer, not required for the last item), prompt (optional, string)
    - The last item’s duration must be 0 or can be optional.

- 500044 :	Reached the limit for concurrent generations.
        
