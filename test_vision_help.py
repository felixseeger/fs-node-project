import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("frontend/ref/help.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Describe the UI in this image. It's a Help menu. Describe the layout, text, icons, social icons, and versions.", img]
)
print(response.text)
