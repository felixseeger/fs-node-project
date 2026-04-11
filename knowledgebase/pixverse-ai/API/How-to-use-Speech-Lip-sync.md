# How to use Speech(Lip sync)?

The Speech (LipSync) endpoint is designed to solve voice synchronization issues in videos.
It analyzes both the audio and the speaker’s mouth movements in the video, matching them precisely. This makes your videos more expressive and engaging, adding storytelling depth.

**Endpoint:** `https://app-api.pixverse.ai/openapi/v2/video/lip_sync/generate`
**API reference** : https://docs.platform.pixverse.ai/speechlipsync-generation-19094278e0

<Columns>
  <Column>
  <Video src="https://media.pixverse.ai/asset/template/对口型 海外.mp4"></Video>
  </Column>
</Columns>
        
## Prerequisites
Before you begin, make sure you have:
- A valid PixVerse API key
- A unique Ai-trace-id for each API request
- An active subscription with available or purchased API credits
- A Video either:
    - A video_id generated from PixVerse
**or**
    - An uploaded video in supported formats (mp4, mov)
    - Max resolution: 1920
    - Max file size: 50MB
    - Max duration: 30 seconds
    
 - A Audio either:
    - A script for using our built-in TTS service.
**or**
     - An audio file in supported formats (.mp3, .wav)
    - Max file size: 50MB
    - Max duration: 30 seconds
    
    
## Quick Start

<AccordionGroup>
  <Accordion title="1: Prepare Your Video">
### Your Video from External video
Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/media/upload' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
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
  <Accordion title="2: Prepare Your Audio or Script">

### Your audio from external audio file
Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/media/upload' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
--form 'file=@"/www/xxx/yyy/zzz.mp3"'

```
Responses

```
{
    "ErrCode": 0,
    "ErrMsg": "success",
    "Resp": {
        "media_id": 0,
        "media_type": "audio",
        "url": "https://media.pixverse.ai/111111.mp3"
    }
}
```

**for TTS service** 

you can get tts list from API
```
curl --location --request GET 'https://app-api.pixverse.ai/openapi/v2/video/lip_sync/tts_list' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
--header 'Content-Type: application/json' \
--data-raw '{
    "page_num": 0,
    "page_size": 0
}'
```

 Parameter Name | Required | Type | Description |
|:--------:|:----------:|:----------:|:------:|
| page_num | optional | int | how many pages you want to get|
| page_size | optional | int | how many datas on one page |

      
      
  </Accordion>
    <Accordion title="3. Speech generation task">
Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/lip_sync/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request'
--header 'Content-Type: application/json' \
--data-raw '{
  "source_video_id: 0,
  "video_media_id": 0,
  "audio_media_id":0,
  "lip_sync_tts_speaker_id": "auto",
  "lip_sync_tts_content": "hello this is harry, where are you from?"
}'
```
Responses
```
{
  "ErrCode": 0,
  "ErrMsg": "success",
  "Resp": {
    "video_id": 0
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


### Step 2 : Prepare Your Audio or Script
You can either:
- Upload a pre-recorded audio file (.mp3 or .wav, ≤ 30s, ≤ 50MB)
- Use our TTS service with a provided script

The audio must be clear. Multiple languages and audio types are supported, including speech, singing, and advertisements.

**for uploading audio file**
Construct your API request with the appropriate parameters:

```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/media/upload' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request'
--form 'file=@"/www/xxx/yyy/zzz.mp4"'

```

you will get "media_id" with "video" media_type

```
{
    "ErrCode": 0,
    "ErrMsg": "success",
    "Resp": {
        "media_id": 0,
        "media_type": "audio",
        "url": "https://media.pixverse.ai/111111.mp3"
    }
}
```

**for TTS service** 

you can get tts list from API
```
curl --location --request GET 'https://app-api.pixverse.ai/openapi/v2/video/lip_sync/tts_list' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
--header 'Content-Type: application/json' \
--data-raw '{
    "page_num": 0,
    "page_size": 0
}'
```

 Parameter Name | Required | Type | Description |
|:--------:|:----------:|:----------:|:------:|
| page_num | optional | int | how many pages you want to get|
| page_size | optional | int | how many datas on one page |



### Step 3: Send Speech(Lip Sync) API Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/video/lip_sync/generate' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request'
--header 'Content-Type: application/json' \
--data-raw '{
  "source_video_id: 0,
  "video_media_id": 0,
  "audio_media_id":0,
  "lip_sync_tts_speaker_id": "auto",
  "lip_sync_tts_content": "hello this is harry, where are you from?"
}'
```

