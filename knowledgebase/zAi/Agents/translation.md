# Translation Agent - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/agents/translation

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationAgentsTranslation Agent[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
On this page* [Overview](#overview)
* [Core Features](#core-features)
* [Usage](#usage)
* [Use Translation Agent](#use-translation-agent)
* [Examples](#examples)
* [Price](#price)
Agents
# Translation Agent
Copy pageCopy page
# [​](#overview)Overview

An AI-powered translation agent designed for multilingual communication and content localization, supporting automatic language detection and translation across 40+ languages. It offers six flexible translation strategies—General, Paraphrasing, Two-Step, Three-Stage, Reflection, and COT—to handle diverse scenarios such as social media, literary works, and academic papers. Users can further enhance translation accuracy through terminology customization and expert guidance. This translation agent also provides a corresponding API service, making it a powerful tool for individuals, enterprises, developers, and professional translators.

# [​](#core-features)Core Features

* Multilingual Translation Support: Covers translation and language detection for 40 languages, including niche languages such as Classical Chinese and Cantonese.

* Six Professional Translation Strategies: Includes General, Paraphrasing, Two-Step, Three-Stage, Reflective, and COT translation modes to meet diverse text translation needs.

* Terminology Customization: Enterprises or users can upload terminology glossaries for term alignment, enhancing domain-specific accuracy.

* Expert Guidance and Style Adaptation: Allows specification of stylistic preferences and cultural context to ensure translations better fit the intended usage scenarios.

* Pinyin and IPA Support: Converts text into Pinyin or International Phonetic Alphabet, suitable for language learning or voice-assistive content creation.

* Intra-Language “Translation” Support: When the source and target languages are the same, applying strategies like Two-Step, Reflective, or COT will paraphrase, rewrite, or polish the text—helpful for eliminating ambiguity in secondary translations.

* Translation Explainability: COT and Reflective strategies can output the reasoning behind the translation process.

FeatureGeneral-Purpose Translation AgentTraditional Translation APIGeneral LLMMultilingual Support✅ 40 languages✅ Typically supports many✅ Typically supports manyProfessional Strategies✅ 6 specialized strategies❌ Limited strategies❌ No dedicated translation strategiesTerminology Support✅ Full support⚠️ Partial support❌ Not supportedTranslation Suggestions✅ Detailed suggestions supported❌ Not supported❌ Requires manual inputTranslation Explainability✅ Provides reasoning❌ Not available⚠️ Requires special promptingAuto Language Detection✅ High accuracy✅ Supported✅ SupportedSpecial Language Support✅ Classical Chinese, Cantonese, etc.❌ Typically unsupported⚠️ Limited support

# [​](#usage)Usage

Target UsersApplication ScenariosIndividual Developers & Language LearnersProvides translation assistance and phonetic annotation to enhance learning efficiencyContent Creators / New Media OperatorsSupports multilingual content publishing and social media localizationEnterprise Clients / Translation ProvidersHandles batch translation tasks, manages custom terminology, and ensures compliant outputEducational / Research InstitutionsSupports translation of papers, course materials, and academic communication
StrategyDescriptionApplicable ScenariosKey FeaturesGeneral TranslationA basic translation method that retains the original format, accounts for the target language’s cultural and linguistic context, balances accuracy and fluency, and resolves over 95% of prompt injection issues.General-purpose content translation; suitable for most daily use cases and handling prompt injection.- Preserves original structure 
- Follows translation rules  - Supports terminology glossaries 
- Adapts to regional language variantsParaphrased TranslationRespects the original meaning while rewriting content in the target language’s natural expression.When natural adaptation to target culture is preferred; non-literal translation scenarios.-  Focuses on conveying meaning over form 
- Adapts more naturally to the target language 
- Allows greater flexibility in restructuringTwo-Step TranslationInvolves literal translation first, followed by freer expression; combines direct and adaptive approaches.Literary works or content needing both accuracy and expressiveness.- Balances literal and intended meanings
- Enhances comprehension
- Stepwise approach improves both accuracy and fluencyThree-Stage TranslationBased on the Chinese traditional theory of “faithfulness, expressiveness, elegance”; ensures content accuracy, fluent delivery, and stylistic beauty—currently supports classical/literary styles only.High-quality literary, poetic, or culturally expressive texts.- Follows “faithfulness, expressiveness, elegance” principle 
- Focuses on cultural and philosophical nuance
- Produces refined, elegant outputReflective TranslationStarts with a literal translation, then prompts the model to act as an expert to reflect on the result by specific dimensions, and finally optimizes the output accordingly.Professional publications, formal documents, or content requiring high accuracy and quality.- Improves output through iterative feedback
- Corrects errors and enhances style 
- Ideal for complex or domain-specific textsCOT TranslationApplies a Chain of Thought reasoning process to analyze the source text before translating into the target language.Conceptually complex or professional domain content requiring deeper understanding.- Performs explicit reasoning before translation 
- Enhances comprehension of complex input
- Increases transparency 
- Useful in expert domains

# [​](#use-translation-agent)Use Translation Agent

* Select Source Language: Specify the source language of the text to be translated (can be left as auto-detect by default).

* Select Target Language: Choose the language you want the text to be translated into.

* Choose Translation Strategy: Select a suitable translation strategy based on your needs (e.g., General, Paraphrasing, Two-Step, etc.).

* Enter Source Text: Paste the text you want to translate into the input box.

* Get Translation Result: The agent will generate a high-quality translation based on the selected strategy.

# [​](#examples)Examples

Original English Text：
“Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.”
— Robert Frost

* General Translation：

“林中有两条路分叉，而我选择了那条少有人走的路，而这让一切变得不同。”
——罗伯特·弗罗斯特

Uses a basic literal translation approach with terminology support, preserving the original format while accommodating the cultural context and linguistic norms of the target language—suitable for over 95% of general translation needs.

* Paraphrased Translation：

“树林中分出两条路，我选择了人迹罕至的一条，而这决定了我一生的道路。”
——罗伯特·弗罗斯特

While staying true to the original meaning, this approach rewrites sentence structure and expressions to present the content in a more natural and native way in the target language. It is suitable for translation scenarios that do not require word-for-word correspondence and prioritize cultural adaptation and linguistic conventions.

* Two-Step Translation：

“林中有两条路分岔，而我选择了那条少有人走的路，这一切因此而截然不同。”
——罗伯特·弗罗斯特

This approach first performs a literal word-for-word translation, then refines the result through free translation to improve overall quality and readability. It is well-suited for scenarios like literary works, where semantic understanding and stylistic expression are especially important.

* Three-Principle Translation：

“林间歧路分，吾择幽径以行，此别天地宽。”
——罗伯特·弗罗斯特

Based on the traditional Chinese translation principles of “faithfulness, expressiveness, and elegance”, this approach ensures that the translation is accurate, fluent, and stylistically refined. It is ideal for literary content such as poetry and prose, supporting high-register styles like Classical Chinese, and aims to balance form and meaning.

* Reflective Translation：

“林中两条路岔开，而我选择了那条少有人走的，而这，让一切截然不同。”
——罗伯特·弗罗斯特

Building on an initial literal translation, this approach introduces an expert role to reflect on and provide feedback, followed by refinement and optimization of the output. It enhances accuracy and stylistic consistency, making it suitable for high-quality formal texts such as publications, legal documents, or professional materials.

* COT Translation：

```
<think>
First, we need to understand the basic meaning of the poem. Robert Frost’s poem describes a person faced with a fork in the woods, symbolizing a moment of choice. The “two roads” represent different paths in life, and the speaker chooses “the one less traveled by,” indicating a preference for uniqueness and individuality. This choice, which “has made all the difference,” suggests that it had a significant impact on the speaker’s life.
When translating, we need to pay attention to the following points:
1. “Two roads diverged in a wood”中的“diverged”表示分叉，可以翻译为“分叉”或“岔开”。
2. “I took the one less traveled by”中的“less traveled”表示少有人走，可以翻译为“少有人走的”。
3. “And that has made all the difference”中的“made all the difference”表示造成了巨大的影响，可以翻译为“造成了所有的不同”或“这一切都不同了”。
In addition, to preserve the poem’s rhythm and aesthetic appeal, we should strive to make the translation concise and poetic.
</think>

```

树林中两条路分叉，而我选择了那条少有人走的，这一切都不同了。
—— 罗伯特·弗罗斯特

By following a “first understand, then translate” reasoning process, this approach enhances the model’s ability to comprehend complex concepts and specialized contexts. It is well-suited for high-expertise domains such as science and medicine, resulting in more logical and transparent translations that help users grasp the underlying knowledge structure behind the language.

# [​](#price)Price

Pay-as-you-go by Token usage, $3 per 1 million TokensWas this page helpful?

YesNo[GLM Slide/Poster Agent(beta)](/guides/agents/slide)[Video Effect Template Agent](/guides/agents/video-template)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
