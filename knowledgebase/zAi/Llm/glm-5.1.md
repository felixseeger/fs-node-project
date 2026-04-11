# GLM-5.1 - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/llm/glm-5.1

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationLanguage ModelsGLM-5.1[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Usage](#usage)
* [   Introducing GLM-5.1](#introducing-glm-5-1)
* [General and Coding Capability: Aligned with the Global Frontier](#general-and-coding-capability-aligned-with-the-global-frontier)
* [Long-Horizon Task Capability: Toward 8-Hour Sustained Execution](#long-horizon-task-capability-toward-8-hour-sustained-execution)
* [Engineering Delivery: From Code Generation Toward Autonomous Agent](#engineering-delivery-from-code-generation-toward-autonomous-agent)
* [   Resources](#resources)
* [    Quick Start](#quick-start)
Language Models
# GLM-5.1
Copy pageCopy page
# [​](#overview)   Overview

GLM-5.1 is Z.AI’s latest flagship model, designed for long-horizon tasks. It can work continuously and autonomously on a single task for up to 8 hours, completing the full loop from planning and execution to iterative optimization and delivering production-grade results.

In both general capability and coding performance, GLM-5.1 is overall aligned with Claude Opus 4.6. It demonstrates stronger sustained execution in long-horizon autonomous tasks, complex engineering optimization, and real-world development workflows, making it an ideal foundation for building autonomous agents and long-horizon coding agents.

# Positioning
Flagship Foundation Model
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
Flexibly integrate external MCP tools and data sources to expand application scenarios

# [​](#usage)   Usage

Agentic Coding

Further optimized for agentic coding workflows such as Claude Code and OpenClaw, GLM-5.1 offers stronger long-horizon planning, stepwise execution, process adjustment, and result delivery. It performs significantly better on long-running development tasks and complex coding problems, making it well suited for real-world engineering work with multiple stages and strong interdependencies.General Conversation

More robust in open-ended Q&A, complex instruction following, and multi-turn interactions, with richer responses, more complete content, stronger instruction adherence, and better long-context understanding. It is well suited for high-quality everyday assistance and complex information workflows.Creative Writing

Further improved in literary expression, plot development, character portrayal, and style control, making it suitable for fiction excerpts, story concepts, and copywriting tasks that require strong expressiveness and consistency.Artifacts / Front-End Development

Well suited for website generation, interactive pages, and front-end prototyping. Outputs show less templated structure, more diverse visual expression, and higher overall task completion quality, enabling a faster path from requirements to usable deliverables.Office Productivity

Broadly improved across PowerPoint, Word, PDF, and Excel tasks, with stronger capabilities in complex content organization, layout design, and structured output. Default visual quality and overall polish are significantly improved, making it suitable for high-intensity production scenarios such as long-form documents, reports, teaching materials, and research papers.

# [​](#introducing-glm-5-1)   Introducing GLM-5.1

1[](#general-and-coding-capability-aligned-with-the-global-frontier)
# General and Coding Capability: Aligned with the Global Frontier
GLM-5.1 ranks among the world’s top-tier models in both overall capability and coding performance, with overall performance aligned with Claude Opus 4.6 and leading results across multiple key benchmarks.On SWE-Bench Pro, GLM-5.1 achieves a score of 58.4, outperforming GPT-5.4, Claude Opus 4.6, and Gemini 3.1 Pro, setting a new state-of-the-art result. At the same time, across 12 representative benchmarks covering reasoning, coding, agents, tool use, and browsing, GLM-5.1 demonstrates a broad and well-balanced capability profile.This shows that GLM-5.1 is not a single-metric improvement. Instead, it advances simultaneously across general intelligence, real-world coding, and complex task execution, making it a stronger foundation for general-purpose agent systems and engineering production scenarios.2[](#long-horizon-task-capability-toward-8-hour-sustained-execution)
# Long-Horizon Task Capability: Toward 8-Hour Sustained Execution
GLM-5.1 shows especially strong gains on long-horizon tasks, with major improvements in sustained execution, closed-loop optimization, and engineering delivery under complex objectives. Compared with models primarily designed for minute-level interactions, GLM-5.1 can work autonomously on a single task for up to 8 hours, completing the full process from planning and execution to testing, fixing, and delivery.Under the same evaluation standard, GLM-5.1 is one of the few models capable of 8-hour sustained execution, and the first Chinese model to reach this level. The way we evaluate model capability is shifting from “how smart it is in a single turn” to “how long it can work reliably on a long-horizon task, and what it can actually deliver.”This capability is not simply about having a longer context window. It requires the model to maintain goal alignment over extended execution, reducing strategy drift, error accumulation, and ineffective trial and error, and enabling truly autonomous execution for complex engineering tasks.3[](#engineering-delivery-from-code-generation-toward-autonomous-agent)
# Engineering Delivery: From Code Generation Toward Autonomous Agent
One of GLM-5.1’s key breakthroughs is its ability to form an autonomous “experiment–analyze–optimize” loop in long-horizon tasks, rather than stopping at one-shot code generation. The model can proactively run benchmarks, identify bottlenecks, adjust strategies, and continuously improve results through iterative refinement.In representative cases, GLM-5.1 can build a complete Linux desktop system from scratch within 8 hours. It can autonomously carry out 655 iterations, completing the entire optimization pipeline and boosting vector database query throughput to 6.9× that of the initial production version. On the KernelBench Level 3 optimization benchmark, it performs thousands of tool-invocation-driven optimizations on real machine learning workloads, achieving a 3.6× geometric mean speedup—significantly surpassing the 1.49× achieved by torch.compile in max-autotune mode.These results show that GLM-5.1 is already capable of autonomous exploration, continuous improvement, and stable delivery in complex engineering environments, enabling it to take on higher-value tasks such as system building, performance optimization, and long-horizon coding agents.

# [​](#resources)   Resources

* [API Documentation](/api-reference/llm/chat-completion): Learn how to call the API.

# [​](#quick-start)    Quick Start

The following is a full sample code to help you onboard GLM-5.1 with ease.
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
    &quot;model&quot;: &quot;glm-5.1&quot;,
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
    &quot;model&quot;: &quot;glm-5.1&quot;,
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
    model=&quot;glm-5.1&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;As a marketing expert, please create an attractive slogan for my product.&quot;,
        },
        {
            &quot;role&quot;: &quot;assistant&quot;,
            &quot;content&quot;: &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;,
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Z.AI Open Platform&quot;
        },
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
    model=&quot;glm-5.1&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;As a marketing expert, please create an attractive slogan for my product.&quot;,
        },
        {
            &quot;role&quot;: &quot;assistant&quot;,
            &quot;content&quot;: &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;,
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Z.AI Open Platform&quot;
        },
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
        ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
            .model(&quot;glm-5.1&quot;)
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
        ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
            .model(&quot;glm-5.1&quot;)
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
model=&quot;glm-5.1&quot;,
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

YesNo[Migrate to GLM-5.1](/guides/overview/migrate-to-glm-new)[GLM-5](/guides/llm/glm-5)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
