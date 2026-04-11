# GLM-4.5V - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/vlm/glm-4.5v

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationVision Language ModelsGLM-4.5V[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Usage](#usage)
* [   Resources](#resources)
* [   Introducing GLM-4.5V](#introducing-glm-4-5v)
* [Open-Source Multimodal SOTA](#open-source-multimodal-sota)
* [Support Thinking and Non-Thinking](#support-thinking-and-non-thinking)
* [    Examples](#examples)
* [    Quick Start](#quick-start)
Vision Language Models
# GLM-4.5V
Copy pageCopy page
# [​](#overview)   Overview

GLM-4.5V is Z.AI’s new generation of visual reasoning models based on the MOE architecture. With a total of 106B parameters and 12B activation parameters, it achieves SOTA performance among open-source VLMs of the same level in various benchmark tests, covering common tasks such as image, video, document understanding, and GUI tasks.

# Price

* Input: $0.6 per million tokens

* Output: $1.8 per million tokens

# Input Modality
Video / Image / Text / File
# Output Modality
Text
# Maximum Output Tokens
16K

# [​](#usage)   Usage

Web Page Coding

Analyze webpage screenshots or screen recording videos, understand layout and interaction logic, and generate complete and usable webpage code with one click.Grounding

Precisely identify and locate target objects, suitable for practical scenarios such as security checks, quality inspections, content reviews, and remote sensing monitoring.GUI Agent

Recognize and process screen images, support execution of commands like clicking and sliding, providing reliable support for intelligent agents to complete operational tasks.Complex Long Document Interpretation

Deeply analyze complex documents spanning dozens of pages, support summarization, translation, chart extraction, and can propose insights based on content.Image Recognition and Reasoning

Strong reasoning ability and rich world knowledge, capable of deducing background information of images without using search.Video Understanding

Able to parse long video content and accurately infer the time, characters, events, and logical relationships within the video.Subject Problem Solving

Can solve complex text-image combined problems, suitable for K12 educational scenarios for problem-solving and explanation.

# [​](#resources)   Resources

* [API Documentation](/api-reference/llm/chat-completion): Learn how to call the API.

# [​](#introducing-glm-4-5v)   Introducing GLM-4.5V

1[](#open-source-multimodal-sota)
# Open-Source Multimodal SOTA
GLM-4.5V, based on Z.AI’s flagship GLM-4.5-Air, continues the iterative upgrade of the GLM-4.1V-Thinking technology route, achieving comprehensive performance at the same level as open-source SOTA models in 42 public visual multimodal benchmarks, covering common tasks such as image, video, document understanding, and GUI tasks.2[](#support-thinking-and-non-thinking)
# Support Thinking and Non-Thinking
GLM-4.5V introduces a new “Thinking Mode” switch, allowing users to freely switch between quick response and deep reasoning, flexibly balancing processing speed and output quality according to task requirements.

# [​](#examples)    Examples

*  Web Page Coding
*  GUI Agent
*  Chart Conversion
*  Grounding

# Prompt
Please generate a high - quality UI interface using CSS and HTML based on the webpage I provided.
# Display
Screenshot of the rendered web page:
# Prompt
Modify the data in the first row on slide 4 to “89”, “21”, “900” and “None”
# Display
Modification result:
# Prompt
Convert the table in the image to Markdown format
# Display
Rendered result：
# Prompt
Tell me the position of the couple in the picture. The short-haired guy is wearing a pink top and blue shorts, and the girl is in a cyan dress. Answer in [x1,y1,x2,y2] format.
# Display

```
The position of the couple in the
picture, where the short-haired 
guy is wearing a pink top and blue
shorts, and the girl is in a cyan 
dress, is [835,626,931,883].

```
Rendered result：

# [​](#quick-start)    Quick Start

*  cURL
*  Python
*  Java
Basic Call
```
curl --location &#x27;https://api.z.ai/api/paas/v4/chat/completions&#x27; \
--header &#x27;Authorization: Bearer YOUR_API_KEY&#x27; \
--header &#x27;Accept-Language: en-US,en&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data &#x27;{
&quot;model&quot;: &quot;glm-4.5v&quot;,
&quot;messages&quot;: [
    {
        &quot;role&quot;: &quot;user&quot;,
        &quot;content&quot;: [
            {
                &quot;type&quot;: &quot;image_url&quot;,
                &quot;image_url&quot;: {
                    &quot;url&quot;: &quot;https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG&quot;
                }
            },
            {
                &quot;type&quot;: &quot;text&quot;,
                &quot;text&quot;: &quot;Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format&quot;
            }
        ]
    }
],
&quot;thinking&quot;: {
    &quot;type&quot;:&quot;enabled&quot;
}
}&#x27;

```
Streaming Call
```
curl --location &#x27;https://api.z.ai/api/paas/v4/chat/completions&#x27; \
--header &#x27;Authorization: Bearer YOUR_API_KEY&#x27; \
--header &#x27;Accept-Language: en-US,en&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data &#x27;{
&quot;model&quot;: &quot;glm-4.5v&quot;,
&quot;messages&quot;: [
    {
        &quot;role&quot;: &quot;user&quot;,
        &quot;content&quot;: [
            {
                &quot;type&quot;: &quot;image_url&quot;,
                &quot;image_url&quot;: {
                    &quot;url&quot;: &quot;https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG&quot;
                }
            },
            {
                &quot;type&quot;: &quot;text&quot;,
                &quot;text&quot;: &quot;Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format&quot;
            }
        ]
    }
],
&quot;thinking&quot;: {
    &quot;type&quot;:&quot;enabled&quot;
},
&quot;stream&quot;: true
}&#x27;

```
Install SDK
```
# Install the latest version
pip install zai-sdk
# Or specify a version
pip install zai-sdk==0.2.2

```
Verify installation
```
import zai
print(zai.__version__)

```
Basic Call
```
from zai import ZaiClient

client = ZaiClient(api_key=&quot;&quot;)  # Enter your own APIKey
response = client.chat.completions.create(
    model=&quot;glm-4.5v&quot;,  # Enter the name of the model you want to call
    messages=[
        {
            &quot;content&quot;: [
                {
                    &quot;type&quot;: &quot;image_url&quot;,
                    &quot;image_url&quot;: {
                        &quot;url&quot;: &quot;https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG&quot;
                    }
                },
                {
                    &quot;type&quot;: &quot;text&quot;,
                    &quot;text&quot;: &quot;Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format&quot;
                }
            ],
            &quot;role&quot;: &quot;user&quot;
        }
    ],
    thinking={
        &quot;type&quot;:&quot;enabled&quot;
    }
)
print(response.choices[0].message)

```
Streaming Call
```
from zai import ZaiClient

client = ZaiClient(api_key=&quot;&quot;)  # Enter your own APIKey
response = client.chat.completions.create(
    model=&quot;glm-4.5v&quot;,  # Enter the name of the model you want to call
    messages=[
        {
            &quot;content&quot;: [
                {
                    &quot;type&quot;: &quot;image_url&quot;,
                    &quot;image_url&quot;: {
                        &quot;url&quot;: &quot;https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG&quot;
                    }
                },
                {
                    &quot;type&quot;: &quot;text&quot;,
                    &quot;text&quot;: &quot;Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format&quot;
                }
            ],
            &quot;role&quot;: &quot;user&quot;
        }
    ],
    thinking={
        &quot;type&quot;:&quot;enabled&quot;
    },
    stream=True
)

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
import ai.z.openapi.service.model.*;
import ai.z.openapi.core.Constants;
import java.util.Arrays;

public class GLM45VExample {
    public static void main(String[] args) {
        String apiKey = &quot;&quot;; // Enter your own APIKey
        ZaiClient client = ZaiClient.builder().ofZAI()
            .apiKey(apiKey)
            .build();

        ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
            .model(&quot;glm-4.5v&quot;)
            .messages(Arrays.asList(
                ChatMessage.builder()
                    .role(ChatMessageRole.USER.value())
                    .content(Arrays.asList(
                        MessageContent.builder()
                            .type(&quot;text&quot;)
                            .text(&quot;Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format&quot;)
                            .build(),
                        MessageContent.builder()
                            .type(&quot;image_url&quot;)
                            .imageUrl(ImageUrl.builder()
                                .url(&quot;https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG&quot;)
                                .build())
                            .build()))
                    .build()))
            .thinking(ChatThinking.builder()
                .type(&quot;enabled&quot;)
                .build())
            .build();

        ChatCompletionResponse response = client.chat().createChatCompletion(request);

        if (response.isSuccess()) {
            Object reply = response.getData().getChoices().get(0).getMessage();
            System.out.println(reply);
        } else {
            System.err.println(&quot;Error: &quot; + response.getMsg());
        }
    }
}

```
Streaming Call
```
import ai.z.openapi.ZaiClient;
import ai.z.openapi.service.model.*;
import ai.z.openapi.core.Constants;
import java.util.Arrays;

public class GLM45VStreamExample {
    public static void main(String[] args) {
        String apiKey = &quot;&quot;; // Enter your own APIKey
        ZaiClient client = ZaiClient.builder().ofZAI()
            .apiKey(apiKey)
            .build();

        ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
            .model(&quot;glm-4.5v&quot;)
            .messages(Arrays.asList(
                ChatMessage.builder()
                    .role(ChatMessageRole.USER.value())
                    .content(Arrays.asList(
                        MessageContent.builder()
                            .type(&quot;text&quot;)
                            .text(&quot;Where is the second bottle of beer from the right on the table?  Provide coordinates in [[xmin,ymin,xmax,ymax]] format&quot;)
                            .build(),
                        MessageContent.builder()
                            .type(&quot;image_url&quot;)
                            .imageUrl(ImageUrl.builder()
                                .url(&quot;https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG&quot;)
                                .build())
                            .build()))
                    .build()))
            .thinking(ChatThinking.builder()
                .type(&quot;enabled&quot;)
                .build())
            .stream(true)
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
Was this page helpful?

YesNo[AutoGLM-Phone-Multilingual](/guides/vlm/autoglm-phone-multilingual)[GLM-Image](/guides/image/glm-image)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
