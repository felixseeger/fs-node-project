# AutoGLM-Phone-Multilingual - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/vlm/autoglm-phone-multilingual

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationVision Language ModelsAutoGLM-Phone-Multilingual[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [   Introducing AutoGLM-Phone-Multilingual](#introducing-autoglm-phone-multilingual)
* [    Examples](#examples)
* [    Invocation Guide](#invocation-guide)
* [Environment Setup](#environment-setup)
* [1. Python Environment](#1-python-environment)
* [2. ADB (Android Debug Bridge)](#2-adb-android-debug-bridge)
* [3. Android Device Configuration](#3-android-device-configuration)
* [4. Install ADB Keyboard](#4-install-adb-keyboard)
* [Deployment Preparation](#deployment-preparation)
* [1. Clone the Repository](#1-clone-the-repository)
* [2. Install Dependencies](#2-install-dependencies)
* [3. Configure ADB Connection](#3-configure-adb-connection)
* [4. Configure Model API](#4-configure-model-api)
Vision Language Models
# AutoGLM-Phone-Multilingual
Copy pageCopy page
# [​](#overview)   Overview

AutoGLM-Phone-Multilingual is a mobile intelligent assistant framework built on vision-language models. It understands phone screen content in a multimodal manner and helps users complete tasks through automated operations. The system controls devices via ADB (Android Debug Bridge), perceives screens, and generates and executes operation workflows through intelligent planning. Users simply describe their needs in natural language, such as “Open eBay and search for wireless earphones.” and AutoGLM-Phone-Multilingual will complete the entire workflow.
New model launched, free for a limited time!

# Input Modality
Task Instructions
# Output Modality
Task Action
# Supported Languages
English & Chinese
# Supported Hardware Devices
Android Phone

# [​](#usage)   Usage

Order Food Delivery

Place orders for specific products from designated merchants on food delivery platforms, or request to reorder the meal you most recently purchased.Product Purchase

Place orders on shopping websites or check product reviews.Transportation Services

Route planning, nearby searches, flight and ticket booking, hotel reservations, and more.News & Information

Search for news, play songs and videos, and interact through likes, comments, and favorites.Housing & Rentals

Search for rentals based on location, budget, layout, and other criteria.

# [​](#resources)   Resources

* [API Documentation](/api-reference/llm/chat-completion#vision-model): Learn how to call the API.

# [​](#introducing-autoglm-phone-multilingual)   Introducing AutoGLM-Phone-Multilingual

1[](#)
# Model Highlights

* Technical Breadth:  Powered by the AutoGLM multimodal model combined with ADB-based device control, integrating a complete capability stack including visual understanding, task planning, and tool execution.

* Commercial Validation:  Its practicality and stability have been verified across multiple partnerships and testing scenarios.

* Application Value:  Delivers true end-to-end intelligence, enabling a “say it, get it” mobile control experience.

2[](#)
# Supported Apps
AutoGLM-Phone-Multilingual supports 50+ mainstream applications:CategoryAppsSocial & MessagingX, Tiktok, WhatsApp, Telegram, FacebookMessenger, GoogleChat, Quora, Reddit, InstagramProductivity & OfficeGmail, GoogleCalendar, GoogleDrive, GoogleDocs, GoogleTasks, JoplinLife, Shopping & FinanceAmazon shopping, Temu, Bluecoins, Duolingo, GoogleFit, ebayUtilities & MediaGoogleClock, Chrome, GooglePlayStore, GooglePlayBooks, FilesbyGoogleTravel & NavigationGoogleMaps, [Booking.com](http://booking.com/), [Trip.com](http://trip.com/), Expedia, OpenTracksTo see the full list of supported apps, run the scripts in [github](https://github.com/zai-org/Open-AutoGLM/blob/main/README.md#%E6%94%AF%E6%8C%81%E7%9A%84%E5%BA%94%E7%94%A8) (feel free to give us a star~)3[](#)
# Available Actions
AutoGLM-Phone-Multilingual can perform the following actions:ActionDescriptionLaunchLaunch an appTapTap at specified coordinatesTypeInput textSwipeSwipe the screenBackGo back to previous pageHomeReturn to home screenLong PressLong pressDouble TapDouble tapWaitWait for page to loadTake_overRequest manual takeover (login/captcha)

# [​](#examples)    Examples

*  Play a Taylor Swift song for me.
*  Turn your phone volume up to the maximum.

# [​](#invocation-guide)    Invocation Guide

# [​](#environment-setup)Environment Setup

# [​](#1-python-environment)1. Python Environment

It is recommended to use Python 3.10.

# [​](#2-adb-android-debug-bridge)2. ADB (Android Debug Bridge)

* Download the official ADB package and extract it to a custom directory.

[https://developer.android.com/tools/releases/platform-tools?hl=zh-cn](https://developer.android.com/tools/releases/platform-tools?hl=zh-cn)

Configure environment variables:

* MacOS：export PATH=${PATH}:~/Downloads/platform-tools

* Windows:  Refer to third-party tutorials to configure environment variables.

* Verify whether ADB is installed successfully:

```
# adb --version

Android Debug Bridge version 1.0.41
Version 36.0.0-13206524
Installed as /opt/homebrew/bin/adb
Running on Darwin 22.4.0 (arm64)

```

# [​](#3-android-device-configuration)3. Android Device Configuration

* Android 7.0+ device or emulator

* Enable Developer Mode: Settings → About phone → Tap “Build number” 10 times consecutively

* Enable USB Debugging: Settings → Developer options → USB debugging

# [​](#4-install-adb-keyboard)4. Install ADB Keyboard

Download ADBKeyboard.apk and install it on the device. After installation, go to Settings → Input method and enable ADB Keyboard.
[https://github.com/senzhk/ADBKeyBoard/blob/master/ADBKeyboard.apk](https://github.com/senzhk/ADBKeyBoard/blob/master/ADBKeyboard.apk)

# [​](#deployment-preparation)Deployment Preparation

# [​](#1-clone-the-repository)1. Clone the Repository

```
git clone https://github.com/zai-org/Open-AutoGLM.git

```

# [​](#2-install-dependencies)2. Install Dependencies

```
pip install -r requirements.txt
pip install -e .

```

# [​](#3-configure-adb-connection)3. Configure ADB Connection

```
# Check connected devices
adb devices
# Output should show your device, e.g.
# List of devices attached
# emulator-5554   device

```

# [​](#4-configure-model-api)4. Configure Model API

```
python main.py --base-url https://api-inference.modelscope.cn/v1 --model &quot;ZAI/AutoGLM-Phone-9B&quot; --apikey &quot;your-zai-api-key&quot; &quot;&quot;Open Chrome browser&quot;

```
Was this page helpful?

YesNo[GLM-OCR](/guides/vlm/glm-ocr)[GLM-4.5V](/guides/vlm/glm-4.5v)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
