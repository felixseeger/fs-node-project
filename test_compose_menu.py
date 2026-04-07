import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("frontend/ref/right-click_compose-menu.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please analyze this screenshot of a UI. Describe the right-click menu or compose menu exactly. What text items are there? What icons correspond to each text item? What do the icons look like visually?", img]
)
print(response.text)
