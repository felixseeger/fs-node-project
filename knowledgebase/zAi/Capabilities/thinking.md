# Deep Thinking - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/capabilities/thinking

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationCapabilitiesDeep Thinking[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [Core Parameters](#core-parameters)
* [Code Examples](#code-examples)
* [Response Example](#response-example)
* [Best Practices](#best-practices)
* [Application scenarios](#application-scenarios)
* [Notes](#notes)
Capabilities
# Deep Thinking
Copy pageCopy pageDeep Thinking is an advanced reasoning feature that enables Chain of Thought mechanisms, allowing the model to perform deep analysis and reasoning before answering questions. This approach significantly improves the model’s accuracy and interpretability in complex tasks, particularly suitable for scenarios requiring multi-step reasoning, logical analysis, and problem-solving.

# [​](#features)Features

The Deep Thinking feature currently supports the latest models in the GLM-5 GLM-4.5 GLM-4.6 GLM-4.7 series. By enabling deep thinking, the model can:

* Multi-step Reasoning: Break down complex problems into multiple steps for gradual analysis and resolution

* Logical Analysis: Provide clear reasoning processes and logical chains

* Improved Accuracy: Reduce errors and improve answer quality through deep thinking

* Enhanced Interpretability: Display the thinking process to help users understand the model’s reasoning logic

* Intelligent Judgment: The model automatically determines whether deep thinking is needed to optimize response efficiency

# [​](#core-parameters)Core Parameters

thinking.type: Controls the deep thinking mode

* enabled (default): Enable dynamic thinking, model automatically determines if deep thinking is needed

* disabled: Disable deep thinking, provide direct answers

* model: Models that support deep thinking, such as glm-5, glm-4.7, glm-4.6, glm-4.5, glm-4.5v, etc.

# [​](#code-examples)Code Examples

*  cURL
*  Python SDK
Basic Call (Enable Deep Thinking)
```
curl --location &#x27;https://api.z.ai/api/paas/v4/chat/completions&#x27; \
--header &#x27;Authorization: Bearer YOUR_API_KEY&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data &#x27;{
    &quot;model&quot;: &quot;glm-5&quot;,
    &quot;messages&quot;: [
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Explain in detail the basic principles of quantum computing and analyze its potential impact in the field of cryptography&quot;
        }
    ],
    &quot;thinking&quot;: {
        &quot;type&quot;: &quot;enabled&quot;
    },
    &quot;max_tokens&quot;: 4096,
    &quot;temperature&quot;: 1.0
}&#x27;

```
Streaming Call (Deep Thinking + Streaming Output)
```
curl --location &#x27;https://api.z.ai/api/paas/v4/chat/completions&#x27; \
--header &#x27;Authorization: Bearer YOUR_API_KEY&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data &#x27;{
    &quot;model&quot;: &quot;glm-5&quot;,
    &quot;messages&quot;: [
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Design a recommendation system architecture for an e-commerce website, considering user behavior, product features, and real-time requirements&quot;
        }
    ],
    &quot;thinking&quot;: {
        &quot;type&quot;: &quot;enabled&quot;
    },
    &quot;stream&quot;: true,
    &quot;max_tokens&quot;: 4096,
    &quot;temperature&quot;: 1.0
}&#x27;

```
Disable Deep Thinking
```
curl --location &#x27;https://api.z.ai/api/paas/v4/chat/completions&#x27; \
--header &#x27;Authorization: Bearer YOUR_API_KEY&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data &#x27;{
    &quot;model&quot;: &quot;glm-5&quot;,
    &quot;messages&quot;: [
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;How is the weather today?&quot;
        }
    ],
    &quot;thinking&quot;: {
        &quot;type&quot;: &quot;disabled&quot;
    }
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
Basic Call (Enable Deep Thinking)
```
from zai import ZaiClient

# Initialize client
client = ZaiClient(api_key=&#x27;your_api_key&#x27;)

# Create deep thinking request
response = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Explain in detail the basic principles of quantum computing and analyze its potential impact in the field of cryptography&quot;}
    ],
    thinking={
        &quot;type&quot;: &quot;enabled&quot;  # Enable deep thinking mode
    },
    max_tokens=4096,
    temperature=1.0
)

print(&quot;Model response:&quot;)
print(response.choices[0].message.content)
print(&quot;\n---&quot;)
print(response.choices[0].message.reasoning_content)

```
Streaming Call (Deep Thinking + Streaming Output)
```
from zai import ZaiClient

# Initialize client
client = ZaiClient(api_key=&#x27;your_api_key&#x27;)

# Create streaming deep thinking request
response = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Design a recommendation system architecture for an e-commerce website, considering user behavior, product features, and real-time requirements&quot;}
    ],
    thinking={
        &quot;type&quot;: &quot;enabled&quot;  # Enable deep thinking mode
    },
    stream=True,  # Enable streaming output
    max_tokens=4096,
    temperature=1.0
)

# Process streaming response
reasoning_content = &quot;&quot;
thinking_phase = True

for chunk in response:
    if not chunk.choices:
        continue
    
    delta = chunk.choices[0].delta
    
    # Process thinking process (if any)
    if hasattr(delta, &#x27;reasoning_content&#x27;) and delta.reasoning_content:
        reasoning_content += delta.reasoning_content
        if thinking_phase:
            print(&quot;🧠 Thinking...&quot;, end=&quot;&quot;, flush=True)
            thinking_phase = False
        print(delta.reasoning_content, end=&quot;&quot;, flush=True)
    
    # Process answer content
    if hasattr(delta, &#x27;content&#x27;) and delta.content:
        if thinking_phase:
            print(&quot;\n\n💡 Answer:&quot;)
            thinking_phase = False
        print(delta.content, end=&quot;&quot;, flush=True)

```
Disable Deep Thinking
```
from zai import ZaiClient

# Initialize client
client = ZaiClient(api_key=&#x27;your_api_key&#x27;)

# Disable deep thinking for quick response
response = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;How is the weather today?&quot;}
    ],
    thinking={
        &quot;type&quot;: &quot;disabled&quot;  # Disable deep thinking mode
    }
)

print(response.choices[0].message.content)

```

# [​](#response-example)Response Example

Response format with deep thinking enabled:

```
{
  &quot;created&quot;: 1677652288,
  &quot;model&quot;: &quot;glm-5&quot;,
  &quot;choices&quot;: [
    {
      &quot;index&quot;: 0,
      &quot;message&quot;: {
        &quot;role&quot;: &quot;assistant&quot;,
        &quot;content&quot;: &quot;Artificial intelligence has tremendous application prospects in medical diagnosis...&quot;,
        &quot;reasoning_content&quot;: &quot;Let me analyze this question from multiple angles. First, I need to consider the technical advantages of AI in medical diagnosis...&quot;
      },
      &quot;finish_reason&quot;: &quot;stop&quot;
    }
  ],
  &quot;usage&quot;: {
    &quot;completion_tokens&quot;: 239,
    &quot;prompt_tokens&quot;: 8,
    &quot;prompt_tokens_details&quot;: {
      &quot;cached_tokens&quot;: 0
    },
    &quot;total_tokens&quot;: 247
  }
}

```

# [​](#best-practices)Best Practices

Recommended scenarios to enable:

* Complex problem analysis and solving

* Multi-step reasoning tasks

* Technical solution design

* Strategy planning and decision

* Academic research and analysis

* Creative writing and content creation

Can be disabled scenarios:

* Simple fact query

* Basic translation tasks

* Simple classification judgment

* Quick question and answer requirements

# [​](#application-scenarios)Application scenarios

# Academic Research

* Research method design

* Data analysis and explanation

* Theory deduction and proof

# Technology Consulting

* System architecture design

* Technological scheme evaluation

* Problem diagnosis and solution

# Business Analysis

* Market trends analysis

* Business model design

* Investment decision support

# Education Training

* Complex concept explanation

* Learning path planning

* Knowledge system building

# [​](#notes)Notes

* Response time：Enable deep thinking will increase response time, particularly for complex tasks

* Token consumption：Thinking process will consume extra tokens, please manage your tokens

* Model support：Ensure you’re using models that support deep thinking

* Task matching：Choose whether to enable deep thinking according to the task complexity

* Streaming output：Combine streaming output to see the thinking process, improving user experience

Was this page helpful?

YesNo[Thinking Mode](/guides/capabilities/thinking-mode)[Streaming Messages](/guides/capabilities/streaming)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
