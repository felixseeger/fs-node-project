# Function Calling - Overview - Z.AI DEVELOPER DOCUMENT

Original URL: https://docs.z.ai/guides/capabilities/function-calling

[Skip to main content](#content-area)[Overview - Z.AI DEVELOPER DOCUMENT home page](https://z.ai/model-api)EnglishSearch...⌘K* [API Keys](https://z.ai/manage-apikey/apikey-list)
* [Payment Method](https://z.ai/manage-apikey/billing)
Search...NavigationCapabilitiesFunction Calling[Guides](/guides/overview/quick-start)[API Reference](/api-reference/introduction)[Scenario Example](/scenario-example/develop-tools/claude)[Coding Plan](/devpack/overview)[Released Notes](/release-notes/new-released)[Terms and Policy](/legal-agreement/privacy-policy)[Help Center](/help/faq)
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
* [Core Parameter Description](#core-parameter-description)
* [Response Parameter Description](#response-parameter-description)
* [Code Examples](#code-examples)
* [Scenario Examples](#scenario-examples)
* [Best Practices](#best-practices)
* [Parameter Design](#parameter-design)
* [Error Handling](#error-handling)
* [Input Validation](#input-validation)
* [Permission Control](#permission-control)
Capabilities
# Function Calling
Copy pageCopy pageFunction Calling allows AI models to call external functions and APIs, greatly expanding the capability boundaries of intelligent agents, enabling them to perform specific operations and obtain real-time data.

# [​](#features)Features

Function calling provides AI models with the ability to interact with external systems, supporting various complex application scenarios and integration requirements.

# [​](#core-parameter-description)Core Parameter Description

* tools: Defines the list of callable functions, including function names, descriptions, and parameter specifications

* tool_choice: Controls function calling strategy, default is auto (only supports auto)

* model: Uses models that support function calling, such as glm-4-plus, glm-4.6, etc.

# [​](#response-parameter-description)Response Parameter Description

Key fields in function calling responses:

* tool_calls: Contains information about functions the model decides to call

* function.name: Name of the called function

* function.arguments: Function call parameters (JSON format string)

* id: Unique identifier for the tool call

# [​](#code-examples)Code Examples

By defining function tools and handling function calls, AI models can perform various external operations:
*  Python SDK
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
```
import json
from zai import ZaiClient

# Initialize client
client = ZaiClient(api_key=&#x27;your_api_key&#x27;)

# Define weather query function
def get_weather(city: str) -> dict:
    &quot;&quot;&quot;Get weather information for specified city&quot;&quot;&quot;
    # This should call a real weather API
    weather_data = {
        &quot;city&quot;: city,
        &quot;temperature&quot;: &quot;22°C&quot;,
        &quot;condition&quot;: &quot;Sunny&quot;,
        &quot;humidity&quot;: &quot;65%&quot;,
        &quot;wind_speed&quot;: &quot;5 km/h&quot;
    }
    return weather_data

# Define function tools
tools = [
    {
        &quot;type&quot;: &quot;function&quot;,
        &quot;function&quot;: {
            &quot;name&quot;: &quot;get_weather&quot;,
            &quot;description&quot;: &quot;Get current weather information for specified city&quot;,
            &quot;parameters&quot;: {
                &quot;type&quot;: &quot;object&quot;,
                &quot;properties&quot;: {
                    &quot;city&quot;: {
                        &quot;type&quot;: &quot;string&quot;,
                        &quot;description&quot;: &quot;City name, e.g.: Beijing, Shanghai&quot;
                    }
                },
                &quot;required&quot;: [&quot;city&quot;]
            }
        }
    }
]

# Make conversation request
response = client.chat.completions.create(
    model=&quot;glm-5&quot;,  # Use model that supports function calling
    messages=[
        {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;How&#x27;s the weather in Beijing today?&quot;}
    ],
    tools=tools,         # Pass function tools
    tool_choice=&quot;auto&quot;   # Automatically choose whether to call functions
)

# Handle function calls
message = response.choices[0].message
messages = [{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;How&#x27;s the weather in Beijing today?&quot;}]
messages.append(message.model_dump())

if message.tool_calls:
    for tool_call in message.tool_calls:
        if tool_call.function.name == &quot;get_weather&quot;:
            # Parse parameters and call function
            args = json.loads(tool_call.function.arguments)
            weather_result = get_weather(args.get(&quot;city&quot;))
            
            # Return function result to model
            messages.append({
                &quot;role&quot;: &quot;tool&quot;,
                &quot;content&quot;: json.dumps(weather_result, ensure_ascii=False),
                &quot;tool_call_id&quot;: tool_call.id
            })
    
    # Get final answer
    final_response = client.chat.completions.create(
        model=&quot;glm-5&quot;,
        messages=messages,
        tools=tools
    )
    
    print(final_response.choices[0].message.content)
else:
    print(message.content)

```

# [​](#scenario-examples)Scenario Examples

When using function calling, please ensure proper security validation and permission control for external APIs and database operations.
Multi-function Assistant

```
import json
import requests
from datetime import datetime
from zai import ZaiClient

class FunctionAgent:
    def __init__(self, api_key):
        self.client = ZaiClient(api_key=api_key)
        self.tools = self._define_tools()
    
    def _define_tools(self):
        return [
            {
                &quot;type&quot;: &quot;function&quot;,
                &quot;function&quot;: {
                    &quot;name&quot;: &quot;get_current_time&quot;,
                    &quot;description&quot;: &quot;Get current time&quot;,
                    &quot;parameters&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {},
                        &quot;required&quot;: []
                    }
                }
            },
            {
                &quot;type&quot;: &quot;function&quot;,
                &quot;function&quot;: {
                    &quot;name&quot;: &quot;calculate&quot;,
                    &quot;description&quot;: &quot;Perform mathematical calculations&quot;,
                    &quot;parameters&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;expression&quot;: {
                                &quot;type&quot;: &quot;string&quot;,
                                &quot;description&quot;: &quot;Mathematical expression, e.g.: 2+3*4&quot;
                            }
                        },
                        &quot;required&quot;: [&quot;expression&quot;]
                    }
                }
            },
            {
                &quot;type&quot;: &quot;function&quot;,
                &quot;function&quot;: {
                    &quot;name&quot;: &quot;search_web&quot;,
                    &quot;description&quot;: &quot;Search web information&quot;,
                    &quot;parameters&quot;: {
                        &quot;type&quot;: &quot;object&quot;,
                        &quot;properties&quot;: {
                            &quot;query&quot;: {
                                &quot;type&quot;: &quot;string&quot;,
                                &quot;description&quot;: &quot;Search keywords&quot;
                            }
                        },
                        &quot;required&quot;: [&quot;query&quot;]
                    }
                }
            }
        ]
    
    def get_current_time(self):
        &quot;&quot;&quot;Get current time&quot;&quot;&quot;
        return {
            &quot;current_time&quot;: datetime.now().strftime(&quot;%Y-%m-%d %H:%M:%S&quot;),
            &quot;timezone&quot;: &quot;Asia/Shanghai&quot;
        }
    
    def calculate(self, expression: str):
        &quot;&quot;&quot;Safe mathematical calculation&quot;&quot;&quot;
        try:
            # Simple security check
            allowed_chars = set(&#x27;0123456789+-*/().&#x27;)
            if not all(c in allowed_chars or c.isspace() for c in expression):
                return {&quot;error&quot;: &quot;Expression contains disallowed characters&quot;}
            
            result = eval(expression)
            return {
                &quot;expression&quot;: expression,
                &quot;result&quot;: result
            }
        except Exception as e:
            return {&quot;error&quot;: f&quot;Calculation error: {str(e)}&quot;}
    
    def search_web(self, query: str):
        &quot;&quot;&quot;Simulate web search&quot;&quot;&quot;
        # This should call a real search API
        return {
            &quot;query&quot;: query,
            &quot;results&quot;: [
                {&quot;title&quot;: f&quot;Search result 1 about {query}&quot;, &quot;url&quot;: &quot;https://example1.com&quot;},
                {&quot;title&quot;: f&quot;Search result 2 about {query}&quot;, &quot;url&quot;: &quot;https://example2.com&quot;}
            ]
        }
    
    def execute_function(self, function_name: str, arguments: dict):
        &quot;&quot;&quot;Execute function call&quot;&quot;&quot;
        if function_name == &quot;get_current_time&quot;:
            return self.get_current_time()
        elif function_name == &quot;calculate&quot;:
            return self.calculate(arguments.get(&quot;expression&quot;, &quot;&quot;))
        elif function_name == &quot;search_web&quot;:
            return self.search_web(arguments.get(&quot;query&quot;, &quot;&quot;))
        else:
            return {&quot;error&quot;: f&quot;Unknown function: {function_name}&quot;}
    
    def chat(self, user_message: str):
        &quot;&quot;&quot;Handle user message&quot;&quot;&quot;
        messages = [{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: user_message}]
        
        response = self.client.chat.completions.create(
            model=&quot;glm-5&quot;,
            messages=messages,
            tools=self.tools,
            tool_choice=&quot;auto&quot;
        )
        
        message = response.choices[0].message
        messages.append(message.model_dump())
        
        # Handle function calls
        if message.tool_calls:
            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                
                # Execute function
                result = self.execute_function(function_name, arguments)
                
                # Add function result
                messages.append({
                    &quot;role&quot;: &quot;tool&quot;,
                    &quot;content&quot;: json.dumps(result, ensure_ascii=False),
                    &quot;tool_call_id&quot;: tool_call.id
                })
            
            # Get final answer
            final_response = self.client.chat.completions.create(
                model=&quot;glm-5&quot;,
                messages=messages,
                tools=self.tools
            )
            
            return final_response.choices[0].message.content
        else:
            return message.content

# Usage example
agent = FunctionAgent(&quot;your_api_key&quot;)

# Test different types of requests
print(agent.chat(&quot;What time is it now?&quot;))
print(agent.chat(&quot;Help me calculate 15 * 23 + 7&quot;))
print(agent.chat(&quot;Search for the latest developments in artificial intelligence&quot;))

```

Database Query

```
import sqlite3

def query_database(sql: str) -> dict:
    &quot;&quot;&quot;Execute database query&quot;&quot;&quot;
    try:
        conn = sqlite3.connect(&#x27;example.db&#x27;)
        cursor = conn.cursor()
        cursor.execute(sql)
        results = cursor.fetchall()
        conn.close()
        
        return {
            &quot;success&quot;: True,
            &quot;data&quot;: results,
            &quot;row_count&quot;: len(results)
        }
    except Exception as e:
        return {
            &quot;success&quot;: False,
            &quot;error&quot;: str(e)
        }

# Function definition
db_tool = {
    &quot;type&quot;: &quot;function&quot;,
    &quot;function&quot;: {
        &quot;name&quot;: &quot;query_database&quot;,
        &quot;description&quot;: &quot;Execute SQL query&quot;,
        &quot;parameters&quot;: {
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;sql&quot;: {
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;description&quot;: &quot;SQL query statement&quot;
                }
            },
            &quot;required&quot;: [&quot;sql&quot;]
        }
    }
}

```

File Operations

```
import os
import json

def file_operations(operation: str, file_path: str, content: str = None) -> dict:
    &quot;&quot;&quot;File operation function&quot;&quot;&quot;
    try:
        if operation == &quot;read&quot;:
            with open(file_path, &#x27;r&#x27;, encoding=&#x27;utf-8&#x27;) as f:
                content = f.read()
            return {&quot;success&quot;: True, &quot;content&quot;: content}
        
        elif operation == &quot;write&quot;:
            with open(file_path, &#x27;w&#x27;, encoding=&#x27;utf-8&#x27;) as f:
                f.write(content)
            return {&quot;success&quot;: True, &quot;message&quot;: &quot;File written successfully&quot;}
        
        elif operation == &quot;list&quot;:
            files = os.listdir(file_path)
            return {&quot;success&quot;: True, &quot;files&quot;: files}
        
        else:
            return {&quot;success&quot;: False, &quot;error&quot;: &quot;Unsupported operation&quot;}
    
    except Exception as e:
        return {&quot;success&quot;: False, &quot;error&quot;: str(e)}

# Function definition
file_tool = {
    &quot;type&quot;: &quot;function&quot;,
    &quot;function&quot;: {
        &quot;name&quot;: &quot;file_operations&quot;,
        &quot;description&quot;: &quot;Execute file operations&quot;,
        &quot;parameters&quot;: {
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;operation&quot;: {
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;enum&quot;: [&quot;read&quot;, &quot;write&quot;, &quot;list&quot;],
                    &quot;description&quot;: &quot;Operation type&quot;
                },
                &quot;file_path&quot;: {
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;description&quot;: &quot;File path&quot;
                },
                &quot;content&quot;: {
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;description&quot;: &quot;Content to write (only required for write operation)&quot;
                }
            },
            &quot;required&quot;: [&quot;operation&quot;, &quot;file_path&quot;]
        }
    }
}

```

API Integration

```
import requests

def call_external_api(url: str, method: str = &quot;GET&quot;, headers: dict = None, data: dict = None) -> dict:
    &quot;&quot;&quot;Call external API&quot;&quot;&quot;
    try:
        if method.upper() == &quot;GET&quot;:
            response = requests.get(url, headers=headers, params=data)
        elif method.upper() == &quot;POST&quot;:
            response = requests.post(url, headers=headers, json=data)
        else:
            return {&quot;success&quot;: False, &quot;error&quot;: &quot;Unsupported HTTP method&quot;}
        
        return {
            &quot;success&quot;: True,
            &quot;status_code&quot;: response.status_code,
            &quot;data&quot;: response.json() if response.headers.get(&#x27;content-type&#x27;, &#x27;&#x27;).startswith(&#x27;application/json&#x27;) else response.text
        }
    
    except Exception as e:
        return {&quot;success&quot;: False, &quot;error&quot;: str(e)}

# Function definition
api_tool = {
    &quot;type&quot;: &quot;function&quot;,
    &quot;function&quot;: {
        &quot;name&quot;: &quot;call_external_api&quot;,
        &quot;description&quot;: &quot;Call external API&quot;,
        &quot;parameters&quot;: {
            &quot;type&quot;: &quot;object&quot;,
            &quot;properties&quot;: {
                &quot;url&quot;: {
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;description&quot;: &quot;API endpoint URL&quot;
                },
                &quot;method&quot;: {
                    &quot;type&quot;: &quot;string&quot;,
                    &quot;enum&quot;: [&quot;GET&quot;, &quot;POST&quot;],
                    &quot;description&quot;: &quot;HTTP method&quot;
                },
                &quot;headers&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;description&quot;: &quot;Request headers&quot;
                },
                &quot;data&quot;: {
                    &quot;type&quot;: &quot;object&quot;,
                    &quot;description&quot;: &quot;Request data&quot;
                }
            },
            &quot;required&quot;: [&quot;url&quot;]
        }
    }
}

```

# [​](#best-practices)Best Practices

# Function Design Principles

* Single responsibility: Each function should do one thing

* Clear naming: Function and parameter names should be meaningful

* Complete description: Provide detailed function and parameter descriptions

# Security Considerations

* Input validation: Strictly validate all input parameters

* Permission control: Limit function access permissions

* Logging: Record function call logs

# [​](#parameter-design)Parameter Design

```
# Good parameter design
{
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;city&quot;: {
            &quot;type&quot;: &quot;string&quot;,
            &quot;description&quot;: &quot;City name, supports Chinese and English, e.g.: Beijing, Shanghai, New York&quot;,
            &quot;examples&quot;: [&quot;Beijing&quot;, &quot;Shanghai&quot;, &quot;New York&quot;]
        },
        &quot;unit&quot;: {
            &quot;type&quot;: &quot;string&quot;,
            &quot;enum&quot;: [&quot;celsius&quot;, &quot;fahrenheit&quot;],
            &quot;description&quot;: &quot;Temperature unit&quot;,
            &quot;default&quot;: &quot;celsius&quot;
        }
    },
    &quot;required&quot;: [&quot;city&quot;]
}

```

# [​](#error-handling)Error Handling

```
def robust_function(param: str) -> dict:
    &quot;&quot;&quot;Robust function implementation&quot;&quot;&quot;
    try:
        # Parameter validation
        if not param or not isinstance(param, str):
            return {
                &quot;success&quot;: False,
                &quot;error&quot;: &quot;Invalid parameter&quot;,
                &quot;error_code&quot;: &quot;INVALID_PARAM&quot;
            }
        
        # Business logic
        result = process_data(param)
        
        return {
            &quot;success&quot;: True,
            &quot;data&quot;: result,
            &quot;timestamp&quot;: datetime.now().isoformat()
        }
    
    except ValueError as e:
        return {
            &quot;success&quot;: False,
            &quot;error&quot;: f&quot;Data error: {str(e)}&quot;,
            &quot;error_code&quot;: &quot;DATA_ERROR&quot;
        }
    except Exception as e:
        return {
            &quot;success&quot;: False,
            &quot;error&quot;: f&quot;System error: {str(e)}&quot;,
            &quot;error_code&quot;: &quot;SYSTEM_ERROR&quot;
        }

```

# [​](#input-validation)Input Validation

```
def secure_function(user_input: str) -> dict:
    &quot;&quot;&quot;Secure function implementation&quot;&quot;&quot;
    # Input length limit
    if len(user_input) > 1000:
        return {&quot;error&quot;: &quot;Input too long&quot;}
    
    # Dangerous character filtering
    dangerous_chars = [&#x27;<&#x27;, &#x27;>&#x27;, &#x27;&&#x27;, &#x27;&quot;&#x27;, &quot;&#x27;&quot;]
    if any(char in user_input for char in dangerous_chars):
        return {&quot;error&quot;: &quot;Input contains dangerous characters&quot;}
    
    # SQL injection protection
    sql_keywords = [&#x27;DROP&#x27;, &#x27;DELETE&#x27;, &#x27;UPDATE&#x27;, &#x27;INSERT&#x27;]
    if any(keyword in user_input.upper() for keyword in sql_keywords):
        return {&quot;error&quot;: &quot;Input contains dangerous keywords&quot;}
    
    return {&quot;success&quot;: True, &quot;processed_input&quot;: user_input}

```

# [​](#permission-control)Permission Control

```
def check_permissions(user_id: str, operation: str) -> bool:
    &quot;&quot;&quot;Check user permissions&quot;&quot;&quot;
    user_permissions = get_user_permissions(user_id)
    return operation in user_permissions

def protected_function(user_id: str, operation: str, data: dict) -> dict:
    &quot;&quot;&quot;Function requiring permission validation&quot;&quot;&quot;
    if not check_permissions(user_id, operation):
        return {
            &quot;success&quot;: False,
            &quot;error&quot;: &quot;Insufficient permissions&quot;,
            &quot;error_code&quot;: &quot;PERMISSION_DENIED&quot;
        }
    
    # Execute operation
    return perform_operation(operation, data)

```

It is recommended to provide detailed documentation and examples for each function to help the model better understand the function’s purpose and usage.
Function calling involves code execution. Please ensure appropriate security measures are implemented, including input validation, permission control, and error handling.Was this page helpful?

YesNo[Tool Streaming Output](/guides/capabilities/stream-tool)[Context Caching](/guides/capabilities/cache)⌘I[x](https://x.com/Zai_org)[github](https://github.com/zai-org)[discord](https://discord.gg/QR7SARHRxK)[linkedin](https://www.linkedin.com/company/zdotai)[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=zhipu-32152247)
