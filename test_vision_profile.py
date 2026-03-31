import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("frontend/ref/profile_modal-menu.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Describe the UI in this image. It's a Profile modal menu. Describe the layout, text, icons, toggle switches, and overall styling.", img]
)
print(response.text)
