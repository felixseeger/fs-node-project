import os
import base64
import requests

# Read the key from the environment instead of hardcoding it
api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("API key not found. Please set the ANTHROPIC_API_KEY environment variable.")

with open("frontend/ref/right-click_compose-menu.jpg", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

headers = {
    "x-api-key": api_key,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
}

data = {
    "model": "claude-3-5-sonnet-20240620",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": encoded_string
                    }
                },
                {
                    "type": "text",
                    "text": "Please analyze this screenshot of a UI. Describe the right-click menu or compose menu exactly. What text items are there? What icons correspond to each text item? Describe the layout."
                }
            ]
        }
    ]
}

response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
print(response.json())
