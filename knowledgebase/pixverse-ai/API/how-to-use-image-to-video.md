# How to use Image-to-video

The Image-to-Video API transforms static images into dynamic videos with motion and effects. This guide walks you through the process of generating videos from your images.
<Columns>
  <Column>
  <Video src="https://media.pixverse.ai/asset/template/图生 海外.mp4"></Video>
  </Column>
</Columns>

## Overview

The Image-to-Video endpoint allows you to animate static images by applying various motion effects, transformations, and optional style transfers. You can upload your own images or provide image URLs.

**Endpoint:** `POST https://app-api.pixverse.ai/openapi/v2/video/img/generate`
**API reference** 
- Image upload task : https://docs.platform.pixverse.ai/upload-image-13016631e0
- generation task : https://docs.platform.pixverse.ai/image-to-video-generation-13016633e0

## Prerequisites

Before you begin, make sure you have:
- A valid PixVerse API key
- **A different Ai-trace-id** for each unique request
- An active subscription plan with available credits or purchased credits
- A image in supported formats (JPG, PNG, Webp)
- maximum dimensions 10000 pixels
- Supported formats: "png", "webp", "jpeg", "jpg" 
- Supported mime-type : "image/jpeg","image/jpg","image/png","image/webp"


## Quick-start
<AccordionGroup>
  <Accordion title="1: Upload your image">
When uploading images, you must use form-data format with the image file path.
Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/image/upload' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
--form 'image=@""'
```
Responses
```  
{
    "ErrCode": 0,
    "ErrMsg": "string",
    "Resp": {
        "img_id": 0,
        "img_url": "string"
    }
}
```

  </Accordion>
  <Accordion title="2:  Image-to-video generation task">
Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/img/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
--header 'Content-Type: application/json' \
--data-raw '{
    "duration": 5,
    "img_id": 0,
    "model": "v4.5",
    "motion_mode": "normal",
    "negative_prompt": "string",
    "prompt": "string",
    "quality": "540p",
    "seed": 0,
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

### 1. Prepare Your Image
For best results, ensure your image:
- Has good resolution (at least 1024×1024 pixels recommended)
- Has clear subjects with some space around them
- Is free from heavy text overlays or watermarks
- Has good lighting and contrast

### 2. Prepare Your upload image API Request and uplaod image to get img_id
Construct your API request with the appropriate parameters:
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/image/upload' \
--header 'API-KEY:your-api-key' \
--header 'Ai-trace-id:different-ai-trace-id-for-each-unique-request' \
--form 'image=@""'
```
Responses
```  
{
    "ErrCode": 0,
    "ErrMsg": "string",
    "Resp": {
        "img_id": 0,
        "img_url": "string"
    }
}
```

:::warning[]
Important note: When uploading images, you must use form-data format with the image file path. URL-based image uploads are currently not supported.
:::

### 3. Prepare your image-to-video API request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/img/generate' \
--header 'API-KEY:your-api-key' \
--header 'Ai-trace-id:different-ai-trace-id-for-each-unique-request' \
--header 'Content-Type: application/json' \
--data-raw '{
    "duration": 5,
    "img_id": 0,
    "model": "v4.5",
    "motion_mode": "normal",
    "negative_prompt": "string",
    "prompt": "string",
    "quality": "540p",
    "seed": 0,
}'
```
:::warning[]
If you want to use effect please go to : https://docs.platform.pixverse.ai/how-to-use-effects-796054m0
:::



### 4. Parameter details

| Parameter Name | Required | Type | Description |
|:--------:|:----------:|:----------:|:------:|
| model | Required | string | v3.5 |
| prompt | Required | string | =< 2048 characters |
| negative_prompt | Optional | string | =< 2048 characters |
| img_id | Requried | integer | Image ID after uploading image interface. <br>Required for image-to-video generation |
| template_id | Optional | integer | Must activate effects in effects management before use. <br>Some effects don't support certain resolutions, please check effects management |
| camera_movement | Optional | string | Add your camera_movement on your videos(supports v4/v4.5 model)<br>supports value: "horizontal_left","horizontal_right","vertical_up","vertical_down",<br>"zoom_in","zoom_out","crane_up",<br>"quickly_zoom_in","quickly_zoom_out","smooth_zoom_in",<br>"camera_rotation","robo_arm","super_dolly_out","whip_pan","hitchcock",<br>"left_follow","right_follow","pan_left","pan_right","fix_bg" 
| style | Optional | string | "anime"<br>"3d_animation"<br>"day"<br>"cyberpunk"<br>"comic" <br> Do not include style parameter unless needed |
| motion_mode | Optional | string | Default - "normal"<br>"fast"(only allows 5-second duration)<br>1080p doesn't support "fast". If not provided, defaults to normal |
| duration | Required | integer | 5,8<br>1080p doesn't support 8 |
| quality | Required | string | "360p"(Turbo model), "540p", "720p", "1080p" |
| seed | Optional | integer | Random seed, int32 random number between 0 - 2147483647 |


### 5. Handle the API Response
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


### 6. Check Generation Status
- After creating the task, you will receive a video_id
- Query periodically Get Video Generation Status API using this video_id

```bash
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
   "status": 5, // 1: Generation successful, 5: In progress, 7: Moderation failed, 8: Generation failed.
   "style": "string",
   "url": "string" // The url is accessible when status is 1.
 }
}
```

### 7. Download the Generated Video
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
   "status": 1, // 1: Generation successful, 5: In progress, 7: Moderation failed, 8: Generation failed.
   "style": "string",
   "url": "string" // The url is accessible when status is 1.
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