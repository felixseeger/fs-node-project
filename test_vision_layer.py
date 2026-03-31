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
    contents=["Please analyze this screenshot of a UI. Describe the ENTIRE image. Where is the Layer Editor menu located on the screen? Is there a Node on the canvas? What does the node look like? Describe the node in detail.", img]
)
print(response.text)
