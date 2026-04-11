# Video Effect Template Agent - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/agents/video-template

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationAgentsVideo Effect Template Agent[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
On this page* [Overview](#overview)
* [Examples](#examples)
* [Core Features](#core-features)
* [Usage](#usage)
* [Use Video Templates](#use-video-templates)
* [Price](#price)
Agents
# Video Effect Template Agent
Copy pageCopy page
# [​](#overview)Overview

Includes three popular special effects video templates: french_kiss, bodyshake, and sexy_me. Users can upload a single image to generate a professional-grade special effects video with a single click. The app is easy to use, produces smooth images, and effectively improves the efficiency and quality of short video creation.

# [​](#examples)Examples

TemplatesPromptExample InputExample Outputfrench_kissThe two figures in the painting gradually draw closer, then passionately kiss, alternating between deep and intense moments.bodyshakeVideo content: The character performs a rhythmic dance sequence in an indoor setting. She first sways her hips, then turns to the other side, briefly shaking her hips in a playful manner. Her movements are fluid and confident, consistently emphasizing body rhythm and expressiveness.  Requirements: Movement Level: Highsexy_meThe woman’s attire undergoes a seamless transformation, her original clothing smoothly transitioning into a fashionable bikini. In the final moment, she confidently places her hands on her hips, exuding elegance and poise.

# [​](#core-features)Core Features

* Excellent Dynamic Performance：Natural and smooth movements with a wide range of motion, eliminating the sluggishness commonly found in AI videos, and suitable for a variety of creative special effects scenarios.

* Accurate Semantic Understanding: Able to efficiently generate a variety of images based on prompts, providing a smoother card-drawing experience.

* Excellent Anime Style: Stable video generation quality without sudden changes.

* Strong Subject Consistency:No need for additional first frame images; generate highly consistent videos with a single click, greatly simplifying the creation process.

# [​](#usage)Usage

Target UsersApplication ScenariosIndividual CreatorsQuickly produce popular special effects short videos (such as costume changes/dance challenges) and efficiently produce creative content at low cost.MCN AgenciesBatch generate standardized special effects videos (such as popular costume change templates) to meet the large-scale content needs of matrix accounts.Short Video PlatformsProvide an integrated special effects template library to lower user creation barriers, enhance platform content diversity, and boost user engagement.

# [​](#use-video-templates)Use Video Templates

* French Kiss Template:

* Image Quantity: Required; Only 1 image can be uploaded.

* Number of People in Image: Only supports two-person collages or group photos.

* Guidelines: Subjects should be shown from the front and upper body only, with no props in hand for best results.

* Prompt: The two figures in the image gradually move closer, then passionately kiss with alternating deep and firm intensity.

* Effect Limitations: If a full-body image is uploaded, the result may show no kiss, a weaker kiss, or a shorter duration—failing to convey the intended passionate effect.

* Bodyshake Template:

* Image Quantity: Required; Only 1 image can be uploaded.

* Number of People in Image: Supports single-person photos in either realistic or anime style.

* Guidelines: Best results are achieved when the character is alone and the image shows at least above-thigh framing.

* Prompt: “Video content: The character performs a rhythmic dance sequence in an indoor setting. She starts by swaying her hips, then turns to the other side, briefly shaking her hips in a playful manner. Her movements are smooth and confident, consistently emphasizing rhythm and expressiveness. Requirement: Movement intensity – high.”

* Effect Limitations: During the turning motion, body structure distortion or hand clipping may occasionally occur. For hip-shaking actions, motion may sometimes appear disconnected or visually unnatural.

* Sexy_Me Template：

* Image Quantity: Required; Only 1 image can be uploaded.

* Number of People in Image: Only supports single-person photos (female or male) in either realistic or anime style.

* Guidelines: Best results are achieved with half-body or full-body images. If the subject in the input image is female, the output will feature a bikini transformation video showcasing the body. If the subject is male, the output will show a shirtless transformation video highlighting muscular physique.

* Prompt: “Video content: The transformation varies depending on the subject’s gender. If the image shows a female: ‘The woman’s clothing transforms seamlessly—her outfit smoothly changes into a stylish bikini. At the final moment, she confidently places her hands on her waist, exuding grace and poise.’ If the image shows a male: ‘The man swiftly removes his shirt, revealing a muscular physique matching his skin tone. He then steps forward.’ Requirements: 1. If the image is a close-up or medium shot, set the camera motion to “zoom out.” 2. Movement intensity: high.”

* Effect Limitations: If the subject’s gender features are unclear, incorrect gender identification may occur, resulting in mixed or incorrect bikini/muscle transformations. In bikini transformations, clothing may not be fully removed. If a two-person image is uploaded, one subject may be missing in the output.

# [​](#price)Price

Pay-as-you-go based on number of videos, $ 0.2 per videoWas this page helpful?

YesNo[Translation Agent](/guides/agents/translation)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
