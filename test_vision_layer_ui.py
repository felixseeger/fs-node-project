import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("frontend/ref/layer-editor.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please analyze this screenshot of a UI. This is a Layer Editor menu that needs to be implemented in React with inline CSS. Provide the React component code that renders exactly this UI. Use appropriate colors, padding, flexbox, and SVG icons. Assume this is a floating panel in the top right of the screen. Return the code in a markdown block.", img]
)
print(response.text)
