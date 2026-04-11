# GLM-5 - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/llm/glm-5

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationLanguage ModelsGLM-5[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Introducing GLM-5](#introducing-glm-5)
* [Larger Foundation, Stronger Intelligence](#larger-foundation-stronger-intelligence)
* [Coding Performance on Par with Claude Opus 4.5](#coding-performance-on-par-with-claude-opus-4-5)
* [Agent Performance: SOTA-Level Long-Horizon Execution](#agent-performance-sota-level-long-horizon-execution)
* [   Resources](#resources)
* [    Quick Start](#quick-start)
Language Models
# GLM-5
Copy pageCopy pageTired of limits? GLM-5 access is currently available for GLM Coding Plan Pro and Max — monthly access to world-class models, compatible with top coding tools like Claude Code and Open Code. [Try it now →](https://z.ai/subscribe?utm_campaign=Platform_Ops&_channel_track_key=DaprgHIc)

# [​](#overview)   Overview

GLM-5 is Z.AI’s new-generation foundation model, designed for Agentic Engineering, capable of providing reliable productivity in complex system engineering and long-range Agent tasks. In terms of Coding and Agent capabilities, GLM-5 has achieved state-of-the-art (SOTA) performance in open source, with its usability in real programming scenarios approaching that of Claude Opus 4.5.

# Positioning
Foundation Model
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

# [​](#usage)   Usage

Agentic Coding

It can automatically generate runnable code based on natural language, covering development processes such as front-end, back-end, and data processing, significantly shortening the iteration cycle from requirements to products.Agent Task

Capable of autonomous decision-making and tool invocation, it can complete the full-process intelligent agent tasks from understanding, planning to execution and self-check under ambiguous and complex objectives, achieving “input from a single sentence to complete deliverables”.Work Scenario

With strong long-range planning and memory capabilities, it can stably complete complex work tasks that span multiple stages, involve multiple steps, and have strong logical connections, ensuring instruction compliance and goal consistency.Roleplay

It can accurately understand and consistently maintain character settings, remain consistent in narrative, emotion, and logic, and achieve a natural, evolvable, and highly immersive role-playing experience.Script / Storyboard Generation

Significantly enhanced in long text consistency and complex character development, it can stably output high-quality script content that can directly enter the production process.Translation

Capable of accurately converting formal texts into professional translations that conform to the expression habits of the target language, achieving full alignment of semantics, terminology, and expression.Text Data Extraction

It can accurately extract key fields and logical relationships from complex texts such as contracts, announcements, and financial reports, stably convert the original content into analyzable Structured Data, and contribute to enterprise data governance and automation.Information Quality Inspection

It can accurately identify key information in complex texts such as customer service tickets and automatically complete quality inspection and risk identification, significantly improving Operational Efficiency.

# [​](#introducing-glm-5)   Introducing GLM-5

1[](#larger-foundation-stronger-intelligence)
# Larger Foundation, Stronger Intelligence
The brand-new GLM-5 foundation lays a solid groundwork for the capability evolution from “writing code” to “building entire projects”:
* Expanded Parameter Scale: Increased from 355B (32B activated) to 744B (40B activated), with pre-training data upgraded from 23T to 28.5T. Larger-scale pre-training computing power has significantly improved the model’s general intelligence.

* Asynchronous Reinforcement Learning: A new “Slime” framework has been developed to support larger model scales and more complex reinforcement learning tasks, enhancing the efficiency of post-training workflows. An asynchronous agent reinforcement learning algorithm is proposed, enabling the model to continuously learn from long-range interactions and fully unlock the potential of pre-trained models.

* Sparse Attention Mechanism: DeepSeek Sparse Attention is integrated for the first time, maintaining lossless long-text performance while drastically reducing model deployment costs and improving Token Efficiency.

2[](#coding-performance-on-par-with-claude-opus-4-5)
# Coding Performance on Par with Claude Opus 4.5
GLM-5 achieves performance alignment with Claude Opus 4.5 in software engineering tasks, reaching the highest scores among open-weight models across widely recognized industry benchmarks.On SWE-bench Verified and Terminal Bench 2.0, GLM-5 records leading open-model scores of 77.8 and 56.2, respectively — surpassing Gemini 3.0 Pro in overall performance.In internal evaluations aligned with the Claude Code task distribution, GLM-5 demonstrates substantial gains over GLM-4.7 across frontend development, backend systems engineering, and long-horizon execution tasks.The model can autonomously perform agentic long-range planning, backend refactoring, and deep debugging with minimal human intervention—delivering a development experience that approaches Opus 4.5 in both reliability and execution depth.3[](#agent-performance-sota-level-long-horizon-execution)
# Agent Performance: SOTA-Level Long-Horizon Execution
GLM-5 achieves state-of-the-art performance among open-weight models in agentic capability, ranking first across multiple authoritative benchmarks. On BrowseComp (web-scale retrieval and information synthesis), MCP-Atlas (tool invocation and multi-step task execution), and τ²-Bench (complex multi-tool planning and orchestration), GLM-5 delivers top open-model results across the board.These capabilities define the core of Agentic Engineering. A capable agent must go beyond generating code or completing isolated tasks — it must sustain goal alignment over long horizons, manage intermediate resources, coordinate tool usage, and resolve multi-step dependencies without losing coherence.

# [​](#resources)   Resources

* [API Documentation](/api-reference/llm/chat-completion): Learn how to call the API.

# [​](#quick-start)    Quick Start

The following is a full sample code to help you onboard GLM-5 with ease.
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
    &quot;model&quot;: &quot;glm-5&quot;,
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
    &quot;model&quot;: &quot;glm-5&quot;,
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
    model=&quot;glm-5&quot;,
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
    model=&quot;glm-5&quot;,
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
                .model(&quot;glm-5&quot;)
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
                .model(&quot;glm-5&quot;)
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
    model=&quot;glm-5&quot;,
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

YesNo[GLM-5.1](/guides/llm/glm-5.1)[GLM-5-Turbo](/guides/llm/glm-5-turbo)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
