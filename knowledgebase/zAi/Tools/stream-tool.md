# Stream Tool Call - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/tools/stream-tool

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationToolsStream Tool Call[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [Response Parameter Description](#response-parameter-description)
* [Code Example](#code-example)
* [Use Cases](#use-cases)
Tools
# Stream Tool Call
Copy pageCopy pageStream Tool Call is a unique feature of Z.ai’s latest GLM-4.6 model, allowing real-time access to reasoning processes, response content, and tool call information during tool invocation, providing better user experience and real-time feedback.

# [​](#features)Features

Tool calling in the latest GLM model now supports streaming output for responses. This allows developers to stream tool usage parameters without buffering or JSON validation when calling chat.completions, thereby reducing call latency and providing a better user experience.

# [​](#core-parameter-description)Core Parameter Description

* stream=True: Enable streaming output, must be set to True

* tool_stream=True: Enable tool call streaming output

* model: Use a model that supports tool calling, limited to glm-4.6 glm-4.7 glm-5

# [​](#response-parameter-description)Response Parameter Description

The delta object in streaming responses contains the following fields:

* reasoning_content: Text content of the model’s reasoning process

* content: Text content of the model’s response

* tool_calls: Tool call information, including function names and parameters

# [​](#code-example)Code Example

By setting the tool_stream=True parameter, you can enable streaming tool call functionality:
*  Python SDK
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
client = ZaiClient(api_key=&#x27;Your API key&#x27;)

# Create streaming tool call request
response = client.chat.completions.create(
    model=&quot;glm-4.6&quot;,  # Use model that supports tool calling
    messages=[
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;How&#x27;s the weather in Beijing?&quot;},
    ],
    tools=[
        {
            &quot;type&quot;: &quot;function&quot;,
            &quot;function&quot;: {
                &quot;name&quot;: &quot;get_weather&quot;,
                &quot;description&quot;: &quot;Get current weather conditions for a specified location&quot;,
                &quot;parameters&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;properties&quot;: {
                        &quot;location&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;description&quot;: &quot;City, e.g.: Beijing, Shanghai&quot;},
                        &quot;unit&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;enum&quot;: [&quot;celsius&quot;, &quot;fahrenheit&quot;]}
                    },
                    &quot;required&quot;: [&quot;location&quot;]
                }
            }
        }
    ],
    stream=True,        # Enable streaming output
    tool_stream=True    # Enable tool call streaming output
)

# Initialize variables to collect streaming data
reasoning_content = &quot;&quot;      # Reasoning process content
content = &quot;&quot;               # Response content
final_tool_calls = {}      # Tool call information
reasoning_started = False  # Reasoning process start flag
content_started = False    # Content output start flag

# Process streaming response
for chunk in response:
    if not chunk.choices:
        continue

    delta = chunk.choices[0].delta

    # Handle streaming reasoning process output
    if hasattr(delta, &#x27;reasoning_content&#x27;) and delta.reasoning_content:
        if not reasoning_started and delta.reasoning_content.strip():
            print(&quot;\n🧠 Thinking Process:&quot;)
            reasoning_started = True
        reasoning_content += delta.reasoning_content
        print(delta.reasoning_content, end=&quot;&quot;, flush=True)

    # Handle streaming response content output
    if hasattr(delta, &#x27;content&#x27;) and delta.content:
        if not content_started and delta.content.strip():
            print(&quot;\n\n💬 Response Content:&quot;)
            content_started = True
        content += delta.content
        print(delta.content, end=&quot;&quot;, flush=True)

    # Handle streaming tool call information
    if delta.tool_calls:
        for tool_call in delta.tool_calls:
            index = tool_call.index
            if index not in final_tool_calls:
                # New tool call
                final_tool_calls[index] = tool_call
                final_tool_calls[index].function.arguments = tool_call.function.arguments
            else:
                # Append tool call parameters (streaming construction)
                final_tool_calls[index].function.arguments += tool_call.function.arguments

# Output final tool call information
if final_tool_calls:
    print(&quot;\n📋 Function Calls Triggered:&quot;)
    for index, tool_call in final_tool_calls.items():
        print(f&quot;  {index}: Function Name: {tool_call.function.name}, Parameters: {tool_call.function.arguments}&quot;)

```

# [​](#use-cases)Use Cases

# Intelligent Customer Service System

* Real-time display of query progress

* Improve waiting experience

# Code Assistant

* Real-time code analysis process

* Display tool call chain

Was this page helpful?

YesNo[Web Search](/guides/tools/web-search)[GLM Slide/Poster Agent(beta)](/guides/agents/slide)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
