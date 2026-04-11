# GLM-ASR-2512 - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/audio/glm-asr-2512

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationAudio ModelsGLM-ASR-2512[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Usage](#usage)
* [   Resources](#resources)
* [   Introducing GLM-ASR-2512](#introducing-glm-asr-2512)
* [    Quick Start](#quick-start)
Audio Models
# GLM-ASR-2512
Copy pageCopy page
# [​](#overview)   Overview

GLM-ASR-2512 is Z.AI’s next-generation speech recognition model, enabling real-time conversion of speech into high-quality text. Whether for daily conversations, meeting minutes, work documents, or scenarios involving specialized terminology, it delivers precise recognition and conversion, significantly boosting input and recording efficiency. The model maintains industry-leading recognition performance across diverse scenarios and accents, achieving a Character Error Rate (CER) of just 0.0717. This delivers a fast and reliable voice input experience.

# Input Modality
Audio / File
# Output Modality
Text
# Upload Restrictions

* Audio duration ≤ 30 seconds

* File size ≤ 25 MB

# [​](#usage)   Usage

Real-time Meeting Minutes

Transcribe online meetings instantly, automatically organizing structured summaries to significantly boost efficiency.Customer Service Quality Assurance & Ticket Management

High-precision transcription of support calls enhances QA efficiency and enables multi-scenario analysis.Live Video Captioning

Provides real-time synchronized subtitles for news broadcasts, educational courses, or video conferences with low latency and high accuracy.Office Document Input

Rapidly generate work documents, emails, and proposal drafts via voice input, dramatically accelerating content creation.Multilingual Communication & Translation

Supports cross-language speech comprehension for cross-border exchanges, online meetings, and educational settings.Medical Record Entry

Instantly recognizes extensive medical terminology, enabling doctors to dictate patient histories for swift electronic medical record generation.

# [​](#resources)   Resources

* [API Documentation](/api-reference/audio/audio-transcriptions): Learn how to call the API.

# [​](#introducing-glm-asr-2512)   Introducing GLM-ASR-2512

1[](#)
# Product Advantages

* Precise Recognition: In the latest competitive evaluation, GLM-ASR-2512 achieved a Character Error Rate (CER) of just 0.0717, reaching internationally leading standards and matching the world’s top speech recognition models.

* Efficient Custom Dictionary: The model enables users to swiftly import specialized vocabulary, project codes (e.g., AutoGLM, Zhipu AI Input Method), and uncommon names/locations through simple configuration. Add once in settings to eliminate repetitive editing hassles.

* Complex Scenario Advantages: Whether handling mixed Chinese-English expressions, command-based text, industry-specific terminology, long sentences, or colloquial speech, GLM-ASR-2512 consistently delivers high-quality transcriptions with overall performance significantly outperforming competitors.

2[](#)
# Supported Languages
GLM-ASR-2512 excels in multilingual and dialect processing, accurately transcribing major global languages and regional speech:
* Chinese: Supports Mandarin, along with major dialects including Sichuanese, Cantonese, Min Nan, and Wu

* English: Supports multiple accents such as American and British

* Other supported languages: Dozens of globally used languages including French, German, Japanese, Korean, Spanish, Arabic, and more

# [​](#quick-start)    Quick Start

The following is a full sample code to help you onboard GLM-ASR-2512 with ease.
*  cURL
Basic Call
```
curl --request POST \
    --url https://api.z.ai/api/paas/v4/audio/transcriptions \
    --header &#x27;Authorization: Bearer API_Key&#x27; \
    --header &#x27;Content-Type: multipart/form-data&#x27; \
    --form model=glm-asr-2512 \
    --form stream=false \
    --form file=@example-file

```
Streaming Call
```
curl --request POST \
    --url https://api.z.ai/api/paas/v4/audio/transcriptions \
    --header &#x27;Authorization: Bearer API_Key&#x27; \
    --header &#x27;Content-Type: multipart/form-data&#x27; \
    --form model=glm-asr-2512 \
    --form stream=true \
    --form file=@example-file

```
Was this page helpful?

YesNo[CogView-4](/guides/image/cogview-4)[Thinking Mode](/guides/capabilities/thinking-mode)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
