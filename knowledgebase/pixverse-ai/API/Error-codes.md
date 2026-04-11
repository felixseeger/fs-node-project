# Error codes


| Error Code | Description |
|:------------:|---------|
| 0 | success |
| 400011 | Empty parameter |
| 400012 | Invalid account |
| 400013 | Invalid binding request: incorrect parameter type or value |
| 400017 | Invalid parameter |
| 400018 | Prompt/negative prompt length exceeds 2048 characters limit. Please check if your input is too long. |
| 400019 | Prompt/negative prompt length exceeds 2048 characters limit. Please check if your input is too long.|
| 400032 | Invalid image ID |
| 500008 | Requested data not found|
| 500020 | User does not have permission for this operation |
| 500030 | Image size cannot exceed 20M 4000px*4000px |
| 500031 | Failed to retrieve image information |
| 500032 | Invalid image format |
| 500033 | Invalid image width or height |
| 500041 | Image upload failed |
| 500042 | Invalid image path |
| 500044 | Reached the limit for concurrent generations. |
| 500054 | Content moderation failure. Image maybe contains inappropriate content. Please replace with another image and try again. |
| 500060 | Monthly effects activation limit reached. Count will reset according to your plan |
| 500063 | Video moderation failed：The input video is not compliant, please re-enter<br>Image moderation failed：The uploaded image is not compliant, please replace it and try again<br>Text moderation failed：The text you entered contains sensitive information. Please re-enter. |
| 500064 | Content has been deleted. Please check other available content |
| 500069 | System is currently experiencing high load. Please try again later |
| 500070 | Current template is not activated |
| 500071 | This effect does not support 720p or 1080p. |
| 500090 | Insufficient balance. Unable to generate video. Please top up your credits. |
| 500100 | MySQL error |
| 99999 | Unknown error |