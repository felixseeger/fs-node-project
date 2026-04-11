# Streaming Messages - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/capabilities/streaming

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationCapabilitiesStreaming Messages[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
On this page* [Features](#features)
* [Core Parameter Description](#core-parameter-description)
* [Response Format Description](#response-format-description)
* [Code Examples](#code-examples)
* [Response Example](#response-example)
* [Application Scenarios](#application-scenarios)
Capabilities
# Streaming Messages
Copy pageCopy pageStreaming Messages allow real-time content retrieval while the model generates responses, without waiting for the complete response to be generated. This approach can significantly improve user experience, especially when generating long text content, as users can immediately see output beginning to appear.

# [​](#features)Features

Streaming messages use an incremental generation mechanism, transmitting content in chunks in real-time during the generation process, rather than waiting for the complete response to be generated before returning it all at once. This mechanism allows developers to:

* Real-time Response: No need to wait for complete response, content displays progressively

* Improved Experience: Reduce user waiting time, provide instant feedback

* Reduced Latency: Content is transmitted as it’s generated, reducing perceived latency

* Flexible Processing: Real-time processing and display during reception

# [​](#core-parameter-description)Core Parameter Description

* stream=True: Enable streaming output, must be set to True

* model: Models that support streaming output, such as glm-5,  glm-4.7, glm-4.6, glm-4.5, etc.

# [​](#response-format-description)Response Format Description

Streaming responses use Server-Sent Events (SSE) format, with each event containing:

* choices[0].delta.content: Incremental text content

* choices[0].delta.reasoning_content: Incremental reasoning content

* choices[0].finish_reason: Completion reason (only appears in the last chunk)

* usage: Token usage statistics (only appears in the last chunk)

# [​](#code-examples)Code Examples

*  cURL
*  Python

```
curl --location &#x27;https://api.z.ai/api/paas/v4/chat/completions&#x27; \
--header &#x27;Authorization: Bearer YOUR_API_KEY&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data &#x27;{
    &quot;model&quot;: &quot;glm-5&quot;,
    &quot;messages&quot;: [
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Write a poem about spring&quot;
        }
    ],
    &quot;stream&quot;: true
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
Complete Example
```
from zai import ZaiClient

# Initialize client
client = ZaiClient(api_key=&#x27;Your API Key&#x27;)

# Create streaming message request
response = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Write a poem about spring&quot;}
    ],
    stream=True  # Enable streaming output
)

# Process streaming response
full_content = &quot;&quot;
for chunk in response:
    if not chunk.choices:
        continue
    
    delta = chunk.choices[0].delta
    
    # Handle incremental content
    if hasattr(delta, &#x27;content&#x27;) and delta.content:
        full_content += delta.content
        print(delta.content, end=&quot;&quot;, flush=True)
    
    # Check if completed
    if chunk.choices[0].finish_reason:
        print(f&quot;\n\nCompletion reason: {chunk.choices[0].finish_reason}&quot;)
        if hasattr(chunk, &#x27;usage&#x27;) and chunk.usage:
            print(f&quot;Token usage: Input {chunk.usage.prompt_tokens}, Output {chunk.usage.completion_tokens}&quot;)

print(f&quot;\n\nComplete content:\n{full_content}&quot;)

```

# [​](#response-example)Response Example

The streaming response format is as follows:

```
data: {&quot;id&quot;:&quot;1&quot;,&quot;created&quot;:1677652288,&quot;model&quot;:&quot;glm-5&quot;,&quot;choices&quot;:[{&quot;index&quot;:0,&quot;delta&quot;:{&quot;content&quot;:&quot;Spring&quot;},&quot;finish_reason&quot;:null}]}

data: {&quot;id&quot;:&quot;1&quot;,&quot;created&quot;:1677652288,&quot;model&quot;:&quot;glm-5&quot;,&quot;choices&quot;:[{&quot;index&quot;:0,&quot;delta&quot;:{&quot;content&quot;:&quot; comes&quot;},&quot;finish_reason&quot;:null}]}

data: {&quot;id&quot;:&quot;1&quot;,&quot;created&quot;:1677652288,&quot;model&quot;:&quot;glm-5&quot;,&quot;choices&quot;:[{&quot;index&quot;:0,&quot;delta&quot;:{&quot;content&quot;:&quot; with&quot;},&quot;finish_reason&quot;:null}]}

...

data: {&quot;id&quot;:&quot;1&quot;,&quot;created&quot;:1677652288,&quot;model&quot;:&quot;glm-5&quot;,&quot;choices&quot;:[{&quot;index&quot;:0,&quot;finish_reason&quot;:&quot;stop&quot;,&quot;delta&quot;:{&quot;role&quot;:&quot;assistant&quot;,&quot;content&quot;:&quot;&quot;}}],&quot;usage&quot;:{&quot;prompt_tokens&quot;:8,&quot;completion_tokens&quot;:262,&quot;total_tokens&quot;:270,&quot;prompt_tokens_details&quot;:{&quot;cached_tokens&quot;:0}}}

data: [DONE]

```

# [​](#application-scenarios)Application Scenarios

# Chat Applications

* Real-time conversation experience

* Character-by-character reply display

* Reduced waiting time

# Content Generation

* Article writing assistant

* Code generation tools

* Creative content creation

# Educational Applications

* Online Q&A systems

* Learning assistance tools

* Knowledge Q&A platforms

# Customer Service Systems

* Intelligent customer service bots

* Real-time problem solving

* User support systems

Was this page helpful?

YesNo[Deep Thinking](/guides/capabilities/thinking)[Tool Streaming Output](/guides/capabilities/stream-tool)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
