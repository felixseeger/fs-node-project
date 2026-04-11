# V6 released!



## **Feature Comparison**

| **Capability** | **v6** | 
| --- | --- |
| Text-to-Video | ✅ | 
| Image-to-Video | ✅ | 
| First & Last Frame (Transition) | ✅ | 
| Video Extension | ✅ | 
| Reference-to-Video (Fusion) | ❌ | 

## **V6 Model**

### **Capabilities Overview**

| feature | Text-to-video | Image-to-Video | Transition (First/Last Frame) | Video Extension |
| --- | --- | --- | --- | --- |
| endpoint | text/generate | img/generate | transition/generate | extend/generate |
| model | ✅"model":"v6" | ✅"model":"v6" | ✅"model":"v6" | ✅"model":"v6" |
| duration | • 1–15 seconds (1080p supports up to 15s) | • 1–15 seconds (1080p supports up to 15s) | • 1–15 seconds (1080p supports up to 15s) | • 1–15 seconds (1080p supports up to 15s) |
| quality | 360/540/720/1080 | 360/540/720/1080 | 360/540/720/1080 | 360/540/720/1080 |
| aspect_ratio | 16:9,4:3,1:1,3:4,9:16,2:3,3:2,21:9 | - | - | - |
| generate_audio_switch | ✅ | ✅ | ✅ | ✅ |
| generate_multi_clip_switch | ✅ | ✅ | - | - |

### **Supported Parameters**

| **Parameter** | **Type** | **Required** | **t2v** | **it2v** | **transition** | **extend** |
| --- | --- | --- | --- | --- | --- | --- |
| model | string | Yes | v6 | v6 | v6 | v6 |
| prompt | string | Yes | ≤2048 chars | ≤2048 chars | ≤2048 chars | ≤2048 chars |
| duration | int | Yes | 1–15 | 1–15 | 1–15 | 1–15 |
| quality | string | Yes | “360p”,“540p”,“720p”,“1080p” | same | same | same |
| aspect_ratio | string | Yes | Supported | ❌ | ❌ | ❌ |
| generate_audio_switch | boolean | No | true/false | true/false | true/false | true/false |
| generate_multi_clip_switch | boolean | No | true/false | true/false | ❌ | ❌ |
| img_id | int | Yes | ❌ | ✅ | ❌ | ❌ |
| first_frame_img | int | Yes | ❌ | ❌ | ✅ | ❌ |
| last_frame_img | int | Yes | ❌ | ❌ | ✅ | ❌ |
| seed | int | No | 0–2147483647 | same | same | same |

### **Credits Consumption**

- Calculated per second

| V6 | no audio | audio |
| --- | --- | --- |
| 360p | 5 | 7 |
| 540p | 7 | 9 |
| 720p | 9 | 12 |
| 1080p | 18 | 23 |