import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/hero.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please analyze this screenshot of a Homepage 'Intro' or 'Hero' section. Describe the layout, text content (heading, description, badges), buttons (colors, icons, text), and the visual graphic/image used (presumably hero_img.jpg). Give me specific details so I can recreate it perfectly in React with inline CSS. Pay attention to colors, fonts, spacing, and alignment.", img]
)
print(response.text)
