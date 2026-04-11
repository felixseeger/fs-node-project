# Context Caching - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/capabilities/cache

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationCapabilitiesContext Caching[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [Code Examples](#code-examples)
* [Best Practices](#best-practices)
* [Use Cases](#use-cases)
* [Important Notes](#important-notes)
* [Billing Information](#billing-information)
Capabilities
# Context Caching
Copy pageCopy pageContext caching functionality significantly reduces token consumption and response latency by caching repeated context content. When you repeatedly use the same system prompts or conversation history in dialogues, the caching mechanism automatically identifies and reuses this content, thereby improving performance and reducing costs.

# [​](#features)Features

* Automatic Cache Recognition: Implicit caching that intelligently identifies repeated context content without manual configuration

* Significant Cost Reduction: Cached tokens are billed at lower prices, dramatically saving costs

* Improved Response Speed: Reduces processing time for repeated content, accelerating model responses

* Transparent Billing: Detailed display of cached token counts in response field usage.prompt_tokens_details.cached_tokens

* Wide Compatibility: Supports all mainstream models, including GLM-5, GLM-4.7, GLM-4.6, GLM-4.5 series, etc.

Context caching works by computing input message content and identifying content that is identical or highly similar to previous requests. When repeated content is detected, the system reuses previous computation results, avoiding redundant token processing.

This mechanism is particularly suitable for the following scenarios:

* System prompt reuse: In multi-turn conversations, system prompts usually remain unchanged, and caching can significantly reduce token consumption for this part.

* Repetitive tasks: For tasks that process similar content with consistent instructions multiple times, caching can improve efficiency.

* Multi-turn conversation history: In complex conversations, historical messages often contain a lot of repeated information, and caching can effectively reduce token usage for this part.

# [​](#code-examples)Code Examples

*  cURL
*  Python SDK
Basic Caching Example
```
# First request - establish cache
curl --location &#x27;https://api.z.ai/api/paas/v4/chat/completions&#x27; \
--header &#x27;Authorization: Bearer YOUR_API_KEY&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data &#x27;{
    &quot;model&quot;: &quot;glm-5&quot;,
    &quot;messages&quot;: [
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: &quot;You are a professional data analyst, skilled at explaining data trends and providing business insights.&quot;
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;How to analyze user retention rate?&quot;
        }
    ]
}&#x27;

```
Cache Reuse Example
```
# Second request - reuse system prompt cache
curl --location &#x27;https://api.z.ai/api/paas/v4/chat/completions&#x27; \
--header &#x27;Authorization: Bearer YOUR_API_KEY&#x27; \
--header &#x27;Content-Type: application/json&#x27; \
--data &#x27;{
    &quot;model&quot;: &quot;glm-5&quot;,
    &quot;messages&quot;: [
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: &quot;You are a professional data analyst, skilled at explaining data trends and providing business insights.&quot;
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;What is funnel analysis?&quot;
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
Basic Conversation Example
```
from zai import ZaiClient

# Initialize client
client = ZaiClient(api_key=&#x27;Your API key&#x27;)

# First request - establish cache
response1 = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: &quot;You are a professional technical documentation assistant, skilled at explaining complex technical concepts. Please answer user questions with clear and concise language, and provide practical code examples.&quot;
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;What is RESTful API?&quot;
        }
    ]
)

print(&quot;First request result:&quot;)
print(f&quot;Reply: {response1.choices[0].message.content}&quot;)
print(f&quot;Total tokens: {response1.usage.total_tokens}&quot;)
print(f&quot;Cached tokens: {response1.usage.prompt_tokens_details.cached_tokens if hasattr(response1.usage, &#x27;prompt_tokens_details&#x27;) else 0}&quot;)

# Second request - reuse system prompt cache
response2 = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: &quot;You are a professional technical documentation assistant, skilled at explaining complex technical concepts. Please answer user questions with clear and concise language, and provide practical code examples.&quot;  # Same system prompt
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;What are the differences between GraphQL and RESTful API?&quot;
        }
    ]
)

print(&quot;\nSecond request result:&quot;)
print(f&quot;Reply: {response2.choices[0].message.content}&quot;)
print(f&quot;Total tokens: {response2.usage.total_tokens}&quot;)
print(f&quot;Cached tokens: {response2.usage.prompt_tokens_details.cached_tokens if hasattr(response2.usage, &#x27;prompt_tokens_details&#x27;) else 0}&quot;)

```
Long Document Analysis Example
```
from zai import ZaiClient

# Initialize client
client = ZaiClient(api_key=&#x27;Your API key&#x27;)

# Long document content (simulated)
long_document = &quot;&quot;&quot;
This is a detailed technical specification document that includes system architecture, API design, database structure, and many other aspects.
The document is very long and contains a lot of technical details and implementation instructions...
[Large amount of document content omitted here]
&quot;&quot;&quot;

# First analysis - establish document cache
response1 = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: f&quot;Please answer user questions based on the following technical document:\n\n{long_document}&quot;
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;What is the main architecture of this system?&quot;
        }
    ]
)

print(&quot;First analysis:&quot;)
print(f&quot;Total tokens: {response1.usage.total_tokens}&quot;)
print(f&quot;Cached tokens: {response1.usage.prompt_tokens_details.cached_tokens if hasattr(response1.usage, &#x27;prompt_tokens_details&#x27;) else 0}&quot;)

# Second analysis - reuse document cache
response2 = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: f&quot;Please answer user questions based on the following technical document:\n\n{long_document}&quot;  # Same document content
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;What are the characteristics of the API design?&quot;
        }
    ]
)

print(&quot;\nSecond analysis:&quot;)
print(f&quot;Total tokens: {response2.usage.total_tokens}&quot;)
print(f&quot;Cached tokens: {response2.usage.prompt_tokens_details.cached_tokens if hasattr(response2.usage, &#x27;prompt_tokens_details&#x27;) else 0}&quot;)
print(f&quot;Cache savings: {response2.usage.prompt_tokens_details.cached_tokens / response2.usage.total_tokens * 100:.1f}%&quot;)

```
Multi-turn Conversation Caching Example
```
from zai import ZaiClient

# Initialize client
client = ZaiClient(api_key=&#x27;Your API key&#x27;)

# Build conversation history
conversation_history = [
    {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a Python programming assistant, helping users solve programming problems.&quot;},
    {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;How to create a simple Flask application?&quot;},
    {&quot;role&quot;: &quot;assistant&quot;, &quot;content&quot;: &quot;Creating a Flask application is simple, first install Flask...&quot;},
    {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;How to add routes?&quot;},
    {&quot;role&quot;: &quot;assistant&quot;, &quot;content&quot;: &quot;In Flask, add routes using the @app.route decorator...&quot;},
]

# Continue conversation - reuse conversation history cache
response = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=conversation_history + [
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;How to handle POST requests?&quot;}
    ]
)

print(&quot;Conversation reply:&quot;)
print(f&quot;Content: {response.choices[0].message.content}&quot;)
print(f&quot;Total tokens: {response.usage.total_tokens}&quot;)
print(f&quot;Cached tokens: {response.usage.prompt_tokens_details.cached_tokens if hasattr(response.usage, &#x27;prompt_tokens_details&#x27;) else 0}&quot;)

# Calculate cache efficiency
if hasattr(response.usage, &#x27;prompt_tokens_details&#x27;) and response.usage.prompt_tokens_details.cached_tokens:
    cache_ratio = response.usage.prompt_tokens_details.cached_tokens / response.usage.prompt_tokens * 100
    print(f&quot;Cache hit rate: {cache_ratio:.1f}%&quot;)

```
Batch Processing Optimization Example
```
from zai import ZaiClient
import time

# Initialize client
client = ZaiClient(api_key=&#x27;Your API key&#x27;)

# Common system prompt
system_prompt = &quot;&quot;&quot;
You are a professional code review assistant. Please analyze the provided code from the following aspects:
1. Code quality and readability
2. Performance optimization suggestions
3. Security considerations
4. Best practice recommendations
Please provide specific improvement suggestions.
&quot;&quot;&quot;

# List of code snippets to review
code_snippets = [
    &quot;def calculate_sum(numbers): return sum(numbers)&quot;,
    &quot;class User: def __init__(self, name): self.name = name&quot;,
    &quot;for i in range(len(items)): print(items[i])&quot;,
    &quot;if user_input == &#x27;yes&#x27; or user_input == &#x27;y&#x27;: return True&quot;
]

results = []
total_cached_tokens = 0

for i, code in enumerate(code_snippets):
    start_time = time.time()
    
    response = client.chat.completions.create(
        model=&quot;glm-5&quot;,
        messages=[
            {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: system_prompt},
            {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: f&quot;Please review the following code:\n```python\n{code}\n```&quot;}
        ]
    )
    
    end_time = time.time()
    
    # Count cache effects
    cached_tokens = 0
    if hasattr(response.usage, &#x27;prompt_tokens_details&#x27;) and response.usage.prompt_tokens_details.cached_tokens:
        cached_tokens = response.usage.prompt_tokens_details.cached_tokens
        total_cached_tokens += cached_tokens
    
    results.append({
        &#x27;code&#x27;: code,
        &#x27;review&#x27;: response.choices[0].message.content,
        &#x27;total_tokens&#x27;: response.usage.total_tokens,
        &#x27;cached_tokens&#x27;: cached_tokens,
        &#x27;response_time&#x27;: end_time - start_time
    })
    
    print(f&quot;Code snippet {i+1} review completed:&quot;)
    print(f&quot;  Response time: {end_time - start_time:.2f}s&quot;)
    print(f&quot;  Cached tokens: {cached_tokens}&quot;)
    print(f&quot;  Total tokens: {response.usage.total_tokens}&quot;)
    print()

print(f&quot;Batch processing completed, total cached tokens: {total_cached_tokens}&quot;)

```

Response contains context cache token usage information:

```
{
  &quot;usage&quot;: {
    &quot;prompt_tokens&quot;: 1200,
    &quot;completion_tokens&quot;: 300,
    &quot;total_tokens&quot;: 1500,
    &quot;prompt_tokens_details&quot;: {
      &quot;cached_tokens&quot;: 800
    }
  }
}

```

# [​](#best-practices)Best Practices

*  System Prompt Optimization
*  Document Content Reuse
*  Conversation History Management
Use stable system prompts
```
# Recommended: Use stable system prompts
system_prompt = &quot;&quot;&quot;
You are a professional technical consultant with the following characteristics:
- Deep technical background and rich project experience
- Able to provide accurate and practical technical advice
- Good at explaining complex concepts in clear and concise language
Please provide professional technical guidance based on user questions.
&quot;&quot;&quot;

```
Use long documents as system messages
```
# Recommended: Use long documents as system messages
def create_document_based_chat(document_content, user_question):
    return client.chat.completions.create(
        model=&quot;glm-5&quot;,
        messages=[
            {
                &quot;role&quot;: &quot;system&quot;,
                &quot;content&quot;: f&quot;Please answer user questions based on the following document content:\n\n{document_content}&quot;
            },
            {
                &quot;role&quot;: &quot;user&quot;,
                &quot;content&quot;: user_question
            }
        ]
    )

# Multiple calls with the same document, system prompts will be cached
questions = [&quot;What is the main content of the document?&quot;, &quot;What are the key points?&quot;, &quot;How to implement these suggestions?&quot;]
for question in questions:
    response = create_document_based_chat(document_content, question)
    # Second and subsequent calls will hit the cache

```
Manage conversation history to improve cache efficiency
```
class ConversationManager:
    def __init__(self, client, system_prompt):
        self.client = client
        self.system_prompt = system_prompt
        self.history = [{&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: system_prompt}]
    
    def add_message(self, role, content):
        self.history.append({&quot;role&quot;: role, &quot;content&quot;: content})
    
    def get_response(self, user_message):
        # Add user message
        self.add_message(&quot;user&quot;, user_message)
        
        # Get reply (conversation history will be cached)
        response = self.client.chat.completions.create(
            model=&quot;glm-5&quot;,
            messages=self.history
        )
        
        # Add assistant reply to history
        assistant_message = response.choices[0].message.content
        self.add_message(&quot;assistant&quot;, assistant_message)
        
        return response
    
    def get_cache_stats(self, response):
        &quot;&quot;&quot;Get cache statistics&quot;&quot;&quot;
        if hasattr(response.usage, &#x27;prompt_tokens_details&#x27;):
            cached = response.usage.prompt_tokens_details.cached_tokens or 0
            total = response.usage.prompt_tokens
            return f&quot;Cache hit: {cached}/{total} ({cached/total*100:.1f}%)&quot;
        return &quot;No cache information&quot;

# Usage example
manager = ConversationManager(client, &quot;You are a programming assistant...&quot;)
response1 = manager.get_response(&quot;How to learn Python?&quot;)
response2 = manager.get_response(&quot;Recommend some learning resources&quot;)  # Will reuse previous conversation cache

```

# [​](#use-cases)Use Cases

# Multi-turn Conversations

* Intelligent customer service systems

* Personal assistant services

# Batch Processing

* Code review batch processing

* Content batch analysis

# Template Applications

* Report generation templates

* Standardized process handling

# Education and Training

* Homework grading assistance

* Learning material analysis

# [​](#important-notes)Important Notes

*  Understanding Cache Mechanism
*  Cost Optimization Suggestions
*  Performance Considerations
*  Best Practices

* Caching is automatically triggered based on content similarity, no manual configuration required

* Identical content has the highest cache hit rate

* Minor formatting differences may affect cache effectiveness

* Cache has reasonable time limits, will recalculate after expiration

* Cached tokens are billed at lower prices

* Long documents and repeated content have the most significant cache effects

* Design system prompts reasonably to improve reuse rates

* Monitor cache hit rates and optimize usage patterns

* Caching can significantly improve response speed

* First request to establish cache may be slightly slower

* Manage conversation history length reasonably

* Avoid overly frequent content changes

* Use stable system prompt templates

* Process long documents as system messages

* Organize conversation history structure reasonably

* Regularly analyze cache effectiveness and optimize

# [​](#billing-information)Billing Information

Context caching uses a differentiated billing strategy:

* New content tokens: Billed at standard prices

* Cache hit tokens: Billed at discounted prices (usually 50% of standard price)

* Output tokens: Billed at standard prices

Billing example:

```
Assuming standard price is 0.01 /1K tokens:

Request details:
- Total input tokens: 2000
- Cache hit tokens: 1200
- New content tokens: 800
- Output tokens: 500

Billing calculation:
- New content cost: 800 × 0.01/1000 = 0.008
- Cache cost: 1200 × 0.005/1000 = 0.006
- Output cost: 500 × 0.01/1000 = 0.005
- Total cost: 0.019

Compared to no cache (2500 × 0.01/1000 = 0.025), saves 24%

```
Was this page helpful?

YesNo[Function Calling](/guides/capabilities/function-calling)[Structured Output](/guides/capabilities/struct-output)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
