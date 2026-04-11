# How to get video generation status?

## Overview

Through this API, you can obtain detailed information about the video generation process, including processing status, video URL (if completed), and other metadata.

**Endpoint:** `GET https://app-api.pixverse.ai/openapi/v2/video/result/{video_id}`

## Prerequisites
Before you begin, make sure you have:
- A valid PixVerse **API key**
- **A different Ai-trace-id** for each unique request
- A **video_id** from generation tasks

### 1. Prepare video_id from generation task
- After submitting a video generation request, you'll receive a video_id.

### 2. Get video generation status for Status Checking
- Use this video_id to periodically check the status of your generation:
```
curl --location --request GET 'https://app-api.pixverse.ai/openapi/v2/video/result/{video_id}' \
--header 'API-KEY: ' \
--header 'Ai-trace-id: '
```

- Status code:
    - 1 : Generation successful
    - 5 : Waiting for generation
    - 7 : Content moderation failure
    - 8 : Generation failed
- When the video is in processing status (status=5), it's recommended to poll at intervals of 3~5 seconds.

### 3. Result Retrieval
- Once processing is complete, the status endpoint will return status 1, indicating the video is ready. At this point, you can use the url field in the response to download or display the generated video.
```{
  "ErrCode": 0,
  "ErrMsg": "",
  "Resp": {
    "create_time": "2025-03-25T08:30:00Z",
    "id": 12345,
    "modify_time": "2025-03-25T08:35:12Z",
    "negative_prompt": "blurry, low quality",
    "outputHeight": 720,
    "outputWidth": 1280,
    "prompt": "City sunset timelapse",
    "resolution_ratio": 0,
    "seed": 42,
    "size": 8427520,
    "status": 1,
    "style": "anime",
    "url": ""
  }
}
```



### Recommended Practices
1. Polling Interval: When the video is in processing status (status=5), it's recommended to poll at intervals of no less than 5 seconds (3~5 seconds)

3. Save video&video_id : video_id is the unique identifier for querying status.






