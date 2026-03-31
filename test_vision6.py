import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("frontend/ref/nodes_02.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Look specifically at the left side menu in this image. Is there a plus button, an X button, or a close button anywhere? Describe the icons vertically in the very left side menu.", img]
)
print(response.text)
