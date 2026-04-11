# GLM-4.6V - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/vlm/glm-4.6v

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationVision Language ModelsGLM-4.6V[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Resources](#resources)
* [   Introducing GLM-4.6V](#introducing-glm-4-6v)
* [Native Multimodal Tool Use](#native-multimodal-tool-use)
* [Capabilities & Scenarios](#capabilities-%26-scenarios)
* [Overall Performance](#overall-performance)
* [    Examples](#examples)
* [    Quick Start](#quick-start)
Vision Language Models
# GLM-4.6V
Copy pageCopy page
# [​](#overview)   Overview

GLM-4.6V series are Z.ai’s iterations in a multimodal large language model. GLM-4.6V scales its context window to 128k tokens in training, and achieves SoTA performance in visual understanding among models of similar parameter scales. Crucially, GLM-4.6V integrate native Function Calling capabilities for the first time. This effectively bridges the gap between “visual perception” and “executable action,” providing a unified technical foundation for multimodal agents in real-world business scenarios.
*  GLM-4.6V
*  GLM-4.6V-FlashX
*  GLM-4.6V-Flash

# Positioning
High Performance
# Input Modality
Video / Image / Text / File
# Output Modality
Text
# Context Length
128K
# Positioning
Lightweight, High-Speed,and Affordable
# Input Modality
Video / Image / Text / File
# Output Modality
Text
# Context Length
128K
# Positioning
Lightweight, Completely Free
# Input Modality
Video / Image / Text / File
# Output Modality
Text
# Context Length
128K

# [​](#resources)   Resources

* [API Documentation](/api-reference/llm/chat-completion): Learn how to call the API.

# [​](#introducing-glm-4-6v)   Introducing GLM-4.6V

1[](#native-multimodal-tool-use)
# Native Multimodal Tool Use
Traditional tool usage in LLMs often relies on pure text, requiring multiple intermediate conversions when dealing with images, videos, or complex documents—a process that introduces information loss and engineering complexity.GLM-4.6V is equipped with native multimodal tool calling capability:
* Multimodal Input:  Images, screenshots, and document pages can be passed directly as tool parameters without being converted to text descriptions first, minimizing signal loss.

* Multimodal Output:  The model can visually comprehend results returned by tools—such as searching results, statistical charts, rendered web screenshots, or retrieved product images—and incorporate them into subsequent reasoning chains.

This native support allows GLM-4.6V to close the loop from perception to understanding to execution, enabling complex tasks like mixed text-image content creation and visual web searching.2[](#capabilities-&-scenarios)
# Capabilities & Scenarios
*  Intelligent Image-Text Content Creation & Layout
*  Visual Web Search & Rich Media Report Generation
*  Frontend Replication & Visual Interaction
*  Long-Context Understanding
GLM-4.6V can accept multimodal inputs—mixed text/image papers, reports, or slides—and automatically generate high-quality, structured image-text interleaved content.
* Complex Document Understanding:  Accurately understands structured information from documents containing text, charts, figures, and formulas.

* Visual Tool Retrieval:  During generation, the model can autonomously call search tools to find candidate images or crop key visuals from the source multimodal context.

* Visual Audit & Layout:  The model performs a “visual audit” on candidate images to assess relevance and quality, filtering out noise to produce structured articles ready for social media or knowledge bases.

GLM-4.6V delivers an end-to-end multimodal search-and-analysis workflow, enabling the model to move seamlessly from visual perception to online retrieval and finally to structured and illustrated report generation. Across the entire process, it maintains multimodal context awareness and performs reasoning grounded in both textual and visual information.
* Intent Recognition and Search Planning:  For queries containing images, text, or both, GLM-4.6V identifies the user’s search intent and determines what information is needed. It then autonomously selects and triggers the appropriate search tools (e.g., text-to-image search, image-to-text search, or image-to-image matching) to retrieve relevant data.

* Multimodal Results Alignment:  The model reviews the mixed visual and textual information returned by the search tools, identifies the parts most relevant to the query, and uses them to support the subsequent reasoning and generation process.

* Reasoning & Rich Media Report Generation:  Leveraging relevant visual and textual cues retrieved from search, the model performs the necessary reasoning steps and generates a structured report, seamlessly integrating both visual and textual elements to match the task requirements.

We have optimized GLM-4.6V for frontend development, significantly shortening the “design to code” cycle.
* Pixel-Level Replication:  By uploading a screenshot or design file, the model identifies layouts, components, and color schemes to generate high-fidelity HTML/CSS/JS code.

* Visual Debugging:  Users can circle an area on a generated page screenshot and give natural language instructions (e.g., “Move this button left and make it dark blue”). The model automatically locates and corrects the corresponding code snippet.

GLM-4.6V aligns its visual encoder with a 128K context length, giving the model a massive memory capacity. In practice, this equates to processing ~150 pages of complex documents, 200 slide pages, or a one-hour video in a single inference pass.
* Financial Analysis:  In testing, GLM-4.6V successfully processed financial reports from four different public companies simultaneously, extracting core metrics across documents and synthesizing a comparative analysis table without losing key details.

* Video Understanding:  The model can perform global summarization on long videos while retaining the ability to perform fine-grained reasoning on temporal clues, such as summarizing goal events and timestamps in a full football match.

3[](#overall-performance)
# Overall Performance
We evaluated GLM-4.6V on over 20 mainstream multimodal benchmarks, including MMBench, MathVista, and OCRBench. The model achieves SOTA performance among open-source models of comparable scale in key capabilities such as multimodal interaction, logical reasoning, and long-context understanding.

# [​](#examples)    Examples

*  Intelligent Image-Text Content Creation & Layout
*  Frontend Replication & Visual Interaction
*  Multi-Image Processing Agent
*  Full Object Detection and Recognition
Highlights Analysis
* Supports native multimodality, enabling direct processing of documents containing visual elements (e.g., images, tables, curves, etc.). This eliminates the need for cumbersome and error-prone preprocessing steps such as OCR and document parsing.

* In addition to text output, the model is capable of independent decision-making to locate the pages and regions where relevant content resides. It can also invoke tools via MCP for screenshot capture and embedding, generating well-illustrated reports.

* On the basis of in-depth paper reading and information analysis & consolidation, the model is endowed with reasoning capabilities, allowing it to express its own “insights” on specific topics.

# Prompt
Based on the key visualizations from the two papers, this research report delivers a comprehensive, illustration-integrated analysis of the bench described in the literature.
# Display
Think
```
Alright, here&#x27;s the deal. The user wants me to act as a research report generator, analyzing two papers on AI-generated video benchmarks. I need to synthesize the information, focusing on the key visualizations and presenting it in a clear, integrated way. This is a common task, and I&#x27;m ready to dive in.
First, I need to understand the core of each paper. Paper 1, &quot;AIGCBench,&quot; seems to be about evaluating Image-to-Video (I2V) generation. It&#x27;s got a framework, datasets, and metrics. I&#x27;ll need to dig into its structure, especially Figure 1, which shows the overall setup. Then, I&#x27;ll look at the evaluation metrics, probably in Table 2. The visual comparisons of the generated videos in Figure 3 will be crucial for understanding the results. And, of course, the radar chart in Figure 4 will summarize the performance.
Next, Paper 2, &quot;FETV,&quot; focuses on Text-to-Video (T2V) generation. It emphasizes fine-grained evaluation, categorizing prompts by content, attributes, and complexity. I&#x27;ll need to understand the categorization framework, probably in Figure 1. The data distribution across these categories, shown in Figure 3 and 4, will be important. The radar charts in Figure 5 and 6 will show the model performance across different categories. And the leaderboards in Figure 7 will provide a quick overview of the rankings.
Now, the real work begins: synthesizing these two papers. I&#x27;ll need to structure the report logically. I&#x27;ll start with an introduction to set the stage. Then, I&#x27;ll dive into the benchmarks themselves, highlighting their different focuses. I&#x27;ll need to explain how AIGCBench is structured (Figure 1) and how FETV categorizes its prompts (Figure 1). Then, I&#x27;ll compare the evaluation metrics, probably using Table 1 and Table 2. I&#x27;ll need to discuss the visual results, using Figure 3 and Figures 5-7. Finally, I&#x27;ll wrap it up with a conclusion, emphasizing the strengths and weaknesses of each benchmark.
I need to make sure I&#x27;m using the images effectively, referencing them correctly, and providing a clear, concise analysis. The user wants a &quot;comprehensive, illustration-integrated analysis,&quot; so I need to deliver on that promise. Let&#x27;s get started!

```
Answer
```
Of course. Here is a research report that provides a comprehensive, illustration-integrated analysis of the two benchmarks described in the literature.
Research Report: A Comparative Analysis of AIGCBench and FETV for Evaluating AI-Generated Video
This report analyzes two key research papers that introduce novel benchmarks for evaluating AI-generated video content. The first, AIGCBench, focuses on a comprehensive evaluation of Image-to-Video (I2V) generation, while the second, FETV, proposes a benchmark for the fine-grained evaluation of open-domain Text-to-Video (T2V) generation. By examining their methodologies, datasets, evaluation metrics, and results, we can understand the current state and challenges of automated video generation assessment.
1. AIGCBench: A Comprehensive Benchmark for Image-to-Video Generation
AIGCBench is designed to address the limitations of existing benchmarks by providing a unified and scalable framework for evaluating I2V models. Its primary goal is to offer a fair comparison of different algorithms under equivalent conditions.
Framework and Datasets:
The AIGCBench framework is divided into three core modules: datasets, video generation models, and evaluation metrics. As illustrated in Figure 1, the benchmark utilizes two types of datasets: real-world video-text pairs and a novel set of image-text pairs generated through a proprietary pipeline.
!<image_ref>[1, [[102, 75, 887, 296]], &quot;Figure 1: Illustration of the AIGCBench framework.&quot;]</image_ref>
This pipeline, detailed in Figure 2, involves combining subjects, behaviors, backgrounds, and styles to create diverse prompts, which are then processed by GPT-4 for enhancement before being fed to a text-to-image model (Stable Diffusion) to generate the final image.
!<image_ref>[1, [[102, 71, 908, 466]], &quot;Figure 2: Image-text dataset generation pipeline and results.&quot;]</image_ref>
Evaluation Metrics and Results:
AIGCBench evaluates I2V models across four critical dimensions:
Control-Video Alignment: How well the generated video matches the input image.
Motion Effects: The quality and plausibility of the motion.
Temporal Consistency: The coherence of the video across time.
Video Quality: The overall aesthetic and technical quality.
The benchmark evaluates five state-of-the-art models: VideoCrafter, I2VGen-XL, SVD, Pika, and Gen-2. The quantitative results, summarized in Table 2, show that Gen-2 performs best in video quality, while SVD and Pika show strong performance in control-video alignment and temporal consistency.
!<table_ref>[1, [[90, 75, 907, 235]], &quot;Table 2: Quantitative analysis for different Image-to-Video algorithms.&quot;]</table_ref>
Qualitative comparisons in Figure 3 visually demonstrate the performance differences. For example, in the &quot;knight running&quot; prompt, Gen-2 produces a highly detailed and aesthetically pleasing video, whereas VideoCrafter and I2VGen-XL struggle to preserve the spatial structure of the original image.
!<image_ref>[1, [[92, 71, 910, 722]], &quot;Figure 3: Qualitative comparison of five I2V algorithms on three different prompts.&quot;]</image_ref>
A user study with 42 participants was conducted to validate the metrics. The results, visualized in a radar chart in Figure 4, show that Pika excels in motion effects and temporal consistency, while Gen-2 is favored for video quality.
!<image_ref>[1, [[385, 75, 614, 266]], &quot;Figure 4: Radar chart showing user preferences for different I2V algorithms.&quot;]</image_ref>
2. FETV: A Benchmark for Fine-Grained Text-to-Video Evaluation
FETV addresses the need for more nuanced evaluation of T2V models by introducing a multi-aspect categorization of prompts. Unlike benchmarks that provide only a single overall score, FETV breaks down evaluation into specific categories to reveal a model&#x27;s strengths and weaknesses.
Multi-Aspect Categorization:
FETV&#x27;s core innovation is its categorization of text prompts based on three orthogonal aspects, as shown in Figure 1:
Major Content: The primary subject (e.g., people, animals, scenery).
Attribute Control: Specific attributes the prompt aims to control (e.g., color, speed, motion direction).
Prompt Complexity: The complexity of the text prompt (simple, medium, complex).
This framework allows for a &quot;fine-grained evaluation&quot; that goes beyond a single score.
!<image_ref>[2, [[181, 71, 815, 314]], &quot;Figure 1: Illustration of FETV&#x27;s multi-aspect categorization.&quot;]</image_ref>
Evaluation and Results:
FETV evaluates four T2V models: CogVideo, Text2Video-zero, ModelScopeT2V, and ZeroScope. The evaluation is performed manually across four perspectives: static quality, temporal quality, overall alignment, and fine-grained alignment.
The results, presented in radar charts in Figure 5 and Figure 6, reveal significant variations in model performance across different categories. For instance, Figure 5 shows that ModelScopeT2V performs well on &quot;static quality&quot; for &quot;people&quot; and &quot;scenery&quot; but poorly on &quot;artifacts&quot; and &quot;vehicles.&quot;
!<image_ref>[2, [[267, 71, 731, 472]], &quot;Figure 5: Manual evaluation of static and temporal video quality across different major contents.&quot;]</image_ref>
Furthermore, Figure 6 demonstrates that models struggle with controlling specific attributes. For example, in the &quot;fine-grained alignment&quot; chart, all models show weakness in controlling &quot;event order.&quot;
!<image_ref>[2, [[181, 525, 807, 722]], &quot;Figure 6: Manual evaluation of video-text alignment across different attributes and complexities.&quot;]</image_ref>
The benchmark also includes leaderboards (Figure 7) that rank the models based on their overall performance in static quality, temporal quality, and alignment.
!<image_ref>[2, [[175, 71, 817, 196]], &quot;Figure 7: Leaderboard on the FETV benchmark based on manual evaluation.&quot;]</image_ref>
3. Comparative Analysis and Conclusion
Both AIGCBench and FETV represent significant steps forward in the standardized evaluation of AI-generated video, but they target different tasks and evaluation philosophies.
Scope: AIGCBench focuses specifically on the I2V task, evaluating how well a model can animate a static image. FETV, in contrast, is designed for the more open-ended T2V task, where the model must generate a video from a text description.
Evaluation Granularity: FETV&#x27;s primary strength is its &quot;fine-grained&quot; approach, using a detailed categorization system to pinpoint model weaknesses. AIGCBench provides a more holistic, four-dimensional score, offering a broader performance overview.
Methodology: AIGCBench combines both reference-dependent (video-dependent) and reference-free (video-free) metrics, along with human validation. FETV relies heavily on comprehensive manual evaluation to establish a ground truth, which it then uses to diagnose the reliability of automatic metrics.
In conclusion, these two benchmarks provide a more robust and multi-faceted way to assess AI video generation models. AIGCBench offers a comprehensive framework for fair I2V model comparison, while FETV pushes for a deeper, more nuanced understanding of T2V model capabilities. Together, they highlight the importance of diverse and detailed evaluation in driving progress in the field of AIGC.
Part 2. Image reference records
!<image_ref>[1, [[102, 75, 887, 296]], &quot;Figure 1: Illustration of the AIGCBench framework.&quot;]</image_ref>
!<image_ref>[1, [[102, 71, 908, 466]], &quot;Figure 2: Image-text dataset generation pipeline and results.&quot;]</image_ref>
!<image_ref>[1, [[92, 71, 910, 722]], &quot;Figure 3: Qualitative comparison of five I2V algorithms on three different prompts.&quot;]</image_ref>
!<image_ref>[1, [[385, 75, 614, 266]], &quot;Figure 4: Radar chart showing user preferences for different I2V algorithms.&quot;]</image_ref>
!<image_ref>[2, [[181, 71, 815, 314]], &quot;Figure 1: Illustration of FETV&#x27;s multi-aspect categorization.&quot;]</image_ref>
!<image_ref>[2, [[267, 71, 731, 472]], &quot;Figure 5: Manual evaluation of static and temporal video quality across different major contents.&quot;]</image_ref>
!<image_ref>[2, [[181, 525, 807, 722]], &quot;Figure 6: Manual evaluation of video-text alignment across different attributes and complexities.&quot;]</image_ref>
!<image_ref>[2, [[175, 71, 817, 196]], &quot;Figure 7: Leaderboard on the FETV benchmark based on manual evaluation.&quot;]</image_ref>
Part 3. Table reference records
!<table_ref>[1, [[90, 75, 907, 235]], &quot;Table 2: Quantitative analysis for different Image-to-Video algorithms.&quot;]</table_ref> Next, I need to call the image_reference tool to get the URL of the relevant image.

```
Rendered Result:Highlights Analysis
* Enhanced code execution & visual consistency

* True support for continuous multi-round iterative web page generation capabilities

* Support for long web page generation and multi-round editing capabilities

# Prompt
Help me generate the HTML code demonstrated in this video, which needs to include the clicks, redirects, interactions, and other features shown in the video.
# Display
Think
```
This is a complex task that requires me to recreate a dynamic webpage based on a series of video frames. The frames show the TripAdvisor website in Chinese. I need to build a React/Tailwind single-page application that mimics the interactions shown in the video.\n\nLet me analyze the key components and interactions from the video:\n\n1. Initial State: The homepage with a search bar, navigation menu, and a large hero image with a &quot;Search&quot; button.\n\n2. Navigation: The top navigation has options like &quot;Discover&quot; (发现), &quot;Travel&quot; (旅行), &quot;Reviews&quot; (点评), &quot;More&quot; (更多), a currency selector (USD), and a login button (登录).\n\n3. Search Bar: A prominent search bar with placeholder text for attractions, hotels, etc.\n\n4. Category Tabs: Below the search bar, there are tabs for different categories like &quot;Search All&quot; (搜索全部), &quot;Hotels&quot; (酒店), &quot;Attractions&quot; (景点玩乐), &quot;Food&quot; (美食).\n\n5. Scrolling Content: As the user scrolls down, different sections appear:\n - Hero banner with rotating images\n - &quot;Find attractions that match your interests&quot; section\n - Category cards for &quot;Outdoor Activities&quot; (户外活动), &quot;Food&quot; (美食), &quot;Culture&quot; (文化), &quot;Water Activities&quot; (水上活动)\n - &quot;Explore Abu Dhabi&quot; section\n - &quot;Unmissable activities in exciting locations&quot; section with activity cards\n - &quot;Go far beyond: Discover more magical moments in Saudi&quot; promotional section\n - &quot;Inspiration to help you plan&quot; section\n - &quot;Big cities, happy holidays&quot; section\n - &quot;Unmissable iconic locations&quot; section\n - &quot;Travelers&#x27; Choice Awards&quot; section\n - &quot;Browse theme series&quot; section\n\n6. Footer: The footer contains links to various pages and social media icons.\n\nNow I&#x27;ll create the HTML/React code to replicate this interface. I&#x27;ll focus on creating reusable components for repeating elements like activity cards and category cards.\n\nLet me start building the code:

```
Rendered Result:Highlights Analysis
* Stronger multi-image relational reasoning: Understands multiple screenshots from different sources and layouts, integrating information across images without requiring user-provided context per image.

* Precise multi-field extraction and validation: Automatically identifies key fields (order status, paid amount, merchant name, etc.) and filters entries based on business logic (e.g., excluding refunded orders).

* End-to-end cross-image logical reasoning: Performs the full reasoning chain—identify → validate → aggregate—to compute final results without manual step-by-step guidance.

* High robustness in real-world scenarios: Maintains consistent and reliable field recognition and logical judgment across diverse UI styles and layouts.

# Prompt

I want to buy AirPods 4. Could you circle the cheapest one for me?
# Display
Think
```
Okay, let&#x27;s see. The user wants me to circle the cheapest AirPods 4. I&#x27;ve got three images to work with, and I need to find the best deal.
First, I&#x27;ll look at the first image. It shows the standard AirPods 4 for $129 and the Active Noise Cancellation version for $179. The standard one is cheaper.
Next, I&#x27;ll check the second image. Here, I see two AirPods 4 options: one at $141.98 and another at $99.00. The $99.00 one is clearly the cheapest so far.
Finally, the third image shows an AirPods 4 for $169.00.
Comparing all the prices, the $99.00 AirPods 4 from the second image is the cheapest. I need to circle that one. The bounding box for that product is at [599, 99, 799, 599]. I&#x27;ll use that to draw the circle.

```
Rendered result：Highlights AnalysisFull Object Detection and Recognition: Based on the description of target categories or characteristics, output all qualified target detection boxes and their corresponding labels.
# Prompt
Identify the breeds of all cats in the image. Return the results in valid JSON format. The result should be a list, where each element in the list corresponds to a dictionary of target detection results. The dictionary keys are label and bbox_2d, with values being the detected cat breed and the result bounding box coordinates respectively.For example:[{&quot;label&quot;: &quot;Golden Shorthair-1&quot;, &quot;bbox_2d&quot;: [1,2,3,4]},{&quot;label&quot;: &quot;Golden Shorthair-2&quot;, &quot;bbox_2d&quot;: [4,5,6,7]}]
# Display
Think
```
I now need to address the user’s question, and first, I have to recall the breeds of the cats in the image. Let’s start with the first cat on the left: it has stripes and a raised tail, so it should be a tabby cat (e.g., an American Shorthair or British Shorthair, but this type of striped pattern is typically tabby). The second cat is also striped with a slightly curved tail—could it also be a tabby? Wait, no. The third cat is light brown and white; could it be a Siamese cat? Because Siamese cats are usually pointed or bicolor with a light coat. The fourth cat is a small gray-and-white kitten—could it be a Ragdoll? Do Ragdolls have long fur? No, the kitten in the image appears to have short fur, so maybe an American Shorthair? Wait, let me think again: the fifth cat is striped with a very high, raised tail—could it be a Maine Coon? Because Maine Coons have long, fluffy tails, yes, the fifth cat has a large, bushy tail, so it should be a Maine Coon. The sixth cat is a small gray shorthair—probably a British Shorthair? The seventh cat is a long-haired gray cat with a fluffy tail—could it be a Norwegian Forest Cat? Because Norwegian Forest Cats have long fur and large tails. The eighth cat is a small striped kitten—likely an American Shorthair tabby.
Now let’s count the number of cats in the image: counting left to right, there are 8 cats total. Let me confirm each one:
First cat on the left: tabby pattern, short fur, upright tail—likely a &quot;tabby cat&quot;.
Second cat: tabby pattern, curved tail, short fur—likely a &quot;tabby cat&quot; (same breed, different individual).
Third cat: light brown and white with pointed ears—likely a &quot;Siamese cat&quot; (Siamese cats are characterized by pointed coloration, pointed ears, and large eyes).
Fourth cat: gray-and-white, small build, short fur—likely an &quot;American Shorthair&quot; (American Shorthair: short fur, round face).
Fifth cat: striped with an especially long, fluffy tail—likely a &quot;Maine Coon&quot; (Maine Coons have long, dense fur on their tails).
Sixth cat: small gray shorthair—likely a &quot;British Shorthair&quot; (British Shorthair: round face, short fur).
Seventh cat: long-haired gray with a fluffy tail—likely a &quot;Norwegian Forest Cat&quot; (Norwegian Forest Cats have long fur, large tails, and a sturdy build).
Eighth cat (last on the right): small striped kitten, short fur—likely an &quot;American Shorthair tabby&quot;.
Next, I need to verify if the breed names are accurate and if there are more precise labels. For example, the third cat: Siamese cats are marked by pointed coloration (e.g., an M-shaped marking on the head), pointed ears, and blue or green eyes. The third cat in the image has pointed ears and a light brown-and-white coat, which matches Siamese characteristics. The fifth cat’s tail is indeed long and dense, so it is a Maine Coon. The seventh cat fits the profile of a Norwegian Forest Cat with its long fur and large tail. The others are common tabby cats, and American/British Shorthairs are common shorthair breeds.
Then, I need to define the position of each cat using bbox_2d, which represents coordinates in the format [x1, y1, x2, y2] (where y1 = top, y2 = bottom, x1 = left, x2 = right). For example:
The first cat (far left): approximate bbox is [100, 150, 190, 820]
The second cat: [180, 330, 310, 850]
The third cat: [300, 350, 430, 900]
The fourth cat: [420, 520, 510, 920]
The fifth cat: [500, 260, 605, 850]
The sixth cat: [600, 450, 700, 870]
The seventh cat: [680, 120, 800, 830]
The eighth cat: [800, 480, 885, 830]
These coordinates are approximate (based on position in the image) and do not require precise pixel values—only general ranges.
Finally, organize this into a JSON list where each element is a dictionary. The label should be the breed plus a serial number (e.g., &quot;Tabby Cat-1&quot;, &quot;Tabby Cat-2&quot;, and so on).

```
Answer
```
[
    {&quot;label&quot;: &quot;Tabby Cat-1&quot;, &quot;bbox_2d&quot;: [95, 152, 192, 825]},
    {&quot;label&quot;: &quot;Tabby Cat-2&quot;, &quot;bbox_2d&quot;: [185, 332, 310, 852]},
    {&quot;label&quot;: &quot;Siamese Cat-1&quot;, &quot;bbox_2d&quot;: [295, 352, 428, 902]},
    {&quot;label&quot;: &quot;American Shorthair-1&quot;, &quot;bbox_2d&quot;: [415, 520, 508, 922]},
    {&quot;label&quot;: &quot;Maine Coon-1&quot;, &quot;bbox_2d&quot;: [498, 262, 603, 852]},
    {&quot;label&quot;: &quot;British Shorthair-1&quot;, &quot;bbox_2d&quot;: [603, 452, 697, 872]},
    {&quot;label&quot;: &quot;Norwegian Forest Cat-1&quot;, &quot;bbox_2d&quot;: [685, 120, 797, 832]},
    {&quot;label&quot;: &quot;Tabby Cat-3&quot;, &quot;bbox_2d&quot;: [802, 482, 882, 832]}
]

```

# [​](#quick-start)    Quick Start

*  cURL
*  Python
*  Java
Basic Call
```
curl -X POST \
    https://api.z.ai/api/paas/v4/chat/completions \
    -H &quot;Authorization: Bearer your-api-key&quot; \
    -H &quot;Content-Type: application/json&quot; \
    -d &#x27;{
        &quot;model&quot;: &quot;glm-4.6v&quot;,
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
curl -X POST \
    https://api.z.ai/api/paas/v4/chat/completions \
    -H &quot;Authorization: Bearer your-api-key&quot; \
    -H &quot;Content-Type: application/json&quot; \
    -d &#x27;{
        &quot;model&quot;: &quot;glm-4.6v&quot;,
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
    model=&quot;glm-4.6v&quot;,  # Enter the name of the model you want to call
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
    model=&quot;glm-4.6v&quot;,  # Enter the name of the model you want to call
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
            .model(&quot;glm-4.6v&quot;)
            .messages(Arrays.asList(
                ChatMessage.builder()
                    .role(ChatMessageRole.USER.value())
                    .content(Arrays.asList(
                        MessageContent.builder()
                            .type(&quot;text&quot;)
                            .text(&quot;Describe this image.&quot;)
                            .build(),
                        MessageContent.builder()
                            .type(&quot;image_url&quot;)
                            .imageUrl(ImageUrl.builder()
                                .url(&quot;https://aigc-files.bigmodel.cn/api/cogview/20250723213827da171a419b9b4906_0.png&quot;)
                                .build())
                    .build()))
                .build()))
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
            .model(&quot;glm-4.6v&quot;)
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

YesNo[GLM-5V-Turbo](/guides/vlm/glm-5v-turbo)[GLM-OCR](/guides/vlm/glm-ocr)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
