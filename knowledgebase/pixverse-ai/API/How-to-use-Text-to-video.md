# How to use Text-to-video

The Text-to-Video API transforms textual descriptions into dynamic video content. This guide will walk you through the process of generating videos from text prompts.

<Columns>
  <Column>
  <Video src="https://media.pixverse.ai/asset/template/文生 海外.mp4"></Video>
  </Column>
</Columns>


## Overview

The Text-to-Video endpoint allows you to create videos by providing a text description (prompt) and various customization parameters. Our AI model interprets your text prompt and generates a video that matches your description.

**Endpoint:** `POST https://app-api.pixverse.ai/openapi/v2/video/text/generate`
**API Reference** : https://docs.platform.pixverse.ai/text-to-video-generation-13016634e0

## Prerequisites

Before you begin, make sure you have:
- A valid PixVerse API key
- **A different Ai-trace-id** for each unique request
- An active subscription plan with available credits or purchased credits
- A clear text description of the video you want to generate

## Quick-start
<AccordionGroup>
  <Accordion title="1: Text-to-video generation task">
  Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/text/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
--header 'Content-Type: application/json' \
--data-raw '{
    "aspect_ratio": "16:9",
    "duration": 5,
    "model": "v4.5",
    "motion_mode": "normal",
    "negative_prompt": "string",
    "prompt": "string",
    "quality": "540p",
    "seed": 0,
    "water_mark": false
}'
```
Responses
```  
{
  "ErrCode": 0,
  "ErrMsg": "string",
  "Resp": {
    "video_id": 0
  }
}
```

  </Accordion>
  <Accordion title="2: Check generation status & download">
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

### 1. Craft Your Text Prompt

The quality of your prompt significantly impacts the generated video. Here are some tips:

- Be specific and descriptive
- Include details about scene, movement, lighting, and atmosphere
- Keep prompts between 25-200 words for optimal results

#### Examples of Effective Prompts:

✅ **Good prompt**: "A serene mountain lake at sunrise, with mist rising from the water. The camera slowly pans across the lake, capturing the golden sunlight reflecting on the surface. Birds fly overhead as the morning unfolds."

❌ **Less effective prompt**: "Mountain lake sunrise"

### 2. Prepare Your API Request

Construct your API request with the appropriate parameters:

```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/text/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
--header 'Content-Type: application/json' \
--data-raw '{
    "aspect_ratio": "16:9", // required
    "duration": 5,  // required
    "model": "v4.5",  // required
    "motion_mode": "normal", 
    "negative_prompt": "string",
    "prompt": "string",  // required
    "quality": "540p",  // required
    "seed": 0
}'
```









### 3. Parameter Details

| Parameter Name | Required | Type | Description |
|:--------:|:----------:|:----------:|:------:|
| model | Required | string | v3.5 / v4 / v4.5 or above |
| prompt | Required | string |  =< 2048 characters |
| negative_prompt | Optional | string | =< 2048 characters |
| aspect_ratio | Required | string | "16:9","9:16","1:1","3:4","4:3" |
| template_id | Optional | integer | Must activate effects in effects management before use. <br>Some effects don't support certain resolutions, please check effects management |
| camera_movement | Optional | string | Add your camera_movement on your videos(supports v4/v4.5 model)<br>supports value: "horizontal_left","horizontal_right","vertical_up","vertical_down",<br>"zoom_in","zoom_out","auto_camera","crane_up",<br>"quickly_zoom_in","quickly_zoom_out","smooth_zoom_in",<br>"camera_rotation","robo_arm","super_dolly_out","whip_pan","hitchcock",<br>"left_follow","right_follow","pan_left","pan_right","fix_bg" |
| style | Optional | string | "anime"<br>"3d_animation"<br>"day"<br>"cyberpunk"<br>"comic" <br> Do not include style parameter unless needed |
| motion_mode | Optional | string | Default - "normal"<br>"fast"(only allows 5-second duration)<br>1080p doesn't support "fast". If not provided, defaults to normal |
| duration | Required | integer | 5,8<br>1080p doesn't support 8 |
| quality | Required | string | "360p"(Turbo model), "540p", "720p", "1080p" |
| seed | Optional | integer | Random seed, int32 random number between 0 - 2147483647 |


### 4. Handle the API Response
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


### 5. Check Generation Status
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

### 6. Download the Generated Video
- You can access a generated video with "url"
- "url" is only valid when status=1
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
- 500044 :	Reached the limit for concurrent generations.



