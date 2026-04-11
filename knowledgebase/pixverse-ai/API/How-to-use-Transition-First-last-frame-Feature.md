# How to use Transition(First-last frame Feature)

The Transition(First-last frame Feature) feature allows you to generate surprising video transitions by controlling both the first and last frames. This is particularly effective for creating transition effects, transformations, and morphing sequences.


<Columns>
  <Column>
  <Video src="https://media.pixverse.ai/asset/media/0512_transition_apiplatform_v1.mp4"></Video>
  </Column>
  <Column>
      <Video src="https://media.pixverse.ai/asset/media/transition_guidance_video.mp4"></Video>
  </Column>
</Columns>





## Overview

This feature requires two images: one for the first frame and one for the last frame. The API will generate a video that smoothly transitions between these two points, creating a surprising and visually appealing sequence.

**Endpoint:** `POST https://app-api.pixverse.ai/openapi/v2/video/transition/generate`
**API reference** : https://docs.platform.pixverse.ai/transitionfirst-last-frame-generation-15123014e0


## Usage Instructions


<Steps>
  <Step title="Upload Images">
    Upload both your first frame and last frame images using the upload image endpoint(https://docs.platform.pixverse.ai/upload-image-13016631e0), and note the returned `img_id` values for each.
      
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
      
   
  </Step>
  <Step title="Create Video Task">
    Make a request to the video generation endpoint with the following parameters:
    - `prompt`: Describe the desired transition process to guide the video generation
    - `model`: "v3.5","v4","v4.5"
    - `duration`: 5 or 8 
    - `quality`: "360p" or "540p" or "720p" or "1080p"
    - `motion_mode` : "normal" or "fast"
    - `seed` : range: 0 - 2147483647
    - `first_frame_img`: The image ID of your first frame
    - `last_frame_img`: The image ID of your last frame
     
 ```
 { 
    "prompt": "transform into a puppy",
    "model": "v4.5",
    "duration": 5,
    "quality": "540p",
    "motion_mode": "normal",
    "seed": 937433858,
    "first_frame_img": 0,
    "last_frame_img": 0
} 
```
  </Step>
  <Step title="Track Progress">
    - After creating the task, you will receive a `video_id`
    - Query periodically Get Video Generation Status API using this video_id
      
```bash
curl --location --request GET 'https://app-api.pixverse.ai/openapi/v2/video/result/{video_id}' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request'
```
    - The status will change from 5 to 1 when processing is complete
  </Step>
  <Step title="View Results">
    Once the status equals 1, use the provided URL to view or download your generated video.
  </Step>
</Steps>






