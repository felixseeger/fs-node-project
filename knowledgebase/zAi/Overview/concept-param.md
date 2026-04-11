# Core Parameters - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/overview/concept-param

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationGet StartedCore Parameters[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
On this page* [Quick Reference](#quick-reference)
* [Parameter Details](#parameter-details)
* [do_sample](#do_sample)
* [temperature](#temperature)
* [top_p](#top_p)
* [max_tokens](#max_tokens)
* [stream](#stream)
* [thinking](#thinking)
* [Related Concepts](#related-concepts)
Get Started
# Core Parameters
Copy pageCopy pageWhen interacting with models, you can control the model’s output by adjusting different parameters to meet the needs of various scenarios. Understanding these core parameters will help you better utilize the model’s capabilities.

# [​](#quick-reference)Quick Reference

ParameterTypeDefault ValueDescription[do_sample](#do_sample)BooleantrueWhether to sample the output to increase diversity.[temperature](#temperature)Float(Model dependent)Controls the randomness of output, higher values are more random.[top_p](#top_p)Float(Model dependent)Controls diversity through nucleus sampling, recommended to use either this or temperature.[max_tokens](#max_tokens)Integer(Model dependent)Limits the maximum number of tokens generated in a single call.[stream](#stream)BooleanfalseWhether to return responses in streaming mode.[thinking](#thinking)Object{&quot;type&quot;: &quot;enabled&quot;}Whether to enable chain-of-thought deep thinking, only supported by GLM-4.5 and above.

# [​](#parameter-details)Parameter Details

# [​](#do_sample)do_sample

do_sample is a boolean value (true or false) that determines whether to sample the model’s output.

* true (default): Performs random sampling based on the probability distribution of each token, increasing text diversity and creativity. Suitable for content creation, dialogue, and other scenarios.

* false: Uses a greedy strategy, always selecting the token with the highest probability. Provides high deterministic output, suitable for scenarios requiring precise, factual answers.

Best Practices:

* Set to false when you need reproducible, deterministic output.

* Set to true when you want the model to generate more diverse and interesting content, and use it in combination with temperature or top_p.

# [​](#temperature)temperature

The temperature parameter controls the randomness of the model’s output.

* Lower values (e.g., 0.2): Make the probability distribution more “sharp”, resulting in more deterministic and conservative output.

* Higher values (e.g., 0.8): Make the probability distribution more “flat”, resulting in more random and diverse output.

Best Practices:

* For scenarios requiring rigor and factual accuracy (such as knowledge Q&A), it’s recommended to use lower temperature.

* For scenarios requiring creativity (such as content creation), you can try higher temperature.

* It’s recommended to use only one of temperature and top_p.

# [​](#top_p)top_p

top_p (nucleus sampling) controls diversity by sampling from the smallest set of tokens whose cumulative probability exceeds the threshold.

* Lower values (e.g., 0.2): Limit the sampling range, resulting in more deterministic output.

* Higher values (e.g., 0.9): Expand the sampling range, resulting in more diverse output.

Best Practices:

* If you want to achieve some diversity while ensuring content quality, top_p is a good choice (recommended values 0.8-0.95).

* It’s generally not recommended to modify both temperature and top_p simultaneously.

# [​](#max_tokens)max_tokens

max_tokens is used to limit the maximum number of tokens the model can generate in a single call. GLM-4.6 supports a maximum output length of 128K, GLM-4.5 supports a maximum output length of 96K, and it’s recommended to set it to no less than 1024. Tokens are the basic units of text, typically 1 token equals approximately 0.75 English words or 1.5 Chinese characters. Setting an appropriate max_tokens can control response length and cost, avoiding overly long outputs. If the model completes its answer before reaching the max_tokens limit, it will naturally end; if it reaches the limit, the output may be truncated.

* Purpose: Prevents generating overly long text and controls API call costs.

* Note: max_tokens limits the length of generated content, not including input.

Best Practices:

* Set max_tokens reasonably according to your application scenario. If you need short answers, you can set it to a smaller value (e.g., 50).

Default max_tokens and maximum supported max_tokens for each model:
Model CodeDefault max_tokensMaximum max_tokensglm-5.165536131072glm-5v-turbo65536131072glm-5-turbo65536131072glm-565536131072glm-4.765536131072glm-4.665536131072glm-4.6v1638432768glm-4.6v-flash1638432768glm-4.6v-flashx1638432768glm-4.56553698304glm-4.5-air6553698304glm-4.5-x6553698304glm-4.5-airx6553698304glm-4.5-flash6553698304glm-4.5v1638416384glm-4-32b-0414-128k1638416384

# [​](#stream)stream

stream is a boolean value used to control the API’s response method.

* false (default): Returns the complete response at once, simple to implement but with long waiting times.

* true: Returns content in streaming (SSE) mode, significantly improving the experience of real-time interactive applications.

Best Practices:

* For chatbots, real-time code generation, and other applications, it’s strongly recommended to set this to true.

# [​](#thinking)thinking

The thinking parameter controls whether the model enables “Chain of Thought” for deeper thinking and reasoning.

* Type: Object

* Supported Models: GLM-4.5 and above

Properties:

type (string):

* enabled (default): Enable chain of thought. GLM-4.6 and GLM-4.5 will automatically determine if needed, while GLM-4.5V will force thinking.

* disabled: Disable chain of thought.

Best Practices:

* It’s recommended to enable this when you need the model to perform complex reasoning and planning.

* For simple tasks, you can disable it to get faster responses.

# [​](#related-concepts)Related Concepts

Token Usage Calculation

Tokens are the basic units for model text processing. Usage calculation includes both input and output parts.
* Input Token Count: The number of tokens contained in the text you send to the model.

* Output Token Count: The number of tokens contained in the text generated by the model.

* Total Token Count: The sum of input and output, usually used as the billing basis.

You can call the tokenizer API to estimate the token count of text.Maximum Output Tokens

Maximum Output Tokens refers to the maximum number of tokens a model can generate in a single request. It’s different from the max_tokens parameter - max_tokens is the upper limit you set in your request, while Maximum Output Tokens is the architectural limitation of the model itself.For example, a model’s context window might be 8k tokens, but its maximum output capability might be limited to 4k tokens.Context Window

The Context Window refers to the total number of tokens a model can process in a single interaction, including all tokens from both input text and generated text.
* Importance: The context window determines how much historical information the model can “remember”. If the total length of input and expected output exceeds the model’s context window, the model will be unable to process it.

* Note: Different models have different context window sizes. When conducting long conversations or processing long documents, special attention should be paid to context window limitations.

Concurrency Limits

Concurrency refers to the number of API requests you can initiate simultaneously. This is set by the platform to ensure service stability and fair resource allocation.
* Limits: Different users or subscription plans may have different concurrency quotas.

* Overages: If you exceed the concurrency limit, new requests may fail or need to wait in queue.

If your application requires high concurrency processing, please check your account limits or contact platform support.Was this page helpful?

YesNo[Pricing](/guides/overview/pricing)[HTTP API Calls](/guides/develop/http/introduction)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
