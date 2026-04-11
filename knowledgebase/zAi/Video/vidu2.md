# Vidu 2 - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/video/vidu2

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationVideo Generation ModelsVidu 2[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
# Get Started
* [Quick Start](/guides/overview/quick-start)
* [Overview](/guides/overview/overview)
* [Pricing](/guides/overview/pricing)
* [Core Parameters](/guides/overview/concept-param)
* SDKs Guide
* [Migrate to GLM-5.1](/guides/overview/migrate-to-glm-new)

# Language Models
* [GLM-5.1](/guides/llm/glm-5.1)
* [GLM-5](/guides/llm/glm-5)
* [GLM-5-Turbo](/guides/llm/glm-5-turbo)
* [GLM-4.7](/guides/llm/glm-4.7)
* [GLM-4.6](/guides/llm/glm-4.6)
* [GLM-4.5](/guides/llm/glm-4.5)
* [GLM-4-32B-0414-128K](/guides/llm/glm-4-32b-0414-128k)

# Vision Language Models
* [GLM-5V-Turbo](/guides/vlm/glm-5v-turbo)
* [GLM-4.6V](/guides/vlm/glm-4.6v)
* [GLM-OCR](/guides/vlm/glm-ocr)
* [AutoGLM-Phone-Multilingual](/guides/vlm/autoglm-phone-multilingual)
* [GLM-4.5V](/guides/vlm/glm-4.5v)

# Image Generation Models
* [GLM-Image](/guides/image/glm-image)
* [CogView-4](/guides/image/cogview-4)

# Video Generation Models
* [CogVideoX-3](/guides/video/cogvideox-3)
* [Vidu Q1](/guides/video/vidu-q1)
* [Vidu 2](/guides/video/vidu2)

# Image Generation Models
* [CogView-4](/guides/image/cogview-4)

# Audio Models
* [GLM-ASR-2512](/guides/audio/glm-asr-2512)

# Capabilities
* [Thinking Mode](/guides/capabilities/thinking-mode)
* [Deep Thinking](/guides/capabilities/thinking)
* [Streaming Messages](/guides/capabilities/streaming)
* [Tool Streaming Output](/guides/capabilities/stream-tool)
* [Function Calling](/guides/capabilities/function-calling)
* [Context Caching](/guides/capabilities/cache)
* [Structured Output](/guides/capabilities/struct-output)

# Tools
* [Web Search](/guides/tools/web-search)
* [Stream Tool Call](/guides/tools/stream-tool)

# Agents
* [GLM Slide/Poster Agent(beta)](/guides/agents/slide)
* [Translation Agent](/guides/agents/translation)
* [Video Effect Template Agent](/guides/agents/video-template)
On this page* [   Overview](#overview)
* [   Capability Description](#capability-description)
* [   Usage](#usage)
* [   Resources](#resources)
* [   Introducing Vidu2](#introducing-vidu2)
* [Efficient Video Generation Speed](#efficient-video-generation-speed)
* [Cost-Effective 720P Output](#cost-effective-720p-output)
* [Stable and Controllable Image-to-Video Generation](#stable-and-controllable-image-to-video-generation)
* [Semantically Enhanced Keyframe Transition](#semantically-enhanced-keyframe-transition)
* [Enhanced Consistency of Multiple Reference Images](#enhanced-consistency-of-multiple-reference-images)
* [    Quick Start](#quick-start)
* [1. Image-to-Video Generation](#1-image-to-video-generation)
* [2. Start and End Frame](#2-start-and-end-frame)
* [3. Reference-based Video Generation](#3-reference-based-video-generation)
Video Generation Models
# Vidu 2
Copy pageCopy page
# [​](#overview)   Overview

Vidu 2 is a next-generation video generation model that strikes a balance between speed and quality. It focuses on image-to-video generation and keyframe-based video creation, supporting 720P resolution for videos up to 4 seconds long.
With significantly faster generation speed and reduced cost, it addresses color distortion issues in image-to-video outputs, delivering stable and controllable visuals ideal for e-commerce scenarios.
Enhanced semantic understanding between keyframes and improved consistency with multiple reference images make Vidu 2 a highly efficient tool for mass production in pan-entertainment, internet content, anime short series, and advertising.
*  vidu2-image
*  vidu2-start-end
*  vidu2-reference

# Price
$0.2 / video
# Capability
Image-to-Video Generation
# Duration
4S
# Clarity
720P
# Price
$0.2 / video
# Capability
Start and End Frame
# Duration
5S
# Clarity
720P
# Price
$0.4 / video
# Capability
Reference-based Video Generation
# Duration
4S
# Clarity
720P

# [​](#capability-description)   Capability Description

# Image-to-Video Generation
Generate a video by providing a starting frame or both starting and ending frames along with corresponding text descriptions.
# Start and End Frame
Support input of two images: the first uploaded image is treated as the starting frame, and the second as the ending frame. The model uses these images as input parameters to generate the video.
# Reference-based Video Generation
Generate a video from a text prompt; currently supports both a general style and an anime style optimized for animation.
The URL link for the video generated by the model is valid for one day. Please save it as soon as possible if needed.

# [​](#usage)   Usage

General Entertainment Content Generation

* Input a single frame or IP elements to quickly generate short videos with coherent storylines and interactive special effects

* Supports diverse visual styles from anime-inspired to realistic

* Tailored for mass production of UGC creative content on short video platforms

Anime Short Drama Production

* Input static character images or keyframes to generate smooth animated sequences and micro-dramas

* Accurately reproduce detailed character movements (e.g., facial expressions)

* Supports mass production in various styles such as Chinese and Japanese anime

* Designed to meet animation studios’ needs for IP-based content expansion

Advertising & E-commerce Marketing

* Input real product images to intelligently generate dynamic advertising videos

* Clearly showcase product features such as 3C details and beauty product textures

* Automatically adapt to various platform formats, such as vertical videos for Tiktok and horizontal layouts for social feeds

# [​](#resources)   Resources

[API Documentation](/api-reference/video/cogvideox-3&vidu): Learn how to call the API.

# [​](#introducing-vidu2)   Introducing Vidu2

1[](#efficient-video-generation-speed)
# Efficient Video Generation Speed
With optimized model computing architecture, video rendering efficiency is significantly enhanced. This allows daily content teams to respond quickly to trending topics, and enables e-commerce sellers to mass-produce product display videos on demand—greatly reducing content delivery time and helping creators seize traffic windows.2[](#cost-effective-720p-output)
# Cost-Effective 720P Output
The cost of generating 720P resolution videos has dropped to 40% of the Q1 version. Small and medium-sized brands can now create batch videos for multiple SKUs, while advertising teams can test creative concepts like “product close-ups + scenario storytelling” at a lower cost—meeting full-platform marketing needs without breaking the content budget.3[](#stable-and-controllable-image-to-video-generation)
# Stable and Controllable Image-to-Video Generation

* The model addresses the “texture color shift” issue—accurately restoring details like the silky glow of satin or the matte finish of leather in clothing videos. In e-commerce scenarios, product colors are displayed more realistically.

* Dynamic frame compensation is optimized, ensuring smooth, shake-free motion for rotating 3C products or hand demonstrations in beauty tutorials.

* Multiple visual styles are supported, enabling eye-catching content like “product close-up + stylized camera movement,” ideal for e-commerce main images and short-form promotional videos.

4[](#semantically-enhanced-keyframe-transition)
# Semantically Enhanced Keyframe Transition
The model strikes a balance between creativity and stability, delivering significantly improved performance and semantic understanding—making it the optimal solution for keyframe-based video generation.By accurately analyzing scene logic and action continuity, transitions between frames are smooth and natural, enhancing narrative coherence throughout the content.5[](#enhanced-consistency-of-multiple-reference-images)
# Enhanced Consistency of Multiple Reference Images
When inputting multi-element materials, the visual style of the generated video (such as tone and lighting) can be highly unified.For example, in a cultural tourism promotional video, the transition between scenes such as the sunrise over an ancient city, street market scenes, and folk performances maintains consistency with the “Chinese style filter.”In anime IP derivative content, the actions and expressions of characters in different plot scenes can also strictly adhere to the original settings, facilitating the coherent creation of multi-scene, multi-element content.

# [​](#quick-start)    Quick Start

# [​](#1-image-to-video-generation)1. Image-to-Video Generation

*  Curl
*  Python
*  Java

```
curl --location --request POST &#x27;https://api.z.ai/api/paas/v4/videos/generations&#x27; \
--header &#x27;Authorization: Bearer {your apikey}&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data-raw &#x27;{
    &quot;model&quot;:&quot;vidu2-image&quot;,
    &quot;image_url&quot;:&quot;https://example.com/path/to/your/image.jpg&quot;,
    &quot;prompt&quot;:&quot;Peter Rabbit drives a small car along the road, his face filled with joy and happiness.&quot;,
    &quot;duration&quot;:4,
    &quot;size&quot;:&quot;720x480&quot;,
    &quot;movement_amplitude&quot;:&quot;auto&quot;
}&#x27;

```
Install SDK
```
# Install latest version
pip install zai-sdk

# Or specify version
pip install zai-sdk==0.2.2

```
Verify Installation
```
import zai
print(zai.__version__)

```

```
from zai import ZaiClient

# Initialize the client, please replace your-api-key with your own APIKey.
client = ZaiClient(api_key=&quot;your-api-key&quot;)

# Video generation example from images.
response = client.videos.generations(
    model=&quot;vidu2-image&quot;,
    image_url=&quot;https://example.com/path/to/your/image.jpg&quot;,
    prompt=&quot;Peter Rabbit is driving a small car, cruising on the road, with a face full of happiness and joy.&quot;,
    duration=4,
    size=&quot;1280x720&quot;,
    movement_amplitude=&quot;auto&quot;
)

# Print the response result.
print(response)

```
Install SDKMaven
```
<dependency>
    <groupId>ai.z.openapi</groupId>
    <artifactId>zai-sdk</artifactId>
    <version>0.3.3</version>
</dependency>

```
Gradle (Groovy)
```
implementation &#x27;ai.z.openapi:zai-sdk:0.3.3&#x27;

```

```
import ai.z.openapi.ZaiClient;
import ai.z.openapi.service.videos.VideoCreateParams;
import ai.z.openapi.service.videos.VideosResponse;

public class Vidu2Example {
    public static void main(String[] args) throws InterruptedException {
        String apiKey = &quot;your_api_key&quot;; // Please fill in your own APIKey.
        ZaiClient client = ZaiClient.builder().ofZAI().apiKey(apiKey).build();

        // Construct video generation request parameters.
        VideoCreateParams request = VideoCreateParams.builder()
            .model(&quot;vidu2-image&quot;)
            .imageUrl(&quot;https://example.com/path/to/your/image.jpg&quot;)
            .prompt(&quot;Peter Rabbit is driving a small car, cruising on the road, with a face full of happiness and joy.&quot;)
            .duration(4)
            .size(&quot;1280x720&quot;)
            .build();

        // Initiate video generation request.
        VideosResponse response = client.videos().videoGenerations(request);
        System.out.println(response.getData());
        
        // Wait for 10 minutes, then asynchronously retrieve the final generated video using the task ID.
        Thread.sleep(600000L);
        VideosResponse videosResponse = client.videos().videoGenerationsResult(response.getData().getId());
        System.out.println(videosResponse.getData().getVideoResult());
    }
}

```

# [​](#2-start-and-end-frame)2. Start and End Frame

*  Curl
*  Python

```
curl --location --request POST &#x27;https://api.z.ai/api/paas/v4/videos/generations&#x27; \
--header &#x27;Authorization: Bearer {your apikey}&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data-raw &#x27;{
    &quot;model&quot;:&quot;vidu2-start-end&quot;,
    &quot;image_url&quot;:[&quot;https://example.com/path/to/your/image1.jpg&quot;,&quot;https://example.com/path/to/your/image2.jpg&quot;],
    &quot;prompt&quot;:&quot;Peter Rabbit drives a small car along the road, his face filled with joy and happiness.&quot;,
    &quot;duration&quot;:4,
    &quot;size&quot;:&quot;720x480&quot;,
    &quot;movement_amplitude&quot;:&quot;auto&quot;
}&#x27;

```

```
from zai import ZaiClient

# Initialize the client, please replace &quot;your-api-key&quot; with your own APIKey.
client = ZaiClient(api_key=&quot;your-api-key&quot;)

# Define URLs for first frame and last frame
sample_first_frame = &quot;https://gd-hbimg.huaban.com/ccee58d77afe8f5e17a572246b1994f7e027657fe9e6-qD66In_fw1200webp&quot;
sample_last_frame = &quot;https://gd-hbimg.huaban.com/cc2601d568a72d18d90b2cc7f1065b16b2d693f7fa3f7-hDAwNq_fw1200webp&quot;

# Video generation request (first and last frame mode)
response = client.videos.generations(
    model=&quot;vidu2-start-end&quot;,
    image_url=[sample_first_frame, sample_last_frame],  # The first and last frame images
    prompt=&quot;Peter Rabbit driving a car, wandering on the road, with a happy and joyful expression on his face.&quot;,
    duration=4,  #Video duration (seconds)
    size=&quot;1280x720&quot;,  # Video resolution
    movement_amplitude=&quot;auto&quot;,  # Movement amplitude
)

# Print the response result
print(response)

```

# [​](#3-reference-based-video-generation)3. Reference-based Video Generation

*  Curl
*  Python

```
curl --location --request POST &#x27;https://api.z.ai/api/paas/v4/videos/generations&#x27; \
--header &#x27;Authorization: Bearer {your apikey}&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data-raw &#x27;{
    &quot;model&quot;:&quot;vidu2-reference&quot;,
    &quot;image_url&quot;:[&quot;https://example.com/path/to/your/image1.jpg&quot;,&quot;https://example.com/path/to/your/image2.jpg&quot;,&quot;https://example.com/path/to/your/image3.jpg&quot;],
    &quot;prompt&quot;:&quot;Peter Rabbit drives a small car along the road, his face filled with joy and happiness.&quot;,
    &quot;duration&quot;:4,
    &quot;aspect_ratio&quot;:&quot;16:9&quot;,
    &quot;size&quot;:&quot;720x480&quot;,
    &quot;movement_amplitude&quot;:&quot;auto&quot;,
    &quot;with_audio&quot;:true
}&#x27;

```

```
from zai import ZaiClient

# Initialize client with your API key (replace &#x27;your-api-key&#x27;)
client = ZaiClient(api_key=&quot;your-api-key&quot;)  

ref_image_url = [
    &quot;https://gd-hbimg.huaban.com/ccee58d77afe8f5e17a572246b1994f7e027657fe9e6-qD66In_fw1200webp&quot;,
    &quot;https://gd-hbimg.huaban.com/cc2601d568a72d18d90b2cc7f1065b16b2d693f7fa3f7-hDAwNq_fw1200webp&quot;,
    &quot;https://gd-hbimg.huaban.com/cc2601d568a72d18d90b2cc7f1065b16b2d693f7fa3f7-hDAwNq_fw1200webp&quot;
    ]

# Generate video using reference images
response = client.videos.generations(
    model=&quot;vidu2-reference&quot;,  # Using reference image model
    image_url=ref_image_url,  # List of reference image URLs
    prompt=&quot;Peter Rabbit driving a car, wandering on the road, with a happy and joyful expression on his face.&quot;,
    duration=4,  # Video duration in seconds
    aspect_ratio=&quot;16:9&quot;,  # Standard widescreen aspect ratio
    size=&quot;1280x720&quot;,  # HD resolution
    movement_amplitude=&quot;auto&quot;,  # Automatic motion control
    with_audio=True,  # Enable audio generation
)

# Print API response
print(response)

```
Was this page helpful?

YesNo[Vidu Q1](/guides/video/vidu-q1)[CogView-4](/guides/image/cogview-4)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
