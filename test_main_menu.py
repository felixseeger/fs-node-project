import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/main_menu.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please analyze this screenshot of a Main Menu UI. Describe all the menu items, their icons, their keyboard shortcuts, and any dividers. List them in order from top to bottom.", img]
)
print(response.text)
