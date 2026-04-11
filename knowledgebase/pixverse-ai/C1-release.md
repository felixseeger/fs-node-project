# C1 released! 

# PixVerse C1 Update — A Cinema-Quality Video Generation Model

> - Delivers near cinematic-quality visuals, physically accurate character motion, and visceral, high-impact combat sequences.
Hand-to-hand combat feels weighty and grounded, while both melee and firearms recreate intense, high-energy battle scenes.
> - Supports text-to-video, image-to-video, start/end frame, and reference-based generation, with up to 15s at 1080p and synchronized audio-visual output.
Automatically generates structured storyboards from prompts.
Reference-based generation additionally supports multi-panel storyboard-to-video conversion.


1. **A Professional Model for Advanced Video Production**
- Ensures strong consistency across multi-character scenes, complex environments, and multi-shot transitions.
Supports up to 1080p and 15s direct generation, significantly improving production efficiency.

2. **Enhanced Combat & VFX Capabilities**
- Combat Motion
    - Precisely renders dynamic, high-impact action sequences.
    - Supports both realistic and stylized (anime) motion — from sharp, aggressive strikes to controlled, cinematic choreography.

- Aesthetic VFX System
    - Enhanced simulation of lighting, particles, and natural elements (e.g., wind, lightning, ice, fire).
    - Traditional cultural elements (e.g., Tai Chi, star formations) are procedurally transformed into distinctive fantasy visuals.

- Fantasy & Magic Effects
    - Rich, immersive fantasy environments with highly detailed spell effects.
Balances ethereal elegance with grounded realism for a stronger sense of immersion.

- High-Speed Motion
    - Smooth camera tracking with strong motion dynamics, delivering a powerful sense of speed and presence.

3. **Multi-Panel Intelligent Storyboarding**
- Within reference-based generation, supports converting a multi-panel storyboard image into a complete video with one click
- enabling a seamless transition from static concepts to dynamic storytelling.


## **Feature Comparison**

| **Capability** | **c1** | 
| --- | --- |
| Text-to-Video | ✅ | 
| Image-to-Video | ✅ | 
| First & Last Frame (Transition) | ✅ | 
| Video Extension | ❌| 
| Reference-to-Video (Fusion) | ✅ | 


## **C1 Model**

### **Capabilities Overview**

| Parameter | Text-to-Video | Image-to-Video | Transition (First/Last Frame) | Reference-to-Video |
|----------|--------------|----------------|-------------------------------|--------------------|
| API Endpoint | `text/generate` | `img/generate` | `transition/generate` | `fusion/generate` |
| Model | ✅ `"model": "c1"` | ✅ `"model": "c1"` | ✅ `"model": "c1"` | ✅ `"model": "c1"` |
| Duration | Any integer from 1–15s (1080p supports up to 15s) | Same | Same | Same |
| Resolution | 360 / 540 / 720 / 1080 | Same | Same | Same |
| Aspect Ratio (`aspect_ratio`) | "16:9","4:3","1:1","3:4","9:16","2:3","3:2","21:9" | ❌ | ❌ | Same as left |
| generate_audio_switch | ✅ | ✅ | ✅ | ✅ |


### **Supported Parameters**

| parameter | Type | Required | t2v | it2v | transition | fusion (reference) |
|------|------|----------|-----|------|------------|--------------|
| model | string | Yes | c1 | c1 | c1 | c1 |
| prompt | string | Yes | Max 2048 characters (UTF-8) | Same | Same | Same |
| duration | int | Yes | 1–15 | 1–15 | 1–15 | 1–15 |
| quality | string | Yes | "360p","540p","720p","1080p" | Same | Same | Same |
| aspect_ratio | string | Yes | Supported | ❌ | ❌ | Supported |
| generate_audio_switch | boolean | No | true/false | true/false | true/false | true/false |
| img_id | int | Yes | ❌ | ✅ | ❌ | ❌ |
| first_frame_img | int | Yes | ❌ | ❌ | ✅ | ❌ |
| last_frame_img | int | Yes | ❌ | ❌ | ✅ | ❌ |
| image_references | array(object) | Yes | ❌ | ❌ | ❌ | ✅ |
| seed | int | No | 0–2147483647 | Same | Same | Same |
    
    
    
### **Credits Consumption**

- Calculated per second
    
    
    
| C1 | no audio | audio |
| --- | --- | --- |
| 360p | 6 | 8 |
| 540p | 8 | 10 |
| 720p | 10 | 13 |
| 1080p | 19 | 24 |
