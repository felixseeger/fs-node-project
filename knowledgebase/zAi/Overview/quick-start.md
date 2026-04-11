# Quick Start - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/overview/quick-start

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationGet StartedQuick Start[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
On this page* [Getting Started](#getting-started)
* [Get More](#get-more)
Get Started
# Quick Start
Copy pageCopy pageTired of limits? GLM Coding Plan — monthly access to world-class models, compatible with top coding tools like Claude Code and Cline. All from just $10/month. [Try it now →](https://z.ai/subscribe?utm_campaign=Platform_Ops&_channel_track_key=DaprgHIc)

# [​](#getting-started)Getting Started

1[](#)Get API Key

Access [Z.AI Open Platform](https://z.ai/model-api), Register or Login.

Access [Billing Page](https://z.ai/manage-apikey/billing) to top up if needed.

Create an API Key in the [API Keys](https://z.ai/manage-apikey/apikey-list) management page.

Copy your API Key for use.

# Z.AI Open Platform
Access [Z.AI Open Platform](https://z.ai/model-api), Register or Login.
# API Keys Management
Create an API Key in the [API Keys](https://z.ai/manage-apikey/apikey-list) management page.

2[](#)Choose Model

The platform offers multiple models, and you can select the appropriate model based on your needs. For detailed model introductions, please refer to the [Models & Agents](pricing).

# GLM-5.1
Zai’s new-generation flagship foundation model, targeting Agentic Engineering, enables a paradigm shift from code to engineering.
# GLM-5V-Turbo
Multimodal Coding model, specializing in visual programming.
# GLM-Image
Supports text-to-image generation, achieving open-source state-of-the-art (SOTA) in complex scenarios
# CogVideoX-3
New frame generation capabilities that significantly improve image stability and clarity3[](#)Choose the Calling Method

Our platform provides various development approaches; you can select the best fit for your project needs and tech stack.
# HTTP API
Standard RESTful API, compatible with all programming languages.
# Z.AI Python SDK
Official Python SDK, featuring full type hints and async support.
# Z.AI Java SDK
Official Java SDK, designed for high concurrency and availability.
# OpenAI Python SDK
OpenAI SDK Compatibility, quickly migrating from OpenAI.
# API Reference
Complete API documentation with parameter descriptions.4[](#)Make API Call

After preparing your API Key and selecting a model, you can start making API calls. Here are examples using curl, Python SDK, and Java SDK:*  cURL
*  Official Python SDK
*  Official Java SDK
*  OpenAI Python SDK
*  OpenAI NodeJs SDK
*  OpenAI Java SDK
Note: When using the [GLM Coding Plan](/devpack/overview), you need to configure the dedicated 

Coding endpoint - [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4) 

instead of the general endpoint - [https://api.z.ai/api/paas/v4](https://api.z.ai/api/paas/v4) 

Note: The Coding API endpoint is only for Coding scenarios and is not applicable to general API scenarios. Please use them accordingly.
```
curl -X POST &quot;https://api.z.ai/api/paas/v4/chat/completions&quot; \
-H &quot;Content-Type: application/json&quot; \
-H &quot;Accept-Language: en-US,en&quot; \
-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \
-d &#x27;{
    &quot;model&quot;: &quot;glm-5.1&quot;,
    &quot;messages&quot;: [
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: &quot;You are a helpful AI assistant.&quot;
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Hello, please introduce yourself.&quot;
        }
    ]
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
Usage Example
```
from zai import ZaiClient

# Initialize client
client = ZaiClient(api_key=&quot;YOUR_API_KEY&quot;)

# Create chat completion request
response = client.chat.completions.create(
    model=&quot;glm-5.1&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: &quot;You are a helpful AI assistant.&quot;
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Hello, please introduce yourself.&quot;
        }
    ]
)

# Get response
print(response.choices[0].message.content)

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
Usage Example
```
import ai.z.openapi.ZaiClient;
import ai.z.openapi.service.model.*;
import java.util.Arrays;

public class QuickStart {
    public static void main(String[] args) {
        // Initialize client
        ZaiClient client = ZaiClient.builder().ofZAI()
            .apiKey(&quot;YOUR_API_KEY&quot;)
            .build();

        // Create chat completion request
        ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
            .model(&quot;glm-5.1&quot;)
            .messages(Arrays.asList(
                ChatMessage.builder()
                    .role(ChatMessageRole.USER.value())
                    .content(&quot;Hello, who are you?&quot;)
                    .build()
            ))
            .stream(false)
            .build();

        // Send request
        ChatCompletionResponse response = client.chat().createChatCompletion(request);

        // Get response
        System.out.println(response.getData().getChoices().get(0).getMessage().getContent());
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
    model=&quot;glm-5.1&quot;,
    messages=[
        {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a smart and creative novelist&quot;},
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Please write a short fairy tale story as a fairy tale master&quot;}
    ]
)

print(completion.choices[0].message.content)

```
Install SDK
```
# Install or upgrade to latest version
npm install openai

# Or using yarn
yarn add openai

```
Usage Example
```
import OpenAI from &quot;openai&quot;;

const client = new OpenAI({
    apiKey: &quot;your-Z.AI-api-key&quot;,
    baseURL: &quot;https://api.z.ai/api/paas/v4/&quot;
});

async function main() {
    const completion = await client.chat.completions.create({
        model: &quot;glm-5.1&quot;,
        messages: [
            { role: &quot;system&quot;, content: &quot;You are a helpful AI assistant.&quot; },
            { role: &quot;user&quot;, content: &quot;Hello, please introduce yourself.&quot; }
        ]
    });

    console.log(completion.choices[0].message.content);
}

main();

```
Install SDKMaven
```
<dependency>
    <groupId>com.openai</groupId>
    <artifactId>openai-java</artifactId>
    <version>2.20.1</version>
</dependency>

```
Gradle (Groovy)
```
implementation &#x27;com.openai:openai-java:2.20.1&#x27;

```
Usage Example
```
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

public class QuickStart {
    public static void main(String[] args) {
        // Initialize client
        OpenAIClient client = OpenAIOkHttpClient.builder()
            .apiKey(&quot;your-Z.AI-api-key&quot;)
            .baseUrl(&quot;https://api.z.ai/api/paas/v4/&quot;)
            .build();

        // Create chat completion request
        ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
            .addSystemMessage(&quot;You are a helpful AI assistant.&quot;)
            .addUserMessage(&quot;Hello, please introduce yourself.&quot;)
            .model(&quot;glm-5.1&quot;)
            .build();

        // Send request and get response
        ChatCompletion chatCompletion = client.chat().completions().create(params);
        Object response = chatCompletion.choices().get(0).message().content();

        System.out.println(response);
    }
}

```

# [​](#get-more)Get More

# API Reference
Access API Reference.
# Python SDK
Access Python SDK Github
# Java SDK
Access Java SDK GithubWas this page helpful?

YesNo[Overview](/guides/overview/overview)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
