# GLM-4.7 - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/llm/glm-4.7

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationLanguage ModelsGLM-4.7[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Introducing GLM-4.7](#introducing-glm-4-7)
* [Comprehensive Coding Capability Enhancement](#comprehensive-coding-capability-enhancement)
* [GLM-4.7-Flash: Small but Powerful](#glm-4-7-flash-small-but-powerful)
* [Perceived Improvement in Real Programming Scenarios](#perceived-improvement-in-real-programming-scenarios)
* [   Resources](#resources)
* [    Quick Start](#quick-start)
Language Models
# GLM-4.7
Copy pageCopy pageTired of limits? Get premium performance at a fraction of the cost, fully compatible with top coding tools like Claude Code and Cline. Starting from just $10/month. [Try it now →](https://z.ai/subscribe?utm_campaign=Platform_Ops&_channel_track_key=DaprgHIc)

# [​](#overview)   Overview

GLM-4.7 Series are Z.AI’s models, featuring upgrades in two key areas: enhanced programming capabilities and more stable multi-step reasoning/execution. It demonstrates significant improvements in executing complex agent tasks while delivering more natural conversational experiences and superior front-end aesthetics.
*  GLM-4.7
*  GLM-4.7-FlashX
*  GLM-4.7-Flash

# Input Modalities
Text
# Output Modalitie
Text
# Context Length
200K
# Maximum Output Tokens
128K
# Positioning
Lightweight, High-Speed,and Affordable
# Input Modalities
Text
# Output Modalitie
Text
# Context Length
200K
# Maximum Output Tokens
128K
# Positioning
Lightweight, Completely Free
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

GLM-4.7 focuses on “task completion” rather than single-point code generation. It autonomously accomplishes requirement comprehension, solution decomposition, and multi-technology stack integration starting from target descriptions. In complex scenarios involving frontend-backend coordination, real-time interaction, and peripheral device calls, it directly generates structurally complete, executable code frameworks. This significantly reduces manual assembly and iterative debugging costs, making it ideal for complex demos, prototype validation, and automated development workflows.Multimodal Interaction and Real-Time Application Development

In scenarios requiring cameras, real-time input, and interactive controls, GLM-4.7 demonstrates superior system-level comprehension. It integrates visual recognition, logic control, and application code into unified solutions, enabling rapid construction of interactive applications like gesture control and real-time feedback. This accelerates the journey from concept to operational application.Web UI Generation and Visual Aesthetic Optimization

Significantly enhanced understanding of visual code and UI specifications. GLM-4.7 provides more aesthetically pleasing and consistent default solutions for layout structures, color harmony, and component styling, reducing time spent on repetitive “fine-tuning” of styles. It is well-suited for low-code platforms, AI frontend generation tools, and rapid prototyping scenarios.High-Quality Dialogue and Complex Problem Collaboration

Maintains context and constraints more reliably during multi-turn conversations. Responds more directly to simple queries while continuously clarifying objectives and advancing resolution paths for complex issues. GLM-4.7 functions as a collaborative “problem-solving partner,” ideal for high-frequency collaboration scenarios like development support, solution discussions, and decision-making assistance.Immersive Writing & Character-Driven Creation

Delivers more nuanced, vividly descriptive prose that builds atmosphere through sensory details like scent, sound, and light. In role-playing and narrative creation, it maintains consistent adherence to world-building and character archetypes, advancing plots with natural tension. Ideal for interactive storytelling, IP content creation, and character-based applications.Professional-Grade PPT/Poster Generation

In office creation, GLM-4.7 demonstrates significantly enhanced layout consistency and aesthetic stability. It reliably adapts to mainstream aspect ratios like 16:9, minimizes template-like elements in typography hierarchy, white space, and color schemes, and produces near-ready-to-use results. This makes it ideal for AI presentation tools, enterprise office systems, and automated content generation scenarios.Intelligent Search and Deep Research

Enhanced capabilities in user intent understanding, information retrieval, and result integration. For complex queries and research tasks, GLM-4.7 not only returns information but also performs structured organization and cross-source consolidation. Through multi-round interactions, it progressively narrows in on core conclusions, making it suitable for in-depth research and decision-support scenarios.

# [​](#introducing-glm-4-7)   Introducing GLM-4.7

1[](#comprehensive-coding-capability-enhancement)
# Comprehensive Coding Capability Enhancement
GLM-4.7 achieves significant breakthroughs across three dimensions: programming, reasoning, and agent capabilities:
* Enhanced Programming Capabilities: Substantially improves model performance in multi-language coding and terminal agent applications; GLM-4.7 now implements a “think before acting” mechanism within programming frameworks like Claude Code, Kilo Code, TRAE, Cline, and Roo Code, delivering more stable performance on complex tasks.

* Enhanced Frontend Aesthetics: GLM-4.7 shows marked progress in frontend generation quality, producing visually superior webpages, PPTs, and posters.

* Enhanced Tool Invocation Capabilities: GLM-4.7 demonstrates improved tool invocation skills, scoring 67 points on the BrowseComp web task evaluation and achieving an open-source SOTA of 84.7 points on the τ²-Bench interactive tool invocation benchmark, surpassing Claude Sonnet 4.5

* Enhanced reasoning capabilities: Significantly improved mathematical and reasoning skills, achieving 42.8% on the HLE (“Human Last Exam”) benchmark—a 41% increase over GLM-4.6 and surpassing GPT-5.1

* Enhanced General Capabilities: GLM-4.7 delivers more concise, intelligent, and empathetic conversations, with more eloquent and immersive writing and role-playing

 Code Arena: A professional coding evaluation system with millions of global users participating in blind tests. GLM-4.7 ranks first among open-source models and domestic models, outperforming GPT-5.2In mainstream benchmark performance, GLM-4.7’s coding capabilities align with Claude Sonnet 4.5: Achieved top open-source ranking on SWE-bench-Verified; Reached an open-source SOTA score of 84.9 on LiveCodeBench V6, surpassing Claude Sonnet 4.5; Achieved 73.8% on SWE-bench Verified (a 5.8% improvement over GLM-4.6), 66.7% on SWE-bench Multilingual (a 12.9% improvement), and 41% on Terminal Bench 2.0 (a 16.5% improvement).2[](#glm-4-7-flash-small-but-powerful)
# GLM-4.7-Flash: Small but Powerful
In mainstream benchmarks like SWE-bench Verified and τ²-Bench, GLM-4.7-Flash achieves open-source SOTA scores among models of comparable size. Additionally, compared to similarly sized models, GLM-4.7-Flash demonstrates superior frontend and backend development capabilities.In internal programming tests, GLM-4.7-Flash excels at both frontend and backend tasks. Beyond programming scenarios, we also recommend experiencing GLM-4.7-Flash in general-purpose applications such as Chinese writing, translation, long-form text processing, and emotional/role-playing interactions.3[](#perceived-improvement-in-real-programming-scenarios)
# Perceived Improvement in Real Programming Scenarios
*  Performance on Real Programming Tasks
*  Controlled Evolution of Reasoning Capabilities
*  Comprehensive Task Execution Capabilities
*  Frontend Aesthetic Enhancement
In the Claude Code environment, we tested 100 real programming tasks covering core capabilities like frontend, backend, and instruction following. Results show GLM-4.7 demonstrates significant improvements over GLM-4.6 in both stability and deliverability.  With enhanced programming capabilities, developers can more naturally organize their development workflow around “task delivery,” forming an end-to-end closed loop from requirement understanding to implementation.GLM-4.7 further enhances the interleaved reasoning capabilities introduced in GLM-4.5 by introducing retained reasoning and round-based reasoning, making complex task execution more stable and controllable.
* Interleaved Reasoning: Performs reasoning before each response/tool invocation, improving compliance with complex instructions and code generation quality.

* Retention-Based Reasoning: Automatically preserves reasoning blocks across multi-turn dialogues, improving cache hit rates and reducing computational costs—ideal for long-term complex tasks.

* Round-Level Reasoning: Enables round-based control of reasoning overhead within a single session—disable reasoning for simple tasks to reduce latency, or enable it for complex tasks to boost accuracy and stability.

[_Related Documentation: https://docs.z.ai/guides/capabilities/thinking-mode](https://docs.z.ai/guides/capabilities/thinking-mode)GLM-4.7 demonstrates superior task decomposition and technology stack integration in complex tasks, delivering complete, executable code in a single step while clearly identifying critical dependencies and execution steps, significantly reducing manual debugging costs.Case studies showcase highly interactive mini-games independently developed by GLM-4.7, such as Plants vs. Zombies and Fruit Ninja.GLM-4.7 enhances its comprehension of visual code. In frontend design, it better interprets UI design specifications, offering more aesthetically pleasing default solutions for layout structures, color harmony, and component styling. This reduces the time developers spend on style “fine-tuning.”GLM-4.7 delivers significant upgrades in layout and aesthetics for office creation. PPT 16:9 compatibility soars from 52% to 91%, with generated results being essentially “ready to use.” Poster design now features more flexible typography and color schemes, exuding a stronger sense of design.

# [​](#resources)   Resources

* [API Documentation](/api-reference/llm/chat-completion): Learn how to call the API.

# [​](#quick-start)    Quick Start

The following is a full sample code to help you onboard GLM-4.7 with ease.
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
    &quot;model&quot;: &quot;glm-4.7&quot;,
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
    &quot;model&quot;: &quot;glm-4.7&quot;,
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
    model=&quot;glm-4.7&quot;,
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
    model=&quot;glm-4.7&quot;,
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
                        .model(&quot;glm-4.7&quot;)
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
                        .model(&quot;glm-4.7&quot;)
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
    model=&quot;glm-4.7&quot;,
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

YesNo[GLM-5-Turbo](/guides/llm/glm-5-turbo)[GLM-4.6](/guides/llm/glm-4.6)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