4 cases for generation task

<Columns>
  <Column>
    #### source_video_id + audio_media_id
    ```
      {
  "source_video_id: 0,
  "audio_media_id":0,
}
    ```
  </Column>
  <Column>
    #### source_video_id + lip_sync_tts_speaker_id + lip_sync_tts_conent
   ```
      {
  "source_video_id: 0,
  "lip_sync_tts_speaker_id": "auto",
  "lip_sync_tts_content": "hello this is harry, where are you from?"
}
    ```
  </Column>
  <Column>
    #### video_media_id + audio_media_id
    ```
      {
  "video_media_id": 0,
  "audio_media_id":0,
}
    ```
  </Column>
  <Column>
    #### video_media_id + lip_sync_tts_speaker_id + lip_sync_tts_conent
    ```
      {
  "video_media_id": 0,
  "lip_sync_tts_speaker_id": "auto",
  "lip_sync_tts_content": "hello this is harry, where are you from?"
}
    ```
  </Column>
</Columns>



| Parameter Name | Required | Type | Description |
|:--------:|:----------:|:----------:|:------:|
| source_video_id | choose either source_video_id or video_media_id, not both. | int | video from PixVerse API |
| video_media_id | choose either source_video_id or video_media_id, not both | int | uploaded external video |
| audio_media_id | choose either audio_media_id or lip_sync_tts_speaker_id + lip_sync_tts_content, not both | int| uploaded external audio |
| lip_sync_tts_speaker_id | choose either audio_media_id or lip_sync_tts_speaker_id + lip_sync_tts_content, not both | string | TTS speaker from tts speaker list|
| lip_sync_tts_content | choose either audio_media_id or lip_sync_tts_speaker_id + lip_sync_tts_content, not both | string | TTS script ~200 characters (not UTF-8 Encoding)|



### Step 4 Handle the API Response
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


### Step 5 Check Generation Status
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
   "status": 5,
   "style": "string",
   "url": "string"
 }
}
```

### Step 6 Download the Generated Video
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
    - Either "audio_media_id" or "lip_sync_tts_speaker_id" + " llip_sync_tts_content" must be provided
    - couldn’t find a matching source_video_id. Please re-upload your video and try again.
    - couldn’t find a matching video_media_id. Please re-upload your video and try again.
    - Invalid media_type: not a video resource. Please check the ID and try again.
    - couldn’t find a matching audio_media_id. Please re-upload your video and try again.
    - Invalid media_type: not a audio resource. Please check the ID and try again.
    - The specified speaker ID is invalid or not supported.
    - TTS text must be within 200 characters.
    - TTS content is invalid or does not meet content guidelines
- 500044 :	Reached the limit for concurrent generations.

# Speech parameter

If you want to use this feature via parameters, please refer to the following details:

- **Supported APIs:** Text-to-Video / Image-to-Video / Keyframe-to-Video  
- **Supported Parameters:**  

| parameter | type | required | description |
| --- | --- | --- |--- |
| lip_sync_tts_switch | boolean |optional|true,fasle<br>Set to true if you want to enable this feature. Default is false.|
| lip_sync_tts_content | string |optional|~140 (UTF-8) characters. If the generated audio exceeds the video duration, it will be truncated|
| lip_sync_tts_speaker_id | string |optional|id from Get speech tts list  |



- **Credits Billing:**  
    - Regardless of the input content, enabling `lip_sync_switch` will be billed based on the generated video length.  
    - **Formula:** `video_duration × 4 credits` (4credits from speech biiling )


