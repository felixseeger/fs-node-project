# Structured Output - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/capabilities/struct-output

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationCapabilitiesStructured Output[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [Core Parameters](#core-parameters)
* [Code Examples](#code-examples)
* [Basic Usage](#basic-usage)
* [Scenario Examples](#scenario-examples)
* [Best Practices](#best-practices)
Capabilities
# Structured Output
Copy pageCopy pageStructured output (JSON mode) ensures that AI returns JSON data conforming to predefined formats, providing reliable guarantees for programmatic processing of AI outputs.

# [​](#features)Features

The structured output feature provides AI models with strict data format control capabilities, supporting various complex data structures and validation requirements.

# [​](#core-parameters)Core Parameters

* response_format: Specifies the response format, set to {&quot;type&quot;: &quot;json_object&quot;} to enable JSON mode

* model: Use models that support structured output, such as glm-5, glm-4.7, glm-4.5, glm-4.6, etc.

* messages: Define the expected JSON structure and field requirements in system messages

# [​](#code-examples)Code Examples

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
The following is a complete structured output example demonstrating how to perform sentiment analysis and return structured JSON results:

```
from zai import ZaiClient
import json

# Initialize client
client = ZaiClient(api_key=&quot;your-api-key&quot;)

# Basic JSON mode
response = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: &quot;&quot;&quot;
            You are a sentiment analysis expert. Please return analysis results in the following JSON format:
            {
                &quot;sentiment&quot;: &quot;positive/negative/neutral&quot;,
                &quot;confidence&quot;: 0.95,
                &quot;emotions&quot;: [&quot;joy&quot;, &quot;excitement&quot;],
                &quot;keywords&quot;: [&quot;weather&quot;, &quot;mood&quot;],
                &quot;analysis&quot;: &quot;Detailed analysis explanation&quot;
            }
            &quot;&quot;&quot;
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Please analyze the sentiment of this sentence: &#x27;The weather is really nice today, I&#x27;m feeling very happy!&#x27;&quot;
        }
    ],
    response_format={
        &quot;type&quot;: &quot;json_object&quot;
    }
)

# Parse results
result = json.loads(response.choices[0].message.content)
print(f&quot;Sentiment: {result[&#x27;sentiment&#x27;]}&quot;)
print(f&quot;Confidence: {result[&#x27;confidence&#x27;]}&quot;)
print(f&quot;Emotions: {result[&#x27;emotions&#x27;]}&quot;)

```

# [​](#basic-usage)Basic Usage

*  Simple JSON Output
*  Specify JSON Structure
*  Schema Validation
Simple JSON Output
```
from zai import ZaiClient

client = ZaiClient(api_key=&quot;your-api-key&quot;)

# Basic JSON mode
response = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Please analyze the sentiment of this sentence: &#x27;The weather is really nice today, I&#x27;m feeling very happy!&#x27;&quot;
        }
    ],
    response_format={
        &quot;type&quot;: &quot;json_object&quot;
    }
)

import json
result = json.loads(response.choices[0].message.content)
print(result)

```

# [​](#specify-json-structure)Specify JSON Structure

```
# Specify specific JSON structure
response = client.chat.completions.create(
    model=&quot;glm-5&quot;,
    messages=[
        {
            &quot;role&quot;: &quot;system&quot;,
            &quot;content&quot;: &quot;&quot;&quot;
            You are a sentiment analysis expert. Please return analysis results in the following JSON format:
            {
                &quot;sentiment&quot;: &quot;positive/negative/neutral&quot;,
                &quot;confidence&quot;: 0.95,
                &quot;emotions&quot;: [&quot;joy&quot;, &quot;excitement&quot;],
                &quot;keywords&quot;: [&quot;weather&quot;, &quot;mood&quot;],
                &quot;analysis&quot;: &quot;Detailed analysis explanation&quot;
            }
            &quot;&quot;&quot;
        },
        {
            &quot;role&quot;: &quot;user&quot;,
            &quot;content&quot;: &quot;Please analyze the sentiment of this sentence: &#x27;The weather is really nice today, I&#x27;m feeling very happy!&#x27;&quot;
        }
    ],
    response_format={
        &quot;type&quot;: &quot;json_object&quot;
    }
)

result = json.loads(response.choices[0].message.content)
print(f&quot;Sentiment: {result[&#x27;sentiment&#x27;]}&quot;)
print(f&quot;Confidence: {result[&#x27;confidence&#x27;]}&quot;)
print(f&quot;Emotions: {result[&#x27;emotions&#x27;]}&quot;)

```

# [​](#using-json-schema-validation)Using JSON Schema Validation

```
import jsonschema
from jsonschema import validate

# Define JSON Schema
schema = {
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;sentiment&quot;: {
            &quot;type&quot;: &quot;string&quot;,
            &quot;enum&quot;: [&quot;positive&quot;, &quot;negative&quot;, &quot;neutral&quot;]
        },
        &quot;confidence&quot;: {
            &quot;type&quot;: &quot;number&quot;,
            &quot;minimum&quot;: 0,
            &quot;maximum&quot;: 1
        },
        &quot;emotions&quot;: {
            &quot;type&quot;: &quot;array&quot;,
            &quot;items&quot;: {&quot;type&quot;: &quot;string&quot;}
        },
        &quot;keywords&quot;: {
            &quot;type&quot;: &quot;array&quot;,
            &quot;items&quot;: {&quot;type&quot;: &quot;string&quot;}
        },
        &quot;analysis&quot;: {
            &quot;type&quot;: &quot;string&quot;
        }
    },
    &quot;required&quot;: [&quot;sentiment&quot;, &quot;confidence&quot;, &quot;analysis&quot;]
}

def analyze_sentiment_with_validation(text):
    &quot;&quot;&quot;Sentiment analysis with validation&quot;&quot;&quot;
    response = client.chat.completions.create(
        model=&quot;glm-5&quot;,
        messages=[
            {
                &quot;role&quot;: &quot;system&quot;,
                &quot;content&quot;: f&quot;&quot;&quot;
                Please return sentiment analysis results according to the following JSON Schema format:
                {json.dumps(schema, indent=2, ensure_ascii=False)}
                &quot;&quot;&quot;
            },
            {
                &quot;role&quot;: &quot;user&quot;,
                &quot;content&quot;: f&quot;Please analyze the sentiment of this sentence: &#x27;{text}&#x27;&quot;
            }
        ],
        response_format={&quot;type&quot;: &quot;json_object&quot;}
    )
    
    try:
        result = json.loads(response.choices[0].message.content)
        # Validate JSON structure
        validate(instance=result, schema=schema)
        return result
    except jsonschema.exceptions.ValidationError as e:
        print(f&quot;JSON validation failed: {e}&quot;)
        return None
    except json.JSONDecodeError as e:
        print(f&quot;JSON parsing failed: {e}&quot;)
        return None

# Usage example
result = analyze_sentiment_with_validation(&quot;The weather is really nice today, I&#x27;m feeling very happy!&quot;)
if result:
    print(&quot;Analysis result:&quot;, result)

```

# [​](#scenario-examples)Scenario Examples

When using JSON mode for data extraction, please ensure the quality and format of input data to achieve the best extraction results.
Data Extraction and Structuring Complete Implementation

```
class DataExtractor:
    def __init__(self, api_key):
        self.client = ZaiClient(api_key=api_key)
    
    def extract_contact_info(self, text):
        &quot;&quot;&quot;Extract contact information&quot;&quot;&quot;
        schema = {
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;contacts&quot;: {
                    &quot;type&quot;: &quot;array&quot;,
                    &quot;items&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;name&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;phone&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;email&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;company&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;position&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;address&quot;: {&quot;type&quot;: &quot;string&quot;}
                        },
                        &quot;required&quot;: [&quot;name&quot;]
                    }
                },
                &quot;total_count&quot;: {&quot;type&quot;: &quot;integer&quot;},
                &quot;extraction_confidence&quot;: {&quot;type&quot;: &quot;number&quot;}
            },
            &quot;required&quot;: [&quot;contacts&quot;, &quot;total_count&quot;]
        }
        
        response = self.client.chat.completions.create(
            model=&quot;glm-5&quot;,
            messages=[
                {
                    &quot;role&quot;: &quot;system&quot;,
                    &quot;content&quot;: f&quot;&quot;&quot;
                    You are an information extraction expert. Please extract all contact information from the text,
                    return in the following JSON format:
                    {json.dumps(schema, indent=2, ensure_ascii=False)}
                    
                    Note:
                    - If a field has no information, do not include that field
                    - phone field should be in standardized phone number format
                    - email field should be a valid email address
                    - extraction_confidence represents overall extraction confidence (0-1)
                    &quot;&quot;&quot;
                },
                {
                    &quot;role&quot;: &quot;user&quot;,
                    &quot;content&quot;: f&quot;Please extract contact information from the following text:\n\n{text}&quot;
                }
            ],
            response_format={&quot;type&quot;: &quot;json_object&quot;}
        )
        
        try:
            result = json.loads(response.choices[0].message.content)[&quot;properties&quot;]
            validate(instance=result, schema=schema)
            return result
        except Exception as e:
            print(f&quot;Extraction failed: {e}&quot;)
            return None
    
    def extract_product_info(self, product_description):
        &quot;&quot;&quot;Extract product information&quot;&quot;&quot;
        schema = {
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;product_name&quot;: {&quot;type&quot;: &quot;string&quot;},
                &quot;brand&quot;: {&quot;type&quot;: &quot;string&quot;},
                &quot;category&quot;: {&quot;type&quot;: &quot;string&quot;},
                &quot;price&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;properties&quot;: {
                        &quot;amount&quot;: {&quot;type&quot;: &quot;number&quot;},
                        &quot;currency&quot;: {&quot;type&quot;: &quot;string&quot;},
                        &quot;original_price&quot;: {&quot;type&quot;: &quot;number&quot;},
                        &quot;discount&quot;: {&quot;type&quot;: &quot;number&quot;}
                    }
                },
                &quot;specifications&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;additionalProperties&quot;: True
                },
                &quot;features&quot;: {
                    &quot;type&quot;: &quot;array&quot;,
                    &quot;items&quot;: {&quot;type&quot;: &quot;string&quot;}
                },
                &quot;availability&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;properties&quot;: {
                        &quot;in_stock&quot;: {&quot;type&quot;: &quot;boolean&quot;},
                        &quot;quantity&quot;: {&quot;type&quot;: &quot;integer&quot;},
                        &quot;shipping_time&quot;: {&quot;type&quot;: &quot;string&quot;}
                    }
                },
                &quot;ratings&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;properties&quot;: {
                        &quot;average_rating&quot;: {&quot;type&quot;: &quot;number&quot;},
                        &quot;total_reviews&quot;: {&quot;type&quot;: &quot;integer&quot;}
                    }
                }
            },
            &quot;required&quot;: [&quot;product_name&quot;]
        }
        
        response = self.client.chat.completions.create(
            model=&quot;glm-5&quot;,
            messages=[
                {
                    &quot;role&quot;: &quot;system&quot;,
                    &quot;content&quot;: f&quot;&quot;&quot;
                    Please extract structured information from product description, return in the following format:
                    {json.dumps(schema, indent=2, ensure_ascii=False)}
                    
                    Note:
                    - Price information should accurately extract values and currency units
                    - specifications should include all technical specifications
                    - features should list main functional features
                    - Do not guess if information is unclear
                    &quot;&quot;&quot;
                },
                {
                    &quot;role&quot;: &quot;user&quot;,
                    &quot;content&quot;: f&quot;Product description:\n{product_description}&quot;
                }
            ],
            response_format={&quot;type&quot;: &quot;json_object&quot;}
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            validate(instance=result, schema=schema)
            return result
        except Exception as e:
            print(f&quot;Product information extraction failed: {e}&quot;)
            return None
    
    def extract_event_info(self, event_text):
        &quot;&quot;&quot;Extract event information&quot;&quot;&quot;
        schema = {
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;events&quot;: {
                    &quot;type&quot;: &quot;array&quot;,
                    &quot;items&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;title&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;description&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;start_time&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;end_time&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;location&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;organizer&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;participants&quot;: {
                                &quot;type&quot;: &quot;array&quot;,
                                &quot;items&quot;: {&quot;type&quot;: &quot;string&quot;}
                            },
                            &quot;category&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;priority&quot;: {
                                &quot;type&quot;: &quot;string&quot;,
                                &quot;enum&quot;: [&quot;high&quot;, &quot;medium&quot;, &quot;low&quot;]
                            },
                            &quot;status&quot;: {
                                &quot;type&quot;: &quot;string&quot;,
                                &quot;enum&quot;: [&quot;scheduled&quot;, &quot;ongoing&quot;, &quot;completed&quot;, &quot;cancelled&quot;]
                            }
                        },
                        &quot;required&quot;: [&quot;title&quot;, &quot;start_time&quot;]
                    }
                }
            },
            &quot;required&quot;: [&quot;events&quot;]
        }
        
        response = self.client.chat.completions.create(
            model=&quot;glm-5&quot;,
            messages=[
                {
                    &quot;role&quot;: &quot;system&quot;,
                    &quot;content&quot;: f&quot;&quot;&quot;
                    Please extract all event information from the text, return in the following format:
                    {json.dumps(schema, indent=2, ensure_ascii=False)}
                    
                    Time format requirements:
                    - Use ISO 8601 format: YYYY-MM-DDTHH:MM:SS
                    - If only date available, use: YYYY-MM-DD
                    - If time is unclear, try to infer reasonable time
                    &quot;&quot;&quot;
                },
                {
                    &quot;role&quot;: &quot;user&quot;,
                    &quot;content&quot;: f&quot;Please extract event information from the following text:\n\n{event_text}&quot;
                }
            ],
            response_format={&quot;type&quot;: &quot;json_object&quot;}
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            validate(instance=result, schema=schema)
            return result
        except Exception as e:
            print(f&quot;Event information extraction failed: {e}&quot;)
            return None

# Usage example
extractor = DataExtractor(&quot;your_api_key&quot;)

# Extract contact information
contact_text = &quot;&quot;&quot;
Zhang San, mobile: 13800138000, email: zhangsan@example.com,
works as Technical Director at Beijing Technology Co., Ltd.
Company address: No. 123, Technology Park, Chaoyang District, Beijing.

Li Si, phone: 010-12345678, work email: lisi@company.com,
is a Product Manager at Shanghai Innovation Company.
&quot;&quot;&quot;

contacts = extractor.extract_contact_info(contact_text)
if contacts:
    print(f&quot;Extracted {contacts[&#x27;total_count&#x27;]} contacts&quot;)
    for contact in contacts[&#x27;contacts&#x27;]:
        print(f&quot;Name: {contact[&#x27;name&#x27;]}&quot;)
        if &#x27;phone&#x27; in contact:
            print(f&quot;Phone: {contact[&#x27;phone&#x27;]}&quot;)

```

API Response Formatting Complete Implementation

```
class APIResponseFormatter:
    def __init__(self, api_key):
        self.client = ZaiClient(api_key=api_key)
    
    def format_search_results(self, query, raw_results):
        &quot;&quot;&quot;Format search results&quot;&quot;&quot;
        schema = {
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;query&quot;: {&quot;type&quot;: &quot;string&quot;},
                &quot;total_results&quot;: {&quot;type&quot;: &quot;integer&quot;},
                &quot;results&quot;: {
                    &quot;type&quot;: &quot;array&quot;,
                    &quot;items&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;title&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;url&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;snippet&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;relevance_score&quot;: {&quot;type&quot;: &quot;number&quot;},
                            &quot;source_type&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;publish_date&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;tags&quot;: {
                                &quot;type&quot;: &quot;array&quot;,
                                &quot;items&quot;: {&quot;type&quot;: &quot;string&quot;}
                            }
                        },
                        &quot;required&quot;: [&quot;title&quot;, &quot;url&quot;, &quot;snippet&quot;]
                    }
                },
                &quot;suggestions&quot;: {
                    &quot;type&quot;: &quot;array&quot;,
                    &quot;items&quot;: {&quot;type&quot;: &quot;string&quot;}
                },
                &quot;filters&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;properties&quot;: {
                        &quot;date_range&quot;: {&quot;type&quot;: &quot;string&quot;},
                        &quot;source_types&quot;: {
                            &quot;type&quot;: &quot;array&quot;,
                            &quot;items&quot;: {&quot;type&quot;: &quot;string&quot;}
                        },
                        &quot;languages&quot;: {
                            &quot;type&quot;: &quot;array&quot;,
                            &quot;items&quot;: {&quot;type&quot;: &quot;string&quot;}
                        }
                    }
                }
            },
            &quot;required&quot;: [&quot;query&quot;, &quot;total_results&quot;, &quot;results&quot;]
        }
        
        response = self.client.chat.completions.create(
            model=&quot;glm-5&quot;,
            messages=[
                {
                    &quot;role&quot;: &quot;system&quot;,
                    &quot;content&quot;: f&quot;&quot;&quot;
                    Please format search results into standard JSON format:
                    {json.dumps(schema, indent=2, ensure_ascii=False)}
                    
                    Requirements:
                    - Calculate relevance score for each result (0-1)
                    - Identify content type (article, video, image, document, etc.)
                    - Extract publish date (if available)
                    - Generate relevant tags
                    - Provide search suggestions
                    &quot;&quot;&quot;
                },
                {
                    &quot;role&quot;: &quot;user&quot;,
                    &quot;content&quot;: f&quot;Query: {query}\n\nRaw results:\n{raw_results}&quot;
                }
            ],
            response_format={&quot;type&quot;: &quot;json_object&quot;}
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            validate(instance=result, schema=schema)
            return result
        except Exception as e:
            print(f&quot;Formatting failed: {e}&quot;)
            return None
    
    def format_analytics_data(self, raw_data, metrics):
        &quot;&quot;&quot;Format analytics data&quot;&quot;&quot;
        schema = {
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;summary&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;properties&quot;: {
                        &quot;total_records&quot;: {&quot;type&quot;: &quot;integer&quot;},
                        &quot;date_range&quot;: {
                            &quot;type&quot;: &quot;object&quot;,
                            &quot;properties&quot;: {
                                &quot;start_date&quot;: {&quot;type&quot;: &quot;string&quot;},
                                &quot;end_date&quot;: {&quot;type&quot;: &quot;string&quot;}
                            }
                        },
                        &quot;key_insights&quot;: {
                            &quot;type&quot;: &quot;array&quot;,
                            &quot;items&quot;: {&quot;type&quot;: &quot;string&quot;}
                        }
                    }
                },
                &quot;metrics&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;additionalProperties&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;current_value&quot;: {&quot;type&quot;: &quot;number&quot;},
                            &quot;previous_value&quot;: {&quot;type&quot;: &quot;number&quot;},
                            &quot;change_percentage&quot;: {&quot;type&quot;: &quot;number&quot;},
                            &quot;trend&quot;: {
                                &quot;type&quot;: &quot;string&quot;,
                                &quot;enum&quot;: [&quot;up&quot;, &quot;down&quot;, &quot;stable&quot;]
                            },
                            &quot;unit&quot;: {&quot;type&quot;: &quot;string&quot;}
                        }
                    }
                },
                &quot;time_series&quot;: {
                    &quot;type&quot;: &quot;array&quot;,
                    &quot;items&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;timestamp&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;values&quot;: {
                                &quot;type&quot;: &quot;object&quot;,
                                &quot;additionalProperties&quot;: {&quot;type&quot;: &quot;number&quot;}
                            }
                        }
                    }
                },
                &quot;segments&quot;: {
                    &quot;type&quot;: &quot;array&quot;,
                    &quot;items&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;name&quot;: {&quot;type&quot;: &quot;string&quot;},
                            &quot;value&quot;: {&quot;type&quot;: &quot;number&quot;},
                            &quot;percentage&quot;: {&quot;type&quot;: &quot;number&quot;},
                            &quot;color&quot;: {&quot;type&quot;: &quot;string&quot;}
                        }
                    }
                }
            },
            &quot;required&quot;: [&quot;summary&quot;, &quot;metrics&quot;]
        }
        
        response = self.client.chat.completions.create(
            model=&quot;glm-5&quot;,
            messages=[
                {
                    &quot;role&quot;: &quot;system&quot;,
                    &quot;content&quot;: f&quot;&quot;&quot;
                    Please format analytics data into standard format:
                    {json.dumps(schema, indent=2, ensure_ascii=False)}
                    
                    Focus indicators:{&#x27;, &#x27;.join(metrics)}
                    
                    Requirements:
                    - Calculate change percentage and trend
                    - Provide key insights
                    - Time series data sorted by time
                    - Segments data contain percentage
                    &quot;&quot;&quot;
                },
                {
                    &quot;role&quot;: &quot;user&quot;,
                    &quot;content&quot;: f&quot;Raw data: \n{raw_data}&quot;
                }
            ],
            response_format={&quot;type&quot;: &quot;json_object&quot;}
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            validate(instance=result, schema=schema)
            return result
        except Exception as e:
            print(f&quot;Analytics data formatting failed: {e}&quot;)
            return None

# Usage example
formatter = APIResponseFormatter(&quot;your_api_key&quot;)

# Format search results
raw_search = &quot;&quot;&quot;
1. Python Programming Tutorial - https://example.com/python-tutorial
   Detailed introduction to Python basic syntax and programming concepts...

2. Python Data Analysis Practice - https://example.com/python-data
   Using pandas and numpy for data processing...
&quot;&quot;&quot;

formatted_results = formatter.format_search_results(&quot;Python Tutorial&quot;, raw_search)
if formatted_results:
    print(f&quot;Found {formatted_results[&#x27;total_results&#x27;]} results&quot;)
    for result in formatted_results[&#x27;results&#x27;]:
        print(f&quot;Title: {result[&#x27;title&#x27;]}&quot;)
        print(f&quot;Relevance: {result[&#x27;relevance_score&#x27;]}&quot;)

```

Configuration Management and Validation Complete Implementation

```
class ConfigurationManager:
    def __init__(self, api_key):
        self.client = ZaiClient(api_key=api_key)

    def parse_config_file(self, config_text, config_type=&quot;general&quot;):
        &quot;&quot;&quot;Parse configuration file&quot;&quot;&quot;
        schemas = {
            &quot;database&quot;: {
                &quot;type&quot;: &quot;object&quot;,
                &quot;properties&quot;: {
                    &quot;connections&quot;: {
                        &quot;type&quot;: &quot;array&quot;,
                        &quot;items&quot;: {
                            &quot;type&quot;: &quot;object&quot;,
                            &quot;properties&quot;: {
                                &quot;name&quot;: {&quot;type&quot;: &quot;string&quot;},
                                &quot;host&quot;: {&quot;type&quot;: &quot;string&quot;},
                                &quot;port&quot;: {&quot;type&quot;: &quot;integer&quot;},
                                &quot;database&quot;: {&quot;type&quot;: &quot;string&quot;},
                                &quot;username&quot;: {&quot;type&quot;: &quot;string&quot;},
                                &quot;ssl&quot;: {&quot;type&quot;: &quot;boolean&quot;},
                                &quot;pool_size&quot;: {&quot;type&quot;: &quot;integer&quot;}
                            },
                            &quot;required&quot;: [&quot;name&quot;, &quot;host&quot;, &quot;database&quot;]
                        }
                    },
                    &quot;settings&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;timeout&quot;: {&quot;type&quot;: &quot;integer&quot;},
                            &quot;retry_attempts&quot;: {&quot;type&quot;: &quot;integer&quot;},
                            &quot;log_level&quot;: {
                                &quot;type&quot;: &quot;string&quot;,
                                &quot;enum&quot;: [&quot;DEBUG&quot;, &quot;INFO&quot;, &quot;WARNING&quot;, &quot;ERROR&quot;]
                            }
                        }
                    }
                },
                &quot;required&quot;: [&quot;connections&quot;]
            },
            &quot;api&quot;: {
                &quot;type&quot;: &quot;object&quot;,
                &quot;properties&quot;: {
                    &quot;endpoints&quot;: {
                        &quot;type&quot;: &quot;array&quot;,
                        &quot;items&quot;: {
                            &quot;type&quot;: &quot;object&quot;,
                            &quot;properties&quot;: {
                                &quot;name&quot;: {&quot;type&quot;: &quot;string&quot;},
                                &quot;url&quot;: {&quot;type&quot;: &quot;string&quot;},
                                &quot;method&quot;: {
                                    &quot;type&quot;: &quot;string&quot;,
                                    &quot;enum&quot;: [&quot;GET&quot;, &quot;POST&quot;, &quot;PUT&quot;, &quot;DELETE&quot;]
                                },
                                &quot;headers&quot;: {&quot;type&quot;: &quot;object&quot;},
                                &quot;timeout&quot;: {&quot;type&quot;: &quot;integer&quot;},
                                &quot;rate_limit&quot;: {&quot;type&quot;: &quot;integer&quot;}
                            },
                            &quot;required&quot;: [&quot;name&quot;, &quot;url&quot;, &quot;method&quot;]
                        }
                    },
                    &quot;authentication&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;type&quot;: {
                                &quot;type&quot;: &quot;string&quot;,
                                &quot;enum&quot;: [&quot;bearer&quot;, &quot;basic&quot;, &quot;api_key&quot;]
                            },
                            &quot;credentials&quot;: {&quot;type&quot;: &quot;object&quot;}
                        }
                    }
                },
                &quot;required&quot;: [&quot;endpoints&quot;]
            }
        }
        
        schema = schemas.get(config_type, {
            &quot;type&quot;: &quot;object&quot;,
            &quot;additionalProperties&quot;: True
        })
        
        response = self.client.chat.completions.create(
            model=&quot;glm-5&quot;,
            messages=[
                {
                    &quot;role&quot;: &quot;system&quot;,
                    &quot;content&quot;: f&quot;&quot;&quot;
                    Please parse the configuration file and convert to JSON format:
                    {json.dumps(schema, indent=2, ensure_ascii=False)}
                    
                    Configuration type: {config_type}
                    
                    Requirements:
                    - Identify configuration items and values
                    - Convert data types (string, number, boolean)
                    - Handle arrays and nested objects
                    - Validate required fields
                    - Provide default values (if applicable)
                    &quot;&quot;&quot;
                },
                {
                    &quot;role&quot;: &quot;user&quot;,
                    &quot;content&quot;: f&quot;Configuration file content:\n{config_text}&quot;
                }
            ],
            response_format={&quot;type&quot;: &quot;json_object&quot;}
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            validate(instance=result, schema=schema)
            return result
        except Exception as e:
            print(f&quot;Configuration parsing failed: {e}&quot;)
            return None
    
    def validate_configuration(self, config_data, validation_rules):
        &quot;&quot;&quot;Validate configuration&quot;&quot;&quot;
        response = self.client.chat.completions.create(
            model=&quot;glm-5&quot;,
            messages=[
                {
                    &quot;role&quot;: &quot;system&quot;,
                    &quot;content&quot;: f&quot;&quot;&quot;
                    Please validate configuration data and return validation results:
                    
                    Return format:
                    {{
                        &quot;is_valid&quot;: true/false,
                        &quot;errors&quot;: [
                            {{
                                &quot;field&quot;: &quot;field_name&quot;,
                                &quot;error&quot;: &quot;error_description&quot;,
                                &quot;severity&quot;: &quot;error/warning/info&quot;
                            }}
                        ],
                        &quot;warnings&quot;: [
                            {{
                                &quot;field&quot;: &quot;field_name&quot;,
                                &quot;message&quot;: &quot;warning_message&quot;
                            }}
                        ],
                        &quot;suggestions&quot;: [
                            &quot;improvement_suggestion_1&quot;,
                            &quot;improvement_suggestion_2&quot;
                        ]
                    }}
                    
                    Validation rules: {validation_rules}
                    &quot;&quot;&quot;
                },
                {
                    &quot;role&quot;: &quot;user&quot;,
                    &quot;content&quot;: f&quot;Configuration data:\n{json.dumps(config_data, indent=2, ensure_ascii=False)}&quot;
                }
            ],
            response_format={&quot;type&quot;: &quot;json_object&quot;}
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            print(f&quot;Configuration validation failed: {e}&quot;)
            return None

# Usage example
config_manager = ConfigurationManager(&quot;your_api_key&quot;)

# Parse database configuration
db_config_text = &quot;&quot;&quot;
[database]
host = localhost
port = 5432
database = myapp
username = admin
ssl = true
pool_size = 10

[settings]
timeout = 30
retry_attempts = 3
log_level = INFO
&quot;&quot;&quot;

config = config_manager.parse_config_file(db_config_text, &quot;database&quot;)
if config:
    print(&quot;Parsed configuration:&quot;, json.dumps(config, indent=2, ensure_ascii=False))
    
    # Validate configuration
    validation_rules = [
        &quot;Port number must be in range 1-65535&quot;,
        &quot;Database name cannot be empty&quot;,
        &quot;Connection pool size should be greater than 0&quot;,
        &quot;Timeout should be reasonable (1-300 seconds)&quot;
    ]
    
    validation_result = config_manager.validate_configuration(config, validation_rules)
    if validation_result:
        print(f&quot;Configuration validity: {validation_result[&#x27;is_valid&#x27;]}&quot;)
        if validation_result[&#x27;errors&#x27;]:
            print(&quot;Errors:&quot;, validation_result[&#x27;errors&#x27;])
        if validation_result[&#x27;warnings&#x27;]:
            print(&quot;Warnings:&quot;, validation_result[&#x27;warnings&#x27;])

```

# [​](#best-practices)Best Practices

# Schema Design Principles

* Clarity: Field names and types should be clear and explicit

* Completeness: Include all necessary validation rules

* Flexibility: Consider future expansion needs

# Error Handling Strategy

* Multi-layer validation: Schema validation + business logic validation

* Fallback plan: Prepare simplified backup Schema

* Logging: Record detailed error information

JSON mode requires AI to strictly output according to specified format, but in some complex scenarios it may affect the naturalness of responses. It’s recommended to find a balance between functionality and user experience.
When designing JSON Schema, it’s recommended to start with simple structures and gradually increase complexity. Also, providing detailed descriptions and examples for key fields helps AI better understand and generate JSON data that meets requirements.Was this page helpful?

YesNo[Context Caching](/guides/capabilities/cache)[Web Search](/guides/tools/web-search)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
