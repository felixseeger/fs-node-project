# How to use Swap?

## Overview

The SWAP feature is a powerful video editing capability. You can either upload or generate a video, then select a frame and choose the object you want to edit. After that, upload a target image, and the system will generate a brand-new video for you.

With this feature, you can create a wide variety of fun and creative videos — such as character replacement, dancing edits, film recreation, and visual remakes.

When using this feature, please use it together with the mask or selection API to specify the target area to be replaced.
Currently, external mask_url input is not yet supported.

**Generation Endpoint:** ``
        
        
## Prerequisites
Before you begin, make sure you have:
- A valid PixVerse API key
- A unique Ai-trace-id for each API request
- An active subscription with available or purchased API credits
 - A video_id generated from PixVerse
**or**
    - An uploaded video in supported formats (mp4, mov)
    - Max resolution: 1920
    - Max file size: 50MB
    - Max duration: 30 seconds
 - The img_id of the image you want to use in Swap
    
    
## Quick Start

<AccordionGroup>
  <Accordion title="1: Prepare Your Videos">
## 1. External Video (User-Provided)

To ensure optimal results, please provide:
- A .mp4 or .mov video file
- Max resolution: 1920p
- Max size: 50MB
- Max duration: 30s

Construct your API request with the appropriate parameters:

```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/media/upload' \
--header 'Ai-Trace-Id: 123123' \
--header 'API-KEY: 123123' \
--form 'file=@"/www/xxx/yyy/zzz.mp4"'

```

you will get "media_id" with "video" media_type

```
{
    "ErrCode": 0,
    "ErrMsg": "success",
    "Resp": {
        "media_id": 0,
        "media_type": "video",
        "url": "https://media.pixverse.ai/111111.mp4"
    }
}
```


## 2. Video from PixVerse API

If you previously generated a video using our API, you should already have a video_id.
To extend this video, pass the video_id into the source_video_id field of the generation request.
  </Accordion>
  
    <Accordion title="2. Mask generate API for accquiring mask_id ">
        
if a video is from pixverse API please use "source_video_id":111 instead of "video_media_id"
   
Request
```
curl --location 'https://app-api.pixverse.ai/openapi/v2/video/mask/selection' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: your-ai-trace-id' \
--header 'Content-Type: application/json' \
--data '{
    
    "video_media_id":111,
    "keyframe_id":1
}'
```
Responses
```
{
    "ErrCode": 0,
    "ErrMsg": "Success",
    "Resp": {
        "keyframe_id": 1,
        "keyframe_url": "https://media.pixverse.ai/xx.png",
        "credits": 2,
        "mask_info": [
            {
                "mask_id": "0",
                "mask_name": "person",
                "mask_url": "https://media.pixverse.ai/xx.png"
            },
            {
                "mask_id": "0",
                "mask_name": "object",
                "mask_url": "https://media.pixverse.ai/xx.png"
            },
            {
                "mask_id": "0",
                "mask_name": "background",
                "mask_url": "https://media.pixverse.ai/xx.png"
            }
        ]
    }
}
```
        
        
        
  </Accordion>
       <Accordion title="3. Swap generation API task ">

Request
```
curl --location 'https://app-api.pixverse.ai/openapi/v2/video/swap/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: your-ai-trace-id' \
--header 'Content-Type: application/json' \
--data '{
    "video_media_id":0, 
    "keyframe_id":1,
    "mask_id":"0",
    "img_id":0,
    "quality": "360p",
    "original_sound_switch":true
    
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
    <Accordion title="4. Check generation status & download">
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
### Step 1-1: Prepare Your Video from External video
1. External Video (User-Provided)

To ensure optimal results, please provide:
- A .mp4 or .mov video file
- Max resolution: 1920p
- Max size: 50MB
- Max duration: 30s

Construct your API request with the appropriate parameters:

```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/media/upload' \
--header 'Ai-Trace-Id: 123123' \
--header 'API-KEY: 123123' \
--form 'file=@"/www/xxx/yyy/zzz.mp4"'

```

you will get "media_id" with "video" media_type

```
{
    "ErrCode": 0,
    "ErrMsg": "success",
    "Resp": {
        "media_id": 0,
        "media_type": "video",
        "url": "https://media.pixverse.ai/111111.mp4"
    }
}
```


### Step 1-2: Prepare Your Video from PixVerse API

If you previously generated a video using our API, you should already have a video_id.
To extend this video, pass the video_id into the source_video_id field of the generation request.

### Step 1-3. Prepare Your Image
- Use high-quality and clear images. Higher resolution is recommended for better results.

```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/image/upload' \
--header 'API-KEY:your-api-key' \
--header 'Ai-trace-id: your-Ai-trace-id' \
--form 'image=@""'
```


### Step 2: Send mask selection API request
if a video is from pixverse API please use "source_video_id":111 instead of "video_media_id"
   
Request
```
curl --location 'https://app-api.pixverse.ai/openapi/v2/video/mask/selection' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: your-ai-trace-id' \
--header 'Content-Type: application/json' \
--data '{
    
    "video_media_id":111,
    "keyframe_id":1
}'
```
Responses
```
{
    "ErrCode": 0,
    "ErrMsg": "Success",
    "Resp": {
        "keyframe_id": 1,
        "keyframe_url": "https://media.pixverse.ai/xx.png",
        "credits": 2,
        "mask_info": [
            {
                "mask_id": "0",
                "mask_name": "person",
                "mask_url": "https://media.pixverse.ai/xx.png"
            },
            {
                "mask_id": "0",
                "mask_name": "object",
                "mask_url": "https://media.pixverse.ai/xx.png"
            },
            {
                "mask_id": "0",
                "mask_name": "background",
                "mask_url": "https://media.pixverse.ai/xx.png"
            }
        ]
    }
}
```


🔧 Parameter Details
| Parameter Name | Required | Type | Description |
|:--------:|:--------:|:--------:|:------:|
| source_video_id | choose either source_video_id or video_media_id, not both. | int | video from PixVerse API |
| video_media_id | choose either source_video_id or video_media_id, not both | int | uploaded external video |
| keyframe_id | optional | int | from 1 to The position of the last video frame. If not provided, the default value is 1.|


### Step 3: Send Swap API Request
* if a video is from pixverse API please use "source_video_id":111 instead of "video_media_id"
* When using `mask_id`, the associated `video_id` and `keyframe_id` must match the ones used during the mask selection generation.
   
Request
```
curl --location 'https://app-api.pixverse.ai/openapi/v2/video/swap/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: your-ai-trace-id' \
--header 'Content-Type: application/json' \
--data '{
    "video_media_id":0, 
    "keyframe_id":1,
    "mask_id":"0",
    "img_id":0,
    "quality": "360p",
    "original_sound_switch":true
    
```


🔧 Parameter Details
| Parameter Name | Required | Type | Description |
|:--------:|:--------:|:--------:|:------:|
| source_video_id | choose either source_video_id or video_media_id, not both. | int | video from PixVerse API |
| video_media_id | choose either source_video_id or video_media_id, not both | int | uploaded external video |
| keyframe_id | required | int | from 1 to The position of the last video frame. If not provided, the default value is 1.|
| mask_id | required | string | mask_id from Mask selection API|
| img_id | required | int | img_id from upload API|
| quality | required | string | "360p","540p","720p". "1080p" not supported|



### Step 4. Handle the API Response
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


### Step 5. Check Generation Status
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

- 500044 :	Reached the limit for concurrent generations.
        
