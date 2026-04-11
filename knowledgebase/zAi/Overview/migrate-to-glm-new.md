# Migrate to GLM-5.1 - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/overview/migrate-to-glm-new

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationGet StartedMigrate to GLM-5.1[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
On this page* [GLM-5.1 Features](#glm-5-1-features)
* [Migration Checklist](#migration-checklist)
* [Start Migration](#start-migration)
* [1. Update Model Identifier](#1-update-model-identifier)
* [2. Update Sampling Parameters](#2-update-sampling-parameters)
* [3. Deep Thinking (Optional)](#3-deep-thinking-optional)
* [4. Streaming Output and Tool Calls (Optional)](#4-streaming-output-and-tool-calls-optional)
* [5. Testing and Regression](#5-testing-and-regression)
* [More Resources](#more-resources)
Get Started
# Migrate to GLM-5.1
Copy pageCopy pageThis guide explains how to migrate your calls from GLM-5.1 GLM-5 GLM-4.7 or other earlier models to Z.AI GLM-5.1, our most powerful coding model to date, covering sampling parameter differences, streaming tool calls, and other key points.

# [​](#glm-5-1-features)GLM-5.1 Features

* Support for larger context and output: Maximum context 200K, maximum output 128K.

* New support for streaming output during tool calling process (tool_stream=true), real-time retrieval of tool call parameters.

* Same as GLM-5 series, supports deep thinking (thinking={ type: &quot;enabled&quot; }), when enabled will think compulsorily.

* Superior code performance and advanced reasoning capabilities.

# [​](#migration-checklist)Migration Checklist

*  Update model identifier to glm-5.1

*  Sampling parameters: temperature default value 1.0, top_p default value 0.95, recommend choosing only one for tuning

*  Deep thinking: Enabled or disable thinking={ type: &quot;enabled&quot; } as needed for complex reasoning/coding

*  Streaming response: Enable stream=true and properly handle delta.reasoning_content and delta.content

*  Streaming tool calls: Enable stream=true and tool_stream=true and stream-concatenate delta.tool_calls[*].function.arguments

*  Maximum output and context: Set max_tokens appropriately (GLM-5.1 maximum output 128K, context 200K)

*  Prompt optimization: Work with deep thinking, use clearer instructions and constraints

*  Development environment verification: Conduct use case testing and regression, focus on randomness, latency, parameter completeness in tool streams

# [​](#start-migration)Start Migration

# [​](#1-update-model-identifier)1. Update Model Identifier

* Update model to glm-5.1.

```
resp = client.chat.completions.create(
    model=&quot;glm-5.1&quot;,
    messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Briefly describe the advantages of GLM-5&quot;}]
)

```

# [​](#2-update-sampling-parameters)2. Update Sampling Parameters

* temperature: Controls randomness; higher values are more divergent, lower values are more stable.

* top_p: Controls nucleus sampling; higher values expand candidate set, lower values converge candidate set.

* temperature defaults to 1.0, top_p defaults to 0.95, not recommended to adjust both simultaneously.

```
# Plan A: Use temperature (recommended)
resp = client.chat.completions.create(
    model=&quot;glm-5.1&quot;,
    messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Write a more creative brand introduction&quot;}],
    temperature=1.0
)

# Plan B: Use top_p
resp = client.chat.completions.create(
    model=&quot;glm-5.1&quot;,
    messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Generate more stable technical documentation&quot;}],
    top_p=0.8
)

```

# [​](#3-deep-thinking-optional)3. Deep Thinking (Optional)

* GLM-5.1 continues to support deep thinking capability, enabled by default.

* Recommended to enable for complex reasoning and coding tasks:

```
resp = client.chat.completions.create(
    model=&quot;glm-5.1&quot;,
    messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Design a three-tier microservice architecture for me&quot;}],
    thinking={&quot;type&quot;: &quot;enabled&quot;}
)

```

# [​](#4-streaming-output-and-tool-calls-optional)4. Streaming Output and Tool Calls (Optional)

GLM-5 supports real-time streaming construction and output during tool calling process, disabled by default (False), requires enabling both:

* stream=True: Enable streaming output for responses

* tool_stream=True: Enable streaming output for tool call parameters

```
response = client.chat.completions.create(
    model=&quot;glm-5.1&quot;,
    messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;How&#x27;s the weather in Beijing&quot;}],
    tools=[
        {
            &quot;type&quot;: &quot;function&quot;,
            &quot;function&quot;: {
                &quot;name&quot;: &quot;get_weather&quot;,
                &quot;description&quot;: &quot;Get current weather conditions for a specified location&quot;,
                &quot;parameters&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;properties&quot;: {
                        &quot;location&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;description&quot;: &quot;City, eg: Beijing, Shanghai&quot;},
                        &quot;unit&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;enum&quot;: [&quot;celsius&quot;, &quot;fahrenheit&quot;]}
                    },
                    &quot;required&quot;: [&quot;location&quot;]
                }
            }
        }
    ],
    stream=True,
    tool_stream=True,
)

# Initialize streaming collection variables
reasoning_content = &quot;&quot;
content = &quot;&quot;
final_tool_calls = {}
reasoning_started = False
content_started = False

# Process streaming response
for chunk in response:
    if not chunk.choices:
        continue

    delta = chunk.choices[0].delta

    # Streaming reasoning process output
    if hasattr(delta, &#x27;reasoning_content&#x27;) and delta.reasoning_content:
        if not reasoning_started and delta.reasoning_content.strip():
            print(&quot;\n🧠 Thinking Process:&quot;)
            reasoning_started = True
        reasoning_content += delta.reasoning_content
        print(delta.reasoning_content, end=&quot;&quot;, flush=True)

    # Streaming answer content output
    if hasattr(delta, &#x27;content&#x27;) and delta.content:
        if not content_started and delta.content.strip():
            print(&quot;\n\n💬 Answer Content:&quot;)
            content_started = True
        content += delta.content
        print(delta.content, end=&quot;&quot;, flush=True)

    # Streaming tool call information (parameter concatenation)
    if delta.tool_calls:
        for tool_call in delta.tool_calls:
            idx = tool_call.index
            if idx not in final_tool_calls:
                final_tool_calls[idx] = tool_call
                final_tool_calls[idx].function.arguments = tool_call.function.arguments
            else:
                final_tool_calls[idx].function.arguments += tool_call.function.arguments

# Output final tool call information
if final_tool_calls:
    print(&quot;\n📋 Function Calls Triggered:&quot;)
    for idx, tool_call in final_tool_calls.items():
        print(f&quot;  {idx}: Function Name: {tool_call.function.name}, Parameters: {tool_call.function.arguments}&quot;)

```

See: [Tool Streaming Output Documentation](/guides/tools/stream-tool)

# [​](#5-testing-and-regression)5. Testing and Regression

First verify in development environment that post-migration calls are stable, focus on:

* Whether responses meet expectations, whether there’s excessive randomness or excessive conservatism in output

* Whether tool streaming construction and output work normally

* Latency and cost in long context and deep thinking scenarios

# [​](#more-resources)More Resources

# Concept Parameters
Common model parameter concepts and sampling recommendations
# Tool Streaming Output
View tool streaming output usage details
# API Reference
View complete API documentation
# Technical Support
Get technical support and helpWas this page helpful?

YesNo[LangChain Integration](/guides/develop/langchain/introduction)[GLM-5.1](/guides/llm/glm-5.1)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
