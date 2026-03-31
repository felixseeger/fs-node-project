import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/settings.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please analyze this screenshot of a 'Settings' UI. Describe the layout, sections, form fields, toggles, buttons, headers, and descriptions. Pay special attention to any dropdowns and what options they might contain, especially regarding 'Models'. Describe everything in detail so I can recreate it in React.", img]
)
print(response.text)
