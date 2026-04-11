# API Parameter Description


## Text-to-video / Image-to-video / Templates

| Parameter Name | Required | Type | Description |
|:--------:|:----------:|:----------:|:------:|
| model | Required | string | v3.5 |
| prompt | Required | string | <= 2048 characters |
| negative_prompt | Optional | string | <= 2048 characters |
| img_id | Required | integer | Image ID after uploading image interface. <br>Required for image-to-video generation |
| template_id | Optional | integer | Must activate effects in effects management before use. <br>Some effects don't support certain resolutions, please check effects management |
| camera_movement | Optional | string | Add your camera_movement on your videos(supports v4/v4.5 model)<br>supports value: "horizontal_left","horizontal_right","vertical_up","vertical_down",<br>"zoom_in","zoom_out","crane_up",<br>"quickly_zoom_in","quickly_zoom_out","smooth_zoom_in",<br>"camera_rotation","robo_arm","super_dolly_out","whip_pan","hitchcock",<br>"left_follow","right_follow","pan_left","pan_right","fix_bg" 
| style | Optional | string | "anime"<br>"3d_animation"<br>"day"<br>"cyberpunk"<br>"comic" <br> Do not include style parameter unless needed |
| motion_mode | Optional | string | Default - "normal"<br>"fast"(only allows 5-second duration)<br>1080p doesn't support "fast". If not provided, defaults to normal |
| duration | Required | integer | 5,8<br>1080p doesn't support 8 |
| quality | Required | string | "360p"(Turbo model), "540p", "720p", "1080p" |
| seed | Optional | integer | Random seed, int32 random number between 0 - 2147483647 |


## Transition

| Parameter Name | Required | Type | Description |
|:--------:|:----------:|:----------:|:------:|
| first_frame_img | Required | integer | The image ID of your first frame |
| last_frame_img | Required | integer | The image ID of your last frame |
| model | Required | string |"v3.5","v4","v4.5"|
| prompt | Required | string | <= 2048 characters |
| motion_mode | Optional | string | Default - "normal"<br>"fast"(only allows 5-second duration)<br>1080p doesn't support "fast". If not provided, defaults to normal |
| duration | Required | integer | 5,8<br>1080p doesn't support 8 |
| quality | Required | string | "360p"(Turbo model), "540p", "720p", "1080p" |
| seed | Optional | integer | Random seed, int32 random number between 0 - 2147483647 |
| negative_prompt | Optional | string | <= 2048 characters |


## Lipsync
| Parameter Name | Required | Type | Description |
|:--------:|:----------:|:----------:|:------:|
| source_video_id | choose either source_video_id or video_media_id, not both. | int | video from PixVerse API |
| video_media_id | choose either source_video_id or video_media_id, not both | int | uploaded external video |
| audio_media_id | choose either audio_media_id or lip_sync_tts_speaker_id + lip_sync_tts_content, not both | int| uploaded external audio |
| lip_sync_tts_speaker_id | choose either audio_media_id or lip_sync_tts_speaker_id + lip_sync_tts_content, not both | string | TTS speaker from tts speaker list|
| lip_sync_tts_content | choose either audio_media_id or lip_sync_tts_speaker_id + lip_sync_tts_content, not both | string | TTS script ~200 characters (not UTF-8 Encoding)|




## Extend
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

