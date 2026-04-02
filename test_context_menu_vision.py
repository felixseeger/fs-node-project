import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/rightclick-menu.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please analyze this screenshot of a right-click/context menu. Describe its visual appearance in great detail: border-radius, background color, padding, borders, divider lines, hover states if inferable, typography. Also, list every single menu item exactly as it appears, from top to bottom. For each item, describe the icon on the left (if any), the main text, and the keyboard shortcut on the right (if any). Describe it in a way that I can recreate it perfectly in React with inline CSS.", img]
)
print(response.text)
