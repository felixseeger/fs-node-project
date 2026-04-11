# How to use Extend?

## Overview

The Extend endpoint provides a powerful way to continue and enhance your video content. It analyzes the ending segment of a given video and extends the story forward using AI generation.
With parameters like prompt, style, and template, you can infinitely expand your video in creative and personalized ways.

**Endpoint:** `https://app-api.pixverse.ai/openapi/v2/video/extend/generate`
**API reference** : https://docs.platform.pixverse.ai/extend-generation-19094393e0
        
<Columns>
  <Column>
  <Video src="https://media.pixverse.ai/asset/template/续写_2.mp4"></Video>
  </Column>
</Columns>

## Prerequisites
Before you begin, make sure you have:
- A valid PixVerse API key
- A unique Ai-trace-id for each API request
- An active subscription with available or purchased API credits
- Either:
    - A video_id generated from PixVerse
**or**
    - An uploaded video in supported formats (mp4, mov)
    - Max resolution: 1920
    - Max file size: 50MB
    - Max duration: 30 seconds
    
## Quick Start

<AccordionGroup>
  <Accordion title="1: Prepare Your Video">
### Your Video from External video
Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/media/upload' \
--header 'Ai-Trace-Id: 123123' \
--header 'API-KEY: 123123' \
--form 'file=@"/www/xxx/yyy/zzz.mp4"'

```
Responses
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

**OR**

### Your Video from PixVerse API

If you previously generated a video using our API, you should already have a video_id.
To extend this video, pass the video_id into the source_video_id field of the generation request.


  </Accordion>
  
    <Accordion title="2. Extend API Request">
Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/extend/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request'\
--header 'Content-Type: application/json' \
--data-raw '{
  "source_video_id": 0,
  "video_media_id" :0, 
  "prompt": "across the universe",
  "seed": 123123,
  "quality": "540p",
  "duration": 5,
  "model": "v4.5",
  "motion_mode": "normal"
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
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
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


### Step 2: Send Extend API Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/extend/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request'\
--header 'Content-Type: application/json' \
--data-raw '{
  "source_video_id": 0,
  "video_media_id" :0, 
  "prompt": "across the universe",
  "seed": 123123,
  "quality": "540p",
  "duration": 5,
  "model": "v4.5",
  "motion_mode": "normal"
  }'

```



🔧 Parameter Details
| Parameter Name | Required | Type | Description |
|:--------:|:----------:|:----------:|:------:|
| source_video_id | choose either source_video_id or video_media_id, not both. | int | video from PixVerse API |
| video_media_id | choose either source_video_id or video_media_id, not both | int | uploaded external video |
| model | Required | string | v3.5/v4/v4.5 |
| prompt | Required | string | =< 2048 characters |
| negative_prompt | Optional | string | =< 2048 characters |
| img_id | Requried | integer | Image ID after uploading image interface. <br>Required for image-to-video generation |
| template_id | Optional | integer | Must activate effects in effects management before use. <br>Some effects don't support certain resolutions, please check effects management |
| style | Optional | string | "anime"<br>"3d_animation"<br>"day"<br>"cyberpunk"<br>"comic" <br> Do not include style parameter unless needed |
| motion_mode | Optional | string | Default - "normal"<br>"fast"(only allows 5-second duration)<br>1080p doesn't support "fast". If not provided, defaults to normal |
| duration | Required | integer | 5,8<br>1080p doesn't support 8 |
| quality | Required | string | "360p"(Turbo model), "540p", "720p", "1080p" |
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
    - couldn’t find a matching source_video_id. Please re-upload your video and try again.
    - couldn’t find a matching video_media_id. Please re-upload your video and try again.
    - Invalid media_type: not a video resource. Please check the ID and try again.

- 500044 :	Reached the limit for concurrent generations.
        
