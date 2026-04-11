# GLM-OCR - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/vlm/glm-ocr

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationVision Language ModelsGLM-OCR[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Introducing GLM-OCR](#introducing-glm-ocr)
* [State-of-the-Art Performance, Precision in Action](#state-of-the-art-performance-precision-in-action)
* [Faster, More Cost-Effective](#faster-more-cost-effective)
* [    Examples](#examples)
* [    Quick Start](#quick-start)
Vision Language Models
# GLM-OCR
Copy pageCopy page
# [​](#overview)   Overview

GLM-OCR is a lightweight professional OCR model with parameters as small as 0.9B, yet it achieves state-of-the-art performance across multiple capabilities. It sets a new benchmark for document parsing with its “small size and high accuracy.” Key features include:

* Performance SOTA: Scored 94.62 points to top OmniDocBench V1.5 and achieved current best performance across multiple mainstream document understanding benchmarks including tables and formulas at launch.

* Optimized for Real-World Scenarios: Delivers stable, leading accuracy in complex environments like code documentation, intricate tables, and stamp recognition. Maintains exceptional recognition precision even with complex layouts, diverse fonts, or mixed text-image content.

* Efficient and Cost-Effective: With just 0.9B parameters, supports VLLM and SGLang deployment, significantly reducing inference latency and computational overhead.

# Input Modality

* PDF, images (JPG, PNG)

* Single image ≤ 10MB, PDF ≤ 50MB

* Maximum support: 100 pages

# Output Modality
Text / Image Links / MD Documents
# Supported Language
Support Chinese, English, French, Spanish, Russian, German, Japanese, Korean, etc.
For detailed pricing information on GLM-OCR, please visit the [Pricing Page](/guides/overview/pricing).

# [​](#usage)   Usage

Text Recognition

Recognize text content from photos, screenshots, documents, and scans, supporting printed text, handwriting, and mathematical formulas. Applicable to diverse scenarios including education, research, and office work.Table Recognition

Identify table structures and content, converting them into HTML-formatted sequences. Suitable for scenarios involving table data entry, conversion, and editing.Information Structuring

Extract key information from various cards, certificates, receipts, and forms, outputting structured JSON data. Supports applications in banking, insurance, government services, legal, logistics, and other industries.Retrieval-Augmented Generation (RAG)

Support high-volume document recognition and parsing with high accuracy and standardized output formats, providing a robust foundation for RAG.

# [​](#resources)   Resources

* [API Documentation](/api-reference/tools/layout-parsing): Learn how to call the API.

# [​](#introducing-glm-ocr)   Introducing GLM-OCR

1[](#state-of-the-art-performance-precision-in-action)
# State-of-the-Art Performance, Precision in Action
Thanks to its proprietary CogViT visual encoder and deep scene optimization, GLM-OCR achieves “compact size, high accuracy.”With only 0.9B parameters, GLM-OCR achieved SOTA on the authoritative document parsing benchmark OmniDocBench V1.5 with a score of 94.6. It outperforms multiple specialized OCR models across four key domains—text, formula, table recognition, and information extraction—with performance approaching that of Gemini-3-Pro.Beyond public benchmarks, we conducted internal evaluations across six core real-world scenarios. Results show GLM-OCR delivers significant advantages across dimensions including code documentation, real-world tables, handwriting, multilingual text, seal recognition, and invoice extraction.2[](#faster-more-cost-effective)
# Faster, More Cost-Effective
For speed, we compared different OCR methods under identical hardware and testing conditions (single replica, single concurrency), evaluating their performance in parsing and exporting Markdown files from both image and PDF inputs. Results show GLM-OCR achieves a throughput of 1.86 pages/second for PDF documents and 0.67 images/second for images, significantly outperforming comparable models.Pricing is uniform for both API input and output, costing just $0.03 per million tokens.

# [​](#examples)    Examples

*  Code Block Recognition
*  Complex Chart Content Recognition
*  Bill Recognition
*  Handwriting Recognition

# Input

# Output

# Input

# Output

# Input

# Output

# Input

# Output

# [​](#quick-start)    Quick Start

*  cURL
*  Python
*  Java

```
curl --location --request POST &#x27;https://api.z.ai/api/paas/v4/layout_parsing&#x27; \
--header &#x27;Authorization: Bearer your-api-key&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data-raw &#x27;{
  &quot;model&quot;: &quot;glm-ocr&quot;,
  &quot;file&quot;: &quot;https://cdn.bigmodel.cn/static/logo/introduction.png&quot;
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

# Initialize client
client = ZaiClient(api_key=&quot;your-api-key&quot;)

image_url = &quot;https://cdn.bigmodel.cn/static/logo/introduction.png&quot;

# Call layout parsing API
response = client.layout_parsing.create(
    model=&quot;glm-ocr&quot;,
    file=image_url
)

# Output result
print(response)

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
import ai.z.openapi.service.layoutparsing.LayoutParsingCreateParams;
import ai.z.openapi.service.layoutparsing.LayoutParsingResponse;
import ai.z.openapi.service.layoutparsing.LayoutParsingResult;

public class LayoutParsing {
    public static void main(String[] args) {
        // Initialize client
        ZaiClient client = ZaiClient.builder()
            .ofZAI()
            .apiKey(&quot;your-api-key&quot;)
            .build();

        String model = &quot;glm-ocr&quot;;
        String file = &quot;https://cdn.bigmodel.cn/static/logo/introduction.png&quot;;

        // Create layout parsing request
        LayoutParsingCreateParams params = LayoutParsingCreateParams.builder()
            .model(model)
            .file(file)
            .build();

        // Send request
        LayoutParsingResponse response = client.layoutParsing().layoutParsing(params);

        // Handle response
        if (response.isSuccess()) {
            System.out.println(&quot;Parsing result: &quot; + response.getData());
        } else {
            System.err.println(&quot;Error: &quot; + response.getMsg());
        }
    }
}

```
Was this page helpful?

YesNo[GLM-4.6V](/guides/vlm/glm-4.6v)[AutoGLM-Phone-Multilingual](/guides/vlm/autoglm-phone-multilingual)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
