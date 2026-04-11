# GLM-4.6 - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/llm/glm-4.6

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationLanguage ModelsGLM-4.6[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Introducing GLM-4.6](#introducing-glm-4-6)
* [1. Comprehensive Evaluation](#1-comprehensive-evaluation)
* [2. Real-World Coding Evaluation](#2-real-world-coding-evaluation)
* [   Usage](#usage)
* [   Resources](#resources)
* [    Quick Start](#quick-start)
Language Models
# GLM-4.6
Copy pageCopy page
# [​](#overview)   Overview

GLM-4.6 achieves comprehensive enhancements across multiple domains, including real-world coding, long-context processing, reasoning, searching, writing, and agentic applications. Details are as follows:

* Longer context window: The context window has been expanded from 128K to 200K tokens, enabling the model to handle more complex agentic tasks.

* Superior coding performance: The model achieves higher scores on code benchmarks and demonstrates better real-world performance in applications such as Claude Code、Cline、Roo Code and Kilo Code, including improvements in generating visually polished front-end pages.

* Advanced reasoning: GLM-4.6 shows a clear improvement in reasoning performance and supports tool use during inference, leading to stronger overall capability.

* More capable agents: GLM-4.6 exhibits stronger performance in tool use and search-based agents, and integrates more effectively within agent frameworks.

* Refined writing: Better aligns with human preferences in style and readability, and performs more naturally in role-playing scenarios.

# Input Modalities
Text
# Output Modalitie
Text
# Context Length
200K
# Maximum Output Tokens
128K

# [​](#introducing-glm-4-6)   Introducing GLM-4.6

# [​](#1-comprehensive-evaluation)1. Comprehensive Evaluation

In evaluations across 8 authoritative benchmarks for general model capabilities—including AIME 25, GPQA, LCB v6, HLE, and SWE-Bench Verified—GLM-4.6 achieves performance on par with Claude Sonnet 4/Claude Sonnet 4.6 on several leaderboards, solidifying its position as the top model developed in China. 

# [​](#2-real-world-coding-evaluation)2. Real-World Coding Evaluation

To better test the model’s capabilities in practical coding tasks, we conducted 74 real-world coding tests within the Claude Code environment. The results show that GLM-4.6 surpasses Claude Sonnet 4 and other domestic models in these real-world tests. 
In terms of average token consumption, GLM-4.6 is over 30% more efficient than GLM-4.5, achieving the lowest consumption rate among comparable models. 
To ensure transparency and credibility, Z.ai has publicly released all test questions and agent trajectories for verification and reproduction. (Link: [https://huggingface.co/datasets/zai-org/CC-Bench-trajectories](https://huggingface.co/datasets/zai-org/CC-Bench-trajectories)).

# [​](#usage)   Usage

AI Coding

Supports mainstream languages including Python, JavaScript, and Java, delivering superior aesthetics and logical layout in frontend code. Natively handles diverse agent tasks with enhanced autonomous planning and tool invocation capabilities. Excels in task decomposition, cross-tool collaboration, and dynamic adjustments, enabling flexible adaptation to complex development or office workflows.Smart Office

Significantly enhances presentation quality in PowerPoint creation and office automation scenarios. Generates aesthetically advanced layouts with clear logical structures while preserving content integrity and expression accuracy, making it ideal for office automation systems and AI presentation tools.Translation and Cross-Language Applications

Translation quality for minor languages (French, Russian, Japanese, Korean) and informal contexts has been further optimized, making it particularly suitable for social media, e-commerce content, and short drama translations. It maintains semantic coherence and stylistic consistency in lengthy passages while achieving superior style adaptation and localized expression, meeting the diverse needs of global enterprises and cross-border services.Content Creation

Supports diverse content production including novels, scripts, and copywriting, achieving more natural expression through contextual expansion and emotional regulation.Virtual Characters

Maintains consistent tone and behavior across multi-turn conversations, ideal for virtual humans, social AI, and brand personification operations, making interactions warmer and more authentic.Intelligent Search & Deep Research

Enhances user intent understanding, tool retrieval, and result integration. Not only does it return more precise search results, but it also deeply synthesizes outcomes to support Deep Research scenarios, delivering more insightful answers to users.

# [​](#resources)   Resources

* [API Documentation](/api-reference/llm/chat-completion): Learn how to call the API.

# [​](#quick-start)    Quick Start

The following is a full sample code to help you onboard GLM-4.6 with ease.
*  cURL
*  Official Python SDK
*  Official Java SDK
*  OpenAI Python SDK
Basic Call
```
curl -X POST &quot;https://api.z.ai/api/paas/v4/chat/completions&quot; \
  -H &quot;Content-Type: application/json&quot; \
  -H &quot;Authorization: Bearer your-api-key&quot; \
  -d &#x27;{
    &quot;model&quot;: &quot;glm-4.6&quot;,
    &quot;messages&quot;: [
      {
        &quot;role&quot;: &quot;user&quot;,
        &quot;content&quot;: &quot;As a marketing expert, please create an attractive slogan for my product.&quot;
      },
      {
        &quot;role&quot;: &quot;assistant&quot;,
        &quot;content&quot;: &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;
      },
      {
        &quot;role&quot;: &quot;user&quot;,
        &quot;content&quot;: &quot;Z.AI Open Platform&quot;
      }
    ],
    &quot;thinking&quot;: {
      &quot;type&quot;: &quot;enabled&quot;
    },
    &quot;max_tokens&quot;: 4096,
    &quot;temperature&quot;: 1.0
  }&#x27;

```
Streaming Call
```
curl -X POST &quot;https://api.z.ai/api/paas/v4/chat/completions&quot; \
  -H &quot;Content-Type: application/json&quot; \
  -H &quot;Authorization: Bearer your-api-key&quot; \
  -d &#x27;{
    &quot;model&quot;: &quot;glm-4.6&quot;,
    &quot;messages&quot;: [
      {
        &quot;role&quot;: &quot;user&quot;,
        &quot;content&quot;: &quot;As a marketing expert, please create an attractive slogan for my product.&quot;
      },
      {
        &quot;role&quot;: &quot;assistant&quot;,
        &quot;content&quot;: &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;
      },
      {
        &quot;role&quot;: &quot;user&quot;,
        &quot;content&quot;: &quot;Z.AI Open Platform&quot;
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
Basic Call
```
from zai import ZaiClient

client = ZaiClient(api_key=&quot;your-api-key&quot;)  # Your API Key

response = client.chat.completions.create(
    model=&quot;glm-4.6&quot;,
    messages=[
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;As a marketing expert, please create an attractive slogan for my product.&quot;},
        {&quot;role&quot;: &quot;assistant&quot;, &quot;content&quot;: &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;},
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Z.AI Open Platform&quot;}
    ],
    thinking={
        &quot;type&quot;: &quot;enabled&quot;,
    },
    max_tokens=4096,
    temperature=1.0
)

# Get complete response
print(response.choices[0].message)

```
Streaming Call
```
from zai import ZaiClient

client = ZaiClient(api_key=&quot;your-api-key&quot;)  # Your API Key

response = client.chat.completions.create(
    model=&quot;glm-4.6&quot;,
    messages=[
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;As a marketing expert, please create an attractive slogan for my product.&quot;},
        {&quot;role&quot;: &quot;assistant&quot;, &quot;content&quot;: &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;},
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Z.AI Open Platform&quot;}
    ],
    thinking={
        &quot;type&quot;: &quot;enabled&quot;,    # Optional: &quot;disabled&quot; or &quot;enabled&quot;, default is &quot;enabled&quot;
    },
    stream=True,
    max_tokens=4096,
    temperature=0.6
)

# Stream response
for chunk in response:
    if chunk.choices[0].delta.reasoning_content:
        print(chunk.choices[0].delta.reasoning_content, end=&#x27;&#x27;, flush=True)

    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end=&#x27;&#x27;, flush=True)

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
Basic Call
```
import ai.z.openapi.ZaiClient;
import ai.z.openapi.service.model.ChatCompletionCreateParams;
import ai.z.openapi.service.model.ChatCompletionResponse;
import ai.z.openapi.service.model.ChatMessage;
import ai.z.openapi.service.model.ChatMessageRole;
import ai.z.openapi.service.model.ChatThinking;
import java.util.Arrays;

public class BasicChat {
    public static void main(String[] args) {
        // Initialize client
        ZaiClient client = ZaiClient.builder().ofZAI()
            .apiKey(&quot;your-api-key&quot;)
            .build();

        // Create chat completion request
        ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
            .model(&quot;glm-4.6&quot;)
            .messages(Arrays.asList(
                ChatMessage.builder()
                    .role(ChatMessageRole.USER.value())
                    .content(&quot;As a marketing expert, please create an attractive slogan for my product.&quot;)
                    .build(),
                ChatMessage.builder()
                    .role(ChatMessageRole.ASSISTANT.value())
                    .content(&quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;)
                    .build(),
                ChatMessage.builder()
                    .role(ChatMessageRole.USER.value())
                    .content(&quot;Z.AI Open Platform&quot;)
                    .build()
            ))
            .thinking(ChatThinking.builder().type(&quot;enabled&quot;).build())
            .maxTokens(4096)
            .temperature(1.0f)
            .build();

        // Send request
        ChatCompletionResponse response = client.chat().createChatCompletion(request);

        // Get response
        if (response.isSuccess()) {
            Object reply = response.getData().getChoices().get(0).getMessage();
            System.out.println(&quot;AI Response: &quot; + reply);
        } else {
            System.err.println(&quot;Error: &quot; + response.getMsg());
        }
    }
}

```
Streaming Call
```
import ai.z.openapi.ZaiClient;
import ai.z.openapi.service.model.ChatCompletionCreateParams;
import ai.z.openapi.service.model.ChatCompletionResponse;
import ai.z.openapi.service.model.ChatMessage;
import ai.z.openapi.service.model.ChatMessageRole;
import ai.z.openapi.service.model.ChatThinking;
import ai.z.openapi.service.model.Delta;
import java.util.Arrays;

public class StreamingChat {
    public static void main(String[] args) {
        // Initialize client
        ZaiClient client = ZaiClient.builder().ofZAI()
            .apiKey(&quot;your-api-key&quot;)
            .build();

        // Create streaming chat completion request
        ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
            .model(&quot;glm-4.6&quot;)
            .messages(Arrays.asList(
                ChatMessage.builder()
                    .role(ChatMessageRole.USER.value())
                    .content(&quot;As a marketing expert, please create an attractive slogan for my product.&quot;)
                    .build(),
                ChatMessage.builder()
                    .role(ChatMessageRole.ASSISTANT.value())
                    .content(&quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;)
                    .build(),
                ChatMessage.builder()
                    .role(ChatMessageRole.USER.value())
                    .content(&quot;Z.AI Open Platform&quot;)
                    .build()
            ))
            .thinking(ChatThinking.builder().type(&quot;enabled&quot;).build())
            .stream(true)  // Enable streaming output
            .maxTokens(4096)
            .temperature(1.0f)
            .build();

        ChatCompletionResponse response = client.chat().createChatCompletion(request);

        if (response.isSuccess()) {
            response.getFlowable().subscribe(
                // Process streaming message data
                data -> {
                    if (data.getChoices() != null && !data.getChoices().isEmpty()) {
                        Delta delta = data.getChoices().get(0).getDelta();
                        System.out.print(delta + &quot;\n&quot;);
                    }
                },
                // Process streaming response error
                error -> System.err.println(&quot;\nStream error: &quot; + error.getMessage()),
                // Process streaming response completion event
                () -> System.out.println(&quot;\nStreaming response completed&quot;)
            );
        } else {
            System.err.println(&quot;Error: &quot; + response.getMsg());
        }
    }
}

```
Install SDK
```
# Install or upgrade to latest version
pip install --upgrade &#x27;openai>=1.0&#x27;

```
Verify Installation
```
python -c &quot;import openai; print(openai.__version__)&quot;

```
Usage Example
```
from openai import OpenAI

client = OpenAI(
    api_key=&quot;your-Z.AI-api-key&quot;,
    base_url=&quot;https://api.z.ai/api/paas/v4/&quot;
)

completion = client.chat.completions.create(
    model=&quot;glm-4.6&quot;,
    messages=[
        {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a smart and creative novelist&quot;},
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Please write a short fairy tale story as a fairy tale master&quot;}
    ]
)

print(completion.choices[0].message.content)

```
Was this page helpful?

YesNo[GLM-4.7](/guides/llm/glm-4.7)[GLM-4.5](/guides/llm/glm-4.5)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
