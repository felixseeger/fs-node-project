# GLM-5-Turbo - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/llm/glm-5-turbo

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationLanguage ModelsGLM-5-Turbo[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Capability](#capability)
* [   Introducing GLM-5-Turbo](#introducing-glm-5-turbo)
* [OpenClaw Native Model](#openclaw-native-model)
* [ZClawBench: A Benchmark for the OpenClaw Agent Scenario](#zclawbench-a-benchmark-for-the-openclaw-agent-scenario)
* [   Resources](#resources)
* [    Quick Start](#quick-start)
Language Models
# GLM-5-Turbo
Copy pageCopy page
# [​](#overview)   Overview

GLM-5-Turbo is a foundation model deeply optimized for the OpenClaw scenario. It has been specifically optimized for the core requirements of OpenClaw tasks since the training phase, enhancing key capabilities such as tool invocation, command following, timed and persistent tasks, and long-chain execution.

# Positioning
ClawBench Enhanced Model
# Input Modalities
Text
# Output Modalitie
Text
# Context Length
200K
# Maximum Output Tokens
128K

# [​](#capability)   Capability

# Thinking Mode
Offering multiple thinking modes for different scenarios
# Streaming Output
Support real-time streaming responses to enhance user interaction experience
# Function Call
Powerful tool invocation capabilities, enabling integration with various external toolsets
# Context Caching
Intelligent caching mechanism to optimize performance in long conversations
# Structured Output
Support for structured output formats like JSON, facilitating system integration
# MCP
Flexibly integrate external MCP tools and data sources to expand use cases

# [​](#introducing-glm-5-turbo)   Introducing GLM-5-Turbo

1[](#openclaw-native-model)
# OpenClaw Native Model
From training data construction to the design of optimization objectives, we have systematically constructed a variety of OpenClaw tasks scenarios based on real-world agent workflows, ensuring that the model is truly capable of executing complex, dynamic, and long-chain tasks. We have significantly enhanced the following core capabilities:

Tool Calling—Precise Invocation, No Failures: GLM-5-Turbo has strengthened its ability to invoke external tools and various skills, ensuring greater stability and reliability in multi-step tasks, thereby enabling OpenClaw tasks to transition from dialogue to execution.

Instruction Following—Enhanced Decomposition of Complex Instructions: The model demonstrates stronger comprehension and decomposition capabilities for complex, multi-layered, and long-chain instructions. It can accurately identify objectives, plan steps, and support collaborative task division among multiple agents.

Scheduled and Persistent Tasks — Better Understanding of Time Dimensions, Uninterrupted Long Tasks: Significantly optimized for scenarios involving scheduled triggers, continuous execution, and long-running tasks. It better understands time-related requirements and maintains execution continuity during complex, long-running tasks.

High-Throughput Long Chains — Faster and More Stable Execution: For Lobster tasks involving high data throughput and long logical chains, GLM-5-Turbo further enhances execution efficiency and response stability, making it better suited for integration into real-world business workflows.

2[](#zclawbench-a-benchmark-for-the-openclaw-agent-scenario)
# ZClawBench: A Benchmark for the OpenClaw Agent Scenario
With the growing adoption of OpenClaw, evaluating model performance in Openclaw workflows has become a key focus across the industry. Based on extensive analysis of real OpenClaw use cases, we introduce ZClawBench, an end-to-end benchmark designed specifically for agent tasks in the OpenClaw ecosystem.Current OpenClaw workloads span a wide range of task types, including environment setup, software development, information retrieval, data analysis, and content creation. The user base has also expanded beyond early developer adopters to include productivity users, financial professionals, operations engineers, content creators, and research analysts. Meanwhile, the usage of Skills has increased rapidly—from 26% to 45% in a short period of time—highlighting a clear shift toward a more modular and skill-driven agent ecosystem.Benchmark results show that GLM-5-Turbo delivers substantial improvements over GLM-5 in OpenClaw scenarios, outperforming several leading models across multiple key task categories.The ZClawBench dataset and full evaluation trajectories are now publicly available. We welcome the community to validate, reproduce, and further improve the benchmark.

# [​](#resources)   Resources

* [API Documentation](/api-reference/llm/chat-completion): Learn how to call the API.

* [OpenClaw Guide](/devpack/tool/openclaw#switching-to-glm-5-turbo-model): Learn how to integrate with OpenClaw.

# [​](#quick-start)    Quick Start

The following is a full sample code to help you onboard GLM-5-Turbo with ease.
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
        &quot;model&quot;: &quot;glm-5-turbo&quot;,
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
        &quot;model&quot;: &quot;glm-5-turbo&quot;,
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
    model=&quot;glm-5-turbo&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;As a marketing expert, please create an attractive slogan for my product.&quot;,
        },
        {
            &quot;role&quot;: &quot;assistant&quot;,
            &quot;content&quot;: &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;,
        },
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Z.AI Open Platform&quot;},
    ],
    thinking={
        &quot;type&quot;: &quot;enabled&quot;,
    },
    max_tokens=4096,
    temperature=1.0,
)

# Get complete response
print(response.choices[0].message)

```
Streaming Call
```
from zai import ZaiClient

client = ZaiClient(api_key=&quot;your-api-key&quot;)  # Your API Key

response = client.chat.completions.create(
model=&quot;glm-5-turbo&quot;,
messages=[
    {
        &quot;role&quot;: &quot;user&quot;,
        &quot;content&quot;: &quot;As a marketing expert, please create an attractive slogan for my product.&quot;,
    },
    {
        &quot;role&quot;: &quot;assistant&quot;,
        &quot;content&quot;: &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;,
    },
    {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Z.AI Open Platform&quot;},
    ],
    thinking={
        &quot;type&quot;: &quot;enabled&quot;,  # Optional: &quot;disabled&quot; or &quot;enabled&quot;, default is &quot;enabled&quot;
    },
    stream=True,
    max_tokens=4096,
    temperature=0.6,
)

# Stream response
for chunk in response:
    if chunk.choices[0].delta.reasoning_content:
        print(chunk.choices[0].delta.reasoning_content, end=&quot;&quot;, flush=True)

    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end=&quot;&quot;, flush=True)

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
        ZaiClient client = ZaiClient.builder().ofZAI().apiKey(&quot;your-api-key&quot;).build();

        // Create chat completion request
        ChatCompletionCreateParams request =
            ChatCompletionCreateParams.builder()
                .model(&quot;glm-5-turbo&quot;)
                .messages(
                    Arrays.asList(
                        ChatMessage.builder()
                            .role(ChatMessageRole.USER.value())
                                .content(
                                    &quot;As a marketing expert, please create an attractive slogan for my product.&quot;)
                                .build(),
                        ChatMessage.builder()
                            .role(ChatMessageRole.ASSISTANT.value())
                                .content(
                                    &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;)
                                .build(),
                        ChatMessage.builder()
                            .role(ChatMessageRole.USER.value())
                                .content(&quot;Z.AI Open Platform&quot;)
                                .build()))
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
        ZaiClient client = ZaiClient.builder().ofZAI().apiKey(&quot;your-api-key&quot;).build();

        // Create streaming chat completion request
        ChatCompletionCreateParams request =
            ChatCompletionCreateParams.builder()
                .model(&quot;glm-5-turbo&quot;)
                .messages(
                    Arrays.asList(
                        ChatMessage.builder()
                            .role(ChatMessageRole.USER.value())
                            .content(
                                &quot;As a marketing expert, please create an attractive slogan for my product.&quot;)
                            .build(),
                        ChatMessage.builder()
                            .role(ChatMessageRole.ASSISTANT.value())
                            .content(
                                &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;)
                            .build(),
                        ChatMessage.builder()
                            .role(ChatMessageRole.USER.value())
                            .content(&quot;Z.AI Open Platform&quot;)
                            .build()))
                .thinking(ChatThinking.builder().type(&quot;enabled&quot;).build())
                .stream(true) // Enable streaming output
                .maxTokens(4096)
                .temperature(1.0f)
                .build();

            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            if (response.isSuccess()) {
                response.getFlowable()
                    .subscribe(
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
                () -> System.out.println(&quot;\nStreaming response completed&quot;));
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
    base_url=&quot;https://api.z.ai/api/paas/v4/&quot;,
)

completion = client.chat.completions.create(
    model=&quot;glm-5-turbo&quot;,
    messages=[
        {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a smart and creative novelist&quot;},
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Please write a short fairy tale story as a fairy tale master&quot;,
        },
    ],
)

print(completion.choices[0].message.content)

```
Was this page helpful?

YesNo[GLM-5](/guides/llm/glm-5)[GLM-4.7](/guides/llm/glm-4.7)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
