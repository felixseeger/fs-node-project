import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("frontend/ref/navbar_default.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Describe the UI in this image. Is there a plus button, an X button, or a close button anywhere? Describe the icons vertically.", img]
)
print(response.text)
