# Common errors and Solutions

## Authentication Errors

### `Invalid API-KEY`

**Cause**: The API key in your request header is incorrect or has been revoked.

**Solution**:
- Verify you're using the correct API key
- Ensure the API key is in the `API-KEY` header (not in the request body)
- Check if your API key has expired


## Parameter Errors

### `Invalid parameter` or `Invalid binding request`

**Cause**: Invalid binding request: incorrect parameter type or value


**Solution**:
- Use correct parameter type & value, here is the reference

| Parameter Name |  Type | Description |
|:--------:|:----------:|:----------:|
| model |  string | v3.5 |
| img_id |  integer |  |
| prompt |  string |  =< 2048 characters |
| negative_prompt |  string | =< 2048 characters |
| template_id | integer | Must activate effects in effects management before use. <br>Some effects don't support certain resolutions, please check effects management |
| style | string | "anime"<br>"3d_animation"<br>"day"<br>"cyberpunk"<br>"comic" <br> Do not include style parameter unless needed |
| motion_mode |  string | Default - "normal"<br>"fast"(only allows 5-second duration)<br>1080p doesn't support "fast". If not provided, defaults to normal |
| duration |  integer | 5,8<br>1080p doesn't support 8 |
| quality |  string | "360p"(Turbo model), "540p", "720p", "1080p" |
| seed |  integer | Random seed, int32 random number between 0 - 2147483647 |


## Video Generation Errors

### `Status code [code]`

**Cause**: The video generation process failed on the server side.

**Solution**:

- if Status is 7 : check if your prompt contains prohibited content,try a different prompt or modify the existing one
- if Status is 8 : Our server encountered an error during generation. Please try again. If the issue persists, please contact our customer support at api@pixverse.ai as soon as possible.




### `Waiting for video generating completion`

**Cause**: The video generation is taking longer than expectation

**Solution**:
- Please check if you're using the same AI-trace-ID for every request.
- Check your Internet connection 



## Image Processing Errors

### `Unsupported image format`

**Cause**: The image file format you're trying to upload is not supported.

**Solution**:
- Use only supported image formats: JPG, JPEG, PNG, or WEBP
- Check the file extension matches the actual file format
- Try converting your image to a different supported format

### `Image upload error (including Image size error)`

**Cause**: Error during the image file upload process.

**Solution**:
- Ensure the image file cannot exceed 20M 4000px*4000px
- Check if your network connection is stable
- Try reducing the image file size

## Rate Limiting Errors

### `Reached the limit for concurrent generations.`

**Cause**: You have exceeded the number of videos allowed to be in "generating" status according to your current plan.

**Solution**:
- Please check your membership privileges. If needed, consider upgrading your membership.
- If a video has been "generating" for a long time, please wait 10 minutes. For videos that haven't successfully generated after 10 minutes, the system will automatically release the "generating" video count limitation.


For more assistance or to report persistent issues, please contact PixVerse technical support api@pixverse.ai


:::highlight purple 💡
When contacting us by email, please use the following format:
- ID:
- E-mail:
- Issue encountered:
- Description:
- Relevant Ai-trace-ID

:::

