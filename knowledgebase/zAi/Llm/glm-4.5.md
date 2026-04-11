# GLM-4.5 - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/llm/glm-4.5

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationLanguage ModelsGLM-4.5[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   GLM-4.5 Serials](#glm-4-5-serials)
* [GLM-4.5](#glm-4-5)
* [GLM-4.5-Air](#glm-4-5-air)
* [GLM-4.5-X](#glm-4-5-x)
* [GLM-4.5-AirX](#glm-4-5-airx)
* [GLM-4.5-Flash](#glm-4-5-flash)
* [   Capability](#capability)
* [   Introducing GLM-4.5](#introducing-glm-4-5)
* [Overview](#overview-2)
* [Higher Parameter Efficiency](#higher-parameter-efficiency)
* [Low Cost, High Speed](#low-cost-high-speed)
* [Real-World Evaluation](#real-world-evaluation)
* [   Usage](#usage)
* [   Resources](#resources)
* [    Quick Start](#quick-start)
* [Thinking Mode](#thinking-mode)
* [Samples Code](#samples-code)
Language Models
# GLM-4.5
Copy pageCopy page
# [​](#overview)   Overview

GLM-4.5 and GLM-4.5-Air are Z.AI’s models, purpose-built as foundational models for agent-oriented applications. Both leverage a Mixture-of-Experts (MoE) architecture. GLM-4.5 has a total parameter count of 355B with 32B active parameters per forward pass, while GLM-4.5-Air adopts a more streamlined design with 106B total parameters and 12B active parameters.
Both models share a similar training pipeline: an initial pretraining phase on 15 trillion tokens of general-domain data, followed by targeted fine-tuning on datasets covering code, reasoning, and agent-specific tasks. The context length has been extended to 128k tokens, and reinforcement learning was applied to further enhance reasoning, coding, and agent performance.
GLM-4.5 and GLM-4.5-Air are optimized for tool invocation, web browsing, software engineering, and front-end development. They can be integrated into code-centric agents such as Claude Code and Roo Code, and also support arbitrary agent applications through tool invocation APIs.
Both models support hybrid reasoning modes, offering two execution modes: Thinking Mode for complex reasoning and tool usage, and Non-Thinking Mode for instant responses. These modes can be toggled via the thinking.typeparameter (with enabled and disabled settings), and dynamic thinking is enabled by default.

# Input Modalities
Text
# Output Modalitie
Text
# Context Length
128K
# Maximum Output Tokens
96K

# [​](#glm-4-5-serials)   GLM-4.5 Serials

# 
GLM
# [​](#glm-4-5)GLM-4.5
Our most powerful reasoning model, with 355 billion parameters

# 
AIR
# [​](#glm-4-5-air)GLM-4.5-Air
Cost-Effective  Lightweight  Strong Performance

# 
X
# [​](#glm-4-5-x)GLM-4.5-X
High Performance  Strong Reasoning  Ultra-Fast Response

# 
AirX
# [​](#glm-4-5-airx)GLM-4.5-AirX
Lightweight  Strong Performance  Ultra-Fast Response

# 
FLASH
# [​](#glm-4-5-flash)GLM-4.5-Flash
Free  Strong Performance  Excellent for Reasoning  Coding & Agents

# [​](#capability)   Capability

# Deep Thinking
Enable deep thinking mode for more advanced reasoning and analysis
# Streaming Output
Support real-time streaming responses to enhance user interaction experience
# Function Call
Powerful tool invocation capabilities, enabling integration with various external toolsets
# Context Caching
Intelligent caching mechanism to optimize performance in long conversations
# Structured Output
Support for structured output formats like JSON, facilitating system integration

# [​](#introducing-glm-4-5)   Introducing GLM-4.5

# [​](#overview-2)Overview

The first-principle measure of AGI lies in integrating more general intelligence capabilities without compromising existing functions. GLM-4.5 represents our first complete realization of this concept. It combines advanced reasoning, coding, and agent capabilities within a single model, achieving a significant technological breakthrough by natively fusing reasoning, coding, and agent abilities to meet the complex demands of agent-based applications.
To comprehensively evaluate the model’s general intelligence, we selected 12 of the most representative benchmark suites, including MMLU Pro, AIME24, MATH 500, SciCode, GPQA, HLE, LiveCodeBench, SWE-Bench, Terminal-bench, TAU-Bench, BFCL v3, and BrowseComp. Based on the aggregated average scores, GLM-4.5 ranks second globally among all models, first among domestic models, and first among open-source models.

# [​](#higher-parameter-efficiency)Higher Parameter Efficiency

GLM-4.5 has half the number of parameters of DeepSeek-R1 and one-third that of Kimi-K2, yet it outperforms them on multiple standard benchmark tests. This is attributed to the higher parameter efficiency of GLM architecture. Notably, GLM-4.5-Air, with 106 billion total parameters and 12 billion active parameters, achieves a significant breakthrough—surpassing models such as Gemini 2.5 Flash, Qwen3-235B, and Claude 4 Opus on reasoning benchmarks like Artificial Analysis, ranking among the top three domestic models in performance.
On charts such as SWE-Bench Verified, the GLM-4.5 series lies on the Pareto frontier for performance-to-parameter ratio, demonstrating that at the same scale, the GLM-4.5 series delivers optimal performance.

# [​](#low-cost-high-speed)Low Cost, High Speed

Beyond performance optimization, the GLM-4.5 series also achieves breakthroughs in cost and efficiency, resulting in pricing far lower than mainstream models: API call costs are as low as $0.2 per million input tokens and $1.1 per million output tokens.
At the same time, the high-speed version demonstrates a generation speed exceeding 100 tokens per second in real-world tests, supporting low-latency and high-concurrency deployment scenarios—balancing cost-effectiveness with user interaction experience.

# [​](#real-world-evaluation)Real-World Evaluation

Real-world performance matters more than leaderboard rankings. To evaluate GLM-4.5’s effectiveness in practical Agent Coding scenarios, we integrated it into Claude Code and benchmarked it against Claude 4 Sonnet, Kimi-K2, and Qwen3-Coder.
The evaluation consisted of 52 programming and development tasks spanning six major domains, executed in isolated container environments with multi-turn interaction tests.
As shown in the results (below), GLM-4.5 demonstrates a strong competitive advantage over other open-source models, particularly in tool invocation reliability and task completion rate. While there remains room for improvement compared to Claude 4 Sonnet, GLM-4.5 delivers a largely comparable experience in most scenarios.
To ensure transparency, we have released all [52 test problems along with full agent trajectories](https://huggingface.co/datasets/zai-org/CC-Bench-trajectories) for industry validation and reproducibility.

# [​](#usage)   Usage

*  Web Development
*  AI Assistant
*  Smart Office
*  Intelligent Question Answering
*  Complex Text Translation
*  Content Creation
*  Virtual Characters
Core Capability: Coding Skills → Intelligent code generation | Real-time code completion | Automated bug fixing
* Supports major languages including Python, JavaScript, and Java.

* Generates well-structured, scalable, high-quality code based on natural language instructions.

* Focuses on real-world development needs, avoiding templated or generic outputs.

Use Case: Complete refactoring-level tasks within 1 hour; generate full product prototypes in 5 minutes.Core Capabilities: Agent Abilities → Autonomous task planning | Multi-tool orchestration | Dynamic environment interaction
* Automatically decomposes complex tasks into clear, executable step-by-step plans.

* Flexibly invokes development tools to complete coding, debugging, and validation in a one-stop workflow.

* Dynamically adjusts strategies based on real-time feedback, quickly adapting to task changes and continuously optimizing execution paths.

Use Case: In multi-module collaborative development projects, delivery cycles were shortened by 40%, and manpower investment was reduced by approximately 30%.Core Capability: PPT Creation → Clear logic | Complete content | Effective visual presentation
* Content Expansion by Theme: Generates multi-slide PPT content from a single title or central concept.

* Logical Structure Organization: Automatically segments content into introduction, body, and conclusion modules with well-organized semantic flow.

* Slide Layout Suggestions: Works with template systems to recommend optimal presentation styles for the generated content.

Use Case: Suitable for office automation platforms, AI presentation tools, and other productivity-focused products.Core Capability: Model reasoning power → Precise instruction parsing | Multi-turn logical reasoning | Domain knowledge integration
* Deep Natural Language Understanding – Accurately interprets natural language instructions, extracts key intents, and converts them into executable tasks.

* Complex Multi-Turn Reasoning – Supports multi-step logical reasoning chains, efficiently handling composite problems involving cross-step dependencies and multiple variables.

* Domain Knowledge Fusion – Integrates domain-specific expertise with contextual information to enhance reasoning accuracy and output stability.

Use Case: In complex business workflows, accuracy improves by 60%, and reasoning efficiency improves by 70%.Core Capabilities: Translation Proficiency → Strong contextual consistency | Accurate style preservation | Excellent handling of long passages
* Long, Complex Sentence Translation: Maintains semantic coherence and structural accuracy, ideal for policy and academic materials.

* Style Retention and Adaptation: Preserves the original tone or adapts to the target language’s commonly used expression style during translation.

* Support for Low-Resource Languages and Informal Contexts: Preliminary coverage of 26 languages, with capabilities to translate social and informal texts.

Use Cases: Suitable for publishing house translations, content localization for overseas markets, cross-border customer service, and social media platforms.Core Capability: Creative Writing → Natural expression | Rich emotion | Complete structure
* Generates coherent literary texts with clear narrative flow based on given themes, characters, or worldviews.

* Produces emotionally engaging copy tailored to audience profiles and product characteristics.

* Supports short videos and new media scripts aligned with platforms like Douyin and Xiaohongshu, integrating emotion control and narrative pacing.

Use Case: Ideal for deployment in content creation platforms, marketing toolchains, or AI writing assistants to enhance content production efficiency and personalization.Core Capability: Humanized Expression → Natural tone | Accurate emotional conveyance | Consistent character behavior
* Role-Playing Dialogue System: Maintains consistent tone and behavior of the designated character across multi-turn conversations.

* Emotionally Rich Copywriting: Delivers warm, relatable expressions suitable for building “humanized” brands or companion-style user products.

* Virtual Persona Content Creation: Supports generation of content aligned with virtual streamers or character IPs, including social posts and fan interactions.

Use Case: Ideal for virtual humans, social AI, and brand personification operations.

# [​](#resources)   Resources

* [API Documentation](/api-reference/llm/chat-completion): Learn how to call the API.

# [​](#quick-start)    Quick Start

# [​](#thinking-mode)Thinking Mode

GLM-4.5 offers a “Deep Thinking Mode” that users can enable or disable by setting the thinking.type parameter. This parameter supports two values: enabled (enabled) and disabled (disabled). By default, dynamic thinking is enabled.

Simple Tasks (No Thinking Required): For straightforward requests that do not require complex reasoning (e.g., fact retrieval or classification), thinking is unnecessary. Examples include:

* When was Z.AI founded?

* Translate the sentence “I love you” into Chinese.

Moderate Tasks (Default/Some Thinking Required): Many common requests require stepwise processing or deeper understanding. The GLM-4.5 series can flexibly apply thinking capabilities to handle tasks such as:

* Why does Jupiter have more moons than Saturn, despite Saturn being larger?

* Compare the advantages and disadvantages of flying versus taking the high-speed train from Beijing to Shanghai.

Difficult Tasks (Maximum Thinking Capacity): For truly complex challenges—such as solving advanced math problems, network-related questions, or coding issues—these tasks require the model to fully engage its reasoning and planning abilities, often involving many internal steps before arriving at an answer. Examples include:

* Explain in detail how different experts in a Mixture-of-Experts (MoE) model collaborate.

* Based on the recent week’s fluctuations of the Shanghai Composite Index and current political information, should I invest in a stock index ETF? Why?

# [​](#samples-code)Samples Code

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
    &quot;model&quot;: &quot;glm-4.5&quot;,
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
    &quot;temperature&quot;: 0.6
  }&#x27;

```
Streaming Call
```
curl -X POST &quot;https://api.z.ai/api/paas/v4/chat/completions&quot; \
  -H &quot;Content-Type: application/json&quot; \
  -H &quot;Authorization: Bearer your-api-key&quot; \
  -d &#x27;{
    &quot;model&quot;: &quot;glm-4.5&quot;,
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
    &quot;temperature&quot;: 0.6
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
    model=&quot;glm-4.5&quot;,
    messages=[
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;As a marketing expert, please create an attractive slogan for my product.&quot;},
        {&quot;role&quot;: &quot;assistant&quot;, &quot;content&quot;: &quot;Sure, to craft a compelling slogan, please tell me more about your product.&quot;},
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Z.AI Open Platform&quot;}
    ],
    thinking={
        &quot;type&quot;: &quot;enabled&quot;,
    },
    max_tokens=4096,
    temperature=0.6
)

# Get complete response
print(response.choices[0].message)

```
Streaming Call
```
from zai import ZaiClient

client = ZaiClient(api_key=&quot;your-api-key&quot;)  # Your API Key

response = client.chat.completions.create(
    model=&quot;glm-4.5&quot;,
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
            .model(&quot;glm-4.5&quot;)
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
            .temperature(0.6f)
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
            .model(&quot;glm-4.5&quot;)
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
            .temperature(0.6f)
            .build();

        ChatCompletionResponse response = client.chat().createChatCompletion(request);

        if (response.isSuccess()) {
            response.getFlowable().subscribe(
                // Process streaming message data
                data -> {
                    if (data.getChoices() != null && !data.getChoices().isEmpty()) {
                        Delta delta = data.getChoices().get(0).getDelta();
                        System.out.print(delta + &quot;\n&quot;);
                    }},
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
    model=&quot;glm-4.5&quot;,
    messages=[
        {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a smart and creative novelist&quot;},
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Please write a short fairy tale story as a fairy tale master&quot;}
    ]
)

print(completion.choices[0].message.content)

```
Was this page helpful?

YesNo[GLM-4.6](/guides/llm/glm-4.6)[GLM-4-32B-0414-128K](/guides/llm/glm-4-32b-0414-128k)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
