# CogView-4 - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/image/cogview-4

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationImage Generation ModelsCogView-4[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Introducting CogView-4](#introducting-cogview-4)
* [Achieved SOTA Performance at Release](#achieved-sota-performance-at-release)
* [Better Chinese Understanding and Generation](#better-chinese-understanding-and-generation)
* [Any Resolution and Any-Length Prompts](#any-resolution-and-any-length-prompts)
* [    Examples](#examples)
* [    Quick Start](#quick-start)
Image Generation Models
# CogView-4
Copy pageCopy page
# [​](#overview)   Overview

CogView-4 is Z.AI’s first open-source text-to-image model. It has comprehensive improvements in semantic understanding, image generation quality, and the ability to generate both English and Chinese text. It supports bilingual input of any length in Chinese and English and can generate images of any resolution within a specified range.

# Price
$0.01 / image
# Input Modality
Text
# Output Modality
Image

# [​](#usage)   Usage

Food & Beverage Promotion

Generates visually appealing, detailed, and realistic food images based on dish names, ingredient characteristics, and style requirements, incorporating creative text elements. Suitable for menu design, food delivery platform displays, and offline posters.E-commerce Product Images

Quickly generates high-resolution product display images based on product features and selling points, adding bilingual promotional text as needed. Fits the image requirements for different product pages and campaign visuals on e-commerce platforms.Game Asset Creation

Produces high-resolution, detailed character illustrations and concept art based on game worldviews and character settings, meeting the needs of multi-resolution production.Educational Material Illustrations

Analyzes teaching text content and automatically generates matching illustrations and scene images, adapted to the layout and resolution requirements of various educational materials, enhancing the visualization of knowledge.Cultural & Tourism Promotion

Generates promotional images in different sizes based on cultural and tourism themes, skillfully combining text with region-specific visual elements to increase the appeal of cultural and tourism marketing.

# [​](#resources)   Resources

* [API Documentation](/api-reference/image/generate-image): Learn how to call the API.

# [​](#introducting-cogview-4)   Introducting CogView-4

1[](#achieved-sota-performance-at-release)
# Achieved SOTA Performance at Release
DPG-Bench (Dense Prompt Graph Benchmark) is a benchmark for evaluating text-to-image generation models, focusing on the model’s performance in complex semantic alignment and instruction following.At the time of release, CogView-4 ranked first overall in the DPG-Bench benchmark test, achieving SOTA performance among open-source text-to-image models.2[](#better-chinese-understanding-and-generation)
# Better Chinese Understanding and Generation
Technically, CogView-4 replaced the English-only T5 encoder with the bilingual GLM-4 encoder and trained the model using bilingual image-text data, enabling the model to handle bilingual prompts.CogView-4 supports Chinese and English prompts and is especially good at understanding and following Chinese prompts, greatly lowering the prompt threshold for users. It is the first open-source text-to-image model capable of generating Chinese characters in the images, making it particularly suitable for creative needs in advertising, short videos, and other fields.3[](#any-resolution-and-any-length-prompts)
# Any Resolution and Any-Length Prompts
CogView-4 implements a mixed training paradigm of text descriptions (captions) of any length and images of any resolution. The model supports input prompts of any length and can generate images at any resolution within the supported range. This not only provides users with more creative freedom but also improves training efficiency.

# [​](#examples)    Examples

*  Food & Beverage Promotion
*  E-commerce Product Images
*  Game Asset Creation
*  Cultural & Tourism Promotion

# Prompt
Close-up, commercial food photography, intense indoor lighting, extreme detail. A Christmas dinner table, a corner of the table where a long-haired orange tabby cat leans its head close to a plate, greedily sniffing the festive feast with an expression of pure delight. The table features roast chicken, plants, salad, champagne, and gold-rimmed porcelain tea sets. Afternoon sunlight bathes the cat’s profile in golden light, casting a soft glow over both the food and its fur. A Christmas tree adorns the background. The image emphasizes the texture of the food and the cat’s coat, featuring strong lighting and a warm, festive Christmas atmosphere.
# Display

# Prompt
Two opaque, non-reflective white milk tea cups are adorned with intricate golden patterns of varying sizes. The designs feature Christmas motifs, including reindeer and pine trees, set against a warm red background and twinkling holiday lights. Displayed within a miniature snow scene, they are illuminated by natural light.
# Display

# Prompt
Cyberpunk samurai with a glowing katana and a robotic arm, standing in a neon-lit alley in Tokyo, rain reflecting on the wet pavement, Blade Runner aesthetic, cinematic, highly detailed, volumetric lighting — ar 2:3.
# Display

# Prompt
The dazzling nightscape of Victoria Harbour in Hong Kong employs double exposure techniques to seamlessly blend the bustling city skyline with spectacular fireworks. Multiple fireworks burst across the night sky, forming a massive heart shape perfectly superimposed at the center of the frame. The fireworks display a kaleidoscope of colors—gold, red, blue, and purple intertwine, illuminating the entire night sky. City lights twinkle in the background, with skyscraper silhouettes clearly visible. Neon lights along the streets accentuate the city’s vibrant energy. The entire scene exudes a dreamlike and romantic atmosphere, immersing the viewer in the dazzling nightscape of Hong Kong.
# Display

# [​](#quick-start)    Quick Start

*  cURL
*  Python
*  Java

```
curl --request POST \
--url https://api.z.ai/api/paas/v4/images/generations \
--header &#x27;Authorization: Bearer <token>&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data &#x27;{
    &quot;model&quot;: &quot;cogView-4-250304&quot;,
    &quot;prompt&quot;: &quot;A cute little kitten sitting on a sunny windowsill, with the background of blue sky and white clouds.&quot;,
    &quot;size&quot;: &quot;1024x1024&quot;
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
Call Example
```
from zai import ZaiClient
client = ZaiClient(api_key=&quot;your-api-key&quot;)
response = client.images.generations(
model=&quot;cogView-4-250304&quot;,
prompt=&quot;A cute little kitten sitting on a sunny windowsill, with the background of blue sky and white clouds.&quot;,
)
print(response.data[0].url)

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
Call Example
```
import ai.z.openapi.ZaiClient;
import ai.z.openapi.core.Constants;
import ai.z.openapi.service.image.CreateImageRequest;
import ai.z.openapi.service.image.ImageResponse;

public class CogView4Example {
public static void main(String[] args) {
ZaiClient client = ZaiClient.builder().ofZAI().apiKey(&quot;YOUR_API_KEY&quot;).build();
// Create image generation request
CreateImageRequest request = CreateImageRequest.builder()
.model(Constants.ModelCogView4250304)
.prompt(&quot;A cute little kitten sitting on a sunny windowsill, with the background of blue sky and white clouds.&quot;)
.size(&quot;1024x1024&quot;)
.build();
ImageResponse response = client.images().createImage(request);
System.out.println(response.getData());
}
}

```

Please note that the output of the CogView-4 model is an image URL. You will need to download the image using this URL.Was this page helpful?

YesNo[GLM-Image](/guides/image/glm-image)[CogVideoX-3](/guides/video/cogvideox-3)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
